import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Laptop, ShieldCheck, UserRound, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import type { UserRole } from "@/types/passport";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [
    { title: "Log in · ReTech Passport" },
    { name: "description", content: "Sign in to manage your electronic device passports." },
    { property: "og:title", content: "Log in · ReTech Passport" },
    { property: "og:description", content: "Sign in to manage your electronic device passports." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const demoOptions: { role: UserRole; title: string; email: string; icon: typeof Laptop }[] = [
  { role: "OWNER", title: "Owner", email: "owner@example.org", icon: Laptop },
  { role: "TECHNICIAN", title: "Technician", email: "tech@example.org", icon: Wrench },
  { role: "VIEWER", title: "Viewer", email: "viewer@example.org", icon: UserRound },
  { role: "ADMIN", title: "Admin", email: "admin@example.org", icon: ShieldCheck },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login, demoLogin } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      login(email, password);
      void navigate({ to: "/" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    }
  }

  function quickLogin(role: UserRole) {
    demoLogin(role);
    void navigate({ to: "/" });
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold"><span className="grid size-10 place-items-center rounded-md bg-primary-foreground/15"><Laptop className="size-5" /></span>ReTech Passport</Link>
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase">Your device, documented</p>
          <h1 className="mt-5 text-5xl font-bold leading-tight">Every device has a story worth keeping.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-primary-foreground/80">Sign in to review trusted records, service history, and next-step guidance.</p>
        </div>
        <p className="text-xs text-primary-foreground/70">A clearer path from purchase to next life.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><Laptop className="size-5" /></span><span className="font-bold">ReTech Passport</span></div>
          <p className="text-sm font-semibold text-primary">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold">Log in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">Use a demo login or enter a demo account email.</p>
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">Email address<Input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.org" required /></label>
            <label className="grid gap-1.5 text-sm font-medium">Password<Input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter any password for demo accounts" required /></label>
            {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="mt-1 w-full">Log in <ArrowRight className="size-4" /></Button>
          </form>
          <div className="my-7 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs font-medium text-muted-foreground">DEMO ACCESS</span><div className="h-px flex-1 bg-border" /></div>
          <div className="grid grid-cols-2 gap-2">
            {demoOptions.map(({ role, title, email: demoEmail, icon: Icon }) => <Button key={role} variant="outline" className="h-11 justify-start" onClick={() => { setEmail(demoEmail); quickLogin(role); }}><Icon className="size-4 text-primary" />{title}</Button>)}
          </div>
          <p className="mt-7 text-center text-sm text-muted-foreground">New to ReTech? <Link to="/signup" className="font-semibold text-primary hover:underline">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}