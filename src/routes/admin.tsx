import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Check, CircleAlert, RotateCcw, Users, Wrench } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { api } from "@/services/api";
import { calculateAssessment } from "@/utils/scoringEngine";
import type { Grade, Recommendation } from "@/types/passport";

export const Route = createFileRoute("/admin")({
  component: AdminConsole,
  head: () => ({ meta: [
    { title: "Admin Console · ReTech Passport" },
    { name: "description", content: "Review platform activity and technician approval requests." },
    { property: "og:title", content: "Admin Console · ReTech Passport" },
    { property: "og:description", content: "Review platform activity and technician approval requests." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const gradeColors: Record<Grade, string> = { A: "var(--color-grade-a)", B: "var(--color-grade-b)", C: "var(--color-grade-c)", D: "var(--color-grade-d)" };
const outcomeColors: Record<Recommendation, string> = { REUSE: "var(--color-reuse)", REPAIR: "var(--color-repair)", REFURBISH: "var(--color-refurbish)", RECYCLE: "var(--color-recycle)" };

function AdminConsole() {
  const { currentUser, state, approveTechnician, rejectTechnician } = useApp();
  const stats = api.adminStats(state);
  const pending = state.users.filter((user) => user.role === "TECHNICIAN" && user.status === "PENDING");
  const gradeData = useMemo(() => (['A', 'B', 'C', 'D'] as Grade[]).map((grade) => ({ grade, count: state.devices.filter((device) => calculateAssessment(device).grade === grade).length })), [state.devices]);
  const recommendationData = useMemo(() => (['REUSE', 'REPAIR', 'REFURBISH', 'RECYCLE'] as Recommendation[]).map((name) => ({ name, value: state.devices.filter((device) => calculateAssessment(device).recommendation === name).length })), [state.devices]);

  if (currentUser?.role !== "ADMIN") return <AppShell title="Admin console"><section className="max-w-lg rounded-md border border-warning/50 bg-warning p-5"><h2 className="font-semibold text-warning-foreground">Admin access required</h2><p className="mt-1 text-sm text-warning-foreground">Switch to the Admin demo role to open this view.</p><Link to="/" className="mt-4 inline-flex"><Button variant="outline">Back to devices</Button></Link></section></AppShell>;

  const metrics = [
    { label: "Total users", value: stats.users, icon: Users },
    { label: "Total devices", value: stats.devices, icon: RotateCcw },
    { label: "Repair records", value: stats.repairs, icon: Wrench },
    { label: "Pending approvals", value: stats.pendingTechnicians, icon: CircleAlert },
  ];
  return <AppShell title="Admin console" subtitle="Platform overview and technician approvals.">
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-md border border-border bg-card p-4 sm:p-5"><span className="grid size-9 place-items-center rounded-md bg-secondary text-primary"><Icon className="size-4" /></span><p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums">{value}</p></div>)}</section>
    <section className="mt-6 grid gap-5 lg:grid-cols-2">
      <div className="rounded-md border border-border bg-card p-5"><h2 className="font-semibold">Devices by grade</h2><div className="mt-4 h-60"><ResponsiveContainer width="100%" height="100%"><BarChart data={gradeData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--color-border)" /><XAxis dataKey="grade" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="count" name="Devices" radius={[4, 4, 0, 0]}>{gradeData.map((item) => <Cell key={item.grade} fill={gradeColors[item.grade]} />)}</Bar></BarChart></ResponsiveContainer></div></div>
      <div className="rounded-md border border-border bg-card p-5"><h2 className="font-semibold">Lifecycle recommendations</h2><div className="mt-4 h-60"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={recommendationData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={88} paddingAngle={3}>{recommendationData.map((item) => <Cell key={item.name} fill={outcomeColors[item.name]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="flex flex-wrap justify-center gap-x-4 gap-y-2">{recommendationData.map((item) => <span key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full" style={{ backgroundColor: outcomeColors[item.name] }} />{item.name}</span>)}</div></div>
    </section>
    <section className="mt-6 rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-semibold">Technician approvals</h2><p className="mt-1 text-sm text-muted-foreground">{pending.length} waiting for review</p></div></div>
      {pending.length ? <div className="divide-y divide-border">{pending.map((user) => <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div><p className="font-medium">{user.name}</p><p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => rejectTechnician(user.id)}><CircleAlert className="size-4" />Reject</Button><Button size="sm" onClick={() => approveTechnician(user.id)}><Check className="size-4" />Approve</Button></div></div>)}</div> : <p className="px-5 py-6 text-sm text-muted-foreground">No technician requests need review.</p>}
    </section>
    <section className="mt-6 rounded-md border border-border bg-card"><div className="border-b border-border px-5 py-4"><h2 className="font-semibold">Platform devices</h2></div><div className="divide-y divide-border">{state.devices.map((device) => <Link key={device.id} to="/devices/$id" params={{ id: device.id }} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 hover:bg-muted/40"><span className="font-medium">{device.name}<span className="ml-2 font-mono text-xs font-normal text-muted-foreground">{device.passportId}</span></span><span className="inline-flex items-center gap-1 text-xs text-primary">View <ArrowRight className="size-3.5" /></span></Link>)}</div></section>
  </AppShell>;
}