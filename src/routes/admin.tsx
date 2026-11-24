import { Component, useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  IndianRupee,
  RotateCcw,
  ShieldAlert,
  Store,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AdminPayoutReviewModal } from "@/components/AdminPayoutReviewModal";
import { TransferModal } from "@/components/TransferModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { api } from "@/services/api";
import { calculateAssessment } from "@/utils/scoringEngine";
import type { DeviceInternalStatus, DevicePayoutStatus, Grade, Recommendation } from "@/types/passport";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error) {
    console.error("AdminConsole runtime error:", error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <AppShell title="Admin console">
          <section className="max-w-xl rounded-md border border-destructive/40 bg-destructive/10 p-6">
            <div className="flex items-center gap-2 text-destructive font-semibold">
              <ShieldAlert className="size-5" />
              <span>Admin Console error encountered</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.state.error?.message ?? "An error occurred while rendering the administration panel."}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Reload Console
              </Button>
              <Link to="/">
                <Button size="sm">Back to Devices</Button>
              </Link>
            </div>
          </section>
        </AppShell>
      );
    }
    return this.props.children;
  }
}

export const Route = createFileRoute("/admin")({
  component: AdminRouteWrapper,
  head: () => ({
    meta: [
      { title: "Admin Console · ReTech Passport" },
      { name: "description", content: "Review platform activity, trade-in payouts, and technician approval requests." },
      { property: "og:title", content: "Admin Console · ReTech Passport" },
      { property: "og:description", content: "Review platform activity, trade-in payouts, and technician approval requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AdminRouteWrapper() {
  return (
    <AdminErrorBoundary>
      <AdminConsole />
    </AdminErrorBoundary>
  );
}

const gradeColors: Record<Grade, string> = {
  A: "var(--color-grade-a)",
  B: "var(--color-grade-b)",
  C: "var(--color-grade-c)",
  D: "var(--color-grade-d)",
};

const outcomeColors: Record<Recommendation, string> = {
  REUSE: "var(--color-reuse)",
  REPAIR: "var(--color-repair)",
  REFURBISH: "var(--color-refurbish)",
  RECYCLE: "var(--color-recycle)",
};

const internalStatusStyles: Record<DeviceInternalStatus, string> = {
  PENDING_INSPECTION: "border-warning/50 bg-warning/10 text-warning-foreground",
  REFURBISHED: "border-success/50 bg-success/10 text-success-foreground",
  RECYCLED: "border-recycle/30 bg-recycle/10 text-recycle",
};

const payoutStatusStyles: Record<DevicePayoutStatus, string> = {
  PENDING_INSPECTION: "border-border bg-muted text-muted-foreground",
  PAYMENT_INITIATED: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  PAID: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

function getInternalStatusStyle(status?: DeviceInternalStatus): string {
  if (!status) return "border-warning/50 bg-warning/10 text-warning-foreground";
  return internalStatusStyles[status] || "border-border bg-muted text-muted-foreground";
}

function getPayoutStatusStyle(status?: DevicePayoutStatus): string {
  if (!status) return "border-border bg-muted text-muted-foreground";
  return payoutStatusStyles[status] || "border-border bg-muted text-muted-foreground";
}

function AdminConsole() {
  const { currentUser, state, approveTechnician, rejectTechnician, markAsPaid, switchRole } = useApp();
  const [reviewingDeviceId, setReviewingDeviceId] = useState<string | null>(null);
  const [transferDeviceId, setTransferDeviceId] = useState<string | null>(null);
  const [payoutPage, setPayoutPage] = useState<number>(1);

  const users = state.users ?? [];
  const devices = state.devices ?? [];

  const reviewingDevice = useMemo(() => {
    return reviewingDeviceId ? devices.find((d) => d.id === reviewingDeviceId) ?? null : null;
  }, [devices, reviewingDeviceId]);

  const transferTargetDevice = useMemo(() => {
    return transferDeviceId ? devices.find((d) => d.id === transferDeviceId) ?? null : null;
  }, [devices, transferDeviceId]);

  const stats = useMemo(() => {
    try {
      return api.adminStats(state);
    } catch {
      return {
        users: users.length,
        devices: devices.length,
        repairs: devices.reduce((total, d) => total + (d.repairs?.length ?? 0), 0),
        pendingTechnicians: users.filter((u) => u.role === "TECHNICIAN" && u.status === "PENDING").length,
      };
    }
  }, [state, users, devices]);

  const pending = useMemo(
    () => users.filter((user) => user.role === "TECHNICIAN" && user.status === "PENDING"),
    [users],
  );

  const payoutDevices = useMemo(
    () => devices.filter((device) => device.payoutStatus === "PAYMENT_INITIATED" || device.payoutStatus === "PAID"),
    [devices],
  );

  const sortedPayoutDevices = useMemo(() => {
    return [...payoutDevices].sort((a, b) => {
      const tA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.createdAt).getTime();
      const tB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.createdAt).getTime();
      if (tB !== tA) return tB - tA;
      return b.passportId.localeCompare(a.passportId);
    });
  }, [payoutDevices]);

  const PAGE_SIZE = 5;
  const totalPayoutPages = Math.max(1, Math.ceil(sortedPayoutDevices.length / PAGE_SIZE));
  const safePayoutPage = Math.min(Math.max(1, payoutPage), totalPayoutPages);
  const paginatedPayoutDevices = sortedPayoutDevices.slice(
    (safePayoutPage - 1) * PAGE_SIZE,
    safePayoutPage * PAGE_SIZE,
  );

  const userNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const user of users) map.set(user.id, user.name);
    return map;
  }, [users]);

  const gradeData = useMemo(() => {
    return (["A", "B", "C", "D"] as Grade[]).map((grade) => {
      const count = devices.filter((device) => {
        try {
          return calculateAssessment(device).grade === grade;
        } catch {
          return false;
        }
      }).length;
      return { grade, count };
    });
  }, [devices]);

  const recommendationData = useMemo(() => {
    return (["REUSE", "REPAIR", "REFURBISH", "RECYCLE"] as Recommendation[]).map((name) => {
      const value = devices.filter((device) => {
        try {
          return calculateAssessment(device).recommendation === name;
        } catch {
          return false;
        }
      }).length;
      return { name, value };
    });
  }, [devices]);

  if (currentUser?.role !== "ADMIN") {
    return (
      <AppShell title="Admin console">
        <section className="max-w-lg rounded-md border border-warning/50 bg-warning/10 p-5">
          <h2 className="font-semibold text-warning-foreground">Admin access required</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You are currently signed in as <span className="font-medium text-foreground">{currentUser?.name ?? "Guest"}</span> ({currentUser?.role ?? "No role"}). Switch to the Admin demo role to open this view.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={() => switchRole("ADMIN")}>Switch to Admin Role</Button>
            <Link to="/">
              <Button variant="outline">Back to devices</Button>
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  const metrics = [
    { label: "Total users", value: stats.users, icon: Users },
    { label: "Total devices", value: stats.devices, icon: RotateCcw },
    { label: "Repair records", value: stats.repairs, icon: Wrench },
    { label: "Pending approvals", value: stats.pendingTechnicians, icon: CircleAlert },
  ];

  return (
    <AppShell title="Admin console" subtitle="Platform overview, payouts, listings, and technician approvals.">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-md border border-border bg-card p-4 sm:p-5">
            <span className="grid size-9 place-items-center rounded-md bg-secondary text-primary">
              <Icon className="size-4" />
            </span>
            <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-5">
          <h2 className="font-semibold">Devices by grade</h2>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="grade" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" name="Devices" radius={[4, 4, 0, 0]}>
                  {gradeData.map((item) => (
                    <Cell key={item.grade} fill={gradeColors[item.grade]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md border border-border bg-card p-5">
          <h2 className="font-semibold">Lifecycle recommendations</h2>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={recommendationData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {recommendationData.map((item) => (
                    <Cell key={item.name} fill={outcomeColors[item.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {recommendationData.map((item) => (
              <span key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: outcomeColors[item.name] }} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trade-In Payouts */}
      <section className="mt-6 rounded-md border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <IndianRupee className="size-4 text-primary" />
            <div>
              <h2 className="font-semibold">Trade-In Payouts</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {payoutDevices.filter((d) => (d.payoutStatus || "PENDING_INSPECTION") === "PAYMENT_INITIATED").length} awaiting review & disbursement
              </p>
            </div>
          </div>
        </div>
        {sortedPayoutDevices.length ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-[11px] font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Device</th>
                    <th className="px-4 py-3">Passport ID</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">Outcome</th>
                    <th className="px-4 py-3">Payout</th>
                    <th className="px-4 py-3">Status & Listing</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedPayoutDevices.map((device) => {
                    const internalStatus = device.internalStatus || "PENDING_INSPECTION";
                    const payoutStatus = device.payoutStatus || "PENDING_INSPECTION";
                    return (
                      <tr key={device.id} className="hover:bg-muted/30">
                        <td className="px-5 py-3.5 font-medium">
                          <Link to="/devices/$id" params={{ id: device.id }} className="hover:text-primary">
                            {device.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{device.passportId}</td>
                        <td className="px-4 py-3.5 text-muted-foreground">{userNameById.get(device.ownerId) ?? device.ownerId}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant="outline" className={`text-xs font-medium ${getInternalStatusStyle(internalStatus)}`}>
                            {internalStatus.replaceAll("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 font-semibold tabular-nums">
                          {device.payoutAmount !== null && device.payoutAmount !== undefined
                            ? `₹${device.payoutAmount.toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1 items-start">
                            <Badge variant="outline" className={`text-xs font-medium ${getPayoutStatusStyle(payoutStatus)}`}>
                              {payoutStatus.replaceAll("_", " ")}
                            </Badge>
                            {device.isListedForSale && (
                              <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary text-[10px]">
                                Listed (₹{(device.listingPrice ?? 0).toLocaleString("en-IN")})
                              </Badge>
                            )}
                            {internalStatus === "REFURBISHED" && !device.isListedForSale && payoutStatus === "PAID" && (
                              <span className="text-[10px] text-muted-foreground">Unlisted</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {payoutStatus === "PAYMENT_INITIATED" ? (
                              <Button size="sm" onClick={() => setReviewingDeviceId(device.id)}>
                                <Check className="size-4" />Review & Approve
                              </Button>
                            ) : internalStatus === "REFURBISHED" && !device.isListedForSale ? (
                              <Button size="sm" variant="outline" onClick={() => setReviewingDeviceId(device.id)}>
                                <Store className="size-4" />Manage Listing
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => setReviewingDeviceId(device.id)}>
                                View Details
                              </Button>
                            )}
                            {(internalStatus === "REFURBISHED" || device.isListedForSale) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-xs"
                                onClick={() => setTransferDeviceId(device.id)}
                              >
                                <UserCheck className="size-3.5" />
                                Transfer to Buyer
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {sortedPayoutDevices.length > PAGE_SIZE && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground">
                <div>
                  Showing <span className="font-medium text-foreground">{(safePayoutPage - 1) * PAGE_SIZE + 1}</span>–
                  <span className="font-medium text-foreground">{Math.min(safePayoutPage * PAGE_SIZE, sortedPayoutDevices.length)}</span> of{" "}
                  <span className="font-medium text-foreground">{sortedPayoutDevices.length}</span> devices
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    disabled={safePayoutPage <= 1}
                    onClick={() => setPayoutPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  {Array.from({ length: totalPayoutPages }, (_, i) => i + 1).map((num) => (
                    <Button
                      key={num}
                      variant={num === safePayoutPage ? "default" : "outline"}
                      size="sm"
                      className="size-8 p-0"
                      onClick={() => setPayoutPage(num)}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    disabled={safePayoutPage >= totalPayoutPages}
                    onClick={() => setPayoutPage((p) => Math.min(totalPayoutPages, p + 1))}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="px-5 py-6 text-sm text-muted-foreground">No trade-in payouts have been initiated yet.</p>
        )}
      </section>

      {/* Technician Approvals */}
      <section className="mt-6 rounded-md border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold">Technician approvals</h2>
            <p className="mt-1 text-sm text-muted-foreground">{pending.length} waiting for review</p>
          </div>
        </div>
        {pending.length ? (
          <div className="divide-y divide-border">
            {pending.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => rejectTechnician(user.id)}>
                    <CircleAlert className="size-4" />Reject
                  </Button>
                  <Button size="sm" onClick={() => approveTechnician(user.id)}>
                    <Check className="size-4" />Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-6 text-sm text-muted-foreground">No technician requests need review.</p>
        )}
      </section>

      {/* Platform Devices & Listings */}
      <section className="mt-6 rounded-md border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Platform devices & listings</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            All registered devices, inspection outcomes, marketplace status, payout tracking, and verified photos.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-[11px] font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Device</th>
                <th className="px-4 py-3">Internal Status</th>
                <th className="px-4 py-3">Marketplace</th>
                <th className="px-4 py-3">Payout Status</th>
                <th className="px-4 py-3">Photos</th>
                <th className="px-5 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {devices.map((device) => {
                const internalStatus = device.internalStatus || "PENDING_INSPECTION";
                const payoutStatus = device.payoutStatus || "PENDING_INSPECTION";
                const ownerPhotos = device.ownerPhotos ?? [];
                const listingPhotos = device.listingPhotos ?? [];

                return (
                  <tr key={device.id} className="hover:bg-muted/40">
                    <td className="px-5 py-3.5">
                      <div className="font-medium">{device.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{device.passportId}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className={`text-xs font-medium ${getInternalStatusStyle(internalStatus)}`}>
                        {internalStatus.replaceAll("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      {device.isListedForSale ? (
                        <Badge variant="outline" className="gap-1 border-primary/50 bg-primary/10 text-primary">
                          <Store className="size-3" />
                          Listed (₹{(device.listingPrice ?? 0).toLocaleString("en-IN")})
                        </Badge>
                      ) : internalStatus === "REFURBISHED" ? (
                        <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                          Ready to List
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className={`text-xs font-medium ${getPayoutStatusStyle(payoutStatus)}`}>
                        {payoutStatus.replaceAll("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Owner: {ownerPhotos.length}</span>
                        <span>·</span>
                        <span>Listing: {listingPhotos.length}</span>
                        {(ownerPhotos.length > 0 || listingPhotos.length > 0) && (
                          <div className="flex items-center gap-1">
                            {ownerPhotos.slice(0, 2).map((src, idx) => (
                              <img key={`owner-${idx}`} src={src} alt="Owner intake" className="size-6 rounded border border-border object-cover" />
                            ))}
                            {listingPhotos.slice(0, 2).map((src, idx) => (
                              <img key={`listing-${idx}`} src={src} alt="Listing" className="size-6 rounded border border-primary/40 object-cover" />
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(device.internalStatus === "REFURBISHED" || device.isListedForSale) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs"
                            onClick={() => setTransferDeviceId(device.id)}
                          >
                            <UserCheck className="size-3.5" />
                            Transfer to Buyer
                          </Button>
                        )}
                        <Link to="/devices/$id" params={{ id: device.id }} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                          View <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {reviewingDevice && (
        <AdminPayoutReviewModal
          open={!!reviewingDevice}
          device={reviewingDevice}
          onClose={() => setReviewingDeviceId(null)}
          onApproved={() => setReviewingDeviceId(null)}
        />
      )}

      {transferTargetDevice && (
        <TransferModal
          open={!!transferTargetDevice}
          device={transferTargetDevice}
          onOpenChange={(open) => {
            if (!open) setTransferDeviceId(null);
          }}
          onComplete={() => setTransferDeviceId(null)}
        />
      )}
    </AppShell>
  );
}
