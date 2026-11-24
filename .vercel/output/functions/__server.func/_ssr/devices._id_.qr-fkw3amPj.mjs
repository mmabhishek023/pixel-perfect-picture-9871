import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { J as ArrowLeft, N as Copy, b as Printer, j as Download, p as Smartphone } from "../_libs/lucide-react.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-CzhGf2Dq.mjs";
import { t as Route } from "./devices._id_.qr-C0fhgiKH.mjs";
import { t as QRCodeCanvas } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/devices._id_.qr-fkw3amPj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QrPage() {
	const { id } = Route.useParams();
	const { getDevice } = useApp();
	const device = getDevice(id);
	const [url, setUrl] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (device) setUrl(`${window.location.origin}/p/${device.qrToken}`);
	}, [device]);
	async function copyLink() {
		try {
			await navigator.clipboard.writeText(url);
			setMessage("Public link copied.");
		} catch {
			setMessage("Copy is unavailable in this browser.");
		}
	}
	function download() {
		const canvas = document.querySelector("#passport-qr canvas");
		if (!canvas) {
			setMessage("QR image is not ready yet.");
			return;
		}
		const link = document.createElement("a");
		link.download = `${device?.passportId ?? "retech-passport"}-qr.png`;
		link.href = canvas.toDataURL("image/png");
		link.click();
	}
	if (!device) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "QR label unavailable",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "This device passport could not be found."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "QR label",
		subtitle: "A scannable link to this device's limited public passport.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/devices/$id",
			params: { id: device.id },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to passport"]
			})
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid max-w-4xl gap-6 lg:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid place-items-center rounded-md border border-border bg-card p-7 sm:p-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 place-items-center rounded-md bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-4" })
							}), "RETECH PASSPORT"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							id: "passport-qr",
							className: "mt-6 rounded-md border border-border bg-card p-3",
							children: url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeCanvas, {
								value: url,
								size: 240,
								level: "M",
								includeMargin: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 font-mono text-sm font-semibold",
							children: device.passportId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: device.model
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col justify-center rounded-md border border-border bg-card p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Passport label"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 break-all rounded-sm bg-muted px-3 py-2 font-mono text-xs text-muted-foreground",
						children: url || "Preparing public link…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-2 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: download,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download PNG"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => void copyLink(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy public link"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "sm:col-span-2",
								onClick: () => window.print(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Print sticker label"]
							})
						]
					}),
					message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "mt-4 text-sm text-primary",
						children: message
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "print-sticker",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold",
					children: "RETECH PASSPORT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "my-4 inline-block self-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeCanvas, {
						value: url || "https://retech.invalid",
						size: 180,
						level: "M",
						includeMargin: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-sm font-semibold",
					children: device.passportId
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm",
					children: device.model
				})
			]
		})]
	});
}
//#endregion
export { QrPage as component };
