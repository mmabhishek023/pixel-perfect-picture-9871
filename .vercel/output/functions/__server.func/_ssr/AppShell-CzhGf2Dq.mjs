import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useApp } from "./AppContext-Cscm7p4N.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { K as ArrowUpRight, P as ClipboardPlus, _ as ScanLine, a as UserRound, m as ShieldCheck, n as Wrench, p as Smartphone, w as Laptop } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { b as Link, p as useLocation, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-CzhGf2Dq.js
var import_jsx_runtime = require_jsx_runtime();
function getNavigationForRole(role) {
	switch (role) {
		case "TECHNICIAN": return [
			{
				label: "Repair Queue",
				href: "/",
				icon: Wrench
			},
			{
				label: "Scan / Lookup",
				href: "/scan",
				icon: ScanLine
			},
			{
				label: "Profile",
				href: "/profile",
				icon: UserRound
			}
		];
		case "VIEWER": return [
			{
				label: "Browse Passports",
				href: "/",
				icon: Laptop
			},
			{
				label: "Scan / Lookup",
				href: "/scan",
				icon: ScanLine
			},
			{
				label: "Profile",
				href: "/profile",
				icon: UserRound
			}
		];
		case "ADMIN": return [
			{
				label: "Admin Console",
				href: "/admin",
				icon: ShieldCheck
			},
			{
				label: "All Passports",
				href: "/",
				icon: Laptop
			},
			{
				label: "Scan / Lookup",
				href: "/scan",
				icon: ScanLine
			},
			{
				label: "Profile",
				href: "/profile",
				icon: UserRound
			}
		];
		default: return [
			{
				label: "My Devices",
				href: "/",
				icon: Laptop
			},
			{
				label: "Register Device",
				href: "/devices/new",
				icon: ClipboardPlus
			},
			{
				label: "Scan / Lookup",
				href: "/scan",
				icon: ScanLine
			},
			{
				label: "Profile",
				href: "/profile",
				icon: UserRound
			}
		];
	}
}
function isActive(path, href) {
	if (href === "/") return path === "/";
	return path === href || path.startsWith(`${href}/`);
}
function NavLink({ item, mobile = false }) {
	const location = useLocation();
	const Icon = item.icon;
	const active = isActive(location.pathname, item.href);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.href,
		className: `flex items-center gap-3 rounded-md text-sm font-medium transition-colors ${mobile ? "min-w-0 flex-col gap-1 px-2 py-1 text-[11px]" : "px-3 py-2.5"} ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: mobile ? "size-5" : "size-[18px]",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: item.label
		})]
	});
}
function AppShell({ title, subtitle, children, actions }) {
	const { currentUser, switchRole, logout } = useApp();
	const location = useLocation();
	const navigate = useNavigate();
	if (location.pathname.startsWith("/p/") || location.pathname === "/login" || location.pathname === "/signup") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	const visibleNavigation = getNavigationForRole(currentUser?.role);
	const mobileNavigation = visibleNavigation;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-border bg-sidebar md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex h-[76px] items-center gap-3 border-b border-sidebar-border px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-bold tracking-normal",
							children: "ReTech Passport"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 pt-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 pb-3 text-[11px] font-semibold uppercase text-muted-foreground",
							children: "Workspace"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "grid gap-1",
							children: visibleNavigation.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, { item }, item.href))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto border-t border-sidebar-border p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-md bg-muted/70 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary",
									children: currentUser?.name.slice(0, 1) ?? "G"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: currentUser?.name ?? "Guest"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: currentUser?.role ?? "Signed out"
									})]
								}),
								currentUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-8",
									onClick: logout,
									"aria-label": "Sign out",
									title: "Sign out",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										children: "Log in"
									})
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-[252px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2 text-sm font-bold md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 place-items-center rounded-md bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-4" })
							}), "ReTech Passport"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-2 text-sm text-muted-foreground md:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Workspace" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-border",
									children: "/"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: title
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 sm:gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-xs font-medium text-muted-foreground sm:inline",
								children: "Demo role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: currentUser?.role ?? "OWNER",
								onValueChange: (value) => {
									const newRole = value;
									switchRole(newRole);
									if (newRole === "ADMIN") navigate({ to: "/admin" });
									else navigate({ to: "/" });
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-[138px] bg-card text-xs sm:w-[158px]",
									"aria-label": "Demo role switcher",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select role" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "OWNER",
										children: "Owner · Aarav"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "TECHNICIAN",
										children: "Technician · Pratham"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "VIEWER",
										children: "Viewer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ADMIN",
										children: "Admin"
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden size-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary sm:grid",
								children: currentUser?.name.slice(0, 1) ?? "G"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "mx-auto min-h-[calc(100vh-68px)] max-w-[1500px] px-4 pb-24 pt-7 sm:px-6 md:px-8 md:pb-10 md:pt-9",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-7 flex flex-wrap items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl font-bold sm:text-[28px]",
								children: title
							}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: subtitle
							})]
						}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex shrink-0 flex-wrap items-center gap-2",
							children: actions
						})]
					}), children]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 grid border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] pt-2 md:hidden",
				style: { gridTemplateColumns: `repeat(${mobileNavigation.length}, minmax(0, 1fr))` },
				"aria-label": "Main navigation",
				children: mobileNavigation.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
					item,
					mobile: true
				}, item.href))
			})
		]
	});
}
//#endregion
export { AppShell as t };
