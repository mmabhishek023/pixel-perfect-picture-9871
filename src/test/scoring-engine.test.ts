import { describe, expect, it } from "vitest";
import { calculateAssessment } from "@/utils/scoringEngine";
import { api, createDemoState } from "@/services/api";
import type { DevicePassport } from "@/types/passport";

// Minimal device factory
function makeDevice(overrides: Partial<DevicePassport> = {}): DevicePassport {
  return {
    id: "test-device",
    passportId: "RTP-2026-999999",
    name: "Test Device",
    deviceType: "SMARTPHONE",
    brand: "Test",
    model: "Test Model",
    serial: "SN-TEST-001",
    purchaseDate: "2024-01-01",
    os: "Android 15",
    ramGb: 8,
    storageGb: 128,
    processor: "Test A1",
    previousOwnersCount: 0,
    knownDamages: [],
    damageNotes: "",
    priorHistory: "",
    status: "IN_USE",
    internalStatus: "PENDING_INSPECTION",
    payoutStatus: "PENDING_INSPECTION",
    payoutAmount: null,
    ownerPhotos: [],
    listingPhotos: [],
    activeDamages: [],
    resolvedDamages: [],
    isListedForSale: false,
    listingPrice: null,
    listingCondition: null,
    listingNotes: null,
    ownerId: "user-owner",
    qrToken: "test-token",
    components: [],
    repairs: [],
    audit: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

// Fixed "now" to avoid flaky age deductions in tests (1 year after purchase)
const NOW = new Date("2025-01-01T00:00:00.000Z");

describe("calculateAssessment — new deductions", () => {
  it("1. device with no active damages and 0 previous owners: damages/previousOwners deductions are 0", () => {
    const device = makeDevice({ activeDamages: [], previousOwnersCount: 0 });
    const assessment = calculateAssessment(device, NOW);
    expect(assessment.deductions.damages).toBe(0);
    expect(assessment.deductions.previousOwners).toBe(0);
    // Score capped at 100 from the top (1 yr age = 5 pts off)
    expect(assessment.score).toBe(95);
  });

  it("2. Screen Crack + Battery Swelling/Drain deduct 35 pts total", () => {
    const device = makeDevice({
      activeDamages: ["Screen Crack", "Battery Swelling/Drain"],
      previousOwnersCount: 0,
    });
    const assessment = calculateAssessment(device, NOW);
    // Screen Crack = 15, Battery Swelling/Drain = 20 → total 35
    expect(assessment.deductions.damages).toBe(35);
    // age = 5, damages = 35, others = 0 → 100 - 40 = 60
    expect(assessment.score).toBe(60);
    const reasons = assessment.reasons.join(" ");
    expect(reasons).toContain("Screen Crack");
    expect(reasons).toContain("Battery Swelling/Drain");
  });

  it("3. 4 previous owners deducts exactly 6 pts (capped at 6)", () => {
    // 4 owners * 2 = 8, but cap is 6
    const device = makeDevice({ previousOwnersCount: 4, activeDamages: [] });
    const assessment = calculateAssessment(device, NOW);
    expect(assessment.deductions.previousOwners).toBe(6);
    // age = 5, previousOwners = 6, others = 0 → 100 - 11 = 89
    expect(assessment.score).toBe(89);
  });

  it("score is clamped to [0, 100] even with many damages", () => {
    const manyDamages = [
      "Water/Liquid Damage",
      "Battery Swelling/Drain",
      "Screen Crack",
      "Port/Charging Issue",
      "Camera/Speaker Fault",
      "Body Dents/Scratches",
    ];
    const device = makeDevice({
      activeDamages: manyDamages,
      previousOwnersCount: 10,
    });
    const assessment = calculateAssessment(device, NOW);
    expect(assessment.score).toBeGreaterThanOrEqual(0);
    expect(assessment.score).toBeLessThanOrEqual(100);
  });
});

describe("api.completeInspection", () => {
  it("4. transitions internalStatus and payoutStatus", () => {
    const state = createDemoState();
    const deviceId = "device-097"; // starts as PENDING_INSPECTION

    const result = api.completeInspection(state, deviceId, {
      outcome: "REFURBISHED",
      payoutAmount: 15000,
      resolvedDamageIds: ["Screen Crack"],
      extraActiveDamages: [],
      repairRecord: {
        date: "2026-01-01",
        description: "Screen replaced",
        cost: 3000,
        affectedComponentIds: [],
        notes: "Fully repaired",
        verified: true,
      },
      listingPhotos: [],
    });

    expect(result.value.internalStatus).toBe("REFURBISHED");
    expect(result.value.payoutStatus).toBe("PAYMENT_INITIATED");
    expect(result.value.payoutAmount).toBe(15000);
    // Screen Crack was resolved, Battery Swelling/Drain remains
    expect(result.value.resolvedDamages).toContain("Screen Crack");
    expect(result.value.activeDamages).not.toContain("Screen Crack");
    expect(result.value.activeDamages).toContain("Battery Swelling/Drain");
    // A repair record was appended
    expect(result.value.repairs[0]?.description).toBe("Screen replaced");
  });
});

describe("api.markAsPaid", () => {
  it("5. transitions payoutStatus to PAID", () => {
    const state = createDemoState();
    const deviceId = "device-118"; // payoutStatus: PAYMENT_INITIATED in demo

    const result = api.markAsPaid(state, deviceId);

    expect(result.value.payoutStatus).toBe("PAID");
    // Audit entry added
    const latestAudit = result.value.audit[0];
    expect(latestAudit?.action).toContain("PAID");
  });
});
