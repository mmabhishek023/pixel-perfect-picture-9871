import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Laptop, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "@/types/passport";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [
    { title: "Create account · ReTech Passport" },
    { name: "description", content: "Create a ReTech Passport account as an owner, technician, or viewer." },
    { property: "og:title", content: "Create account · ReTech Passport" },
    { property: "og:description", content: "Create a ReTech Passport account as an owner, technician, or viewer." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Extract<UserRole, "OWNER" | "TECHNICIAN" | "VIEWER">>("OWNER");
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      signup(name.trim(), email.trim(), role);
      void navigate({ to: "/profile" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create account.");
    }
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold"><span className="grid size-10 place-items-center rounded-md bg-primary-foreground/15"><Laptop className="size-5" /></span>ReTech Passport</Link>
        <div className="max-w-xl"><p className="text-sm font-semibold uppercase">A record that moves with your device</p><h1 className="mt-5 text-5xl font-bold leading-tight">Make the next handoff more transparent.</h1><p className="mt-5 max-w-md text-base leading-7 text-primary-foreground/80">Create an account to keep device identity and lifecycle history together.</p></div>
        <p className="text-xs text-primary-foreground/70">Built for owners, repairers, and responsible buyers.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><Laptop className="size-5" /></span><span className="font-bold">ReTech Passport</span></div>
          <Link to="/login" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to log in</Link>
          <h2 className="mt-2 text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">Choose the role that best fits how you use devices.</p>
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">Full name<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></label>
            <label className="grid gap-1.5 text-sm font-medium">Email address<Input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.org" required /></label>
            <label className="grid gap-1.5 text-sm font-medium">Account type
              <Select value={role} onValueChange={(value) => setRole(value as typeof role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="OWNER">Device owner</SelectItem><SelectItem value="TECHNICIAN">Repair technician</SelectItem><SelectItem value="VIEWER">Buyer / recycler</SelectItem></SelectContent>
              </Select>
            </label>
            {role === "TECHNICIAN" && <div className="flex gap-3 rounded-md border border-warning/50 bg-warning p-3 text-sm text-warning-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0" /><p>Technician accounts need Admin approval. Verified repair badges are available after approval.</p></div>}
            {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="mt-1 w-full">Create account</Button>
          </form>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Wrench className="size-3.5" />Demo data stays in this browser.</p>
        </div>
      </section>
    </main>
  );
}