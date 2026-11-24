import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ClipboardPlus,
  Laptop,
  ScanLine,
  ShieldCheck,
  Smartphone,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  adminOnly?: boolean;
}

const navigation: NavigationItem[] = [
  { label: "My Devices", href: "/", icon: Laptop },
  { label: "Register Device", href: "/devices/new", icon: ClipboardPlus },
  { label: "Scan / Lookup", href: "/scan", icon: ScanLine },
  { label: "Admin Console", href: "/admin", icon: ShieldCheck, adminOnly: true },
  { label: "Profile", href: "/profile", icon: UserRound },
];

function isActive(path: string, href: NavigationItem["href"]) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

function NavLink({ item, mobile = false }: { item: NavigationItem; mobile?: boolean }) {
  const location = useLocation();
  const Icon = item.icon;
  const active = isActive(location.pathname, item.href);
  return (
    <Link
      to={item.href}
      className={`flex items-center gap-3 rounded-md text-sm font-medium transition-colors ${mobile ? "min-w-0 flex-col gap-1 px-2 py-1 text-[11px]" : "px-3 py-2.5"} ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
    >
      <Icon className={mobile ? "size-5" : "size-[18px]"} aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function AppShell({ title, subtitle, children, actions }: AppShellProps) {
  const { currentUser, switchRole, logout } = useApp();
  const location = useLocation();
  const isPublic = location.pathname.startsWith("/p/") || location.pathname === "/login" || location.pathname === "/signup";
  if (isPublic) return <>{children}</>;

  const visibleNavigation = navigation.filter((item) => !item.adminOnly || currentUser?.role === "ADMIN");
  const mobileNavigation = visibleNavigation.filter((item) => ["My Devices", "Scan / Lookup", "Profile", "Admin Console"].includes(item.label));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-border bg-sidebar md:flex">
        <Link to="/" className="flex h-[76px] items-center gap-3 border-b border-sidebar-border px-6">
          <span className="grid size-9 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"><Smartphone className="size-5" /></span>
          <span className="text-base font-bold tracking-normal">ReTech Passport</span>
        </Link>
        <div className="px-4 pt-7">
          <p className="px-3 pb-3 text-[11px] font-semibold uppercase text-muted-foreground">Workspace</p>
          <nav className="grid gap-1">
            {visibleNavigation.map((item) => <NavLink key={item.href} item={item} />)}
          </nav>
        </div>
        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-md bg-muted/70 p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{currentUser?.name.slice(0, 1) ?? "G"}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{currentUser?.name ?? "Guest"}</p>
              <p className="truncate text-xs text-muted-foreground">{currentUser?.role ?? "Signed out"}</p>
            </div>
            {currentUser ? <Button variant="ghost" size="icon" className="size-8" onClick={logout} aria-label="Sign out" title="Sign out"><ArrowUpRight className="size-4" /></Button> : <Link to="/login"><Button size="sm">Log in</Button></Link>}
          </div>
        </div>
      </aside>

      <div className="md:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-sm font-bold md:hidden">
              <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><Smartphone className="size-4" /></span>
              ReTech Passport
            </Link>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
              <span>Workspace</span><span className="text-border">/</span><span className="font-medium text-foreground">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">Demo role</span>
            <Select value={currentUser?.role ?? ""} onValueChange={(value) => switchRole(value as UserRole)}>
              <SelectTrigger className="h-9 w-[138px] bg-card text-xs sm:w-[158px]" aria-label="Demo role switcher"><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="OWNER">Owner · Aarav</SelectItem>
                <SelectItem value="TECHNICIAN">Technician · Pratham</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden size-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary sm:grid">{currentUser?.name.slice(0, 1) ?? "G"}</div>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-68px)] max-w-[1500px] px-4 pb-24 pt-7 sm:px-6 md:px-8 md:pb-10 md:pt-9">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold sm:text-[28px]">{title}</h1>
              {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] pt-2 md:hidden" style={{ gridTemplateColumns: `repeat(${mobileNavigation.length}, minmax(0, 1fr))` }} aria-label="Main navigation">
        {mobileNavigation.map((item) => <NavLink key={item.href} item={item} mobile />)}
      </nav>
    </div>
  );
}