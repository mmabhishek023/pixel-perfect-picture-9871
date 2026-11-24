import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp, r as calculateAssessment } from "./AppContext-Cscm7p4N.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { E as ImagePlus, F as CircleX, I as CircleCheck, U as Camera, d as Store, f as Sparkles, l as Trash2, n as Wrench, u as Tag, x as Plus, y as Recycle } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { c as formatDate, s as formatCurrency, t as Badge } from "./passport-ui-Cy6-Lt0L.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BBUarmca.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { i as TabsTrigger$1, n as TabsContent$1, r as TabsList$1, t as Tabs$1 } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabs-CrMqq-zs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STANDARD_DAMAGES = [
	"Water/Liquid Damage",
	"Battery Swelling/Drain",
	"Screen Crack",
	"Port/Charging Issue",
	"Camera/Speaker Fault",
	"Body Dents/Scratches"
];
function InspectionModal({ open, onOpenChange, device, onComplete }) {
	const { currentUser, completeInspection } = useApp();
	const [resolvedDamageIds, setResolvedDamageIds] = (0, import_react.useState)([]);
	const [extraActiveDamages, setExtraActiveDamages] = (0, import_react.useState)([]);
	const [selectedStandardDamage, setSelectedStandardDamage] = (0, import_react.useState)("");
	const [customDamage, setCustomDamage] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [cost, setCost] = (0, import_react.useState)("0");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [listingPhotos, setListingPhotos] = (0, import_react.useState)([]);
	const [outcome, setOutcome] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const isTechVerified = currentUser?.role === "TECHNICIAN" && currentUser.status === "ACTIVE";
	const initialDamages = device.activeDamages ?? [];
	const ownerPhotos = device.ownerPhotos ?? [];
	const projectedAssessment = (0, import_react.useMemo)(() => {
		const remainingDamages = initialDamages.filter((dmg) => !resolvedDamageIds.includes(dmg));
		return calculateAssessment({
			...device,
			activeDamages: [...remainingDamages, ...extraActiveDamages]
		});
	}, [
		device,
		initialDamages,
		resolvedDamageIds,
		extraActiveDamages
	]);
	(0, import_react.useEffect)(() => {
		if (open) {
			setResolvedDamageIds([]);
			setExtraActiveDamages([]);
			setSelectedStandardDamage("");
			setCustomDamage("");
			setDescription("");
			setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
			setCost("0");
			setNotes("");
			setListingPhotos([]);
			setOutcome(null);
			setError("");
		}
	}, [open, device.id]);
	function toggleResolvedDamage(dmg) {
		setResolvedDamageIds((prev) => prev.includes(dmg) ? prev.filter((item) => item !== dmg) : [...prev, dmg]);
	}
	function addExtraDamage() {
		const toAdd = (selectedStandardDamage || customDamage).trim();
		if (!toAdd) return;
		if (initialDamages.includes(toAdd) || extraActiveDamages.includes(toAdd)) {
			setError(`Damage "${toAdd}" is already in the list.`);
			return;
		}
		setExtraActiveDamages((prev) => [...prev, toAdd]);
		setSelectedStandardDamage("");
		setCustomDamage("");
		setError("");
	}
	function removeExtraDamage(dmg) {
		setExtraActiveDamages((prev) => prev.filter((item) => item !== dmg));
	}
	function handlePhotoUpload(event) {
		const files = event.target.files;
		if (!files || files.length === 0) return;
		const fileList = Array.from(files);
		for (const file of fileList) {
			if (!file.type.startsWith("image/")) continue;
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result;
				if (typeof result === "string") setListingPhotos((prev) => [...prev, result]);
			};
			reader.readAsDataURL(file);
		}
		event.target.value = "";
	}
	function removePhoto(index) {
		setListingPhotos((prev) => prev.filter((_, idx) => idx !== index));
	}
	function handleSubmit(event) {
		event.preventDefault();
		setError("");
		if (!description.trim()) {
			setError("Repair description is required.");
			return;
		}
		if (!outcome) {
			setError("Please select a final outcome: Mark as REFURBISHED or Mark as RECYCLED.");
			return;
		}
		const repairRecord = {
			date,
			description: description.trim(),
			cost: Number(cost) || 0,
			affectedComponentIds: [],
			notes: notes.trim(),
			verified: isTechVerified
		};
		try {
			completeInspection(device.id, {
				outcome,
				payoutAmount: null,
				resolvedDamageIds,
				extraActiveDamages,
				repairRecord,
				listingPhotos
			});
			onOpenChange(false);
			onComplete();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Failed to complete inspection.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[92vh] overflow-y-auto sm:max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5 text-primary" }), "Technician Inspection & Repair"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Verify owner intake condition, log technical repair work, upload post-repair photos, and mark refurbished or recycled." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-border bg-muted/20 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: "1. Owner's Intake Info"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Device"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: device.name
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Passport ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-sm font-medium",
										children: device.passportId
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Registered"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: formatDate(device.createdAt)
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Known damages"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 flex flex-wrap gap-1.5",
									children: initialDamages.length > 0 ? initialDamages.map((dmg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
										children: dmg
									}, dmg)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground",
										children: "No known damages reported."
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Prior history"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-foreground",
									children: device.priorHistory || "No prior history provided."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Owner intake photos"
								}), ownerPhotos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4",
									children: ownerPhotos.map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: src,
										target: "_blank",
										rel: "noreferrer",
										className: "overflow-hidden rounded-md border border-border bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src,
											alt: `Owner intake photo ${idx + 1}`,
											className: "h-20 w-full object-cover transition-transform hover:scale-105"
										})
									}, `${src.slice(0, 32)}-${idx}`))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "No owner photos provided."
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: "2. Damage Verification"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Check off damages resolved during repair. Unchecked items continue to reduce the health score."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: initialDamages.length > 0 ? initialDamages.map((dmg) => {
									const isResolved = resolvedDamageIds.includes(dmg);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted/40",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: isResolved,
												onChange: () => toggleResolvedDamage(dmg),
												className: "size-4 rounded border-border text-primary focus:ring-primary"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: isResolved ? "line-through text-muted-foreground" : "font-medium",
												children: dmg
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: isResolved ? "border-success/40 bg-success/10 text-success-foreground" : "border-warning/40 bg-warning/10 text-warning-foreground",
											children: isResolved ? "Repaired / Resolved" : "Active Damage"
										})]
									}, dmg);
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "No reported damages from intake."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 border-t border-border pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase text-muted-foreground",
										children: "Discovered Additional Damages"
									}),
									extraActiveDamages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-wrap gap-1.5",
										children: extraActiveDamages.map((dmg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "gap-1 border-destructive/40 bg-destructive/10 text-destructive",
											children: [dmg, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => removeExtraDamage(dmg),
												className: "ml-1 hover:text-foreground",
												"aria-label": `Remove ${dmg}`,
												children: "×"
											})]
										}, dmg))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: selectedStandardDamage,
												onValueChange: (val) => {
													setSelectedStandardDamage(val);
													setCustomDamage("");
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "w-[200px] bg-card text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Standard damage..." })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STANDARD_DAMAGES.map((dmg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: dmg,
													className: "text-xs",
													children: dmg
												}, dmg)) })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: customDamage,
												onChange: (e) => {
													setCustomDamage(e.target.value);
													setSelectedStandardDamage("");
												},
												placeholder: "Or custom fault...",
												className: "w-[180px] text-xs"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												onClick: addExtraDamage,
												className: "text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Add"]
											})
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: "3. Repair Work Log"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: isTechVerified ? "border-success/40 bg-success/10 text-success-foreground" : "border-warning/40 bg-warning/10 text-warning-foreground",
								children: isTechVerified ? "Technician Verified" : "Pending Approval"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "grid gap-1.5 text-sm font-medium",
									children: ["Repair Description *", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: description,
										onChange: (e) => setDescription(e.target.value),
										placeholder: "e.g. Replaced cracked OLED display assembly and calibrated touch controller"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1.5 text-sm font-medium",
										children: ["Date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: date,
											onChange: (e) => setDate(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1.5 text-sm font-medium",
										children: ["Repair Cost (₹)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: "0",
											step: "1",
											value: cost,
											onChange: (e) => setCost(e.target.value),
											placeholder: "Parts + labor cost in ₹"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "grid gap-1.5 text-sm font-medium",
									children: ["Diagnostic & Work Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										value: notes,
										onChange: (e) => setNotes(e.target.value),
										placeholder: "Diagnostic observations, parts replaced, thermal test results..."
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold",
									children: "4. Post-Repair Photos"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Upload photos of the repaired device for Admin review and buyer listing."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-2.5 text-sm font-medium hover:bg-muted/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Choose or capture photos" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											capture: "environment",
											multiple: true,
											onChange: handlePhotoUpload,
											className: "sr-only"
										})
									]
								})
							}),
							listingPhotos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4",
								children: listingPhotos.map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "group relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src,
										alt: `Post-repair photo ${idx + 1}`,
										className: "h-24 w-full rounded-md border border-border object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => removePhoto(idx),
										className: "absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground",
										"aria-label": `Remove photo ${idx + 1}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})]
								}, `${src.slice(0, 32)}-${idx}`))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold",
										children: "5. Final Outcome"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: [
										"Projected score: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											className: "text-foreground",
											children: [projectedAssessment.score, "/100"]
										}),
										" (Grade ",
										projectedAssessment.grade,
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setOutcome("REFURBISHED"),
									className: `flex items-center justify-center gap-2.5 rounded-md border-2 p-4 text-sm font-semibold transition-colors ${outcome === "REFURBISHED" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted/50"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }), "Mark as REFURBISHED"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setOutcome("RECYCLED"),
									className: `flex items-center justify-center gap-2.5 rounded-md border-2 p-4 text-sm font-semibold transition-colors ${outcome === "RECYCLED" ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-card text-foreground hover:bg-muted/50"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recycle, { className: "size-5" }), "Mark as RECYCLED"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3.5 flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Owner trade-in payout and public selling price will be reviewed and approved by the System Administrator based on your logged repair cost and final health score." })]
							})
						]
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
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: !outcome,
							children: "Submit Technical Inspection"
						})]
					})
				]
			})]
		})
	});
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
function ListingModal({ open, onOpenChange, device, onComplete }) {
	const { listDeviceForSale, unlistDevice } = useApp();
	const assessment = calculateAssessment(device);
	const [priceInput, setPriceInput] = (0, import_react.useState)("");
	const [condition, setCondition] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [photos, setPhotos] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open) {
			setError("");
			setCondition(device.listingCondition || getDefaultCondition(assessment.grade));
			setPriceInput(device.listingPrice !== null && device.listingPrice !== void 0 ? String(device.listingPrice) : String(Math.round((device.payoutAmount ?? 15e3) * 1.25)));
			setNotes(device.listingNotes || `Verified Grade ${assessment.grade} refurbished device. Passed technician testing and component diagnostics.`);
			setPhotos(device.listingPhotos ?? []);
		}
	}, [
		open,
		device,
		assessment.grade
	]);
	function handlePhotoUpload(event) {
		const files = event.target.files;
		if (!files || files.length === 0) return;
		const fileList = Array.from(files);
		for (const file of fileList) {
			if (!file.type.startsWith("image/")) continue;
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result;
				if (typeof result === "string") setPhotos((prev) => [...prev, result]);
			};
			reader.readAsDataURL(file);
		}
		event.target.value = "";
	}
	function removePhoto(index) {
		setPhotos((prev) => prev.filter((_, i) => i !== index));
	}
	function handlePublish(event) {
		event.preventDefault();
		setError("");
		const price = Number(priceInput);
		if (!Number.isFinite(price) || price <= 0) {
			setError("Please enter a valid selling price greater than ₹0.");
			return;
		}
		if (!condition.trim()) {
			setError("Please specify the listing condition.");
			return;
		}
		try {
			listDeviceForSale(device.id, {
				price,
				condition: condition.trim(),
				notes: notes.trim(),
				listingPhotos: photos
			});
			onOpenChange(false);
			onComplete?.();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Failed to list device for sale.");
		}
	}
	function handleUnlist() {
		setError("");
		try {
			unlistDevice(device.id);
			onOpenChange(false);
			onComplete?.();
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Failed to unlist device.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[92vh] overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-5 text-primary" }), device.isListedForSale ? "Edit Marketplace Listing" : "List Refurbished Device for Sale"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Publish this verified device to the public Viewer marketplace with buyer pricing and post-repair photos." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handlePublish,
				className: "space-y-5 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-border bg-muted/30 p-3.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: device.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted-foreground",
								children: device.passportId
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "border-success/50 bg-success/10 text-success-foreground",
									children: [
										"Grade ",
										assessment.grade,
										" · ",
										assessment.score,
										"/100"
									]
								}), device.payoutAmount !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Payout cost: ", formatCurrency(device.payoutAmount)]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "listing-condition",
							className: "block text-xs font-medium text-foreground",
							children: "Listing Condition"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: condition,
								onValueChange: setCondition,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "listing-condition",
									className: "bg-card",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select condition" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CONDITION_PRESETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: item,
									children: item
								}, item)) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: condition,
								onChange: (e) => setCondition(e.target.value),
								placeholder: "Or type custom condition",
								className: "text-xs"
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "listing-price",
								className: "block text-xs font-medium text-foreground",
								children: "Selling Price (₹)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground",
									children: "₹"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "listing-price",
									type: "number",
									min: "0",
									step: "1",
									value: priceInput,
									onChange: (e) => setPriceInput(e.target.value),
									placeholder: "e.g. 24999",
									className: "pl-7 tabular-nums",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "Visible to buyers in the public catalog."
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "listing-notes",
						className: "block text-xs font-medium text-foreground",
						children: "Buyer-Facing Description & Notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "listing-notes",
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Highlight cosmetic condition, warranty, upgrades, or included accessories...",
						rows: 3,
						className: "mt-1.5 bg-card text-xs"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-medium text-foreground",
							children: [
								"Listing Photos (",
								photos.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "Buyers only see these verified photos"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4",
						children: [photos.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group relative aspect-video overflow-hidden rounded-md border border-border bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: `Listing photo ${index + 1}`,
								className: "h-full w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => removePhoto(index),
								className: "absolute right-1 top-1 rounded bg-background/80 p-1 text-destructive opacity-0 backdrop-blur transition-opacity group-hover:opacity-100",
								title: "Remove photo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						}, index)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-muted-foreground hover:border-primary hover:text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 text-[11px]",
									children: "Add photos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									multiple: true,
									onChange: handlePhotoUpload,
									className: "sr-only"
								})
							]
						})]
					})] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0",
						children: [device.isListedForSale ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "text-destructive hover:bg-destructive/10",
							onClick: handleUnlist,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4" }), "Unlist from Store"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => onOpenChange(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "size-4" }), device.isListedForSale ? "Update Listing" : "Publish Listing"]
							})]
						})]
					})
				]
			})]
		})
	});
}
var Tabs = Tabs$1;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsList$1.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger$1, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsTrigger$1.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent$1, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsContent$1.displayName;
//#endregion
export { TabsList as a, TabsContent as i, ListingModal as n, TabsTrigger as o, Tabs as r, InspectionModal as t };
