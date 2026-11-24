import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp } from "./AppContext-Cscm7p4N.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { D as History, H as Check, J as ArrowLeft, U as Camera, p as Smartphone, s as Upload, t as X, w as Laptop } from "../_libs/lucide-react.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-CzhGf2Dq.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/devices.new-D_K8ujTT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var KNOWN_DAMAGE_OPTIONS = [
	"Screen Crack",
	"Battery Swelling/Drain",
	"Water/Liquid Damage",
	"Body Dents/Scratches",
	"Port/Charging Issue",
	"Camera/Speaker Fault"
];
var emptyInput = {
	deviceType: "LAPTOP",
	brand: "",
	model: "",
	serial: "",
	purchaseDate: "",
	os: "",
	ramGb: null,
	storageGb: null,
	processor: "",
	previousOwnersCount: 0,
	knownDamages: [],
	damageNotes: "",
	priorHistory: "",
	ownerPhotos: []
};
function RegisterDevice() {
	const navigate = useNavigate();
	const { currentUser, registerDevice } = useApp();
	const [form, setForm] = (0, import_react.useState)(emptyInput);
	const [error, setError] = (0, import_react.useState)("");
	const canRegister = currentUser?.role === "OWNER" || currentUser?.role === "TECHNICIAN" && currentUser.status === "ACTIVE";
	(0, import_react.useEffect)(() => {
		if (currentUser?.role === "VIEWER") navigate({ to: "/" });
	}, [currentUser, navigate]);
	const update = (key, value) => setForm((previous) => ({
		...previous,
		[key]: value
	}));
	const toggleDamage = (damage) => {
		const current = form.knownDamages ?? [];
		const updated = current.includes(damage) ? current.filter((d) => d !== damage) : [...current, damage];
		update("knownDamages", updated);
	};
	function handlePhotoUpload(event) {
		const files = Array.from(event.target.files ?? []);
		if (!files.length) return;
		files.forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === "string") setForm((previous) => ({
					...previous,
					ownerPhotos: [...previous.ownerPhotos ?? [], reader.result]
				}));
			};
			reader.readAsDataURL(file);
		});
		event.target.value = "";
	}
	function removePhoto(index) {
		setForm((previous) => ({
			...previous,
			ownerPhotos: (previous.ownerPhotos ?? []).filter((_, i) => i !== index)
		}));
	}
	function submit(event) {
		event.preventDefault();
		setError("");
		try {
			const device = registerDevice(form);
			navigate({
				to: "/devices/$id",
				params: { id: device.id }
			});
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Unable to register device.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Register device",
		subtitle: "Start a durable record for a phone or computer.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " My devices"]
			})
		}),
		children: !canRegister ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-xl rounded-md border border-warning/50 bg-warning p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold text-warning-foreground",
					children: "Registration unavailable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-warning-foreground",
					children: "Device registration is available to owners and Admin-approved technicians."
				}),
				currentUser?.status === "PENDING" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-medium text-warning-foreground",
					children: "Your technician account is awaiting approval."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "max-w-4xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					role: "group",
					"aria-label": "Device type",
					children: ["LAPTOP", "SMARTPHONE"].map((type) => {
						const Icon = type === "LAPTOP" ? Laptop : Smartphone;
						const selected = form.deviceType === type;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: selected ? "default" : "outline",
							className: "h-11 min-w-40 justify-start",
							onClick: () => update("deviceType", type),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), type === "LAPTOP" ? "Laptop" : "Smartphone"]
						}, type);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-md border border-border bg-card p-5 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Device identity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "The passport ID and private QR token are created when you save."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Brand",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.brand,
										onChange: (event) => update("brand", event.target.value),
										placeholder: "e.g. ExampleBrand",
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Model",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.model,
										onChange: (event) => update("model", event.target.value),
										placeholder: "e.g. ExampleBook 14",
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Serial number / IMEI",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.serial,
										onChange: (event) => update("serial", event.target.value),
										placeholder: "Unique device identifier",
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Purchase date",
									required: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: form.purchaseDate,
										onChange: (event) => update("purchaseDate", event.target.value),
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Operating system",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.os,
										onChange: (event) => update("os", event.target.value),
										placeholder: "e.g. Windows 11"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Processor",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.processor,
										onChange: (event) => update("processor", event.target.value),
										placeholder: "e.g. Intel Core i5"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "RAM (GB)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "0",
										value: form.ramGb ?? "",
										onChange: (event) => update("ramGb", event.target.value ? Number(event.target.value) : null),
										placeholder: "8"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Storage (GB)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "0",
										value: form.storageGb ?? "",
										onChange: (event) => update("storageGb", event.target.value ? Number(event.target.value) : null),
										placeholder: "512"
									})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-md border border-border bg-card p-5 sm:p-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Prior History & Condition"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm text-muted-foreground",
							children: "Log known past ownership, existing defects, or prior repairs before issuing this passport."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Number of previous owners",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: "0",
										value: form.previousOwnersCount ?? 0,
										onChange: (event) => update("previousOwnersCount", Math.max(0, parseInt(event.target.value) || 0)),
										placeholder: "0 (first owner)"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Enter 0 if registering as the first / original owner."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Existing / known damages"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mb-3",
									children: "Select any visible physical or functional damages present on the device."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
									children: KNOWN_DAMAGE_OPTIONS.map((damage) => {
										const checked = (form.knownDamages ?? []).includes(damage);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: `flex items-center gap-3 rounded-md border p-3 cursor-pointer text-sm font-medium transition-colors ${checked ? "border-primary/50 bg-primary/5 text-foreground" : "border-border bg-card hover:bg-muted/50 text-muted-foreground"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked,
												onCheckedChange: () => toggleDamage(damage)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: damage })]
										}, damage);
									})
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Additional damage notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.damageNotes ?? "",
									onChange: (event) => update("damageNotes", event.target.value),
									placeholder: "e.g. Dent on top-right chassis corner; small hairline scratch on display"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Prior device & repair history",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: form.priorHistory ?? "",
									onChange: (event) => update("priorHistory", event.target.value),
									placeholder: "e.g. Motherboard serviced in 2023; refurbished battery installed by previous owner; water damage repaired in 2024",
									rows: 3
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-md border border-border bg-card p-5 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-base font-semibold",
							children: ["Device photos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-normal text-muted-foreground",
								children: "(optional)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Upload existing photos or take a photo of the device for the intake record."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							capture: "environment",
							multiple: true,
							id: "owner-photo-upload",
							className: "hidden",
							onChange: handlePhotoUpload
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "owner-photo-upload",
								className: "cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), " Upload from files"] })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "owner-photo-upload",
								className: "cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), " Take photo"] })
								})
							})]
						}),
						form.ownerPhotos && form.ownerPhotos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4",
							children: form.ownerPhotos.map((url, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-square overflow-hidden rounded-md border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: url,
									alt: `Device photo ${index + 1}`,
									className: "h-full w-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removePhoto(index),
									"aria-label": `Remove device photo ${index + 1}`,
									className: "absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-destructive hover:text-destructive-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
								})]
							}, index))
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-end gap-2 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							children: "Cancel"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Create passport"
					})]
				})
			]
		})
	});
}
function Field({ label, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5 text-sm font-medium",
		children: [
			label,
			required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: " required"
			}),
			children
		]
	});
}
//#endregion
export { RegisterDevice as component };
