import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp, r as calculateAssessment } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { K as ArrowUpRight, O as Funnel, Y as ArrowDownUp, d as Store, g as Search, n as Wrench, p as Smartphone, q as ArrowRight, u as Tag, w as Laptop, x as Plus } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-CzhGf2Dq.mjs";
import { a as StatusBadge, i as ScoreRing, n as GradeBadge, r as RecommendationBadge, t as Badge } from "./passport-ui-Cy6-Lt0L.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { a as TabsList, n as ListingModal, o as TabsTrigger, r as Tabs, t as InspectionModal } from "./tabs-CrMqq-zs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DBm_g847.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeviceDashboard() {
	const { devices, currentUser } = useApp();
	const [search, setSearch] = (0, import_react.useState)("");
	const [gradeFilter, setGradeFilter] = (0, import_react.useState)("ALL");
	const [recommendationFilter, setRecommendationFilter] = (0, import_react.useState)("ALL");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("ALL");
	const [techTab, setTechTab] = (0, import_react.useState)("QUEUE");
	const [inspectingDeviceId, setInspectingDeviceId] = (0, import_react.useState)(null);
	const [listingDeviceId, setListingDeviceId] = (0, import_react.useState)(null);
	const isTech = currentUser?.role === "TECHNICIAN";
	const isViewer = currentUser?.role === "VIEWER";
	const isOwner = currentUser?.role === "OWNER";
	const isAdmin = currentUser?.role === "ADMIN";
	const inspectingDevice = (0, import_react.useMemo)(() => devices.find((device) => device.id === inspectingDeviceId) ?? null, [devices, inspectingDeviceId]);
	const listingDevice = (0, import_react.useMemo)(() => devices.find((device) => device.id === listingDeviceId) ?? null, [devices, listingDeviceId]);
	const assessed = (0, import_react.useMemo)(() => devices.map((device) => ({
		device,
		assessment: calculateAssessment(device)
	})), [devices]);
	const pendingInspection = (0, import_react.useMemo)(() => assessed.filter(({ device }) => (device.internalStatus || "PENDING_INSPECTION") === "PENDING_INSPECTION"), [assessed]);
	const repairedListings = (0, import_react.useMemo)(() => assessed.filter(({ device }) => device.internalStatus === "REFURBISHED" || device.internalStatus === "RECYCLED"), [assessed]);
	const filtered = assessed.filter(({ device, assessment }) => {
		const query = search.trim().toLowerCase();
		if (!(!query || [
			device.passportId,
			device.brand,
			device.model,
			device.serial
		].some((value) => value.toLowerCase().includes(query)))) return false;
		if (isOwner && device.ownerId !== currentUser?.id) return false;
		if (isViewer) {
			if (device.internalStatus !== "REFURBISHED" || !device.isListedForSale) return false;
		}
		if (isTech) {
			if (techTab === "QUEUE") {
				if ((device.internalStatus || "PENDING_INSPECTION") !== "PENDING_INSPECTION") return false;
			} else if (device.internalStatus !== "REFURBISHED" && device.internalStatus !== "RECYCLED") return false;
		}
		return (gradeFilter === "ALL" || assessment.grade === gradeFilter) && (recommendationFilter === "ALL" || assessment.recommendation === recommendationFilter) && (typeFilter === "ALL" || device.deviceType === typeFilter);
	});
	const pageTitle = isTech ? "Technician Workspace" : isViewer ? "Verified Marketplace" : isAdmin ? "All Passports" : "My Devices";
	const pageSubtitle = isTech ? "Inspect triage queue, log verified repairs, and publish refurbished products for sale." : isViewer ? "Certified refurbished electronics with cryptographic repair ledgers and verified health scores." : isAdmin ? "Platform oversight across all registered electronic device passports." : "A clear view of your registered devices.";
	const avgQueueScore = pendingInspection.length ? Math.round(pendingInspection.reduce((sum, { assessment }) => sum + assessment.score, 0) / pendingInspection.length) : 0;
	const metrics = isTech ? [
		{
			label: "Repair Queue",
			value: pendingInspection.length,
			detail: "Awaiting inspection & repair",
			icon: Wrench,
			color: "text-primary",
			tint: "bg-primary/10"
		},
		{
			label: "Repaired & Ready",
			value: repairedListings.filter(({ device }) => device.internalStatus === "REFURBISHED" && !device.isListedForSale).length,
			detail: "Finished repairs ready to list",
			icon: Tag,
			color: "text-warning",
			tint: "bg-warning/10"
		},
		{
			label: "Listed for Sale",
			value: repairedListings.filter(({ device }) => device.internalStatus === "REFURBISHED" && device.isListedForSale).length,
			detail: "Live in public buyer catalog",
			icon: Store,
			color: "text-grade-a",
			tint: "bg-grade-a/10"
		},
		{
			label: "Avg queue health",
			value: pendingInspection.length ? avgQueueScore : "—",
			detail: "Average score of queued intake",
			icon: ArrowUpRight,
			color: "text-primary",
			tint: "bg-primary/10"
		}
	] : [
		{
			label: isOwner ? "My devices" : isViewer ? "Available for sale" : "Total passports",
			value: isViewer ? assessed.filter(({ device }) => device.internalStatus === "REFURBISHED" && device.isListedForSale).length : assessed.length,
			detail: isOwner ? "Registered to your account" : isViewer ? "Verified refurbished in stock" : "Across platform registry",
			icon: Laptop,
			color: "text-primary",
			tint: "bg-primary/10"
		},
		{
			label: "Grade A / B",
			value: assessed.filter(({ assessment }) => assessment.grade === "A" || assessment.grade === "B").length,
			detail: "Ready for continued use",
			icon: ArrowUpRight,
			color: "text-grade-a",
			tint: "bg-grade-a/10"
		},
		{
			label: "Needs repair",
			value: assessed.filter(({ assessment }) => assessment.recommendation === "REPAIR").length,
			detail: "Repair before next use",
			icon: Funnel,
			color: "text-repair",
			tint: "bg-repair/10"
		},
		{
			label: "Due for recycling",
			value: assessed.filter(({ assessment }) => assessment.recommendation === "RECYCLE").length,
			detail: "End-of-life recommendation",
			icon: ArrowDownUp,
			color: "text-recycle",
			tint: "bg-recycle/10"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: pageTitle,
		subtitle: pageSubtitle,
		actions: isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/devices/new",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Register device"] })
		}) : isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				children: "Admin Console"
			})
		}) : null,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4",
				"aria-label": "Device overview",
				children: metrics.map((metric) => {
					const Icon = metric.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-card p-4 sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-muted-foreground sm:text-sm",
								children: metric.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-2xl font-bold tabular-nums sm:text-[30px]",
								children: metric.value
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid size-9 shrink-0 place-items-center rounded-md ${metric.tint} ${metric.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-[18px]" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 hidden text-xs text-muted-foreground sm:block",
							children: metric.detail
						})]
					}, metric.label);
				})
			}),
			isTech && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: techTab,
					onValueChange: (val) => setTechTab(val),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "QUEUE",
							className: "gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" }),
								"Inspection & Repair Queue",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "ml-1 text-[11px]",
									children: pendingInspection.length
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "LISTINGS",
							className: "gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-4" }),
								"Repaired & Listings",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "ml-1 text-[11px]",
									children: repairedListings.length
								})
							]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: isTech ? "mt-4" : "mt-8",
				"aria-labelledby": "device-list-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "device-list-heading",
							className: "text-lg font-semibold",
							children: isTech ? techTab === "QUEUE" ? "Devices Awaiting Inspection" : "Completed Repairs & Marketplace Listings" : isViewer ? "Available Certified Products" : "Device passports"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								"Showing ",
								filtered.length,
								" ",
								filtered.length === 1 ? "device" : "devices"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-full flex-wrap gap-2 sm:w-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative min-w-[210px] flex-1 sm:w-64 sm:flex-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: search,
										onChange: (event) => setSearch(event.target.value),
										placeholder: "Search passport, model, serial",
										className: "pl-9",
										"aria-label": "Search devices"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: typeFilter,
									onValueChange: (value) => setTypeFilter(value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[132px] bg-card",
										"aria-label": "Filter device type",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ALL",
											children: "All types"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "SMARTPHONE",
											children: "Smartphone"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "LAPTOP",
											children: "Laptop"
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: gradeFilter,
									onValueChange: (value) => setGradeFilter(value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[112px] bg-card",
										"aria-label": "Filter grade",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ALL",
										children: "All grades"
									}), [
										"A",
										"B",
										"C",
										"D"
									].map((grade) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: grade,
										children: ["Grade ", grade]
									}, grade))] })]
								}),
								!isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: recommendationFilter,
									onValueChange: (value) => setRecommendationFilter(value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[142px] bg-card",
										"aria-label": "Filter recommendation",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ALL",
										children: "All outcomes"
									}), [
										"REUSE",
										"REPAIR",
										"REFURBISH",
										"RECYCLE"
									].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: option,
										children: option
									}, option))] })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden overflow-hidden rounded-md border border-border bg-card md:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `grid ${isViewer ? "grid-cols-[minmax(240px,1.6fr)_110px_120px_110px_140px_120px]" : isTech ? "grid-cols-[minmax(220px,1.5fr)_110px_120px_130px_160px_160px]" : "grid-cols-[minmax(220px,1.5fr)_110px_120px_145px_145px_44px]"} items-center gap-4 border-b border-border bg-muted/50 px-5 py-3 text-[11px] font-semibold uppercase text-muted-foreground`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Device" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Passport ID" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Health" }),
								isViewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Price" }) : isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payout" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recommendation" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isViewer ? "Condition" : isTech ? techTab === "QUEUE" ? "Triage Status" : "Market Status" : "Lifecycle status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-right",
									children: isViewer ? "Action" : isTech ? "Action" : ""
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "divide-y divide-border",
							children: [filtered.map(({ device, assessment }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopDeviceRow, {
								device,
								assessment,
								isTech,
								techTab,
								isOwner,
								isViewer,
								onInspect: setInspectingDeviceId,
								onList: setListingDeviceId
							}, device.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDevices, { clear: () => {
								setSearch("");
								setGradeFilter("ALL");
								setRecommendationFilter("ALL");
								setTypeFilter("ALL");
							} })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:hidden",
						children: [filtered.map(({ device, assessment }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDeviceCard, {
							device,
							assessment,
							isTech,
							techTab,
							isOwner,
							isViewer,
							onInspect: setInspectingDeviceId,
							onList: setListingDeviceId
						}, device.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDevices, { clear: () => {
							setSearch("");
							setGradeFilter("ALL");
							setRecommendationFilter("ALL");
							setTypeFilter("ALL");
						} })]
					})
				]
			}),
			inspectingDevice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectionModal, {
				open: true,
				onOpenChange: (open) => {
					if (!open) setInspectingDeviceId(null);
				},
				device: inspectingDevice,
				onComplete: () => setInspectingDeviceId(null)
			}),
			listingDevice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingModal, {
				open: true,
				onOpenChange: (open) => {
					if (!open) setListingDeviceId(null);
				},
				device: listingDevice,
				onComplete: () => setListingDeviceId(null)
			})
		]
	});
}
function OwnerPayoutBadge({ device }) {
	const payoutStatus = device.payoutStatus || "PENDING_INSPECTION";
	if (payoutStatus === "PAID") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold",
		children: device.payoutAmount !== null && device.payoutAmount !== void 0 ? `₹${device.payoutAmount.toLocaleString("en-IN")} · Paid` : "Paid"
	});
	if (payoutStatus === "PAYMENT_INITIATED") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium",
		children: device.payoutAmount !== null && device.payoutAmount !== void 0 ? `₹${device.payoutAmount.toLocaleString("en-IN")} · Payment Initiated` : "Payment Initiated"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "border-border bg-muted text-muted-foreground text-xs font-normal",
		children: "Pending Inspection"
	});
}
function OwnerStatusBadge({ device }) {
	if (device.internalStatus === "PENDING_INSPECTION") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center whitespace-nowrap rounded-full border border-warning/50 bg-warning px-2.5 py-0.5 text-xs font-medium text-warning-foreground",
		children: "PENDING INSPECTION"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center whitespace-nowrap rounded-full border border-success/50 bg-success px-2.5 py-0.5 text-xs font-medium text-success-foreground",
		children: "APPROVED"
	});
}
function TechMarketBadge({ device }) {
	if (device.internalStatus === "RECYCLED") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "border-recycle/30 bg-recycle/10 text-recycle font-medium",
		children: "Recycled"
	});
	if (device.isListedForSale) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		variant: "outline",
		className: "border-emerald-500/50 bg-emerald-500/10 font-semibold text-emerald-700 dark:text-emerald-400",
		children: [
			"Listed (₹",
			(device.listingPrice ?? 0).toLocaleString("en-IN"),
			")"
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium",
		children: "Ready to List"
	});
}
function DesktopDeviceRow({ device, assessment, isTech, techTab, isOwner, isViewer, onInspect, onList }) {
	const DeviceIcon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
	const viewerThumbnail = isViewer && (device.listingPhotos?.length ?? 0) > 0 ? device.listingPhotos[0] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `grid min-h-[76px] ${isViewer ? "grid-cols-[minmax(240px,1.6fr)_110px_120px_110px_140px_120px]" : isTech ? "grid-cols-[minmax(220px,1.5fr)_110px_120px_130px_160px_160px]" : "grid-cols-[minmax(220px,1.5fr)_110px_120px_145px_145px_44px]"} items-center gap-4 px-5 transition-colors hover:bg-muted/40`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/devices/$id",
				params: { id: device.id },
				className: "flex min-w-0 items-center gap-3",
				children: [viewerThumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: viewerThumbnail,
					alt: device.name,
					className: "size-10 shrink-0 rounded-md border border-border object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceIcon, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-semibold hover:text-primary",
						children: device.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 truncate text-xs text-muted-foreground",
						children: [
							device.brand,
							" · ",
							device.deviceType.toLowerCase()
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-muted-foreground",
				children: device.passportId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
					assessment,
					size: "small"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBadge, { grade: assessment.grade })]
			}),
			isViewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-bold text-sm text-foreground tabular-nums",
				children: ["₹", (device.listingPrice ?? 0).toLocaleString("en-IN")]
			}) : isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerPayoutBadge, { device }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendationBadge, { recommendation: assessment.recommendation }),
			isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerStatusBadge, { device }) : isViewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "border-primary/40 bg-primary/10 text-xs font-medium text-primary",
				children: device.listingCondition || "Certified Refurbished"
			}) : isTech ? techTab === "QUEUE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "border-warning/50 bg-warning/10 text-warning-foreground text-xs font-medium",
				children: "Pending Inspection"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechMarketBadge, { device }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: device.status }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: isTech ? techTab === "QUEUE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "h-8 gap-1.5 text-xs font-medium",
					onClick: () => onInspect?.(device.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-3.5" }), "Inspect & Repair"]
				}) : device.internalStatus === "REFURBISHED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: device.isListedForSale ? "outline" : "default",
					className: "h-8 gap-1.5 text-xs font-medium",
					onClick: () => onList?.(device.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-3.5" }), device.isListedForSale ? "Edit Listing" : "List for Sale"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/devices/$id",
					params: { id: device.id },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-8 text-xs",
						children: "View Passport"
					})
				}) : isViewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/devices/$id",
					params: { id: device.id },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "h-8 gap-1 text-xs",
						children: ["View Passport ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/devices/$id",
					params: { id: device.id },
					className: "grid size-8 place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-muted-foreground" })
				})
			})
		]
	});
}
function MobileDeviceCard({ device, assessment, isTech, techTab, isOwner, isViewer, onInspect, onList }) {
	const DeviceIcon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
	const viewerThumbnail = isViewer && (device.listingPhotos?.length ?? 0) > 0 ? device.listingPhotos[0] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-card p-4 transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/devices/$id",
				params: { id: device.id },
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [viewerThumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: viewerThumbnail,
						alt: device.name,
						className: "size-10 shrink-0 rounded-md border border-border object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceIcon, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-semibold",
							children: device.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 truncate font-mono text-[11px] text-muted-foreground",
							children: device.passportId
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
					assessment,
					size: "small"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBadge, { grade: assessment.grade }),
					isViewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold text-sm text-foreground tabular-nums",
						children: ["₹", (device.listingPrice ?? 0).toLocaleString("en-IN")]
					}) : isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerPayoutBadge, { device }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendationBadge, { recommendation: assessment.recommendation }),
					isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerStatusBadge, { device }) : isViewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "border-primary/40 bg-primary/10 text-xs font-medium text-primary",
						children: device.listingCondition || "Certified Refurbished"
					}) : isTech ? techTab === "QUEUE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "border-warning/50 bg-warning/10 text-warning-foreground text-xs font-medium",
						children: "Pending Inspection"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechMarketBadge, { device }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: device.status })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					device.brand,
					" · ",
					device.deviceType.toLowerCase()
				] }), isTech ? techTab === "QUEUE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "h-7 gap-1 text-xs",
					onClick: () => onInspect?.(device.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-3" }), "Inspect & Repair"]
				}) : device.internalStatus === "REFURBISHED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: device.isListedForSale ? "outline" : "default",
					className: "h-7 gap-1 text-xs",
					onClick: () => onList?.(device.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-3" }), device.isListedForSale ? "Edit Listing" : "List for Sale"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/devices/$id",
					params: { id: device.id },
					className: "font-medium text-primary",
					children: "View"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/devices/$id",
					params: { id: device.id },
					className: "inline-flex items-center gap-1 font-medium text-primary",
					children: ["View ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
				})]
			})
		]
	});
}
function EmptyDevices({ clear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-56 place-items-center px-4 py-10 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-auto grid size-11 place-items-center rounded-full bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-semibold",
				children: "No devices match these filters"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Adjust your search or clear the selected filters."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				className: "mt-4",
				onClick: clear,
				children: "Clear filters"
			})
		] })
	});
}
//#endregion
export { DeviceDashboard as component };
