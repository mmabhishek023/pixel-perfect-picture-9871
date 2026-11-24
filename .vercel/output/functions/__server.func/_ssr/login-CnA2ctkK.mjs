import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { a as UserRound, m as ShieldCheck, n as Wrench, q as ArrowRight, w as Laptop } from "../_libs/lucide-react.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CnA2ctkK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var demoOptions = [
	{
		role: "OWNER",
		title: "Owner",
		email: "owner@example.org",
		icon: Laptop
	},
	{
		role: "TECHNICIAN",
		title: "Technician",
		email: "tech@example.org",
		icon: Wrench
	},
	{
		role: "VIEWER",
		title: "Viewer",
		email: "viewer@example.org",
		icon: UserRound
	},
	{
		role: "ADMIN",
		title: "Admin",
		email: "admin@example.org",
		icon: ShieldCheck
	}
];
function LoginPage() {
	const navigate = useNavigate();
	const { login, demoLogin } = useApp();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function submit(event) {
		event.preventDefault();
		setError("");
		try {
			login(email, password);
			navigate({ to: "/" });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Unable to sign in.");
		}
	}
	function quickLogin(role) {
		demoLogin(role);
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 text-lg font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 place-items-center rounded-md bg-primary-foreground/15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "size-5" })
					}), "ReTech Passport"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold uppercase",
							children: "Your device, documented"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 text-5xl font-bold leading-tight",
							children: "Every device has a story worth keeping."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-md text-base leading-7 text-primary-foreground/80",
							children: "Sign in to review trusted records, service history, and next-step guidance."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-primary-foreground/70",
					children: "A clearer path from purchase to next life."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex min-h-screen items-center justify-center px-5 py-10 sm:px-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-[440px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-center gap-3 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-md bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "ReTech Passport"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-primary",
						children: "Welcome back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-3xl font-bold",
						children: "Log in to your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Use a demo login or enter a demo account email."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "mt-7 grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1.5 text-sm font-medium",
								children: ["Email address", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									autoComplete: "email",
									value: email,
									onChange: (event) => setEmail(event.target.value),
									placeholder: "you@example.org",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid gap-1.5 text-sm font-medium",
								children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									autoComplete: "current-password",
									value: password,
									onChange: (event) => setPassword(event.target.value),
									placeholder: "Enter any password for demo accounts",
									required: true
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "mt-1 w-full",
								children: ["Log in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-7 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: "DEMO ACCESS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: demoOptions.map(({ role, title, email: demoEmail, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "h-11 justify-start",
							onClick: () => {
								setEmail(demoEmail);
								quickLogin(role);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-primary" }), title]
						}, role))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-7 text-center text-sm text-muted-foreground",
						children: ["New to ReTech? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							className: "font-semibold text-primary hover:underline",
							children: "Create an account"
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
