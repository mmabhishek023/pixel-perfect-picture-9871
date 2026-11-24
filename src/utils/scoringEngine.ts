import type {
  ComponentType,
  DeviceAssessment,
  DevicePassport,
  Grade,
} from "@/types/passport";

const criticalTypes: ComponentType[] = ["MOTHERBOARD", "DISPLAY"];
const repairableTypes: ComponentType[] = ["BATTERY", "DISPLAY", "SSD", "RAM"];

function fullYearsBetween(purchaseDate: string, now: Date) {
  const purchased = new Date(`${purchaseDate}T00:00:00`);
  if (Number.isNaN(purchased.getTime())) return 0;
  let years = now.getFullYear() - purchased.getFullYear();
  const beforeAnniversary =
    now.getMonth() < purchased.getMonth() ||
    (now.getMonth() === purchased.getMonth() && now.getDate() < purchased.getDate());
  if (beforeAnniversary) years -= 1;
  return Math.max(0, years);
}

function gradeFor(score: number): Grade {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

export function calculateAssessment(device: DevicePassport, now = new Date()): DeviceAssessment {
  const fullYearsSincePurchase = fullYearsBetween(device.purchaseDate, now);
  const activeComponents = device.components.filter((component) => component.active);
  const battery = activeComponents.find((component) => component.type === "BATTERY");
  const countPoorComponents = activeComponents.filter(
    (component) => component.condition === "POOR",
  ).length;
  const countFairComponents = activeComponents.filter(
    (component) => component.condition === "FAIR",
  ).length;
  const replacedCritical = device.components.filter(
    (component) => criticalTypes.includes(component.type) && component.origin === "REPLACED",
  );
  const poorCriticalCount = activeComponents.filter(
    (component) => criticalTypes.includes(component.type) && component.condition === "POOR",
  ).length;
  const poorReplacedCriticalCount = replacedCritical.filter(
    (component) => component.condition === "POOR",
  ).length;

  const dAge = Math.min(30, 5 * fullYearsSincePurchase);
  const dRep = Math.min(20, 4 * device.repairs.length);
  const dBat =
    battery?.batteryHealth !== null && battery?.batteryHealth !== undefined && battery.batteryHealth < 80
      ? Math.min(20, 0.5 * (80 - battery.batteryHealth))
      : 0;
  const dCmp = Math.min(20, 5 * countPoorComponents + 2 * countFairComponents);
  const dCrit = Math.min(10, 5 * replacedCritical.length);
  const score = Math.max(0, Math.round(100 - (dAge + dRep + dBat + dCmp + dCrit)));
  const grade = gradeFor(score);
  const criticalFailures = Math.max(poorCriticalCount, poorReplacedCriticalCount);
  let recommendation: DeviceAssessment["recommendation"];

  if (
    grade === "D" ||
    criticalFailures >= 2 ||
    fullYearsSincePurchase > (device.deviceType === "LAPTOP" ? 8 : 6)
  ) {
    recommendation = "RECYCLE";
  } else if ((grade === "A" || grade === "B") && countPoorComponents === 0) {
    recommendation = "REUSE";
  } else {
    const poor = activeComponents.filter((component) => component.condition === "POOR");
    const allPoorComponentsRepairable = poor.every((component) =>
      repairableTypes.includes(component.type),
    );
    if (
      (grade === "B" || grade === "C") &&
      countPoorComponents >= 1 &&
      countPoorComponents <= 2 &&
      allPoorComponentsRepairable
    ) {
      recommendation = "REPAIR";
    } else {
      recommendation = "REFURBISH";
    }
  }

  const factors = [
    {
      value: dAge,
      reason: `Device age: ${fullYearsSincePurchase} ${fullYearsSincePurchase === 1 ? "year" : "years"} (-${dAge} pts)`,
    },
    {
      value: dRep,
      reason: `${device.repairs.length} repair ${device.repairs.length === 1 ? "record" : "records"} logged (-${dRep} pts)`,
    },
    {
      value: dBat,
      reason: `Battery health at ${battery?.batteryHealth ?? 0}% (-${dBat} pts)`,
    },
    {
      value: dCmp,
      reason: `Component condition: ${countPoorComponents} poor, ${countFairComponents} fair (-${dCmp} pts)`,
    },
    {
      value: dCrit,
      reason: `Critical replacements: ${replacedCritical.length} display or motherboard (-${dCrit} pts)`,
    },
  ];
  const reasons = factors
    .filter((factor) => factor.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((factor) => factor.reason);

  return {
    score,
    grade,
    recommendation,
    fullYearsSincePurchase,
    deductions: { age: dAge, repairs: dRep, battery: dBat, components: dCmp, critical: dCrit },
    reasons,
    countPoorComponents,
    criticalFailures,
  };
}