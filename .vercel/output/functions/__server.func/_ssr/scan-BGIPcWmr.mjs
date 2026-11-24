import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { U as Camera, W as CameraOff, _ as ScanLine, k as Flashlight, p as Smartphone, w as Laptop } from "../_libs/lucide-react.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-CzhGf2Dq.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-BGIPcWmr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScanPage() {
	const navigate = useNavigate();
	const { devices, currentUser, getPublicPassport } = useApp();
	const [token, setToken] = (0, import_react.useState)("");
	const [cameraActive, setCameraActive] = (0, import_react.useState)(false);
	const [facingMode, setFacingMode] = (0, import_react.useState)("environment");
	const [torchOn, setTorchOn] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [cameraError, setCameraError] = (0, import_react.useState)("");
	const scannerRef = (0, import_react.useRef)(null);
	function resolve(rawValue) {
		const raw = rawValue.trim();
		let resolvedToken = raw;
		try {
			resolvedToken = new URL(raw).pathname.split("/").filter(Boolean).at(-1) ?? raw;
		} catch {}
		const device = getPublicPassport(resolvedToken);
		setError("");
		if (!device) {
			navigate({
				to: "/p/$token",
				params: { token: "invalid-or-revoked" }
			});
			return;
		}
		if (currentUser?.role === "OWNER" || currentUser?.role === "TECHNICIAN" || currentUser?.role === "ADMIN") navigate({
			to: "/devices/$id",
			params: { id: device.id }
		});
		else navigate({
			to: "/p/$token",
			params: { token: resolvedToken }
		});
	}
	(0, import_react.useEffect)(() => {
		if (!cameraActive) return;
		let alive = true;
		const startScanner = async () => {
			try {
				const { Html5Qrcode } = await import("../_libs/html5-qrcode.mjs").then((n) => n.t);
				if (!alive) return;
				const scanner = new Html5Qrcode("retech-qr-reader");
				scannerRef.current = scanner;
				await scanner.start({ facingMode }, {
					fps: 10,
					qrbox: {
						width: 220,
						height: 220
					}
				}, (decoded) => {
					if (alive) {
						setCameraActive(false);
						resolve(decoded);
					}
				}, () => void 0);
			} catch {
				if (alive) {
					setCameraError("Camera access is unavailable. Use a demo scan or enter a token below.");
					setCameraActive(false);
				}
			}
		};
		startScanner();
		return () => {
			alive = false;
			const scanner = scannerRef.current;
			scannerRef.current = null;
			if (scanner) scanner.stop().then(() => scanner.clear()).catch(() => void 0);
		};
	}, [cameraActive, facingMode]);
	async function toggleTorch() {
		const scanner = scannerRef.current;
		if (!scanner) return;
		const next = !torchOn;
		try {
			const constraints = { advanced: [{ torch: next }] };
			await scanner.applyVideoConstraints(constraints);
			setTorchOn(next);
		} catch {
			setCameraError("Torch control is not supported by this camera.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Scan / Lookup",
		subtitle: "Open a passport from its QR label or a demo token.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[1.1fr_0.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-md border border-border bg-card p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "QR scanner"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Use your device camera to scan a passport label."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-md bg-secondary text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid min-h-[280px] place-items-center overflow-hidden rounded-md bg-foreground text-background",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								id: "retech-qr-reader",
								className: "absolute inset-0 w-full [&_video]:h-full [&_video]:object-cover [&_img]:hidden"
							}),
							!cameraActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 flex flex-col items-center px-6 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-14 place-items-center rounded-full bg-background/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-7" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 font-semibold",
										children: "Camera scan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 max-w-xs text-sm text-background/70",
										children: "Allow camera access to scan a device QR label."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute left-1/2 top-1/2 z-20 size-48 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-background/80" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => {
									setCameraError("");
									setCameraActive((active) => !active);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), cameraActive ? "Stop camera" : "Start camera"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setFacingMode((mode) => mode === "environment" ? "user" : "environment"),
								disabled: !cameraActive,
								children: "Switch camera"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => void toggleTorch(),
								disabled: !cameraActive,
								"aria-label": torchOn ? "Turn torch off" : "Turn torch on",
								title: torchOn ? "Turn torch off" : "Turn torch on",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flashlight, { className: "size-4" })
							})
						]
					}),
					cameraError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "mt-3 text-sm text-muted-foreground",
						children: cameraError
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-md border border-border bg-card p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Manual token lookup"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Enter the opaque token from a device QR label."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 flex gap-2",
							onSubmit: (event) => {
								event.preventDefault();
								if (!token.trim()) {
									setError("Enter a token to continue.");
									return;
								}
								resolve(token);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: token,
								onChange: (event) => setToken(event.target.value),
								placeholder: "Passport token",
								"aria-label": "Passport token"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Look up"
							})]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "mt-2 text-sm text-destructive",
							children: error
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-md border border-border bg-card p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								children: "Simulate QR scan"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Open a seeded device passport instantly."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-2 sm:grid-cols-2",
							children: [devices.map((device) => {
								const Icon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "h-auto justify-start py-3 text-left",
									onClick: () => resolve(device.qrToken),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 truncate",
										children: device.name
									})]
								}, device.id);
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "justify-start text-destructive",
								onClick: () => resolve("revoked-demo-token"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "size-4" }), "Invalid / revoked token"]
							})]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { ScanPage as component };
