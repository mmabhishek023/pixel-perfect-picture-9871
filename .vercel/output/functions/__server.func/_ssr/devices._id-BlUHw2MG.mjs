import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as useAppApi, i as useApp, r as calculateAssessment } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { A as FilePlusCorner, D as History, E as ImagePlus, G as Battery, H as Check, J as ArrowLeft, M as Cpu, N as Copy, P as ClipboardPlus, S as Pencil, V as ChevronDown, c as TriangleAlert, d as Store, f as Sparkles, h as ShieldAlert, m as ShieldCheck, n as Wrench, o as UserCheck, r as Wallet } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-CzhGf2Dq.mjs";
import { a as StatusBadge, c as formatDate, i as ScoreRing, n as GradeBadge, o as displayName, r as RecommendationBadge, s as formatCurrency, t as Badge } from "./passport-ui-Cy6-Lt0L.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BBUarmca.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as TransferModal } from "./TransferModal-D7Rzoo0a.mjs";
import { t as Route } from "./devices._id-CX4qAQzl.mjs";
import { a as TabsList, i as TabsContent, n as ListingModal, o as TabsTrigger, r as Tabs, t as InspectionModal } from "./tabs-CrMqq-zs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/devices._id-BlUHw2MG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var componentTypes = [
	"BATTERY",
	"RAM",
	"SSD",
	"DISPLAY",
	"MOTHERBOARD",
	"CAMERA",
	"PORT",
	"OTHER"
];
var deviceStatuses = [
	"REGISTERED",
	"IN_USE",
	"UNDER_REPAIR",
	"FOR_SALE",
	"REFURBISHING",
	"RECYCLED"
];
function DeviceDetail() {
	const { id } = Route.useParams();
	const { getDevice, currentUser, updateDevice, transferDevice } = useApp();
	const device = getDevice(id);
	const [transferOpen, setTransferOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [inspectOpen, setInspectOpen] = (0, import_react.useState)(false);
	const [listingOpen, setListingOpen] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [editForm, setEditForm] = (0, import_react.useState)({
		os: device?.os ?? "",
		ramGb: device?.ramGb ?? null,
		storageGb: device?.storageGb ?? null,
		processor: device?.processor ?? ""
	});
	const isOwner = device?.ownerId === currentUser?.id && currentUser?.role === "OWNER";
	const isTechnician = currentUser?.role === "TECHNICIAN";
	const isViewer = currentUser?.role === "VIEWER";
	const isAdmin = currentUser?.role === "ADMIN";
	const canEditSpecs = (isOwner || isAdmin) && device?.status !== "RECYCLED";
	const canChangeStatus = isAdmin && device?.status !== "RECYCLED";
	const isReadOnly = isViewer || isOwner || device?.status === "RECYCLED";
	async function shareLink() {
		if (!device) return;
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/p/${device.qrToken}`);
			setMessage("Public link copied.");
		} catch {
			setError("Copy is unavailable in this browser.");
		}
	}
	function updateStatus(value) {
		if (!device) return;
		setError("");
		try {
			updateDevice(device.id, { status: value });
			setMessage("Lifecycle status updated.");
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not update status.");
		}
	}
	function saveSpecs(event) {
		event.preventDefault();
		if (!device) return;
		try {
			updateDevice(device.id, editForm);
			setEditOpen(false);
			setMessage("Device specifications updated.");
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not save specifications.");
		}
	}
	if (!device) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Passport unavailable",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-lg rounded-md border border-border bg-card p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "This device passport could not be found."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 inline-flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to devices"]
				})
			})]
		})
	});
	if (isViewer && (device.internalStatus !== "REFURBISHED" || !device.isListedForSale)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Passport unavailable",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-lg rounded-md border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "This device is not listed in the public marketplace."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "This electronic product is currently undergoing inspection, repair, or has not been listed for sale."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 inline-flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to marketplace"]
					})
				})
			]
		})
	});
	const assessment = calculateAssessment(device);
	const ownerName = (0, import_react.useMemo)(() => getDevice(device.id) ? "Current owner" : "", [getDevice, device.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: device.name,
		subtitle: `${device.brand} · ${device.deviceType.toLowerCase()} · ${device.passportId}`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: currentUser?.role === "TECHNICIAN" ? "Repair Queue" : currentUser?.role === "VIEWER" ? "Browse Passports" : "My devices"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/devices/$id/qr",
				params: { id: device.id },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), "QR code"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => void shareLink(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "Share link"
				})]
			}),
			isAdmin && (device.internalStatus === "REFURBISHED" || device.isListedForSale) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setError("");
					setTransferOpen(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4" }), "Transfer to Buyer"]
			}),
			isTechnician && (device.internalStatus || "PENDING_INSPECTION") === "PENDING_INSPECTION" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setError("");
					setInspectOpen(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" }), "Inspect & Complete Repair"]
			}),
			isTechnician && device.internalStatus === "REFURBISHED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: device.isListedForSale ? "outline" : "default",
				onClick: () => {
					setError("");
					setListingOpen(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-4" }), device.isListedForSale ? "Edit Marketplace Listing" : "List for Sale"]
			})
		] }),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBadge, { grade: assessment.grade }),
					!isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendationBadge, { recommendation: assessment.recommendation }),
					isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: `text-xs font-semibold ${(device.payoutStatus || "PENDING_INSPECTION") === "PAID" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : (device.payoutStatus || "PENDING_INSPECTION") === "PAYMENT_INITIATED" ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400" : "border-border bg-muted text-muted-foreground"}`,
						children: device.payoutStatus === "PAID" ? `Payout: ₹${(device.payoutAmount ?? 0).toLocaleString("en-IN")} · Paid` : device.payoutStatus === "PAYMENT_INITIATED" ? `Payout: ₹${(device.payoutAmount ?? 0).toLocaleString("en-IN")} · Initiated` : "Payout: Pending Inspection"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs font-medium text-muted-foreground sm:inline",
							children: "Lifecycle status"
						}), isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerStatusBadge, { device }) : canChangeStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: device.status,
							onValueChange: updateStatus,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 w-[162px] bg-card",
								"aria-label": "Lifecycle status",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: deviceStatuses.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: status,
								children: status.replaceAll("_", " ")
							}, status)) })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: device.status })]
					})
				]
			}),
			(error || message) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: error ? "alert" : "status",
				className: `mb-5 rounded-md border px-3 py-2 text-sm ${error ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-success/40 bg-success text-success-foreground"}`,
				children: error || message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "overview",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "h-11 w-full justify-start overflow-x-auto rounded-md bg-transparent p-0 sm:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "overview",
								className: "h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
								children: "Overview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "components",
								className: "h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
								children: ["Components ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-xs text-muted-foreground",
									children: device.components.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "repairs",
								className: "h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
								children: ["Repairs ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-xs text-muted-foreground",
									children: device.repairs.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "health",
								className: "h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
								children: "Health report"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "overview",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5 xl:grid-cols-[1.35fr_0.65fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-md border border-border bg-card p-5 sm:p-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-5 flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "font-semibold",
												children: "Device specifications"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm text-muted-foreground",
												children: "Core identity and configuration"
											})] }), canEditSpecs && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setEditOpen(true),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Edit"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-x-6 gap-y-5 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
													label: "Device type",
													value: displayName(device.deviceType)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
													label: "Serial number / IMEI",
													value: device.serial,
													mono: true
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
													label: "Purchase date",
													value: formatDate(device.purchaseDate)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
													label: "Device age",
													value: `${assessment.fullYearsSincePurchase} full ${assessment.fullYearsSincePurchase === 1 ? "year" : "years"}`
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
													label: "Operating system",
													value: device.os || "Not provided"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
													label: "Processor",
													value: device.processor || "Not provided"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
													label: "Memory",
													value: device.ramGb ? `${device.ramGb} GB RAM` : "Not provided"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
													label: "Storage",
													value: device.storageGb ? `${device.storageGb} GB` : "Not provided"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-md border border-border bg-card p-5 sm:p-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-4 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "font-semibold",
												children: "Prior Ownership & Condition History"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-x-6 gap-y-4 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-medium text-muted-foreground",
													children: "Previous owners"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-sm font-medium",
													children: device.previousOwnersCount === 0 || device.previousOwnersCount === void 0 ? "0 (Original owner / First owner)" : `${device.previousOwnersCount} previous owner${device.previousOwnersCount > 1 ? "s" : ""}`
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-medium text-muted-foreground",
													children: "Known damages / defects"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 flex flex-wrap gap-1.5",
													children: device.knownDamages && device.knownDamages.length > 0 ? device.knownDamages.map((dmg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-500/20",
														children: dmg
													}, dmg)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm text-muted-foreground",
														children: "None reported upon registration"
													})
												})] }),
												device.damageNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "sm:col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-medium text-muted-foreground",
														children: "Damage details & observations"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-sm text-foreground bg-muted/30 p-2.5 rounded-md border border-border/50",
														children: device.damageNotes
													})]
												}),
												device.priorHistory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "sm:col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-medium text-muted-foreground",
														children: "Prior device / repair history"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-sm text-foreground bg-muted/30 p-2.5 rounded-md border border-border/50 whitespace-pre-line",
														children: device.priorHistory
													})]
												})
											]
										})]
									}),
									isViewer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-md border border-primary/40 bg-card p-5 sm:p-6 shadow-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-start justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold uppercase tracking-wider text-primary",
														children: "Certified Refurbished Marketplace"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
													className: "mt-1.5 text-3xl font-extrabold tabular-nums text-foreground",
													children: ["₹", (device.listingPrice ?? 0).toLocaleString("en-IN")]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "border-primary/50 bg-primary/10 text-xs font-semibold text-primary",
													children: device.listingCondition || "Verified Refurbished"
												})]
											}),
											device.listingNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 rounded-md border border-border/60 bg-muted/30 p-3.5 text-sm text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mb-1 text-[11px] font-semibold uppercase text-muted-foreground",
													children: "Buyer Summary & Notes"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "whitespace-pre-line text-sm",
													children: device.listingNotes
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-3 flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "font-semibold text-sm",
														children: "Verified Post-Repair Photos"
													})]
												}), device.listingPhotos && device.listingPhotos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
													children: device.listingPhotos.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: src,
														target: "_blank",
														rel: "noreferrer",
														className: "group overflow-hidden rounded-md border border-border bg-muted/30",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src,
															alt: `${device.name} verified listing ${index + 1}`,
															className: "aspect-video w-full object-cover transition-transform group-hover:scale-105"
														})
													}, `listing-${index}`))
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: "Certified diagnostics verified without additional images."
												})]
											})
										]
									}),
									isAdmin && (device.ownerPhotos?.length > 0 || device.listingPhotos?.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-md border border-border bg-card p-5 sm:p-6 space-y-5",
										children: [device.ownerPhotos && device.ownerPhotos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "font-semibold",
												children: "Owner Intake Photos"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
											children: device.ownerPhotos.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: src,
												target: "_blank",
												rel: "noreferrer",
												className: "group overflow-hidden rounded-md border border-border bg-muted/30",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src,
													alt: `${device.name} owner intake ${index + 1}`,
													className: "aspect-video w-full object-cover transition-transform group-hover:scale-105"
												})
											}, `owner-${index}`))
										})] }), device.listingPhotos && device.listingPhotos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "font-semibold",
												children: "Technician Listing Photos"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
											children: device.listingPhotos.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: src,
												target: "_blank",
												rel: "noreferrer",
												className: "group overflow-hidden rounded-md border border-border bg-muted/30",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src,
													alt: `${device.name} technician listing ${index + 1}`,
													className: "aspect-video w-full object-cover transition-transform group-hover:scale-105"
												})
											}, `admin-listing-${index}`))
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-md border border-border bg-card p-5 sm:p-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-4 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "font-semibold",
												children: "Passport audit trail"
											})]
										}), device.audit.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-4",
											children: device.audit.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 size-2 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-medium",
														children: entry.action
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-1 text-xs text-muted-foreground",
														children: [
															entry.actor,
															" · ",
															new Intl.DateTimeFormat("en-IN", {
																dateStyle: "medium",
																timeStyle: "short"
															}).format(new Date(entry.date))
														]
													})]
												})]
											}, entry.id))
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "No edits or transfers have been recorded yet."
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "flex items-center gap-5 rounded-md border border-border bg-card p-5 sm:p-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { assessment }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: "Current health"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 flex items-center gap-2 text-xl font-bold",
													children: [
														"Grade ",
														assessment.grade,
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBadge, { grade: assessment.grade })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-sm text-muted-foreground",
													children: assessment.recommendation === "REPAIR" ? "Repair the identified issue before resale." : assessment.recommendation === "RECYCLE" ? "Consider responsible recycling." : assessment.recommendation === "REFURBISH" ? "A refurbishment review is recommended." : "Suitable for continued use."
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-md border border-border bg-card p-5 sm:p-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPlus, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
													className: "font-semibold",
													children: "Passport details"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 grid gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
														label: "Passport ID",
														value: device.passportId,
														mono: true
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
														label: "Repair records",
														value: String(device.repairs.length)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
														label: "Owner account",
														value: ownerName
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/devices/$id/qr",
												params: { id: device.id },
												className: "mt-5 inline-flex",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "outline",
													size: "sm",
													children: ["View QR code ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 -rotate-90" })]
												})
											})
										]
									}),
									isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutStatusCard, { device })
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "components",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComponentsPanel, {
							deviceId: device.id,
							components: device.components,
							readOnly: isReadOnly,
							onError: setError,
							onMessage: setMessage
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "repairs",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepairsPanel, {
							device,
							readOnly: isReadOnly,
							onError: setError,
							onMessage: setMessage
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "health",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthReport, {
							assessment,
							isOwner
						})
					})
				]
			}),
			device && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransferModal, {
				open: transferOpen,
				onOpenChange: setTransferOpen,
				device,
				onComplete: () => setMessage("Ownership transferred to buyer. Old QR token revoked.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit specifications" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Updates are appended to the passport audit trail." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: saveSpecs,
					className: "grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-sm font-medium",
							children: ["Operating system", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editForm.os,
								onChange: (event) => setEditForm((previous) => ({
									...previous,
									os: event.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1.5 text-sm font-medium",
								children: ["RAM (GB)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "0",
									value: editForm.ramGb ?? "",
									onChange: (event) => setEditForm((previous) => ({
										...previous,
										ramGb: event.target.value ? Number(event.target.value) : null
									}))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1.5 text-sm font-medium",
								children: ["Storage (GB)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "0",
									value: editForm.storageGb ?? "",
									onChange: (event) => setEditForm((previous) => ({
										...previous,
										storageGb: event.target.value ? Number(event.target.value) : null
									}))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-sm font-medium",
							children: ["Processor", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editForm.processor,
								onChange: (event) => setEditForm((previous) => ({
									...previous,
									processor: event.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save changes"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectionModal, {
				open: inspectOpen,
				onOpenChange: setInspectOpen,
				device,
				onComplete: () => setMessage("Inspection and repair completed.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingModal, {
				open: listingOpen,
				onOpenChange: setListingOpen,
				device,
				onComplete: () => setMessage("Marketplace listing updated.")
			})
		]
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
var PAYOUT_STEPS = [
	{
		key: "PENDING_INSPECTION",
		label: "Pending Inspection"
	},
	{
		key: "PAYMENT_INITIATED",
		label: "Payment Initiated"
	},
	{
		key: "PAID",
		label: "Paid"
	}
];
function PayoutStatusCard({ device }) {
	const currentIndex = PAYOUT_STEPS.findIndex((step) => step.key === device.payoutStatus);
	const activeIndex = currentIndex === -1 ? 0 : currentIndex;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-md border border-border bg-card p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Payout status"
				})]
			}),
			device.payoutStatus !== "PENDING_INSPECTION" && device.payoutAmount !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md border border-success/40 bg-success/10 px-3.5 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-muted-foreground",
					children: "Approved payout"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-2xl font-bold tabular-nums text-foreground",
					children: ["₹", device.payoutAmount.toLocaleString("en-IN")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-3 gap-2",
				children: PAYOUT_STEPS.map((step, index) => {
					const isCompleted = index < activeIndex;
					const isActive = index === activeIndex;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col items-center text-center",
						children: [
							index < PAYOUT_STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute left-1/2 top-3.5 h-0.5 w-full ${index < activeIndex ? "bg-primary" : "bg-border"}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `relative z-10 grid size-7 place-items-center rounded-full border text-xs font-semibold transition-colors ${isCompleted ? "border-primary bg-primary text-primary-foreground" : isActive ? "border-primary bg-primary/15 text-primary ring-2 ring-primary/25" : "border-border bg-card text-muted-foreground"}`,
								children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : index + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `mt-2 text-[11px] leading-tight ${isActive ? "font-semibold text-foreground" : isCompleted ? "font-medium text-foreground" : "text-muted-foreground"}`,
								children: step.label
							})
						]
					}, step.key);
				})
			})
		]
	});
}
function Spec({ label, value, mono = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 break-words text-sm font-medium ${mono ? "font-mono" : ""}`,
			children: value
		})]
	});
}
function ComponentsPanel({ deviceId, components, readOnly, onError, onMessage }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const active = components.filter((component) => component.active);
	const inactive = components.filter((component) => !component.active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Component inventory"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [active.length, " active components · replaced items remain in the record"]
				})] }), !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, { className: "size-4" }), "Add component"]
				})]
			}),
			active.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: active.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComponentCard, { item }, item.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-dashed border-border bg-card p-6 text-sm text-muted-foreground",
				children: "No component inventory has been added."
			}),
			inactive.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-sm font-semibold text-muted-foreground",
				children: "Previous parts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: inactive.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComponentCard, {
					item,
					previous: true
				}, item.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddComponentDialog, {
				open,
				onOpenChange: setOpen,
				deviceId,
				onError,
				onMessage
			})
		]
	});
}
function ComponentCard({ item, previous = false }) {
	const conditionClass = item.condition === "GOOD" ? "text-grade-a" : item.condition === "FAIR" ? "text-grade-c" : "text-grade-d";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `rounded-md border border-border bg-card p-4 ${previous ? "opacity-70" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-primary",
						children: item.type === "BATTERY" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Battery, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate text-sm font-semibold",
							children: displayName(item.type)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: item.origin
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-xs font-semibold ${conditionClass}`,
					children: item.condition
				})]
			}),
			item.batteryHealth !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between border-t border-border pt-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Battery health"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold",
					children: [item.batteryHealth, "%"]
				})]
			}),
			item.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: item.details
			}),
			previous && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] text-muted-foreground",
				children: "Retained in passport history"
			})
		]
	});
}
function AddComponentDialog({ open, onOpenChange, deviceId, onError, onMessage }) {
	const { addComponent } = useApp();
	const api = useAppApi();
	const [type, setType] = (0, import_react.useState)("BATTERY");
	const [condition, setCondition] = (0, import_react.useState)("GOOD");
	const [origin, setOrigin] = (0, import_react.useState)("ORIGINAL");
	const [batteryHealth, setBatteryHealth] = (0, import_react.useState)("100");
	const [details, setDetails] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [prediction, setPrediction] = (0, import_react.useState)(null);
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	const [lowConfidence, setLowConfidence] = (0, import_react.useState)(false);
	const [aiDecision, setAiDecision] = (0, import_react.useState)("none");
	const [formError, setFormError] = (0, import_react.useState)("");
	async function identify() {
		if (!file) {
			setFormError("Choose a JPEG or PNG image first.");
			return;
		}
		setAiBusy(true);
		setFormError("");
		setPrediction(null);
		setAiDecision("pending");
		try {
			const result = await api.identifyComponent(file, lowConfidence);
			setPrediction(result);
		} catch (cause) {
			setFormError(cause instanceof Error ? cause.message : "Image identification failed.");
			setAiDecision("none");
		} finally {
			setAiBusy(false);
		}
	}
	function applyPrediction() {
		const predicted = prediction?.predictions[0];
		if (!predicted) return;
		if (prediction.reliable) {
			setType(predicted.type);
			setAiDecision("confirmed");
		} else setAiDecision("changed");
	}
	function save(event) {
		event.preventDefault();
		setFormError("");
		if (prediction && aiDecision === "pending") {
			setFormError("Confirm the advisory result or choose a component manually before saving.");
			return;
		}
		const batteryValue = type === "BATTERY" ? Number(batteryHealth) : null;
		if (batteryValue !== null && (!Number.isFinite(batteryValue) || batteryValue < 0 || batteryValue > 100)) {
			setFormError("Battery health must be between 0 and 100.");
			return;
		}
		try {
			addComponent(deviceId, {
				type,
				condition,
				origin,
				batteryHealth: batteryValue,
				details
			});
			onMessage(`${displayName(type)} added. Health score updated.`);
			onError("");
			onOpenChange(false);
			setPrediction(null);
			setFile(null);
			setAiDecision("none");
		} catch (cause) {
			setFormError(cause instanceof Error ? cause.message : "Could not add component.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add component" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Record the installed part and its condition." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-warning/60 bg-warning p-3 text-sm text-warning-foreground",
						children: "AI result is advisory and does not replace professional hardware inspection."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
								label: "Component",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: type,
									onValueChange: (value) => {
										setType(value);
										if (aiDecision === "pending") setAiDecision("changed");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: componentTypes.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: option,
										children: displayName(option)
									}, option)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
								label: "Condition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: condition,
									onValueChange: (value) => setCondition(value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"GOOD",
										"FAIR",
										"POOR"
									].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: option,
										children: option
									}, option)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
								label: "Origin",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: origin,
									onValueChange: (value) => setOrigin(value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ORIGINAL",
										children: "Original"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "REPLACED",
										children: "Replaced"
									})] })]
								})
							}),
							type === "BATTERY" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1.5 text-sm font-medium",
								children: ["Battery health (%)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: "0",
									max: "100",
									value: batteryHealth,
									onChange: (event) => setBatteryHealth(event.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5 text-sm font-medium",
						children: ["Details", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: details,
							onChange: (event) => setDetails(event.target.value),
							placeholder: "Capacity, replacement date, or notes",
							rows: 2
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-md border border-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-primary" }), "Advisory identification"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 grid gap-1.5 text-sm font-medium",
								children: ["Component photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "file",
									accept: "image/jpeg,image/png",
									onChange: (event) => {
										setFile(event.target.files?.[0] ?? null);
										setPrediction(null);
										setAiDecision("none");
										setFormError("");
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: lowConfidence,
									onChange: (event) => setLowConfidence(event.target.checked),
									className: "size-4 accent-primary"
								}), "Simulate unrelated / low-confidence image"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								className: "mt-3",
								onClick: () => void identify(),
								disabled: aiBusy || !file,
								children: aiBusy ? "Identifying…" : "Identify component"
							}),
							prediction && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-md bg-muted/70 p-3",
								children: [prediction.reliable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-semibold",
									children: [
										prediction.predictions[0]?.label,
										" · ",
										prediction.predictions[0]?.confidence,
										"% confidence"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Also considered: ", prediction.predictions.slice(1).map((item) => `${item.label} ${item.confidence}%`).join(" · ")]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-warning-foreground",
									children: "Component could not be identified reliably"
								}), aiDecision === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										onClick: applyPrediction,
										disabled: !prediction.reliable,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Confirm label"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => setAiDecision("changed"),
										children: "Change / select manually"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs font-medium text-primary",
									children: aiDecision === "confirmed" ? "Label confirmed; you can continue." : "Manual selection is active."
								})]
							})
						]
					}),
					formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-sm font-medium text-destructive",
						children: formError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Add component"
					})] })
				]
			})]
		})
	});
}
function RepairsPanel({ device, readOnly, onError, onMessage }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [amendTarget, setAmendTarget] = (0, import_react.useState)(null);
	const records = (0, import_react.useMemo)(() => [...device.repairs].sort((a, b) => b.date.localeCompare(a.date)), [device.repairs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Repair history"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Original entries are append-only. Additional context is added as amendments."
				})] }), !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" }), "Add repair record"]
				})]
			}),
			records.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative ml-2 space-y-0 border-l border-border pl-6",
				children: records.map((record, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `relative pb-7 ${index === records.length - 1 ? "pb-0" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute -left-[31px] top-1 grid size-4 place-items-center rounded-full border-2 border-background ${record.verified ? "bg-grade-a" : "bg-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-card p-4 sm:p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: formatDate(record.date)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 font-semibold",
									children: record.description
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [record.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), "Technician verified"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground",
										children: "Owner reported"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold",
										children: formatCurrency(record.cost)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: ["Recorded by ", record.technicianName]
							}),
							record.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm",
								children: record.notes
							}),
							record.affectedComponentIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-1.5",
								children: record.affectedComponentIds.map((componentId) => {
									const part = device.components.find((item) => item.id === componentId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-sm bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground",
										children: part ? displayName(part.type) : "Affected component"
									}, componentId);
								})
							}),
							record.amendments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 border-t border-border pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-xs font-semibold uppercase text-muted-foreground",
									children: "Amendments"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: record.amendments.map((amendment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-sm bg-muted/60 p-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm",
											children: amendment.note
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-[11px] text-muted-foreground",
											children: [
												amendment.authorName,
												" · ",
												new Intl.DateTimeFormat("en-IN", {
													dateStyle: "medium",
													timeStyle: "short"
												}).format(new Date(amendment.createdAt))
											]
										})]
									}, amendment.id))
								})]
							}),
							!readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "mt-3 h-8 px-2 text-muted-foreground",
								onClick: () => setAmendTarget(record.id),
								children: "Add amendment note"
							})
						]
					})]
				}, record.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-dashed border-border bg-card p-6 text-sm text-muted-foreground",
				children: "No repair records yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddRepairDialog, {
				open,
				onOpenChange: setOpen,
				device,
				onError,
				onMessage
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmendmentDialog, {
				open: amendTarget !== null,
				onOpenChange: (value) => {
					if (!value) setAmendTarget(null);
				},
				deviceId: device.id,
				repairId: amendTarget ?? "",
				onError,
				onMessage
			})
		]
	});
}
function AddRepairDialog({ open, onOpenChange, device, onError, onMessage }) {
	const { addRepair, currentUser } = useApp();
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [description, setDescription] = (0, import_react.useState)("");
	const [cost, setCost] = (0, import_react.useState)("0");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [affected, setAffected] = (0, import_react.useState)([]);
	const [formError, setFormError] = (0, import_react.useState)("");
	const verified = currentUser?.role === "TECHNICIAN" && currentUser.status === "ACTIVE";
	function submit(event) {
		event.preventDefault();
		setFormError("");
		const record = {
			date,
			description,
			cost: Number(cost) || 0,
			affectedComponentIds: affected,
			notes,
			verified
		};
		try {
			addRepair(device.id, record);
			onMessage("Repair record appended. Health score updated.");
			onError("");
			onOpenChange(false);
			setDescription("");
			setCost("0");
			setNotes("");
			setAffected([]);
		} catch (cause) {
			setFormError(cause instanceof Error ? cause.message : "Could not append repair record.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add repair record" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "This repair will be added to the permanent passport timeline." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-4",
				children: [
					currentUser?.role === "TECHNICIAN" && currentUser.status === "PENDING" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 rounded-md border border-warning/60 bg-warning p-3 text-sm text-warning-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your technician account is pending Admin approval. This repair record will be logged as unverified until approved." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5 text-sm font-medium",
						children: ["Repair description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: description,
							onChange: (event) => setDescription(event.target.value),
							placeholder: "e.g. Battery replaced",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-sm font-medium",
							children: ["Date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (event) => setDate(event.target.value),
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1.5 text-sm font-medium",
							children: ["Cost (INR)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "0",
								step: "1",
								value: cost,
								onChange: (event) => setCost(event.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5 text-sm font-medium",
						children: ["Affected components ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-normal text-muted-foreground",
							children: "Selected parts are replaced and retained in the history."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid max-h-36 gap-2 overflow-y-auto rounded-md border border-border p-3 sm:grid-cols-2",
						children: device.components.filter((item) => item.active).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "size-4 accent-primary",
									checked: affected.includes(item.id),
									onChange: (event) => setAffected((previous) => event.target.checked ? [...previous, item.id] : previous.filter((id) => id !== item.id))
								}),
								displayName(item.type),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: item.condition
								})
							]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5 text-sm font-medium",
						children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: notes,
							onChange: (event) => setNotes(event.target.value),
							placeholder: "Service notes"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${verified ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`,
						children: [verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" }), verified ? "This record will receive a Technician Verified badge." : "This record will be marked Owner-Reported."]
					}),
					formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "text-sm font-medium text-destructive",
						children: formError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Add repair record"
					})] })
				]
			})]
		})
	});
}
function AmendmentDialog({ open, onOpenChange, deviceId, repairId, onError, onMessage }) {
	const { amendRepair } = useApp();
	const [note, setNote] = (0, import_react.useState)("");
	function submit(event) {
		event.preventDefault();
		try {
			amendRepair(deviceId, repairId, note.trim());
			onError("");
			onMessage("Amendment added without changing the original repair record.");
			onOpenChange(false);
			setNote("");
		} catch (cause) {
			onError(cause instanceof Error ? cause.message : "Could not add amendment.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add amendment note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "The original repair details will remain unchanged." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "grid gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-1.5 text-sm font-medium",
				children: ["Additional context", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: note,
					onChange: (event) => setNote(event.target.value),
					rows: 4,
					required: true,
					placeholder: "Add a dated note to this record"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				onClick: () => onOpenChange(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Append note"
			})] })]
		})] })
	});
}
function HealthReport({ assessment, isOwner }) {
	const factors = [
		{
			label: "Device age",
			value: assessment.deductions.age,
			max: 30
		},
		{
			label: "Repair count",
			value: assessment.deductions.repairs,
			max: 20
		},
		{
			label: "Battery health",
			value: assessment.deductions.battery,
			max: 20
		},
		{
			label: "Component condition",
			value: assessment.deductions.components,
			max: 20
		},
		{
			label: "Critical replacement",
			value: assessment.deductions.critical,
			max: 10
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 xl:grid-cols-[0.8fr_1.2fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col items-center rounded-md border border-border bg-card p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { assessment }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBadge, {
						grade: assessment.grade,
						className: "mt-4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-3 text-xl font-bold",
						children: [assessment.score, " / 100"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Explainable health score"
					}),
					!isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendationBadge, { recommendation: assessment.recommendation })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-md border border-border bg-card p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Score deductions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Each factor is capped independently."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 space-y-4",
							children: factors.map((factor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1.5 flex items-center justify-between gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: factor.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums text-muted-foreground",
									children: [
										"−",
										factor.value,
										" / ",
										factor.max,
										" pts"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary transition-[width]",
									style: { width: `${Math.min(100, factor.value / factor.max * 100)}%` }
								})
							})] }, factor.label))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-md border border-border bg-card p-5 sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Top reasons"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-2",
						children: assessment.reasons.length ? assessment.reasons.map((reason, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground",
								children: index + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pt-0.5",
								children: reason
							})]
						}, reason)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted-foreground",
							children: "No score deductions were recorded."
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-start gap-2 text-xs text-muted-foreground xl:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), "This report is advisory and is not a substitute for professional hardware inspection."]
			})
		]
	});
}
function SelectField({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5 text-sm font-medium",
		children: [label, children]
	});
}
//#endregion
export { DeviceDetail as component };
