import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Copy, LogOut, RotateCcw, ShieldCheck, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/components/passport-ui";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [
    { title: "Profile · ReTech Passport" },
    { name: "description", content: "View your account status, role, and demo session controls." },
    { property: "og:title", content: "Profile · ReTech Passport" },
    { property: "og:description", content: "View your account status, role, and demo session controls." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function ProfilePage() {
  const { currentUser, state, logout, resetDemo } = useApp();
  const [message, setMessage] = useState("");
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

  return (
    <AppShell title="Profile" subtitle="Your account and demo workspace preferences.">
      <div className="grid max-w-4xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-md border border-border bg-card p-5 sm:p-7">
          <div className="flex items-start gap-4 border-b border-border pb-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary">{user?.name.slice(0, 1) ?? "G"}</span>
            <div className="min-w-0 flex-1"><h2 className="truncate text-lg font-semibold">{user?.name ?? "Guest"}</h2><p className="mt-1 truncate text-sm text-muted-foreground">{user?.email ?? "No account signed in"}</p></div>
            <Button variant="ghost" size="icon" onClick={() => void copyEmail()} aria-label="Copy email"><Copy className="size-4" /></Button>
          </div>
          <dl className="grid gap-5 pt-5 sm:grid-cols-2">
            <ProfileValue label="Account role" value={user?.role ?? "GUEST"} />
            <ProfileValue label="Account status" value={user?.status ?? "SIGNED OUT"} />
            <ProfileValue label="Device passports" value={String(ownedCount)} />
            <ProfileValue label="Workspace" value="Local demo" />
          </dl>
          {user?.role === "TECHNICIAN" && user.status === "PENDING" && <div className="mt-6 flex gap-3 rounded-md border border-warning/50 bg-warning p-4 text-sm text-warning-foreground"><ShieldCheck className="size-5 shrink-0" /><p>Your technician account is awaiting Admin approval. Verified repair badges will be available after approval.</p></div>}
          {message && <p role="status" className="mt-5 text-sm font-medium text-primary">{message}</p>}
        </section>

        <section className="space-y-4">
          <div className="rounded-md border border-border bg-card p-5">
            <span className="grid size-9 place-items-center rounded-md bg-secondary text-primary"><UserRound className="size-4" /></span>
            <h2 className="mt-4 font-semibold">Account access</h2>
            <p className="mt-1 text-sm text-muted-foreground">Switch between demo roles from the top bar or sign in with another account.</p>
            <div className="mt-4 flex flex-wrap gap-2"><Link to="/login"><Button variant="outline" size="sm">Switch account <ArrowRight className="size-4" /></Button></Link><Button variant="ghost" size="sm" onClick={logout}><LogOut className="size-4" />Sign out</Button></div>
          </div>
          <div className="rounded-md border border-border bg-card p-5">
            <span className="grid size-9 place-items-center rounded-md bg-muted text-muted-foreground"><RotateCcw className="size-4" /></span>
            <h2 className="mt-4 font-semibold">Reset demo data</h2>
            <p className="mt-1 text-sm text-muted-foreground">Restore the original accounts, device records, and repair history.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={reset}>Reset demo data</Button>
          </div>
          <p className="px-1 text-xs text-muted-foreground">Last viewed {formatDate(new Date().toISOString())}</p>
        </section>
      </div>
    </AppShell>
  );
}

function ProfileValue({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1.5 text-sm font-semibold">{value}</dd></div>;
}