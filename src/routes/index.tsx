import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Filter,
  Laptop,
  Plus,
  Search,
  Smartphone,
  Store,
  Tag,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { InspectionModal } from "@/components/InspectionModal";
import { ListingModal } from "@/components/ListingModal";
import { GradeBadge, RecommendationBadge, ScoreRing, StatusBadge } from "@/components/passport-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [techTab, setTechTab] = useState<"QUEUE" | "LISTINGS">("QUEUE");

  const [inspectingDeviceId, setInspectingDeviceId] = useState<string | null>(null);
  const [listingDeviceId, setListingDeviceId] = useState<string | null>(null);

  const isTech = currentUser?.role === "TECHNICIAN";
  const isViewer = currentUser?.role === "VIEWER";
  const isOwner = currentUser?.role === "OWNER";
  const isAdmin = currentUser?.role === "ADMIN";

  const inspectingDevice = useMemo(
    () => devices.find((device) => device.id === inspectingDeviceId) ?? null,
    [devices, inspectingDeviceId],
  );

  const listingDevice = useMemo(
    () => devices.find((device) => device.id === listingDeviceId) ?? null,
    [devices, listingDeviceId],
  );

  const assessed = useMemo(
    () => devices.map((device) => ({ device, assessment: calculateAssessment(device) })),
    [devices],
  );

  const pendingInspection = useMemo(
    () => assessed.filter(({ device }) => (device.internalStatus || "PENDING_INSPECTION") === "PENDING_INSPECTION"),
    [assessed],
  );

  const repairedListings = useMemo(
    () => assessed.filter(({ device }) => device.internalStatus === "REFURBISHED" || device.internalStatus === "RECYCLED"),
    [assessed],
  );

  const filtered = assessed.filter(({ device, assessment }) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [device.passportId, device.brand, device.model, device.serial].some((value) =>
        value.toLowerCase().includes(query),
      );
    if (!matchesSearch) return false;

    if (isOwner && device.ownerId !== currentUser?.id) return false;

    if (isViewer) {
      if (device.internalStatus !== "REFURBISHED" || !device.isListedForSale) return false;
    }

    if (isTech) {
      if (techTab === "QUEUE") {
        if ((device.internalStatus || "PENDING_INSPECTION") !== "PENDING_INSPECTION") return false;
      } else {
        if (device.internalStatus !== "REFURBISHED" && device.internalStatus !== "RECYCLED") return false;
      }
    }

    return (
      (gradeFilter === "ALL" || assessment.grade === gradeFilter) &&
      (recommendationFilter === "ALL" || assessment.recommendation === recommendationFilter) &&
      (typeFilter === "ALL" || device.deviceType === typeFilter)
    );
  });

  const pageTitle = isTech
    ? "Technician Workspace"
    : isViewer
    ? "Verified Marketplace"
    : isAdmin
    ? "All Passports"
    : "My Devices";

  const pageSubtitle = isTech
    ? "Inspect triage queue, log verified repairs, and publish refurbished products for sale."
    : isViewer
    ? "Certified refurbished electronics with cryptographic repair ledgers and verified health scores."
    : isAdmin
    ? "Platform oversight across all registered electronic device passports."
    : "A clear view of your registered devices.";

  const avgQueueScore = pendingInspection.length
    ? Math.round(
        pendingInspection.reduce((sum, { assessment }) => sum + assessment.score, 0) / pendingInspection.length,
      )
    : 0;

  const metrics = isTech
    ? [
        {
          label: "Repair Queue",
          value: pendingInspection.length,
          detail: "Awaiting inspection & repair",
          icon: Wrench,
          color: "text-primary",
          tint: "bg-primary/10",
        },
        {
          label: "Repaired & Ready",
          value: repairedListings.filter(({ device }) => device.internalStatus === "REFURBISHED" && !device.isListedForSale).length,
          detail: "Finished repairs ready to list",
          icon: Tag,
          color: "text-warning",
          tint: "bg-warning/10",
        },
        {
          label: "Listed for Sale",
          value: repairedListings.filter(({ device }) => device.internalStatus === "REFURBISHED" && device.isListedForSale).length,
          detail: "Live in public buyer catalog",
          icon: Store,
          color: "text-grade-a",
          tint: "bg-grade-a/10",
        },
        {
          label: "Avg queue health",
          value: pendingInspection.length ? avgQueueScore : "—",
          detail: "Average score of queued intake",
          icon: ArrowUpRight,
          color: "text-primary",
          tint: "bg-primary/10",
        },
      ]
    : [
        {
          label: isOwner ? "My devices" : isViewer ? "Available for sale" : "Total passports",
          value: isViewer ? assessed.filter(({ device }) => device.internalStatus === "REFURBISHED" && device.isListedForSale).length : assessed.length,
          detail: isOwner ? "Registered to your account" : isViewer ? "Verified refurbished in stock" : "Across platform registry",
          icon: Laptop,
          color: "text-primary",
          tint: "bg-primary/10",
        },
        {
          label: "Grade A / B",
          value: assessed.filter(({ assessment }) => assessment.grade === "A" || assessment.grade === "B").length,
          detail: "Ready for continued use",
          icon: ArrowUpRight,
          color: "text-grade-a",
          tint: "bg-grade-a/10",
        },
        {
          label: "Needs repair",
          value: assessed.filter(({ assessment }) => assessment.recommendation === "REPAIR").length,
          detail: "Repair before next use",
          icon: Filter,
          color: "text-repair",
          tint: "bg-repair/10",
        },
        {
          label: "Due for recycling",
          value: assessed.filter(({ assessment }) => assessment.recommendation === "RECYCLE").length,
          detail: "End-of-life recommendation",
          icon: ArrowDownUp,
          color: "text-recycle",
          tint: "bg-recycle/10",
        },
      ];

  return (
    <AppShell
      title={pageTitle}
      subtitle={pageSubtitle}
      actions={
        isOwner ? (
          <Link to="/devices/new">
            <Button>
              <Plus className="size-4" /> Register device
            </Button>
          </Link>
        ) : isAdmin ? (
          <Link to="/admin">
            <Button variant="outline">Admin Console</Button>
          </Link>
        ) : null
      }
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
                <span className={`grid size-9 shrink-0 place-items-center rounded-md ${metric.tint} ${metric.color}`}>
                  <Icon className="size-[18px]" />
                </span>
              </div>
              <p className="mt-3 hidden text-xs text-muted-foreground sm:block">{metric.detail}</p>
            </div>
          );
        })}
      </section>

      {/* Technician workspace tabs */}
      {isTech && (
        <div className="mt-8">
          <Tabs value={techTab} onValueChange={(val) => setTechTab(val as "QUEUE" | "LISTINGS")}>
            <TabsList className="bg-muted p-1">
              <TabsTrigger value="QUEUE" className="gap-2">
                <Wrench className="size-4" />
                Inspection & Repair Queue
                <Badge variant="secondary" className="ml-1 text-[11px]">
                  {pendingInspection.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="LISTINGS" className="gap-2">
                <Store className="size-4" />
                Repaired & Listings
                <Badge variant="secondary" className="ml-1 text-[11px]">
                  {repairedListings.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <section className={isTech ? "mt-4" : "mt-8"} aria-labelledby="device-list-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="device-list-heading" className="text-lg font-semibold">
              {isTech
                ? techTab === "QUEUE"
                  ? "Devices Awaiting Inspection"
                  : "Completed Repairs & Marketplace Listings"
                : isViewer
                ? "Available Certified Products"
                : "Device passports"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {filtered.length} {filtered.length === 1 ? "device" : "devices"}
            </p>
          </div>
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:flex lg:w-auto gap-2">
            <div className="relative w-full sm:col-span-2 lg:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search passport, model, serial"
                className="pl-9 w-full text-base sm:text-sm"
                aria-label="Search devices"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeFilter)}>
              <SelectTrigger className="w-full lg:w-[132px] bg-card text-base sm:text-sm" aria-label="Filter device type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                <SelectItem value="LAPTOP">Laptop</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={(value) => setGradeFilter(value as GradeFilter)}>
              <SelectTrigger className="w-full lg:w-[112px] bg-card text-base sm:text-sm" aria-label="Filter grade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All grades</SelectItem>
                {["A", "B", "C", "D"].map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isOwner && (
              <Select value={recommendationFilter} onValueChange={(value) => setRecommendationFilter(value as RecommendationFilter)}>
                <SelectTrigger className="w-full lg:w-[142px] bg-card text-base sm:text-sm" aria-label="Filter recommendation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All outcomes</SelectItem>
                  {["REUSE", "REPAIR", "REFURBISH", "RECYCLE"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-md border border-border bg-card md:block">
          <div
            className={`grid ${
              isViewer
                ? "grid-cols-[minmax(240px,1.6fr)_110px_120px_110px_140px_120px]"
                : isTech
                ? "grid-cols-[minmax(220px,1.5fr)_110px_120px_130px_160px_160px]"
                : "grid-cols-[minmax(220px,1.5fr)_110px_120px_145px_145px_44px]"
            } items-center gap-4 border-b border-border bg-muted/50 px-5 py-3 text-[11px] font-semibold uppercase text-muted-foreground`}
          >
            <span>Device</span>
            <span>Passport ID</span>
            <span>Health</span>
            {isViewer ? <span>Price</span> : isOwner ? <span>Payout</span> : <span>Recommendation</span>}
            <span>{isViewer ? "Condition" : isTech ? (techTab === "QUEUE" ? "Triage Status" : "Market Status") : "Lifecycle status"}</span>
            <span className="text-right">{isViewer ? "Action" : isTech ? "Action" : ""}</span>
          </div>
          <div className="divide-y divide-border">
            {filtered.map(({ device, assessment }) => (
              <DesktopDeviceRow
                key={device.id}
                device={device}
                assessment={assessment}
                isTech={isTech}
                techTab={techTab}
                isOwner={isOwner}
                isViewer={isViewer}
                onInspect={setInspectingDeviceId}
                onList={setListingDeviceId}
              />
            ))}
            {filtered.length === 0 && (
              <EmptyDevices
                clear={() => {
                  setSearch("");
                  setGradeFilter("ALL");
                  setRecommendationFilter("ALL");
                  setTypeFilter("ALL");
                }}
              />
            )}
          </div>
        </div>

        <div className="grid gap-3 md:hidden">
          {filtered.map(({ device, assessment }) => (
            <MobileDeviceCard
              key={device.id}
              device={device}
              assessment={assessment}
              isTech={isTech}
              techTab={techTab}
              isOwner={isOwner}
              isViewer={isViewer}
              onInspect={setInspectingDeviceId}
              onList={setListingDeviceId}
            />
          ))}
          {filtered.length === 0 && (
            <EmptyDevices
              clear={() => {
                setSearch("");
                setGradeFilter("ALL");
                setRecommendationFilter("ALL");
                setTypeFilter("ALL");
              }}
            />
          )}
        </div>
      </section>

      {inspectingDevice && (
        <InspectionModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setInspectingDeviceId(null);
          }}
          device={inspectingDevice}
          onComplete={() => setInspectingDeviceId(null)}
        />
      )}

      {listingDevice && (
        <ListingModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setListingDeviceId(null);
          }}
          device={listingDevice}
          onComplete={() => setListingDeviceId(null)}
        />
      )}
    </AppShell>
  );
}

function OwnerPayoutBadge({ device }: { device: DevicePassport }) {
  const payoutStatus = device.payoutStatus || "PENDING_INSPECTION";
  if (payoutStatus === "PAID") {
    return (
      <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
        {device.payoutAmount !== null && device.payoutAmount !== undefined ? `₹${device.payoutAmount.toLocaleString("en-IN")} · Paid` : "Paid"}
      </Badge>
    );
  }
  if (payoutStatus === "PAYMENT_INITIATED") {
    return (
      <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium">
        {device.payoutAmount !== null && device.payoutAmount !== undefined ? `₹${device.payoutAmount.toLocaleString("en-IN")} · Payment Initiated` : "Payment Initiated"}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-border bg-muted text-muted-foreground text-xs font-normal">
      Pending Inspection
    </Badge>
  );
}

function OwnerStatusBadge({ device }: { device: DevicePassport }) {
  if (device.internalStatus === "PENDING_INSPECTION") {
    return (
      <span className="inline-flex items-center whitespace-nowrap rounded-full border border-warning/50 bg-warning px-2.5 py-0.5 text-xs font-medium text-warning-foreground">
        PENDING INSPECTION
      </span>
    );
  }
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-success/50 bg-success px-2.5 py-0.5 text-xs font-medium text-success-foreground">
      APPROVED
    </span>
  );
}

function TechMarketBadge({ device }: { device: DevicePassport }) {
  if (device.internalStatus === "RECYCLED") {
    return (
      <Badge variant="outline" className="border-recycle/30 bg-recycle/10 text-recycle font-medium">
        Recycled
      </Badge>
    );
  }
  if (device.isListedForSale) {
    return (
      <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 font-semibold text-emerald-700 dark:text-emerald-400">
        Listed (₹{(device.listingPrice ?? 0).toLocaleString("en-IN")})
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium">
      Ready to List
    </Badge>
  );
}

function DesktopDeviceRow({
  device,
  assessment,
  isTech,
  techTab,
  isOwner,
  isViewer,
  onInspect,
  onList,
}: {
  device: DevicePassport;
  assessment: ReturnType<typeof calculateAssessment>;
  isTech?: boolean;
  techTab?: "QUEUE" | "LISTINGS";
  isOwner?: boolean;
  isViewer?: boolean;
  onInspect?: (id: string) => void;
  onList?: (id: string) => void;
}) {
  const DeviceIcon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
  const viewerThumbnail = isViewer && (device.listingPhotos?.length ?? 0) > 0 ? device.listingPhotos[0] : null;

  return (
    <div
      className={`grid min-h-[76px] ${
        isViewer
          ? "grid-cols-[minmax(240px,1.6fr)_110px_120px_110px_140px_120px]"
          : isTech
          ? "grid-cols-[minmax(220px,1.5fr)_110px_120px_130px_160px_160px]"
          : "grid-cols-[minmax(220px,1.5fr)_110px_120px_145px_145px_44px]"
      } items-center gap-4 px-5 transition-colors hover:bg-muted/40`}
    >
      <Link to="/devices/$id" params={{ id: device.id }} className="flex min-w-0 items-center gap-3">
        {viewerThumbnail ? (
          <img src={viewerThumbnail} alt={device.name} className="size-10 shrink-0 rounded-md border border-border object-cover" />
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
            <DeviceIcon className="size-5" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold hover:text-primary">{device.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {device.brand} · {device.deviceType.toLowerCase()}
          </p>
        </div>
      </Link>

      <span className="font-mono text-xs text-muted-foreground">{device.passportId}</span>

      <div className="flex items-center gap-2">
        <ScoreRing assessment={assessment} size="small" />
        <GradeBadge grade={assessment.grade} />
      </div>

      {isViewer ? (
        <span className="font-bold text-sm text-foreground tabular-nums">
          ₹{(device.listingPrice ?? 0).toLocaleString("en-IN")}
        </span>
      ) : isOwner ? (
        <OwnerPayoutBadge device={device} />
      ) : (
        <RecommendationBadge recommendation={assessment.recommendation} />
      )}

      {isOwner ? (
        <OwnerStatusBadge device={device} />
      ) : isViewer ? (
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-medium text-primary">
          {device.listingCondition || "Certified Refurbished"}
        </Badge>
      ) : isTech ? (
        techTab === "QUEUE" ? (
          <Badge variant="outline" className="border-warning/50 bg-warning/10 text-warning-foreground text-xs font-medium">
            Pending Inspection
          </Badge>
        ) : (
          <TechMarketBadge device={device} />
        )
      ) : (
        <StatusBadge status={device.status} />
      )}

      <div className="flex justify-end">
        {isTech ? (
          techTab === "QUEUE" ? (
            <Button size="sm" className="h-8 gap-1.5 text-xs font-medium" onClick={() => onInspect?.(device.id)}>
              <Wrench className="size-3.5" />
              Inspect & Repair
            </Button>
          ) : device.internalStatus === "REFURBISHED" ? (
            <Button
              size="sm"
              variant={device.isListedForSale ? "outline" : "default"}
              className="h-8 gap-1.5 text-xs font-medium"
              onClick={() => onList?.(device.id)}
            >
              <Store className="size-3.5" />
              {device.isListedForSale ? "Edit Listing" : "List for Sale"}
            </Button>
          ) : (
            <Link to="/devices/$id" params={{ id: device.id }}>
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                View Passport
              </Button>
            </Link>
          )
        ) : isViewer ? (
          <Link to="/devices/$id" params={{ id: device.id }}>
            <Button size="sm" className="h-8 gap-1 text-xs">
              View Passport <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        ) : (
          <Link to="/devices/$id" params={{ id: device.id }} className="grid size-8 place-items-center">
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>
        )}
      </div>
    </div>
  );
}

function MobileDeviceCard({
  device,
  assessment,
  isTech,
  techTab,
  isOwner,
  isViewer,
  onInspect,
  onList,
}: {
  device: DevicePassport;
  assessment: ReturnType<typeof calculateAssessment>;
  isTech?: boolean;
  techTab?: "QUEUE" | "LISTINGS";
  isOwner?: boolean;
  isViewer?: boolean;
  onInspect?: (id: string) => void;
  onList?: (id: string) => void;
}) {
  const DeviceIcon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
  const viewerThumbnail = isViewer && (device.listingPhotos?.length ?? 0) > 0 ? device.listingPhotos[0] : null;

  return (
    <div className="rounded-md border border-border bg-card p-4 transition-colors">
      <Link to="/devices/$id" params={{ id: device.id }} className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {viewerThumbnail ? (
            <img src={viewerThumbnail} alt={device.name} className="size-10 shrink-0 rounded-md border border-border object-cover" />
          ) : (
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
              <DeviceIcon className="size-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold">{device.name}</p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">{device.passportId}</p>
          </div>
        </div>
        <ScoreRing assessment={assessment} size="small" />
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <GradeBadge grade={assessment.grade} />
        {isViewer ? (
          <span className="font-bold text-sm text-foreground tabular-nums">
            ₹{(device.listingPrice ?? 0).toLocaleString("en-IN")}
          </span>
        ) : isOwner ? (
          <OwnerPayoutBadge device={device} />
        ) : (
          <RecommendationBadge recommendation={assessment.recommendation} />
        )}
        {isOwner ? (
          <OwnerStatusBadge device={device} />
        ) : isViewer ? (
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-xs font-medium text-primary">
            {device.listingCondition || "Certified Refurbished"}
          </Badge>
        ) : isTech ? (
          techTab === "QUEUE" ? (
            <Badge variant="outline" className="border-warning/50 bg-warning/10 text-warning-foreground text-xs font-medium">
              Pending Inspection
            </Badge>
          ) : (
            <TechMarketBadge device={device} />
          )
        ) : (
          <StatusBadge status={device.status} />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {device.brand} · {device.deviceType.toLowerCase()}
        </span>
        {isTech ? (
          techTab === "QUEUE" ? (
            <Button size="sm" className="h-8 gap-1.5 text-xs font-medium" onClick={() => onInspect?.(device.id)}>
              <Wrench className="size-3.5" />
              Inspect & Repair
            </Button>
          ) : device.internalStatus === "REFURBISHED" ? (
            <Button
              size="sm"
              variant={device.isListedForSale ? "outline" : "default"}
              className="h-8 gap-1.5 text-xs font-medium"
              onClick={() => onList?.(device.id)}
            >
              <Store className="size-3.5" />
              {device.isListedForSale ? "Edit Listing" : "List for Sale"}
            </Button>
          ) : (
            <Link to="/devices/$id" params={{ id: device.id }} className="font-medium text-primary py-1 px-2">
              View
            </Link>
          )
        ) : (
          <Link to="/devices/$id" params={{ id: device.id }} className="inline-flex items-center gap-1 font-medium text-primary py-1 px-2">
            View <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

function EmptyDevices({ clear }: { clear: () => void }) {
  return (
    <div className="grid min-h-56 place-items-center px-4 py-10 text-center">
      <div>
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
          <Search className="size-5" />
        </span>
        <p className="mt-3 font-semibold">No devices match these filters</p>
        <p className="mt-1 text-sm text-muted-foreground">Adjust your search or clear the selected filters.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={clear}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}
