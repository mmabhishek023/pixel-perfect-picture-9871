import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var gradeStyles = {
	A: "border-grade-a/25 bg-grade-a/10 text-grade-a",
	B: "border-grade-b/25 bg-grade-b/10 text-grade-b",
	C: "border-grade-c/25 bg-grade-c/10 text-grade-c",
	D: "border-grade-d/25 bg-grade-d/10 text-grade-d"
};
var recommendationStyles = {
	REUSE: "border-reuse/25 bg-reuse/10 text-reuse",
	REPAIR: "border-repair/25 bg-repair/10 text-repair",
	REFURBISH: "border-refurbish/25 bg-refurbish/10 text-refurbish",
	RECYCLE: "border-recycle/25 bg-recycle/10 text-recycle"
};
var statusStyles = {
	REGISTERED: "border-border bg-muted text-muted-foreground",
	IN_USE: "border-success/50 bg-success text-success-foreground",
	UNDER_REPAIR: "border-warning/50 bg-warning text-warning-foreground",
	FOR_SALE: "border-info/50 bg-info text-info-foreground",
	REFURBISHING: "border-refurbish/25 bg-refurbish/10 text-refurbish",
	RECYCLED: "border-recycle/25 bg-recycle/10 text-recycle"
};
function GradeBadge({ grade, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "outline",
		className: `font-semibold ${gradeStyles[grade]} ${className}`,
		children: ["Grade ", grade]
	});
}
function RecommendationBadge({ recommendation }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: `font-semibold ${recommendationStyles[recommendation]}`,
		children: recommendation
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: `whitespace-nowrap font-medium ${statusStyles[status]}`,
		children: status.replaceAll("_", " ")
	});
}
function ScoreRing({ assessment, size = "large" }) {
	const isLarge = size === "large";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `score-ring score-ring-${assessment.grade.toLowerCase()} grid shrink-0 place-items-center rounded-full p-[5px] ${isLarge ? "size-28" : "size-14"}`,
		style: { "--score": `${assessment.score}%` },
		"aria-label": `Health score ${assessment.score} out of 100`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `grid size-full place-content-center rounded-full bg-card text-center ${isLarge ? "gap-0.5" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `font-bold leading-none ${isLarge ? "text-3xl" : "text-base"}`,
				children: assessment.score
			}), isLarge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-semibold uppercase text-muted-foreground",
				children: "score"
			})]
		})
	});
}
function formatDate(date) {
	const parsed = /* @__PURE__ */ new Date(`${date.slice(0, 10)}T00:00:00`);
	return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(parsed);
}
function formatCurrency(amount) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(amount);
}
function displayName(name) {
	return name.replaceAll("_", " ").replace(/\b\w/gu, (letter) => letter.toUpperCase());
}
//#endregion
export { StatusBadge as a, formatDate as c, ScoreRing as i, GradeBadge as n, displayName as o, RecommendationBadge as r, formatCurrency as s, Badge as t };
