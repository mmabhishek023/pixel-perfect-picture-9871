import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp, r as calculateAssessment } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { L as CircleAlert, p as Smartphone, q as ArrowRight, w as Laptop } from "../_libs/lucide-react.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as GradeBadge, r as RecommendationBadge } from "./passport-ui-Cy6-Lt0L.mjs";
import { t as Route } from "./p._token-CYCO0pG4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._token-DbuRIc3x.js
var import_jsx_runtime = require_jsx_runtime();
function PublicPassport() {
	const { token } = Route.useParams();
	const { getPublicPassport } = useApp();
	const device = getPublicPassport(token);
	if (!device) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-background px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "w-full max-w-md rounded-md border border-border bg-card p-7 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-xl font-bold",
					children: "Invalid or Revoked QR Token"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "This public link is no longer active or could not be found."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "mt-5 inline-flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: ["Log in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })] })
				})
			]
		})
	});
	const assessment = calculateAssessment(device);
	const Icon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background px-4 py-8 sm:px-8 sm:py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 place-items-center rounded-md bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold",
						children: "RETECH PASSPORT"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-9 rounded-md border border-border bg-card p-5 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase text-primary",
							children: "Limited public view"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-2xl font-bold sm:text-3xl",
							children: device.model
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Device identity and lifecycle summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-7 grid gap-5 border-y border-border py-5 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Device type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm font-semibold",
								children: device.deviceType
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Passport ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-mono text-sm font-semibold",
								children: device.passportId
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBadge, { grade: assessment.grade }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendationBadge, { recommendation: assessment.recommendation })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-md border border-info/40 bg-info p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-info-foreground",
								children: "Limited Public View"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-info-foreground",
								children: "Personal owner information, component inventory, and repair history are hidden until login."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "mt-6 inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: ["Log in to view full passport ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })] })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-center text-xs text-muted-foreground",
					children: "This lifecycle recommendation is advisory."
				})
			]
		})
	});
}
//#endregion
export { PublicPassport as component };
