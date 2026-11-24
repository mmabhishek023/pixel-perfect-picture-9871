import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { C as LogOut, N as Copy, a as UserRound, m as ShieldCheck, q as ArrowRight, v as RotateCcw } from "../_libs/lucide-react.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./AppShell-CzhGf2Dq.mjs";
import { c as formatDate } from "./passport-ui-Cy6-Lt0L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BVvW8EQm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { currentUser, state, logout, resetDemo } = useApp();
	const [message, setMessage] = (0, import_react.useState)("");
	const user = currentUser;
	const ownedCount = state.devices.filter((device) => device.ownerId === user?.id).length;
	async function copyEmail() {
		if (!user) return;
		try {
			await navigator.clipboard.writeText(user.email);
			setMessage("Email copied.");
		} catch {
			setMessage("Copy is unavailable in this browser.");
		}
	}
	function reset() {
		if (!window.confirm("Reset all demo users, device changes, and repair history to the original sample data?")) return;
		resetDemo();
		setMessage("Demo data has been reset.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Profile",
		subtitle: "Your account and demo workspace preferences.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid max-w-4xl gap-6 lg:grid-cols-[1.25fr_0.75fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-md border border-border bg-card p-5 sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4 border-b border-border pb-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary",
								children: user?.name.slice(0, 1) ?? "G"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "truncate text-lg font-semibold",
									children: user?.name ?? "Guest"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 truncate text-sm text-muted-foreground",
									children: user?.email ?? "No account signed in"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => void copyEmail(),
								"aria-label": "Copy email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid gap-5 pt-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileValue, {
								label: "Account role",
								value: user?.role ?? "GUEST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileValue, {
								label: "Account status",
								value: user?.status ?? "SIGNED OUT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileValue, {
								label: "Device passports",
								value: String(ownedCount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileValue, {
								label: "Workspace",
								value: "Local demo"
							})
						]
					}),
					user?.role === "TECHNICIAN" && user.status === "PENDING" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex gap-3 rounded-md border border-warning/50 bg-warning p-4 text-sm text-warning-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your technician account is awaiting Admin approval. Verified repair badges will be available after approval." })]
					}),
					message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: "mt-5 text-sm font-medium text-primary",
						children: message
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-9 place-items-center rounded-md bg-secondary text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-semibold",
								children: "Account access"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Switch between demo roles from the top bar or sign in with another account."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										children: ["Switch account ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: logout,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign out"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-9 place-items-center rounded-md bg-muted text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-semibold",
								children: "Reset demo data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Restore the original accounts, device records, and repair history."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "mt-4",
								onClick: reset,
								children: "Reset demo data"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "px-1 text-xs text-muted-foreground",
						children: ["Last viewed ", formatDate((/* @__PURE__ */ new Date()).toISOString())]
					})
				]
			})]
		})
	});
}
function ProfileValue({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs font-medium text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1.5 text-sm font-semibold",
		children: value
	})] });
}
//#endregion
export { ProfilePage as component };
