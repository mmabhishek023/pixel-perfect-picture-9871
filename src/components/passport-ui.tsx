import { Badge } from "@/components/ui/badge";
import type { DeviceAssessment, DeviceStatus, Grade, Recommendation } from "@/types/passport";

const gradeStyles: Record<Grade, string> = {
  A: "border-grade-a/25 bg-grade-a/10 text-grade-a",
  B: "border-grade-b/25 bg-grade-b/10 text-grade-b",
  C: "border-grade-c/25 bg-grade-c/10 text-grade-c",
  D: "border-grade-d/25 bg-grade-d/10 text-grade-d",
};

const recommendationStyles: Record<Recommendation, string> = {
  REUSE: "border-reuse/25 bg-reuse/10 text-reuse",
  REPAIR: "border-repair/25 bg-repair/10 text-repair",
  REFURBISH: "border-refurbish/25 bg-refurbish/10 text-refurbish",
  RECYCLE: "border-recycle/25 bg-recycle/10 text-recycle",
};

const statusStyles: Record<DeviceStatus, string> = {
  REGISTERED: "border-border bg-muted text-muted-foreground",
  IN_USE: "border-success/50 bg-success text-success-foreground",
  UNDER_REPAIR: "border-warning/50 bg-warning text-warning-foreground",
  FOR_SALE: "border-info/50 bg-info text-info-foreground",
  REFURBISHING: "border-refurbish/25 bg-refurbish/10 text-refurbish",
  RECYCLED: "border-recycle/25 bg-recycle/10 text-recycle",
};

export function GradeBadge({ grade, className = "" }: { grade: Grade; className?: string }) {
  return <Badge variant="outline" className={`font-semibold ${gradeStyles[grade]} ${className}`}>Grade {grade}</Badge>;
}

export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  return <Badge variant="outline" className={`font-semibold ${recommendationStyles[recommendation]}`}>{recommendation}</Badge>;
}

export function StatusBadge({ status }: { status: DeviceStatus }) {
  return <Badge variant="outline" className={`whitespace-nowrap font-medium ${statusStyles[status]}`}>{status.replaceAll("_", " ")}</Badge>;
}

export function ScoreRing({ assessment, size = "large" }: { assessment: DeviceAssessment; size?: "large" | "small" }) {
  const isLarge = size === "large";
  return (
    <div
      className={`score-ring score-ring-${assessment.grade.toLowerCase()} grid shrink-0 place-items-center rounded-full p-[5px] ${isLarge ? "size-28" : "size-14"}`}
      style={{ "--score": `${assessment.score}%` } as React.CSSProperties}
      aria-label={`Health score ${assessment.score} out of 100`}
    >
      <div className={`grid size-full place-content-center rounded-full bg-card text-center ${isLarge ? "gap-0.5" : ""}`}>
        <span className={`font-bold leading-none ${isLarge ? "text-3xl" : "text-base"}`}>{assessment.score}</span>
        {isLarge && <span className="text-[10px] font-semibold uppercase text-muted-foreground">score</span>}
      </div>
    </div>
  );
}

export function formatDate(date: string) {
  const parsed = new Date(`${date.slice(0, 10)}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function displayName(name: string) {
  return name.replaceAll("_", " ").replace(/\b\w/gu, (letter) => letter.toUpperCase());
}