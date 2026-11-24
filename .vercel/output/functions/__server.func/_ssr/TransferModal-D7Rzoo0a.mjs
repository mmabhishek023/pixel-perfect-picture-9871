import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { H as Check, c as TriangleAlert, o as UserCheck } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BBUarmca.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TransferModal-D7Rzoo0a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TransferModal({ open, onOpenChange, device, onComplete }) {
	const { transferDevice, state } = useApp();
	const [recipientEmail, setRecipientEmail] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const activeUsers = (state.users ?? []).filter((u) => u.status === "ACTIVE");
	function handleSubmit(e) {
		e.preventDefault();
		setError("");
		const email = recipientEmail.trim();
		if (!email) {
			setError("Please enter the buyer's registered email address.");
			return;
		}
		try {
			setIsSubmitting(true);
			transferDevice(device.id, email);
			setIsSubmitting(false);
			onOpenChange(false);
			onComplete?.();
		} catch (cause) {
			setIsSubmitting(false);
			setError(cause instanceof Error ? cause.message : "Failed to transfer device ownership.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-5 text-primary" }), "Transfer Device to Buyer"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Assign this refurbished device to a buyer. This unlists the device from the public store and immediately revokes its old QR token." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-2 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-border bg-muted/40 p-3 text-xs space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Device:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: device.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Passport ID:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground",
									children: device.passportId
								})]
							}),
							device.listingPrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Selling Price:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground",
									children: ["₹", device.listingPrice.toLocaleString("en-IN")]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "buyer-email",
							className: "block text-xs font-semibold text-foreground",
							children: "Buyer's Registered Email *"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "buyer-email",
							type: "email",
							value: recipientEmail,
							onChange: (e) => setRecipientEmail(e.target.value),
							placeholder: "e.g. buyer@example.org",
							className: "mt-1.5",
							list: "active-users-list",
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "active-users-list",
							children: activeUsers.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: u.email,
								children: [
									u.name,
									" (",
									u.role,
									")"
								]
							}, u.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: "Select or type the registered buyer account email."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2.5 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Cryptographic QR Token Revocation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] opacity-90",
								children: "The existing QR token and public link will be revoked instantly. A new cryptographic token will be minted for the buyer, and the device will be unlisted from the marketplace."
							})]
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 sm:gap-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							disabled: isSubmitting,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: isSubmitting,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Confirm Transfer to Buyer"]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { TransferModal as t };
