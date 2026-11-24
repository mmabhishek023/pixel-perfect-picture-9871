import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownUp, ArrowRight, ArrowUpRight, Filter, Laptop, Plus, Search, Smartphone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GradeBadge, RecommendationBadge, ScoreRing, StatusBadge } from "@/components/passport-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { calculateAssessment } from "@/utils/scoringEngine";
import type { DevicePassport, Grade, Recommendation } from "@/types/passport";

export const Route = createFileRoute("/")({
  component: DeviceDashboard,
  head: () => ({
    meta: [
      { title: "My Devices · ReTech Passport" },
      { name: "description", content: "Review device passports, health scores, and lifecycle recommendations." },
      { property: "og:title", content: "My Devices · ReTech Passport" },
      { property: "og:description", content: "Review device passports, health scores, and lifecycle recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type GradeFilter = "ALL" | Grade;
type RecommendationFilter = "ALL" | Recommendation;
type TypeFilter = "ALL" | "LAPTOP" | "SMARTPHONE";

function DeviceDashboard() {
  const { devices, currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("ALL");
  const [recommendationFilter, setRecommendationFilter] = useState<RecommendationFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const assessed = useMemo(() => devices.map((device) => ({ device, assessment: calculateAssessment(device) })), [devices]);
  const filtered = assessed.filter(({ device, assessment }) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [device.passportId, device.brand, device.model, device.serial].some((value) => value.toLowerCase().includes(query));
    return matchesSearch &&
      (gradeFilter === "ALL" || assessment.grade === gradeFilter) &&
      (recommendationFilter === "ALL" || assessment.recommendation === recommendationFilter) &&
      (typeFilter === "ALL" || device.deviceType === typeFilter);
  });
  const metrics = [
    { label: "Total devices", value: assessed.length, detail: "Across your passport list", icon: Laptop, color: "text-primary", tint: "bg-primary/10" },
    { label: "Grade A / B", value: assessed.filter(({ assessment }) => assessment.grade === "A" || assessment.grade === "B").length, detail: "Ready for continued use", icon: ArrowUpRight, color: "text-grade-a", tint: "bg-grade-a/10" },
    { label: "Needs repair", value: assessed.filter(({ assessment }) => assessment.recommendation === "REPAIR").length, detail: "Repair before next use", icon: Filter, color: "text-repair", tint: "bg-repair/10" },
    { label: "Due for recycling", value: assessed.filter(({ assessment }) => assessment.recommendation === "RECYCLE").length, detail: "End-of-life recommendation", icon: ArrowDownUp, color: "text-recycle", tint: "bg-recycle/10" },
  ];

  return (
    <AppShell
      title="My Devices"
      subtitle={`A clear view of your registered devices${currentUser?.role === "OWNER" ? "." : " across the demo workspace."}`}
      actions={<Link to="/devices/new"><Button><Plus className="size-4" /> Register device</Button></Link>}
    >
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" aria-label="Device overview">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-md border border-border bg-card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums sm:text-[30px]">{metric.value}</p>
                </div>
                <span className={`grid size-9 shrink-0 place-items-center rounded-md ${metric.tint} ${metric.color}`}><Icon className="size-[18px]" /></span>
              </div>
              <p className="mt-3 hidden text-xs text-muted-foreground sm:block">{metric.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-8" aria-labelledby="device-list-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="device-list-heading" className="text-lg font-semibold">Device passports</h2>
            <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {devices.length} devices</p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <div className="relative min-w-[210px] flex-1 sm:w-64 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search passport, model, serial" className="pl-9" aria-label="Search devices" />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeFilter)}>
              <SelectTrigger className="w-[132px] bg-card" aria-label="Filter device type"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="ALL">All types</SelectItem><SelectItem value="SMARTPHONE">Smartphone</SelectItem><SelectItem value="LAPTOP">Laptop</SelectItem></SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={(value) => setGradeFilter(value as GradeFilter)}>
              <SelectTrigger className="w-[112px] bg-card" aria-label="Filter grade"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="ALL">All grades</SelectItem>{["A", "B", "C", "D"].map((grade) => <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={recommendationFilter} onValueChange={(value) => setRecommendationFilter(value as RecommendationFilter)}>
              <SelectTrigger className="w-[142px] bg-card" aria-label="Filter recommendation"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="ALL">All outcomes</SelectItem>{["REUSE", "REPAIR", "REFURBISH", "RECYCLE"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-md border border-border bg-card md:block">
          <div className="grid grid-cols-[minmax(220px,1.5fr)_110px_120px_145px_145px_44px] items-center gap-4 border-b border-border bg-muted/50 px-5 py-3 text-[11px] font-semibold uppercase text-muted-foreground">
            <span>Device</span><span>Passport ID</span><span>Health</span><span>Recommendation</span><span>Lifecycle status</span><span />
          </div>
          <div className="divide-y divide-border">
            {filtered.map(({ device, assessment }) => <DesktopDeviceRow key={device.id} device={device} assessment={assessment} />)}
            {filtered.length === 0 && <EmptyDevices clear={() => { setSearch(""); setGradeFilter("ALL"); setRecommendationFilter("ALL"); setTypeFilter("ALL"); }} />}
          </div>
        </div>

        <div className="grid gap-3 md:hidden">
          {filtered.map(({ device, assessment }) => <MobileDeviceCard key={device.id} device={device} assessment={assessment} />)}
          {filtered.length === 0 && <EmptyDevices clear={() => { setSearch(""); setGradeFilter("ALL"); setRecommendationFilter("ALL"); setTypeFilter("ALL"); }} />}
        </div>
      </section>
    </AppShell>
  );
}

function DesktopDeviceRow({ device, assessment }: { device: DevicePassport; assessment: ReturnType<typeof calculateAssessment> }) {
  const DeviceIcon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
  return (
    <Link to="/devices/$id" params={{ id: device.id }} className="grid min-h-[76px] grid-cols-[minmax(220px,1.5fr)_110px_120px_145px_145px_44px] items-center gap-4 px-5 transition-colors hover:bg-muted/40">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary"><DeviceIcon className="size-5" /></span>
        <div className="min-w-0"><p className="truncate text-sm font-semibold">{device.name}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{device.brand} · {device.deviceType.toLowerCase()}</p></div>
      </div>
      <span className="font-mono text-xs text-muted-foreground">{device.passportId}</span>
      <div className="flex items-center gap-2"><ScoreRing assessment={assessment} size="small" /><GradeBadge grade={assessment.grade} /></div>
      <RecommendationBadge recommendation={assessment.recommendation} />
      <StatusBadge status={device.status} />
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function MobileDeviceCard({ device, assessment }: { device: DevicePassport; assessment: ReturnType<typeof calculateAssessment> }) {
  const DeviceIcon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
  return (
    <Link to="/devices/$id" params={{ id: device.id }} className="rounded-md border border-border bg-card p-4 transition-colors active:bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary"><DeviceIcon className="size-5" /></span>
          <div className="min-w-0"><p className="truncate font-semibold">{device.name}</p><p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">{device.passportId}</p></div>
        </div>
        <ScoreRing assessment={assessment} size="small" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2"><GradeBadge grade={assessment.grade} /><RecommendationBadge recommendation={assessment.recommendation} /><StatusBadge status={device.status} /></div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground"><span>{device.brand} · {device.deviceType.toLowerCase()}</span><ArrowRight className="size-4" /></div>
    </Link>
  );
}

function EmptyDevices({ clear }: { clear: () => void }) {
  return <div className="grid min-h-56 place-items-center px-4 py-10 text-center">
    <div><span className="mx-auto grid size-11 place-items-center rounded-full bg-muted text-muted-foreground"><Search className="size-5" /></span><p className="mt-3 font-semibold">No devices match these filters</p><p className="mt-1 text-sm text-muted-foreground">Adjust your search or clear the selected filters.</p><Button variant="outline" size="sm" className="mt-4" onClick={clear}>Clear filters</Button></div>
  </div>;
}