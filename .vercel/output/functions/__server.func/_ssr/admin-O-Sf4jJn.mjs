import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp, n as api, r as calculateAssessment } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { B as ChevronLeft, H as Check, L as CircleAlert, T as IndianRupee, d as Store, f as Sparkles, h as ShieldAlert, i as Users, n as Wrench, o as UserCheck, q as ArrowRight, v as RotateCcw, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-CzhGf2Dq.mjs";
import { i as ScoreRing, n as GradeBadge, t as Badge } from "./passport-ui-Cy6-Lt0L.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BBUarmca.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as TransferModal } from "./TransferModal-D7Rzoo0a.mjs";
import { a as CartesianGrid, c as Cell, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Bar, r as YAxis, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-O-Sf4jJn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function calculateDeviceBaseValue(device) {
	const baseValue = device.deviceType === "LAPTOP" ? 4e4 : 2e4;
	let specBonus = 0;
	if (device.ramGb && device.ramGb >= 16) specBonus += 4e3;
	if (device.storageGb && device.storageGb >= 512) specBonus += 3e3;
	return {
		baseValue,
		specBonus,
		total: baseValue + specBonus
	};
}
function calculateTotalRepairCost(device) {
	if (!Array.isArray(device.repairs)) return 0;
	return device.repairs.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
}
function calculatePricing(device, healthScore, customRepairCost) {
	const { baseValue, specBonus, total: effectiveBaseValue } = calculateDeviceBaseValue(device);
	const totalRepairCost = customRepairCost !== void 0 ? customRepairCost : calculateTotalRepairCost(device);
	const healthMultiplier = Math.max(0, Math.min(100, healthScore)) / 100;
	const isRecycled = device.internalStatus === "RECYCLED";
	let suggestedPayout;
	if (isRecycled) suggestedPayout = Math.max(500, Math.round(effectiveBaseValue * .15 / 100) * 100);
	else {
		const rawPayout = effectiveBaseValue * healthMultiplier - totalRepairCost;
		suggestedPayout = Math.max(1e3, Math.round(rawPayout / 100) * 100);
	}
	let suggestedSellingPrice = null;
	if (!isRecycled) suggestedSellingPrice = Math.round((suggestedPayout + totalRepairCost) * 1.2 / 100) * 100;
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
		platformMargin
	};
}
function calculateSellingPriceFromPayout(ownerPayout, totalRepairCost) {
	return Math.round((ownerPayout + totalRepairCost) * 1.2 / 100) * 100;
}
var CONDITION_PRESETS = [
	"Like New (Grade A)",
	"Good (Grade B)",
	"Fair (Grade C)",
	"Needs Attention (Grade D)"
];
function getDefaultCondition(grade) {
	switch (grade) {
		case "A": return "Like New (Grade A)";
		case "B": return "Good (Grade B)";
		case "C": return "Fair (Grade C)";
		case "D": return "Needs Attention (Grade D)";
	}
}
function AdminPayoutReviewModal({ open, onOpenChange, onClose, device, onComplete, onApproved }) {
	const { adminApprovePayoutAndListing } = useApp();
	const assessment = calculateAssessment(device);
	const totalRepairCost = calculateTotalRepairCost(device);
	const pricing = (0, import_react.useMemo)(() => calculatePricing(device, assessment.score), [device, assessment.score]);
	const [payoutInput, setPayoutInput] = (0, import_react.useState)("");
	const [listForSale, setListForSale] = (0, import_react.useState)(true);
	const [sellingPriceInput, setSellingPriceInput] = (0, import_react.useState)("");
	const [priceManuallyEdited, setPriceManuallyEdited] = (0, import_react.useState)(false);
	const [condition, setCondition] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const isRefurbished = device.internalStatus === "REFURBISHED";
	device.internalStatus;
	(0, import_react.useEffect)(() => {
		if (open) {
			setError("");
			const initialPayout = device.payoutAmount !== null && device.payoutAmount !== void 0 && device.payoutAmount > 0 ? device.payoutAmount : pricing.suggestedPayout;
			setPayoutInput(String(initialPayout));
			setListForSale(device.isListedForSale || isRefurbished);
			const initialSellingPrice = device.listingPrice !== null && device.listingPrice !== void 0 && device.listingPrice > 0 ? device.listingPrice : calculateSellingPriceFromPayout(initialPayout, totalRepairCost);
			setSellingPriceInput(String(initialSellingPrice));
			setPriceManuallyEdited(Boolean(device.listingPrice));
			setCondition(device.listingCondition || getDefaultCondition(assessment.grade));
			setNotes(device.listingNotes || `Certified Grade ${assessment.grade} refurbished device. Passed technician testing and verified repair diagnostics.`);
		}
	}, [
		open,
		device,
		assessment.grade,
		pricing.suggestedPayout,
		totalRepairCost,
		isRefurbished
	]);
	function handlePayoutChange(value) {
		setPayoutInput(value);
		const num = Number(value);
		if (!priceManuallyEdited && Number.isFinite(num) && num > 0) setSellingPriceInput(String(calculateSellingPriceFromPayout(num, totalRepairCost)));
	}
	function handleSellingPriceChange(value) {
		setSellingPriceInput(value);
		setPriceManuallyEdited(true);
	}
	function handleSubmit(event) {
		event.preventDefault();
		setError("");
		const payoutAmount = Number(payoutInput);
		if (!Number.isFinite(payoutAmount) || payoutAmount <= 0) {
			setError("Please enter a valid owner payout amount greater than ₹0.");
			return;
		}
		let finalSellingPrice = null;
		if (isRefurbished && listForSale) {
			finalSellingPrice = Number(sellingPriceInput);
			if (!Number.isFinite(finalSellingPrice) || finalSellingPrice <= 0) {
				setError("Please enter a valid selling price greater than ₹0 for the public catalog.");
				return;
			}
			if (finalSellingPrice < payoutAmount + totalRepairCost) {
				setError(`Selling price (₹${finalSellingPrice.toLocaleString("en-IN")}) should cover owner payout + repair cost (₹${(payoutAmount + totalRepairCost).toLocaleString("en-IN")}).`);
				return;
			}
		}
		try {
			adminApprovePayoutAndListing(device.id, {
				payoutAmount,
				isListedForSale: isRefurbished ? listForSale : false,
				listingPrice: finalSellingPrice,
				listingCondition: isRefurbished && listForSale ? condition.trim() : null,
				listingNotes: isRefurbished && listForSale ? notes.trim() : null
			});
			onOpenChange?.(false);
			onClose?.();
			onComplete?.();
			onApproved?.();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Failed to approve payout and listing.");
		}
	}
	const latestRepair = device.repairs && device.repairs.length > 0 ? device.repairs[0] : null;
	const handleOpenChange = (nextOpen) => {
		onOpenChange?.(nextOpen);
		if (!nextOpen) onClose?.();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: handleOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[92vh] overflow-y-auto sm:max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-primary" }), "Admin Review: Trade-In Payout & Marketplace Listing"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Verify technician repair work, approve owner trade-in payout, and configure public marketplace pricing." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-border bg-muted/20 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: device.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs text-muted-foreground",
									children: [
										device.passportId,
										" · ",
										device.brand
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
											assessment,
											size: "small"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBadge, { grade: assessment.grade }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: isRefurbished ? "border-success/50 bg-success/10 text-success-foreground font-semibold" : "border-recycle/40 bg-recycle/10 text-recycle font-semibold",
											children: device.internalStatus
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-3 sm:grid-cols-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Specifications:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium mt-0.5",
										children: [
											device.ramGb ?? "—",
											"GB RAM · ",
											device.storageGb ?? "—",
											"GB · ",
											device.os || "OS"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Logged Repair Cost:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-foreground mt-0.5",
										children: ["₹", totalRepairCost.toLocaleString("en-IN")]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Latest Repair:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium truncate mt-0.5",
										children: latestRepair?.description || "No repair details"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3.5 border-t border-border pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs font-medium text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Verified Post-Repair Photos (",
										device.listingPhotos?.length ?? 0,
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Intake Photos (",
										device.ownerPhotos?.length ?? 0,
										")"
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: [(device.listingPhotos ?? []).slice(0, 3).map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src,
										alt: "Post-repair",
										className: "size-14 rounded-md border border-primary/40 object-cover",
										title: "Technician Post-Repair Photo"
									}, `listing-preview-${idx}`)), (device.ownerPhotos ?? []).slice(0, 2).map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src,
										alt: "Owner intake",
										className: "size-14 rounded-md border border-border opacity-70 object-cover",
										title: "Owner Intake Photo"
									}, `owner-preview-${idx}`))]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-border p-4 bg-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold",
										children: "Owner Trade-In Payout"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: ["Suggested: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: ["₹", pricing.suggestedPayout.toLocaleString("en-IN")]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 rounded-md bg-muted/40 p-3 text-xs space-y-1.5 text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Base Device Value (",
										device.deviceType,
										"):"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: ["₹", pricing.effectiveBaseValue.toLocaleString("en-IN")]
									})]
								}), isRefurbished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Health Score Factor (",
										assessment.score,
										"%):"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: ["₹", Math.round(pricing.effectiveBaseValue * pricing.healthMultiplier).toLocaleString("en-IN")]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Less Technician Repair Cost:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["−₹", totalRepairCost.toLocaleString("en-IN")] })]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recycled Salvage Value (15%):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: ["₹", pricing.suggestedPayout.toLocaleString("en-IN")]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "admin-payout-input",
										className: "block text-xs font-semibold text-foreground",
										children: "Approved Owner Payout (₹) *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground",
											children: "₹"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "admin-payout-input",
											type: "number",
											min: "0",
											step: "1",
											value: payoutInput,
											onChange: (e) => handlePayoutChange(e.target.value),
											className: "pl-7 text-sm font-bold tabular-nums",
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: "Disbursed to owner's account upon approval."
									})
								]
							})
						]
					}),
					isRefurbished && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-primary/30 bg-primary/[0.02] p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold",
									children: "Viewer Marketplace Listing"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: listForSale,
									onChange: (e) => setListForSale(e.target.checked),
									className: "size-4 rounded border-border text-primary focus:ring-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "List for sale immediately" })]
							})]
						}), listForSale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3.5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "admin-selling-price",
										className: "block text-xs font-semibold text-foreground",
										children: "Public Selling Price (₹) *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative mt-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground",
											children: "₹"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "admin-selling-price",
											type: "number",
											min: "0",
											step: "1",
											value: sellingPriceInput,
											onChange: (e) => handleSellingPriceChange(e.target.value),
											className: "pl-7 text-sm font-bold tabular-nums",
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: [
											"Covers Payout (₹",
											Number(payoutInput) || 0,
											") + Repair (₹",
											totalRepairCost,
											") + 20% margin."
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "admin-listing-condition",
									className: "block text-xs font-semibold text-foreground",
									children: "Listing Condition"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: condition,
										onValueChange: setCondition,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "admin-listing-condition",
											className: "bg-card text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select condition" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CONDITION_PRESETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: item,
											className: "text-xs",
											children: item
										}, item)) })]
									})
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "admin-listing-notes",
								className: "block text-xs font-semibold text-foreground",
								children: "Buyer-Facing Summary & Warranty Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "admin-listing-notes",
								rows: 2,
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: "Verified condition summary visible to buyers...",
								className: "mt-1.5 bg-card text-xs"
							})] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2.5 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground",
							children: "Device payout will be approved as PAID, but the item will remain unlisted from the public catalog. You can list it anytime later."
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 sm:gap-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => handleOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), isRefurbished ? listForSale ? "Approve Payout & List for Sale" : "Approve Payout (Unlisted)" : "Approve Payout (Recycled)"]
						})]
					})
				]
			})]
		})
	});
}
var AdminErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error) {
		console.error("AdminConsole runtime error:", error);
	}
	render() {
		if (this.state.hasError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
			title: "Admin console",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-xl rounded-md border border-destructive/40 bg-destructive/10 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-destructive font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin Console error encountered" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: this.state.error?.message ?? "An error occurred while rendering the administration panel."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => this.setState({
								hasError: false,
								error: null
							}),
							children: "Reload Console"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								children: "Back to Devices"
							})
						})]
					})
				]
			})
		});
		return this.props.children;
	}
};
function AdminRouteWrapper() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminConsole, {}) });
}
var gradeColors = {
	A: "var(--color-grade-a)",
	B: "var(--color-grade-b)",
	C: "var(--color-grade-c)",
	D: "var(--color-grade-d)"
};
var outcomeColors = {
	REUSE: "var(--color-reuse)",
	REPAIR: "var(--color-repair)",
	REFURBISH: "var(--color-refurbish)",
	RECYCLE: "var(--color-recycle)"
};
var internalStatusStyles = {
	PENDING_INSPECTION: "border-warning/50 bg-warning/10 text-warning-foreground",
	REFURBISHED: "border-success/50 bg-success/10 text-success-foreground",
	RECYCLED: "border-recycle/30 bg-recycle/10 text-recycle"
};
var payoutStatusStyles = {
	PENDING_INSPECTION: "border-border bg-muted text-muted-foreground",
	PAYMENT_INITIATED: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
	PAID: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
};
function getInternalStatusStyle(status) {
	if (!status) return "border-warning/50 bg-warning/10 text-warning-foreground";
	return internalStatusStyles[status] || "border-border bg-muted text-muted-foreground";
}
function getPayoutStatusStyle(status) {
	if (!status) return "border-border bg-muted text-muted-foreground";
	return payoutStatusStyles[status] || "border-border bg-muted text-muted-foreground";
}
function AdminConsole() {
	const { currentUser, state, approveTechnician, rejectTechnician, markAsPaid, switchRole } = useApp();
	const [reviewingDeviceId, setReviewingDeviceId] = (0, import_react.useState)(null);
	const [transferDeviceId, setTransferDeviceId] = (0, import_react.useState)(null);
	const [payoutPage, setPayoutPage] = (0, import_react.useState)(1);
	const users = state.users ?? [];
	const devices = state.devices ?? [];
	const reviewingDevice = (0, import_react.useMemo)(() => {
		return reviewingDeviceId ? devices.find((d) => d.id === reviewingDeviceId) ?? null : null;
	}, [devices, reviewingDeviceId]);
	const transferTargetDevice = (0, import_react.useMemo)(() => {
		return transferDeviceId ? devices.find((d) => d.id === transferDeviceId) ?? null : null;
	}, [devices, transferDeviceId]);
	const stats = (0, import_react.useMemo)(() => {
		try {
			return api.adminStats(state);
		} catch {
			return {
				users: users.length,
				devices: devices.length,
				repairs: devices.reduce((total, d) => total + (d.repairs?.length ?? 0), 0),
				pendingTechnicians: users.filter((u) => u.role === "TECHNICIAN" && u.status === "PENDING").length
			};
		}
	}, [
		state,
		users,
		devices
	]);
	const pending = (0, import_react.useMemo)(() => users.filter((user) => user.role === "TECHNICIAN" && user.status === "PENDING"), [users]);
	const payoutDevices = (0, import_react.useMemo)(() => devices.filter((device) => device.payoutStatus === "PAYMENT_INITIATED" || device.payoutStatus === "PAID"), [devices]);
	const sortedPayoutDevices = (0, import_react.useMemo)(() => {
		return [...payoutDevices].sort((a, b) => {
			const tA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
			const tB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
			if (tB !== tA) return tB - tA;
			return b.passportId.localeCompare(a.passportId);
		});
	}, [payoutDevices]);
	const PAGE_SIZE = 5;
	const totalPayoutPages = Math.max(1, Math.ceil(sortedPayoutDevices.length / PAGE_SIZE));
	const safePayoutPage = Math.min(Math.max(1, payoutPage), totalPayoutPages);
	const paginatedPayoutDevices = sortedPayoutDevices.slice((safePayoutPage - 1) * PAGE_SIZE, safePayoutPage * PAGE_SIZE);
	const userNameById = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const user of users) map.set(user.id, user.name);
		return map;
	}, [users]);
	const gradeData = (0, import_react.useMemo)(() => {
		return [
			"A",
			"B",
			"C",
			"D"
		].map((grade) => {
			return {
				grade,
				count: devices.filter((device) => {
					try {
						return calculateAssessment(device).grade === grade;
					} catch {
						return false;
					}
				}).length
			};
		});
	}, [devices]);
	const recommendationData = (0, import_react.useMemo)(() => {
		return [
			"REUSE",
			"REPAIR",
			"REFURBISH",
			"RECYCLE"
		].map((name) => {
			return {
				name,
				value: devices.filter((device) => {
					try {
						return calculateAssessment(device).recommendation === name;
					} catch {
						return false;
					}
				}).length
			};
		});
	}, [devices]);
	if (currentUser?.role !== "ADMIN") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Admin console",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "max-w-lg rounded-md border border-warning/50 bg-warning/10 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold text-warning-foreground",
					children: "Admin access required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						"You are currently signed in as ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: currentUser?.name ?? "Guest"
						}),
						" (",
						currentUser?.role ?? "No role",
						"). Switch to the Admin demo role to open this view."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => switchRole("ADMIN"),
						children: "Switch to Admin Role"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Back to devices"
						})
					})]
				})
			]
		})
	});
	const metrics = [
		{
			label: "Total users",
			value: stats.users,
			icon: Users
		},
		{
			label: "Total devices",
			value: stats.devices,
			icon: RotateCcw
		},
		{
			label: "Repair records",
			value: stats.repairs,
			icon: Wrench
		},
		{
			label: "Pending approvals",
			value: stats.pendingTechnicians,
			icon: CircleAlert
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Admin console",
		subtitle: "Platform overview, payouts, listings, and technician approvals.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: metrics.map(({ label, value, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-card p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-md bg-secondary text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs font-medium text-muted-foreground",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold tabular-nums",
							children: value
						})
					]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Devices by grade"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: gradeData,
								margin: {
									top: 8,
									right: 12,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										vertical: false,
										stroke: "var(--color-border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "grade",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										name: "Devices",
										radius: [
											4,
											4,
											0,
											0
										],
										children: gradeData.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: gradeColors[item.grade] }, item.grade))
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Lifecycle recommendations"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: recommendationData,
									dataKey: "value",
									nameKey: "name",
									innerRadius: 55,
									outerRadius: 88,
									paddingAngle: 3,
									children: recommendationData.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: outcomeColors[item.name] }, item.name))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap justify-center gap-x-4 gap-y-2",
							children: recommendationData.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2 rounded-full",
									style: { backgroundColor: outcomeColors[item.name] }
								}), item.name]
							}, item.name))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-md border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Trade-In Payouts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-sm text-muted-foreground",
							children: [payoutDevices.filter((d) => (d.payoutStatus || "PENDING_INSPECTION") === "PAYMENT_INITIATED").length, " awaiting review & disbursement"]
						})] })]
					})
				}), sortedPayoutDevices.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border bg-muted/50 text-[11px] font-semibold uppercase text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Device"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Passport ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Owner"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Outcome"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Payout"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status & Listing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: paginatedPayoutDevices.map((device) => {
								const internalStatus = device.internalStatus || "PENDING_INSPECTION";
								const payoutStatus = device.payoutStatus || "PENDING_INSPECTION";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 font-medium",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/devices/$id",
												params: { id: device.id },
												className: "hover:text-primary",
												children: device.name
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 font-mono text-xs text-muted-foreground",
											children: device.passportId
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 text-muted-foreground",
											children: userNameById.get(device.ownerId) ?? device.ownerId
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: `text-xs font-medium ${getInternalStatusStyle(internalStatus)}`,
												children: internalStatus.replaceAll("_", " ")
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 font-semibold tabular-nums",
											children: device.payoutAmount !== null && device.payoutAmount !== void 0 ? `₹${device.payoutAmount.toLocaleString("en-IN")}` : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col gap-1 items-start",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: `text-xs font-medium ${getPayoutStatusStyle(payoutStatus)}`,
														children: payoutStatus.replaceAll("_", " ")
													}),
													device.isListedForSale && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: "border-primary/50 bg-primary/10 text-primary text-[10px]",
														children: [
															"Listed (₹",
															(device.listingPrice ?? 0).toLocaleString("en-IN"),
															")"
														]
													}),
													internalStatus === "REFURBISHED" && !device.isListedForSale && payoutStatus === "PAID" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-muted-foreground",
														children: "Unlisted"
													})
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-2",
												children: [payoutStatus === "PAYMENT_INITIATED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													onClick: () => setReviewingDeviceId(device.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Review & Approve"]
												}) : internalStatus === "REFURBISHED" && !device.isListedForSale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setReviewingDeviceId(device.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-4" }), "Manage Listing"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													onClick: () => setReviewingDeviceId(device.id),
													children: "View Details"
												}), (internalStatus === "REFURBISHED" || device.isListedForSale) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-8 gap-1 text-xs",
													onClick: () => setTransferDeviceId(device.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5" }), "Transfer to Buyer"]
												})]
											})
										})
									]
								}, device.id);
							})
						})]
					})
				}), sortedPayoutDevices.length > PAGE_SIZE && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"Showing ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: (safePayoutPage - 1) * PAGE_SIZE + 1
						}),
						"–",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: Math.min(safePayoutPage * PAGE_SIZE, sortedPayoutDevices.length)
						}),
						" of",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: sortedPayoutDevices.length
						}),
						" devices"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 px-2",
								disabled: safePayoutPage <= 1,
								onClick: () => setPayoutPage((p) => Math.max(1, p - 1)),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Previous"]
							}),
							Array.from({ length: totalPayoutPages }, (_, i) => i + 1).map((num) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: num === safePayoutPage ? "default" : "outline",
								size: "sm",
								className: "size-8 p-0",
								onClick: () => setPayoutPage(num),
								children: num
							}, num)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-8 px-2",
								disabled: safePayoutPage >= totalPayoutPages,
								onClick: () => setPayoutPage((p) => Math.min(totalPayoutPages, p + 1)),
								children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
							})
						]
					})]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 py-6 text-sm text-muted-foreground",
					children: "No trade-in payouts have been initiated yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-md border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Technician approvals"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [pending.length, " waiting for review"]
					})] })
				}), pending.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: pending.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: user.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm text-muted-foreground",
							children: user.email
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => rejectTechnician(user.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4" }), "Reject"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => approveTechnician(user.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Approve"]
							})]
						})]
					}, user.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 py-6 text-sm text-muted-foreground",
					children: "No technician requests need review."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-md border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Platform devices & listings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-sm text-muted-foreground",
						children: "All registered devices, inspection outcomes, marketplace status, payout tracking, and verified photos."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border bg-muted/50 text-[11px] font-semibold uppercase text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Device"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Internal Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Marketplace"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Payout Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Photos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Details"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: devices.map((device) => {
								const internalStatus = device.internalStatus || "PENDING_INSPECTION";
								const payoutStatus = device.payoutStatus || "PENDING_INSPECTION";
								const ownerPhotos = device.ownerPhotos ?? [];
								const listingPhotos = device.listingPhotos ?? [];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-3.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: device.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-xs text-muted-foreground",
												children: device.passportId
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: `text-xs font-medium ${getInternalStatusStyle(internalStatus)}`,
												children: internalStatus.replaceAll("_", " ")
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5",
											children: device.isListedForSale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "gap-1 border-primary/50 bg-primary/10 text-primary",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-3" }),
													"Listed (₹",
													(device.listingPrice ?? 0).toLocaleString("en-IN"),
													")"
												]
											}) : internalStatus === "REFURBISHED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "border-border bg-muted text-muted-foreground",
												children: "Ready to List"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "—"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: `text-xs font-medium ${getPayoutStatusStyle(payoutStatus)}`,
												children: payoutStatus.replaceAll("_", " ")
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Owner: ", ownerPhotos.length] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Listing: ", listingPhotos.length] }),
													(ownerPhotos.length > 0 || listingPhotos.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1",
														children: [ownerPhotos.slice(0, 2).map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src,
															alt: "Owner intake",
															className: "size-6 rounded border border-border object-cover"
														}, `owner-${idx}`)), listingPhotos.slice(0, 2).map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src,
															alt: "Listing",
															className: "size-6 rounded border border-primary/40 object-cover"
														}, `listing-${idx}`))]
													})
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3.5 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-2",
												children: [(device.internalStatus === "REFURBISHED" || device.isListedForSale) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-7 gap-1 text-xs",
													onClick: () => setTransferDeviceId(device.id),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5" }), "Transfer to Buyer"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/devices/$id",
													params: { id: device.id },
													className: "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
													children: ["View ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
												})]
											})
										})
									]
								}, device.id);
							})
						})]
					})
				})]
			}),
			reviewingDevice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPayoutReviewModal, {
				open: !!reviewingDevice,
				device: reviewingDevice,
				onClose: () => setReviewingDeviceId(null),
				onApproved: () => setReviewingDeviceId(null)
			}),
			transferTargetDevice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransferModal, {
				open: !!transferTargetDevice,
				device: transferTargetDevice,
				onOpenChange: (open) => {
					if (!open) setTransferDeviceId(null);
				},
				onComplete: () => setTransferDeviceId(null)
			})
		]
	});
}
//#endregion
export { AdminRouteWrapper as component };
