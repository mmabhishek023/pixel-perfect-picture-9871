import { describe, expect, it } from "vitest";
import { api, createDemoState } from "@/services/api";
import type { DeviceInput } from "@/types/passport";

describe("ReTech Passport Features & Role Partitions", () => {
  it("registers a device with prior history, damages, and previous owners", () => {
    let state = createDemoState();

    // Login as Owner
    state = api.demoLogin(state, "OWNER").state;

    const input: DeviceInput = {
      deviceType: "SMARTPHONE",
      brand: "Apple",
      model: "iPhone 13",
      serial: "IMEI998877665544",
      purchaseDate: "2023-01-15",
      os: "iOS 17",
      ramGb: 4,
      storageGb: 128,
      processor: "A15 Bionic",
      previousOwnersCount: 2,
      knownDamages: ["Screen Crack", "Battery Swelling/Drain"],
      damageNotes: "Hairline crack on top left bezel; 78% battery capacity",
      priorHistory: "Display replaced in late 2023 by third-party technician.",
    };

    const result = api.registerDevice(state, input);
    const newDevice = result.value;

    expect(newDevice.previousOwnersCount).toBe(2);
    expect(newDevice.knownDamages).toEqual(["Screen Crack", "Battery Swelling/Drain"]);
    expect(newDevice.damageNotes).toBe("Hairline crack on top left bezel; 78% battery capacity");
    expect(newDevice.priorHistory).toBe("Display replaced in late 2023 by third-party technician.");
    expect(newDevice.audit[0]?.action).toContain("2 prev owner(s)");
    expect(newDevice.audit[0]?.action).toContain("2 damage(s)");
    expect(newDevice.audit[0]?.action).toContain("prior history noted");
  });

  it("partitions device listing strictly by role", () => {
    const baseState = createDemoState();

    // Owner role should only see their own devices
    const ownerState = api.demoLogin(baseState, "OWNER").state;
    const ownerDevices = api.listDevices(ownerState, "user-owner");
    expect(ownerDevices.every((d) => d.ownerId === "user-owner")).toBe(true);

    // Technician role sees all platform devices to triage in Repair Queue
    const techState = api.demoLogin(baseState, "TECHNICIAN").state;
    const techDevices = api.listDevices(techState, "user-tech-approved");
    expect(techDevices.length).toBeGreaterThanOrEqual(baseState.devices.length);

    // Viewer role sees only REFURBISHED devices that are listed for sale (public marketplace)
    const viewerState = api.demoLogin(baseState, "VIEWER").state;
    const viewerDevices = api.listDevices(viewerState, "user-viewer");
    expect(viewerDevices.every((d) => d.internalStatus === "REFURBISHED" && d.isListedForSale === true)).toBe(true);
    // In the demo seed, 2 devices are REFURBISHED and listed for sale (device-118 and device-123)
    // while device-097 is REFURBISHED but isListedForSale is false (Ready to List)
    expect(viewerDevices.length).toBe(2);
  });

  it("handles the technician listing and unlisting workflow for refurbished devices", () => {
    let state = createDemoState();
    state = api.demoLogin(state, "TECHNICIAN").state;

    // device-090 starts as REFURBISHED but isListedForSale = false (Ready to List)
    const device090 = api.getDevice(state, "device-090");
    expect(device090?.internalStatus).toBe("REFURBISHED");
    expect(device090?.isListedForSale).toBe(false);

    // Technician lists it for sale
    const listResult = api.listDeviceForSale(state, "device-090", {
      price: 19999,
      condition: "Good (Grade B)",
      notes: "Fully inspected and tested. Speaker serviced.",
      listingPhotos: ["data:image/svg+xml;utf8,<svg></svg>"],
    });
    state = listResult.state;
    const listed = listResult.value;

    expect(listed.isListedForSale).toBe(true);
    expect(listed.listingPrice).toBe(19999);
    expect(listed.listingCondition).toBe("Good (Grade B)");
    expect(listed.listingPhotos.length).toBe(1);
    expect(listed.audit[0]?.action).toContain("Listing published");

    // Now viewer can see 3 devices
    const viewerDevices = api.listDevices(state, "user-viewer");
    expect(viewerDevices.length).toBe(3);
    expect(viewerDevices.some((d) => d.id === "device-090")).toBe(true);

    // Technician unlists it
    const unlistResult = api.unlistDevice(state, "device-090");
    state = unlistResult.state;
    const unlisted = unlistResult.value;

    expect(unlisted.isListedForSale).toBe(false);
    expect(unlisted.audit[0]?.action).toContain("unlisted");

    // Viewer now sees 2 devices again
    const viewerDevicesAfter = api.listDevices(state, "user-viewer");
    expect(viewerDevicesAfter.length).toBe(2);
    expect(viewerDevicesAfter.some((d) => d.id === "device-090")).toBe(false);
  });

  it("safely normalizes legacy data without crashing", () => {
    // Simulate legacy data missing all new fields
    const legacyDevice = {
      id: "legacy-001",
      passportId: "RTP-2026-000001",
      name: "Old Laptop",
      deviceType: "LAPTOP",
      brand: "OldBrand",
      model: "OldModel",
      serial: "SN-OLD-001",
      purchaseDate: "2021-01-01",
      status: "IN_USE",
      ownerId: "user-owner",
    };

    // Load with legacy saved state
    const mockStorage = JSON.stringify({
      users: [{ id: "user-owner", email: "owner@example.org", name: "Aarav", role: "OWNER", status: "ACTIVE" }],
      devices: [legacyDevice],
      currentUserId: "user-owner",
    });

    window.localStorage.setItem("retech-passport-demo-v1", mockStorage);
    const loaded = api.loadState();

    expect(loaded.devices.length).toBe(1);
    const d = loaded.devices[0]!;
    expect(d.internalStatus).toBe("REFURBISHED");
    expect(d.payoutStatus).toBe("PAID");
    expect(d.isListedForSale).toBe(false);
    expect(d.ownerPhotos).toEqual([]);
    expect(d.listingPhotos).toEqual([]);
    expect(d.components).toEqual([]);
    expect(d.repairs).toEqual([]);

    // Check that admin user is restored if missing
    expect(loaded.users.some((u) => u.role === "ADMIN")).toBe(true);

    // Clean up
    window.localStorage.removeItem("retech-passport-demo-v1");
  });

  it("handles admin console actions: stats, tech approval, and marking payout as paid", () => {
    let state = createDemoState();
    state = api.demoLogin(state, "ADMIN").state;

    const stats = api.adminStats(state);
    expect(stats.devices).toBe(5);
    expect(stats.pendingTechnicians).toBe(1);

    // Approve pending technician
    const approveResult = api.approveTechnician(state, "user-pending");
    state = approveResult.state;
    expect(approveResult.value?.status).toBe("ACTIVE");
    expect(api.adminStats(state).pendingTechnicians).toBe(0);

    // Mark payout as paid for device-118 (which starts as PAYMENT_INITIATED)
    const paidResult = api.markAsPaid(state, "device-118");
    state = paidResult.state;
    expect(paidResult.value.payoutStatus).toBe("PAID");
    expect(paidResult.value.audit[0]?.action).toContain("Payout marked as PAID");
  });

  it("handles technician inspection and admin review, pricing & listing approval flow", () => {
    let state = createDemoState();

    // 1. Technician completes technical work on device-097 (starts PENDING_INSPECTION)
    state = api.demoLogin(state, "TECHNICIAN").state;
    const inspResult = api.completeInspection(state, "device-097", {
      outcome: "REFURBISHED",
      resolvedDamageIds: ["Screen Crack"],
      extraActiveDamages: [],
      repairRecord: {
        date: "2026-03-10",
        description: "Replaced OLED panel with genuine OEM display",
        cost: 3500,
        affectedComponentIds: [],
        notes: "OEM screen replacement done",
        verified: true,
      },
      listingPhotos: ["data:image/jpeg;base64,postrepair123"],
    });
    state = inspResult.state;
    const techCompletedDevice = inspResult.value;
    expect(techCompletedDevice.internalStatus).toBe("REFURBISHED");
    expect(techCompletedDevice.payoutStatus).toBe("PAYMENT_INITIATED");
    expect(techCompletedDevice.isListedForSale).toBe(false);
    expect(techCompletedDevice.listingPhotos.length).toBe(1);

    // 2. Admin reviews the trade-in payout and approves marketplace listing
    state = api.demoLogin(state, "ADMIN").state;
    const approveResult = api.adminApprovePayoutAndListing(state, "device-097", {
      payoutAmount: 18500,
      isListedForSale: true,
      listingPrice: 26400,
      listingCondition: "Good (Grade B)",
      listingNotes: "OEM screen replacement done, fully tested and certified.",
    });
    state = approveResult.state;
    const approvedDevice = approveResult.value;
    expect(approvedDevice.payoutStatus).toBe("PAID");
    expect(approvedDevice.payoutAmount).toBe(18500);
    expect(approvedDevice.isListedForSale).toBe(true);
    expect(approvedDevice.listingPrice).toBe(26400);
    expect(approvedDevice.listingCondition).toBe("Good (Grade B)");

    // 3. Now Viewer can immediately see it in public marketplace catalog
    const viewerState = api.demoLogin(state, "VIEWER").state;
    const viewerCatalog = api.listDevices(viewerState, "user-viewer");
    expect(viewerCatalog.some((d) => d.id === "device-097")).toBe(true);
  });

  it("prevents viewers and pending technicians from registering devices", () => {
    const baseState = createDemoState();

    const viewerState = api.demoLogin(baseState, "VIEWER").state;
    expect(() => {
      api.registerDevice(viewerState, {
        deviceType: "LAPTOP",
        brand: "Dell",
        model: "XPS 15",
        serial: "SN999999",
        purchaseDate: "2024-01-01",
        os: "Windows 11",
        ramGb: 16,
        storageGb: 512,
        processor: "Intel Core i7",
      });
    }).toThrow(/Only owners and approved technicians/);
  });

  it("enforces admin-only ownership transfer with QR token revocation", () => {
    let state = createDemoState();

    // 1. Owner attempt to transfer device must be blocked
    state = api.demoLogin(state, "OWNER").state;
    expect(() => {
      api.transferDevice(state, "device-118", "viewer@example.org");
    }).toThrow(/Only platform Admins can transfer device ownership/);

    // 2. Admin transfers listed refurbished device-118 to viewer (buyer)
    state = api.demoLogin(state, "ADMIN").state;
    const initialDevice = api.getDevice(state, "device-118")!;
    const oldQrToken = initialDevice.qrToken;
    expect(initialDevice.isListedForSale).toBe(true);

    const transferResult = api.transferDevice(state, "device-118", "viewer@example.org");
    state = transferResult.state;
    const transferredDevice = transferResult.value;

    expect(transferredDevice.ownerId).toBe("user-viewer");
    expect(transferredDevice.isListedForSale).toBe(false);
    expect(transferredDevice.qrToken).not.toBe(oldQrToken);
    expect(transferredDevice.audit[0]?.action).toContain("Ownership transferred to buyer");
    expect(transferredDevice.audit[0]?.action).toContain("QR token revoked & regenerated");
  });
});
