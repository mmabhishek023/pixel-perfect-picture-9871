import type { DevicePassport } from "@/types/passport";

export interface PricingBreakdown {
  baseValue: number;
  specBonus: number;
  effectiveBaseValue: number;
  healthScore: number;
  healthMultiplier: number;
  totalRepairCost: number;
  suggestedPayout: number;
  suggestedSellingPrice: number | null;
  platformMargin: number;
}

export function calculateDeviceBaseValue(device: DevicePassport): { baseValue: number; specBonus: number; total: number } {
  const baseValue = device.deviceType === "LAPTOP" ? 40000 : 20000;
  let specBonus = 0;

  if (device.ramGb && device.ramGb >= 16) {
    specBonus += 4000;
  }
  if (device.storageGb && device.storageGb >= 512) {
    specBonus += 3000;
  }

  return {
    baseValue,
    specBonus,
    total: baseValue + specBonus,
  };
}

export function calculateTotalRepairCost(device: DevicePassport): number {
  if (!Array.isArray(device.repairs)) return 0;
  return device.repairs.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
}

export function calculatePricing(
  device: DevicePassport,
  healthScore: number,
  customRepairCost?: number,
): PricingBreakdown {
  const { baseValue, specBonus, total: effectiveBaseValue } = calculateDeviceBaseValue(device);
  const totalRepairCost =
    customRepairCost !== undefined ? customRepairCost : calculateTotalRepairCost(device);
  const healthMultiplier = Math.max(0, Math.min(100, healthScore)) / 100;

  const isRecycled = device.internalStatus === "RECYCLED";

  let suggestedPayout: number;
  if (isRecycled) {
    // Salvage value: 15% of base value, min ₹500 rounded to hundreds
    suggestedPayout = Math.max(500, Math.round((effectiveBaseValue * 0.15) / 100) * 100);
  } else {
    // Refurbished: (baseValue * health%) - totalRepairCost, min ₹1,000 rounded to hundreds
    const rawPayout = effectiveBaseValue * healthMultiplier - totalRepairCost;
    suggestedPayout = Math.max(1000, Math.round(rawPayout / 100) * 100);
  }

  // Suggested selling price: (ownerPayout + totalRepairCost) * 1.20 (20% margin)
  let suggestedSellingPrice: number | null = null;
  if (!isRecycled) {
    suggestedSellingPrice = Math.round(((suggestedPayout + totalRepairCost) * 1.2) / 100) * 100;
  }

  const platformMargin = suggestedSellingPrice !== null ? suggestedSellingPrice - (suggestedPayout + totalRepairCost) : 0;

  return {
    baseValue,
    specBonus,
    effectiveBaseValue,
    healthScore,
    healthMultiplier,
    totalRepairCost,
    suggestedPayout,
    suggestedSellingPrice,
    platformMargin,
  };
}

export function calculateSellingPriceFromPayout(
  ownerPayout: number,
  totalRepairCost: number,
): number {
  return Math.round(((ownerPayout + totalRepairCost) * 1.2) / 100) * 100;
}
