import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ClipboardPlus,
  Laptop,
  Menu,
  ScanLine,
  ShieldCheck,
  Smartphone,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useApp } from "@/context/AppContext";
import type { UserRole } from "@/types/passport";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

interface NavigationItem {
  label: string;
  href: "/" | "/devices/new" | "/scan" | "/profile" | "/admin";
  icon: LucideIcon;
}

function getNavigationForRole(role?: UserRole): NavigationItem[] {
  switch (role) {
    case "TECHNICIAN":
      return [
        { label: "Repair Queue", href: "/", icon: Wrench },
        { label: "Scan / Lookup", href: "/scan", icon: ScanLine },
        { label: "Profile", href: "/profile", icon: UserRound },
      ];
    case "VIEWER":
      return [
        { label: "Browse Passports", href: "/", icon: Laptop },
        { label: "Scan / Lookup", href: "/scan", icon: ScanLine },
        { label: "Profile", href: "/profile", icon: UserRound },
      ];
    case "ADMIN":
      return [
        { label: "Admin Console", href: "/admin", icon: ShieldCheck },
        { label: "All Passports", href: "/", icon: Laptop },
        { label: "Scan / Lookup", href: "/scan", icon: ScanLine },
        { label: "Profile", href: "/profile", icon: UserRound },
      ];
    case "OWNER":
    default:
      return [
        { label: "My Devices", href: "/", icon: Laptop },
        { label: "Register Device", href: "/devices/new", icon: ClipboardPlus },
        { label: "Scan / Lookup", href: "/scan", icon: ScanLine },
        { label: "Profile", href: "/profile", icon: UserRound },
      ];
  }
}

function isActive(path: string, href: NavigationItem["href"]) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

function NavLink({
  item,
  mobile = false,
  onClick,
}: {
  item: NavigationItem;
  mobile?: boolean;
  onClick?: () => void;
}) {
  const location = useLocation();
  const Icon = item.icon;
  const active = isActive(location.pathname, item.href);
  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-md text-sm font-medium transition-colors ${
        mobile ? "min-w-0 flex-col gap-1 px-2 py-1 text-[11px]" : "px-3 py-2.5"
      } ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className={mobile ? "size-5" : "size-[18px]"} aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function AppShell({ title, subtitle, children, actions }: AppShellProps) {
  const { currentUser, switchRole, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isPublic =
    location.pathname.startsWith("/p/") ||
    location.pathname === "/login" ||
    location.pathname === "/signup";
  if (isPublic) return <>{children}</>;

  const visibleNavigation = getNavigationForRole(currentUser?.role);
  const mobileNavigation = visibleNavigation;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-border bg-sidebar md:flex">
        <Link to="/" className="flex h-[76px] items-center gap-3 border-b border-sidebar-border px-6">
          <span className="grid size-9 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Smartphone className="size-5" />
          </span>
          <span className="text-base font-bold tracking-normal">ReTech Passport</span>
        </Link>
        <div className="px-4 pt-7">
          <p className="px-3 pb-3 text-[11px] font-semibold uppercase text-muted-foreground">Workspace</p>
          <nav className="grid gap-1">
            {visibleNavigation.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-md bg-muted/70 p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {currentUser?.name.slice(0, 1) ?? "G"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{currentUser?.name ?? "Guest"}</p>
              <p className="truncate text-xs text-muted-foreground">{currentUser?.role ?? "Signed out"}</p>
            </div>
            {currentUser ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
              >
                <ArrowUpRight className="size-4" />
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm">Log in</Button>
              </Link>
            )}
          </div>
        </div>
      </aside>

      <div className="md:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-14 sm:h-[68px] items-center justify-between border-b border-border bg-background/95 px-3 sm:px-6 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-sidebar text-sidebar-foreground">
                <SheetHeader className="border-b border-sidebar-border px-5 py-4 text-left">
                  <SheetTitle className="flex items-center gap-2.5 text-base font-bold">
                    <span className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                      <Smartphone className="size-4" />
                    </span>
                    ReTech Passport
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-4 py-5">
                  <p className="px-3 pb-2 text-[11px] font-semibold uppercase text-muted-foreground">Workspace</p>
                  <nav className="grid gap-1">
                    {visibleNavigation.map((item) => (
                      <NavLink key={item.href} item={item} onClick={() => setDrawerOpen(false)} />
                    ))}
                  </nav>
                </div>
                <div className="border-t border-sidebar-border p-4">
                  <div className="flex items-center gap-3 rounded-md bg-muted/70 p-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {currentUser?.name.slice(0, 1) ?? "G"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{currentUser?.name ?? "Guest"}</p>
                      <p className="truncate text-xs text-muted-foreground">{currentUser?.role ?? "Signed out"}</p>
                    </div>
                    {currentUser ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={logout}
                        aria-label="Sign out"
                        title="Sign out"
                      >
                        <ArrowUpRight className="size-4" />
                      </Button>
                    ) : (
                      <Link to="/login" onClick={() => setDrawerOpen(false)}>
                        <Button size="sm">Log in</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2 text-sm font-bold truncate">
              <span className="grid size-7 sm:size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground md:hidden">
                <Smartphone className="size-4" />
              </span>
              <span className="truncate md:hidden font-bold">ReTech</span>
            </Link>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
              <span>Workspace</span>
              <span className="text-border">/</span>
              <span className="font-medium text-foreground">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">Demo role</span>
            <Select
              value={currentUser?.role ?? "OWNER"}
              onValueChange={(value) => {
                const newRole = value as UserRole;
                switchRole(newRole);
                if (newRole === "ADMIN") {
                  void navigate({ to: "/admin" });
                } else {
                  void navigate({ to: "/" });
                }
              }}
            >
              <SelectTrigger
                className="h-8 sm:h-9 w-[128px] max-w-[150px] truncate bg-card text-xs sm:w-[158px]"
                aria-label="Demo role switcher"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OWNER">Owner · Aarav</SelectItem>
                <SelectItem value="TECHNICIAN">Technician · Pratham</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden size-8 sm:size-9 place-items-center rounded-full bg-primary/10 text-xs sm:text-sm font-bold text-primary sm:grid">
              {currentUser?.name.slice(0, 1) ?? "G"}
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-68px)] max-w-[1500px] px-3.5 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 pb-20 md:pb-10">
          <div className="mb-5 sm:mb-7 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold sm:text-2xl md:text-[28px] tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 md:hidden"
        style={{ gridTemplateColumns: `repeat(${mobileNavigation.length}, minmax(0, 1fr))` }}
        aria-label="Main navigation"
      >
        {mobileNavigation.map((item) => (
          <NavLink key={item.href} item={item} mobile />
        ))}
      </nav>
    </div>
  );
}