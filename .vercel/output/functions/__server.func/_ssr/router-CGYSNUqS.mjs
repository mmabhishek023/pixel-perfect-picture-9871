import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as AppProvider } from "./AppContext-Cscm7p4N.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$8 } from "./devices._id-CX4qAQzl.mjs";
import { t as Route$9 } from "./devices._id_.qr-C0fhgiKH.mjs";
import { t as Route$10 } from "./p._token-CYCO0pG4.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CGYSNUqS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-B-xEkPkO.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ReTech Passport · Smart Digital Identity" },
			{
				name: "description",
				content: "Digital identity and lifecycle history for your electronic devices."
			},
			{
				name: "author",
				content: "ReTech Passport"
			},
			{
				property: "og:title",
				content: "ReTech Passport · Smart Digital Identity"
			},
			{
				property: "og:description",
				content: "Digital identity and lifecycle history for your electronic devices."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@ReTechPassport"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$6 = () => import("./routes-DBm_g847.mjs");
var Route$6 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [
		{ title: "My Devices · ReTech Passport" },
		{
			name: "description",
			content: "Review device passports, health scores, and lifecycle recommendations."
		},
		{
			property: "og:title",
			content: "My Devices · ReTech Passport"
		},
		{
			property: "og:description",
			content: "Review device passports, health scores, and lifecycle recommendations."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter$5 = () => import("./admin-O-Sf4jJn.mjs");
var Route$5 = createFileRoute("/admin")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [
		{ title: "Admin Console · ReTech Passport" },
		{
			name: "description",
			content: "Review platform activity, trade-in payouts, and technician approval requests."
		},
		{
			property: "og:title",
			content: "Admin Console · ReTech Passport"
		},
		{
			property: "og:description",
			content: "Review platform activity, trade-in payouts, and technician approval requests."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter$4 = () => import("./login-CnA2ctkK.mjs");
var Route$4 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [
		{ title: "Log in · ReTech Passport" },
		{
			name: "description",
			content: "Sign in to manage your electronic device passports."
		},
		{
			property: "og:title",
			content: "Log in · ReTech Passport"
		},
		{
			property: "og:description",
			content: "Sign in to manage your electronic device passports."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter$3 = () => import("./profile-BVvW8EQm.mjs");
var Route$3 = createFileRoute("/profile")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [
		{ title: "Profile · ReTech Passport" },
		{
			name: "description",
			content: "View your account status, role, and demo session controls."
		},
		{
			property: "og:title",
			content: "Profile · ReTech Passport"
		},
		{
			property: "og:description",
			content: "View your account status, role, and demo session controls."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter$2 = () => import("./scan-BGIPcWmr.mjs");
var Route$2 = createFileRoute("/scan")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [
		{ title: "Scan or Lookup · ReTech Passport" },
		{
			name: "description",
			content: "Scan a device passport QR code or look up a demo token."
		},
		{
			property: "og:title",
			content: "Scan or Lookup · ReTech Passport"
		},
		{
			property: "og:description",
			content: "Scan a device passport QR code or look up a demo token."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter$1 = () => import("./signup-CZNLOZYE.mjs");
var Route$1 = createFileRoute("/signup")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [
		{ title: "Create account · ReTech Passport" },
		{
			name: "description",
			content: "Create a ReTech Passport account as an owner, technician, or viewer."
		},
		{
			property: "og:title",
			content: "Create account · ReTech Passport"
		},
		{
			property: "og:description",
			content: "Create a ReTech Passport account as an owner, technician, or viewer."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var $$splitComponentImporter = () => import("./devices.new-D_K8ujTT.mjs");
var Route = createFileRoute("/devices/new")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [
		{ title: "Register Device · ReTech Passport" },
		{
			name: "description",
			content: "Create a new electronic device passport with its core specifications and condition history."
		},
		{
			property: "og:title",
			content: "Register Device · ReTech Passport"
		},
		{
			property: "og:description",
			content: "Create a new electronic device passport with its core specifications and condition history."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
var rootRouteChildren = {
	IndexRoute: Route$6.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$7
	}),
	AdminRoute: Route$5.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$7
	}),
	LoginRoute: Route$4.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$7
	}),
	ProfileRoute: Route$3.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$7
	}),
	ScanRoute: Route$2.update({
		id: "/scan",
		path: "/scan",
		getParentRoute: () => Route$7
	}),
	SignupRoute: Route$1.update({
		id: "/signup",
		path: "/signup",
		getParentRoute: () => Route$7
	}),
	DevicesIdRoute: Route$8.update({
		id: "/devices/$id",
		path: "/devices/$id",
		getParentRoute: () => Route$7
	}),
	DevicesNewRoute: Route.update({
		id: "/devices/new",
		path: "/devices/new",
		getParentRoute: () => Route$7
	}),
	PTokenRoute: Route$10.update({
		id: "/p/$token",
		path: "/p/$token",
		getParentRoute: () => Route$7
	}),
	DevicesIdQrRoute: Route$9.update({
		id: "/devices/$id_/qr",
		path: "/devices/$id/qr",
		getParentRoute: () => Route$7
	})
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
