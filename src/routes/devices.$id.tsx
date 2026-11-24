import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Battery, Check, ChevronDown, ClipboardPlus, Copy, Cpu, FilePlus2, History, ImagePlus, Pencil, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { displayName, formatCurrency, formatDate, GradeBadge, RecommendationBadge, ScoreRing, StatusBadge } from "@/components/passport-ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useApp, useAppApi } from "@/context/AppContext";
import type { ComponentCondition, ComponentInput, ComponentOrigin, ComponentType, DevicePassport, DeviceStatus, RepairInput } from "@/types/passport";
import { calculateAssessment } from "@/utils/scoringEngine";

export const Route = createFileRoute("/devices/$id")({
  component: DeviceDetail,
  head: () => ({ meta: [
    { title: "Device Passport · ReTech Passport" },
    { name: "description", content: "Explore a device's identity, condition, repairs, and lifecycle assessment." },
    { property: "og:title", content: "Device Passport · ReTech Passport" },
    { property: "og:description", content: "Explore a device's identity, condition, repairs, and lifecycle assessment." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const componentTypes: ComponentType[] = ["BATTERY", "RAM", "SSD", "DISPLAY", "MOTHERBOARD", "CAMERA", "PORT", "OTHER"];
const deviceStatuses: DeviceStatus[] = ["REGISTERED", "IN_USE", "UNDER_REPAIR", "FOR_SALE", "REFURBISHING", "RECYCLED"];

function DeviceDetail() {
  const { id } = Route.useParams();
  const { getDevice, currentUser, updateDevice, transferDevice } = useApp();
  const device = getDevice(id);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editForm, setEditForm] = useState({ os: device?.os ?? "", ramGb: device?.ramGb ?? null, storageGb: device?.storageGb ?? null, processor: device?.processor ?? "" });
  const isOwner = device?.ownerId === currentUser?.id && currentUser?.role === "OWNER";

  async function shareLink() {
    if (!device) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${device.qrToken}`);
      setMessage("Public link copied.");
    } catch {
      setError("Copy is unavailable in this browser.");
    }
  }

  function updateStatus(value: string) {
    if (!device) return;
    setError("");
    try {
      updateDevice(device.id, { status: value as DeviceStatus });
      setMessage("Lifecycle status updated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update status.");
    }
  }

  function submitTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!device) return;
    setError("");
    try {
      transferDevice(device.id, recipientEmail.trim());
      setTransferOpen(false);
      setRecipientEmail("");
      setMessage("Ownership transferred. The previous QR token is now revoked.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Transfer failed.");
    }
  }

  function saveSpecs(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!device) return;
    try {
      updateDevice(device.id, editForm);
      setEditOpen(false);
      setMessage("Device specifications updated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save specifications.");
    }
  }

  if (!device) {
    return <AppShell title="Passport unavailable"><div className="max-w-lg rounded-md border border-border bg-card p-6"><h2 className="font-semibold">This device passport could not be found.</h2><Link to="/" className="mt-4 inline-flex"><Button variant="outline"><ArrowLeft className="size-4" />Back to devices</Button></Link></div></AppShell>;
  }

  const assessment = calculateAssessment(device);
  const ownerName = useMemo(() => getDevice(device.id) ? "Current owner" : "", [getDevice, device.id]);

  return (
    <AppShell
      title={device.name}
      subtitle={`${device.brand} · ${device.deviceType.toLowerCase()} · ${device.passportId}`}
      actions={
        <>
          <Link to="/"><Button variant="outline" size="sm"><ArrowLeft className="size-4" /><span className="hidden sm:inline">My devices</span></Button></Link>
          <Link to="/devices/$id/qr" params={{ id: device.id }}><Button variant="outline" size="sm"><ImagePlus className="size-4" />QR code</Button></Link>
          <Button variant="outline" size="sm" onClick={() => void shareLink()}><Copy className="size-4" /><span className="hidden sm:inline">Share link</span></Button>
          {isOwner && <Button size="sm" onClick={() => { setError(""); setTransferOpen(true); }}>Transfer</Button>}
        </>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <GradeBadge grade={assessment.grade} />
        <RecommendationBadge recommendation={assessment.recommendation} />
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">Lifecycle status</span>
          {device.status === "RECYCLED" ? <StatusBadge status={device.status} /> : <Select value={device.status} onValueChange={updateStatus}><SelectTrigger className="h-9 w-[162px] bg-card" aria-label="Lifecycle status"><SelectValue /></SelectTrigger><SelectContent>{deviceStatuses.map((status) => <SelectItem key={status} value={status}>{status.replaceAll("_", " ")}</SelectItem>)}</SelectContent></Select>}
        </div>
      </div>
      {(error || message) && <p role={error ? "alert" : "status"} className={`mb-5 rounded-md border px-3 py-2 text-sm ${error ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-success/40 bg-success text-success-foreground"}`}>{error || message}</p>}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-11 w-full justify-start overflow-x-auto rounded-md bg-transparent p-0 sm:w-auto">
          <TabsTrigger value="overview" className="h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Overview</TabsTrigger>
          <TabsTrigger value="components" className="h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Components <span className="ml-1 text-xs text-muted-foreground">{device.components.length}</span></TabsTrigger>
          <TabsTrigger value="repairs" className="h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Repairs <span className="ml-1 text-xs text-muted-foreground">{device.repairs.length}</span></TabsTrigger>
          <TabsTrigger value="health" className="h-10 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">Health report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-5">
              <section className="rounded-md border border-border bg-card p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-semibold">Device specifications</h2><p className="mt-1 text-sm text-muted-foreground">Core identity and configuration</p></div><Button variant="outline" size="sm" onClick={() => setEditOpen(true)} disabled={device.status === "RECYCLED"}><Pencil className="size-4" />Edit</Button></div>
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Spec label="Device type" value={displayName(device.deviceType)} />
                  <Spec label="Serial number / IMEI" value={device.serial} mono />
                  <Spec label="Purchase date" value={formatDate(device.purchaseDate)} />
                  <Spec label="Device age" value={`${assessment.fullYearsSincePurchase} full ${assessment.fullYearsSincePurchase === 1 ? "year" : "years"}`} />
                  <Spec label="Operating system" value={device.os || "Not provided"} />
                  <Spec label="Processor" value={device.processor || "Not provided"} />
                  <Spec label="Memory" value={device.ramGb ? `${device.ramGb} GB RAM` : "Not provided"} />
                  <Spec label="Storage" value={device.storageGb ? `${device.storageGb} GB` : "Not provided"} />
                </div>
              </section>
              <section className="rounded-md border border-border bg-card p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2"><History className="size-4 text-primary" /><h2 className="font-semibold">Passport audit trail</h2></div>
                {device.audit.length ? <div className="space-y-4">{device.audit.map((entry) => <div key={entry.id} className="flex gap-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-primary" /><div className="min-w-0 flex-1"><p className="text-sm font-medium">{entry.action}</p><p className="mt-1 text-xs text-muted-foreground">{entry.actor} · {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.date))}</p></div></div>)}</div> : <p className="text-sm text-muted-foreground">No edits or transfers have been recorded yet.</p>}
              </section>
            </div>
            <div className="space-y-5">
              <section className="flex items-center gap-5 rounded-md border border-border bg-card p-5 sm:p-6"><ScoreRing assessment={assessment} /><div className="min-w-0"><p className="text-sm text-muted-foreground">Current health</p><p className="mt-1 flex items-center gap-2 text-xl font-bold">Grade {assessment.grade}<GradeBadge grade={assessment.grade} /></p><p className="mt-2 text-sm text-muted-foreground">{assessment.recommendation === "REPAIR" ? "Repair the identified issue before resale." : assessment.recommendation === "RECYCLE" ? "Consider responsible recycling." : assessment.recommendation === "REFURBISH" ? "A refurbishment review is recommended." : "Suitable for continued use."}</p></div></section>
              <section className="rounded-md border border-border bg-card p-5 sm:p-6"><div className="flex items-center gap-2"><ClipboardPlus className="size-4 text-primary" /><h2 className="font-semibold">Passport details</h2></div><div className="mt-4 grid gap-3"><Spec label="Passport ID" value={device.passportId} mono /><Spec label="Repair records" value={String(device.repairs.length)} /><Spec label="Owner account" value={ownerName} /></div><Link to="/devices/$id/qr" params={{ id: device.id }} className="mt-5 inline-flex"><Button variant="outline" size="sm">View QR code <ChevronDown className="size-4 -rotate-90" /></Button></Link></section>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="components" className="mt-6">
          <ComponentsPanel deviceId={device.id} components={device.components} readOnly={device.status === "RECYCLED"} onError={setError} onMessage={setMessage} />
        </TabsContent>

        <TabsContent value="repairs" className="mt-6">
          <RepairsPanel device={device} readOnly={device.status === "RECYCLED"} onError={setError} onMessage={setMessage} />
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <HealthReport assessment={assessment} />
        </TabsContent>
      </Tabs>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Transfer ownership</DialogTitle><DialogDescription>Choose an active ReTech Passport account to receive this device passport.</DialogDescription></DialogHeader>
          <form onSubmit={submitTransfer} className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">Recipient email<Input type="email" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} placeholder="recipient@example.org" required /></label>
            <div className="flex gap-3 rounded-md border border-warning/60 bg-warning p-3 text-sm text-warning-foreground"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><p>The QR code will be regenerated. The old printed code will stop working immediately.</p></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setTransferOpen(false)}>Cancel</Button><Button type="submit">Transfer ownership</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit specifications</DialogTitle><DialogDescription>Updates are appended to the passport audit trail.</DialogDescription></DialogHeader>
          <form onSubmit={saveSpecs} className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-medium">Operating system<Input value={editForm.os} onChange={(event) => setEditForm((previous) => ({ ...previous, os: event.target.value }))} /></label>
            <div className="grid grid-cols-2 gap-3"><label className="grid gap-1.5 text-sm font-medium">RAM (GB)<Input type="number" min="0" value={editForm.ramGb ?? ""} onChange={(event) => setEditForm((previous) => ({ ...previous, ramGb: event.target.value ? Number(event.target.value) : null }))} /></label><label className="grid gap-1.5 text-sm font-medium">Storage (GB)<Input type="number" min="0" value={editForm.storageGb ?? ""} onChange={(event) => setEditForm((previous) => ({ ...previous, storageGb: event.target.value ? Number(event.target.value) : null }))} /></label></div>
            <label className="grid gap-1.5 text-sm font-medium">Processor<Input value={editForm.processor} onChange={(event) => setEditForm((previous) => ({ ...previous, processor: event.target.value }))} /></label>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button type="submit">Save changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Spec({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className={`mt-1 break-words text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

function ComponentsPanel({ deviceId, components, readOnly, onError, onMessage }: { deviceId: string; components: DevicePassport["components"]; readOnly: boolean; onError: (value: string) => void; onMessage: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const active = components.filter((component) => component.active);
  const inactive = components.filter((component) => !component.active);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-semibold">Component inventory</h2><p className="mt-1 text-sm text-muted-foreground">{active.length} active components · replaced items remain in the record</p></div><Button onClick={() => setOpen(true)} disabled={readOnly}><FilePlus2 className="size-4" />Add component</Button></div>
      {active.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{active.map((item) => <ComponentCard key={item.id} item={item} />)}</div> : <p className="rounded-md border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">No component inventory has been added.</p>}
      {inactive.length > 0 && <section><h3 className="mb-3 text-sm font-semibold text-muted-foreground">Previous parts</h3><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{inactive.map((item) => <ComponentCard key={item.id} item={item} previous />)}</div></section>}
      <AddComponentDialog open={open} onOpenChange={setOpen} deviceId={deviceId} onError={onError} onMessage={onMessage} />
    </div>
  );
}

function ComponentCard({ item, previous = false }: { item: DevicePassport["components"][number]; previous?: boolean }) {
  const conditionClass = item.condition === "GOOD" ? "text-grade-a" : item.condition === "FAIR" ? "text-grade-c" : "text-grade-d";
  return <article className={`rounded-md border border-border bg-card p-4 ${previous ? "opacity-70" : ""}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary text-primary">{item.type === "BATTERY" ? <Battery className="size-4" /> : <Cpu className="size-4" />}</span><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{displayName(item.type)}</h3><p className="mt-0.5 text-xs text-muted-foreground">{item.origin}</p></div></div><span className={`text-xs font-semibold ${conditionClass}`}>{item.condition}</span></div>
    {item.batteryHealth !== null && <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm"><span className="text-muted-foreground">Battery health</span><span className="font-semibold">{item.batteryHealth}%</span></div>}
    {item.details && <p className="mt-2 text-xs text-muted-foreground">{item.details}</p>}
    {previous && <p className="mt-3 text-[11px] text-muted-foreground">Retained in passport history</p>}
  </article>;
}

function AddComponentDialog({ open, onOpenChange, deviceId, onError, onMessage }: { open: boolean; onOpenChange: (open: boolean) => void; deviceId: string; onError: (value: string) => void; onMessage: (value: string) => void }) {
  const { addComponent } = useApp();
  const api = useAppApi();
  const [type, setType] = useState<ComponentType>("BATTERY");
  const [condition, setCondition] = useState<ComponentCondition>("GOOD");
  const [origin, setOrigin] = useState<ComponentOrigin>("ORIGINAL");
  const [batteryHealth, setBatteryHealth] = useState("100");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<Awaited<ReturnType<typeof api.identifyComponent>> | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [lowConfidence, setLowConfidence] = useState(false);
  const [aiDecision, setAiDecision] = useState<"pending" | "confirmed" | "changed" | "none">("none");
  const [formError, setFormError] = useState("");

  async function identify() {
    if (!file) { setFormError("Choose a JPEG or PNG image first."); return; }
    setAiBusy(true);
    setFormError("");
    setPrediction(null);
    setAiDecision("pending");
    try {
      const result = await api.identifyComponent(file, lowConfidence);
      setPrediction(result);
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : "Image identification failed.");
      setAiDecision("none");
    } finally {
      setAiBusy(false);
    }
  }

  function applyPrediction() {
    const predicted = prediction?.predictions[0];
    if (!predicted) return;
    if (prediction.reliable) {
      setType(predicted.type);
      setAiDecision("confirmed");
    } else {
      setAiDecision("changed");
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (prediction && aiDecision === "pending") { setFormError("Confirm the advisory result or choose a component manually before saving."); return; }
    const batteryValue = type === "BATTERY" ? Number(batteryHealth) : null;
    if (batteryValue !== null && (!Number.isFinite(batteryValue) || batteryValue < 0 || batteryValue > 100)) { setFormError("Battery health must be between 0 and 100."); return; }
    try {
      addComponent(deviceId, { type, condition, origin, batteryHealth: batteryValue, details });
      onMessage(`${displayName(type)} added. Health score updated.`);
      onError("");
      onOpenChange(false);
      setPrediction(null);
      setFile(null);
      setAiDecision("none");
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : "Could not add component.");
    }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
    <DialogHeader><DialogTitle>Add component</DialogTitle><DialogDescription>Record the installed part and its condition.</DialogDescription></DialogHeader>
    <form onSubmit={save} className="grid gap-4">
      <div className="rounded-md border border-warning/60 bg-warning p-3 text-sm text-warning-foreground">AI result is advisory and does not replace professional hardware inspection.</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField label="Component"><Select value={type} onValueChange={(value) => { setType(value as ComponentType); if (aiDecision === "pending") setAiDecision("changed"); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{componentTypes.map((option) => <SelectItem key={option} value={option}>{displayName(option)}</SelectItem>)}</SelectContent></Select></SelectField>
        <SelectField label="Condition"><Select value={condition} onValueChange={(value) => setCondition(value as ComponentCondition)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["GOOD", "FAIR", "POOR"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></SelectField>
        <SelectField label="Origin"><Select value={origin} onValueChange={(value) => setOrigin(value as ComponentOrigin)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ORIGINAL">Original</SelectItem><SelectItem value="REPLACED">Replaced</SelectItem></SelectContent></Select></SelectField>
        {type === "BATTERY" && <label className="grid gap-1.5 text-sm font-medium">Battery health (%)<Input type="number" min="0" max="100" value={batteryHealth} onChange={(event) => setBatteryHealth(event.target.value)} /></label>}
      </div>
      <label className="grid gap-1.5 text-sm font-medium">Details<Textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Capacity, replacement date, or notes" rows={2} /></label>
      <section className="rounded-md border border-border p-4">
        <div className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-primary" />Advisory identification</div>
        <label className="mt-3 grid gap-1.5 text-sm font-medium">Component photo<Input type="file" accept="image/jpeg,image/png" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setPrediction(null); setAiDecision("none"); setFormError(""); }} /></label>
        <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={lowConfidence} onChange={(event) => setLowConfidence(event.target.checked)} className="size-4 accent-primary" />Simulate unrelated / low-confidence image</label>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void identify()} disabled={aiBusy || !file}>{aiBusy ? "Identifying…" : "Identify component"}</Button>
        {prediction && <div className="mt-4 rounded-md bg-muted/70 p-3">
          {prediction.reliable ? <><p className="text-sm font-semibold">{prediction.predictions[0]?.label} · {prediction.predictions[0]?.confidence}% confidence</p><p className="mt-1 text-xs text-muted-foreground">Also considered: {prediction.predictions.slice(1).map((item) => `${item.label} ${item.confidence}%`).join(" · ")}</p></> : <p className="text-sm font-semibold text-warning-foreground">Component could not be identified reliably</p>}
          {aiDecision === "pending" ? <div className="mt-3 flex gap-2"><Button type="button" size="sm" onClick={applyPrediction} disabled={!prediction.reliable}><Check className="size-4" />Confirm label</Button><Button type="button" variant="outline" size="sm" onClick={() => setAiDecision("changed")}>Change / select manually</Button></div> : <p className="mt-2 text-xs font-medium text-primary">{aiDecision === "confirmed" ? "Label confirmed; you can continue." : "Manual selection is active."}</p>}
        </div>}
      </section>
      {formError && <p role="alert" className="text-sm font-medium text-destructive">{formError}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit">Add component</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}

function RepairsPanel({ device, readOnly, onError, onMessage }: { device: DevicePassport; readOnly: boolean; onError: (value: string) => void; onMessage: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [amendTarget, setAmendTarget] = useState<string | null>(null);
  const records = useMemo(() => [...device.repairs].sort((a, b) => b.date.localeCompare(a.date)), [device.repairs]);
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-semibold">Repair history</h2><p className="mt-1 text-sm text-muted-foreground">Original entries are append-only. Additional context is added as amendments.</p></div><Button onClick={() => setOpen(true)} disabled={readOnly}><Wrench className="size-4" />Add repair record</Button></div>
    {records.length ? <div className="relative ml-2 space-y-0 border-l border-border pl-6">{records.map((record, index) => <article key={record.id} className={`relative pb-7 ${index === records.length - 1 ? "pb-0" : ""}`}>
      <span className={`absolute -left-[31px] top-1 grid size-4 place-items-center rounded-full border-2 border-background ${record.verified ? "bg-grade-a" : "bg-muted-foreground"}`} />
      <div className="rounded-md border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-medium text-muted-foreground">{formatDate(record.date)}</p><h3 className="mt-1 font-semibold">{record.description}</h3></div><div className="flex flex-wrap items-center gap-2">{record.verified ? <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground"><ShieldCheck className="size-3.5" />Technician verified</span> : <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">Owner reported</span>}<span className="text-sm font-semibold">{formatCurrency(record.cost)}</span></div></div>
        <p className="mt-2 text-sm text-muted-foreground">Recorded by {record.technicianName}</p>
        {record.notes && <p className="mt-3 text-sm">{record.notes}</p>}
        {record.affectedComponentIds.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{record.affectedComponentIds.map((componentId) => { const part = device.components.find((item) => item.id === componentId); return <span key={componentId} className="rounded-sm bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{part ? displayName(part.type) : "Affected component"}</span>; })}</div>}
        {record.amendments.length > 0 && <div className="mt-4 border-t border-border pt-3"><p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Amendments</p><div className="space-y-2">{record.amendments.map((amendment) => <div key={amendment.id} className="rounded-sm bg-muted/60 p-2.5"><p className="text-sm">{amendment.note}</p><p className="mt-1 text-[11px] text-muted-foreground">{amendment.authorName} · {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(amendment.createdAt))}</p></div>)}</div></div>}
        <Button variant="ghost" size="sm" className="mt-3 h-8 px-2 text-muted-foreground" onClick={() => setAmendTarget(record.id)} disabled={readOnly}>Add amendment note</Button>
      </div>
    </article>)}</div> : <p className="rounded-md border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">No repair records yet.</p>}
    <AddRepairDialog open={open} onOpenChange={setOpen} device={device} onError={onError} onMessage={onMessage} />
    <AmendmentDialog open={amendTarget !== null} onOpenChange={(value) => { if (!value) setAmendTarget(null); }} deviceId={device.id} repairId={amendTarget ?? ""} onError={onError} onMessage={onMessage} />
  </div>;
}

function AddRepairDialog({ open, onOpenChange, device, onError, onMessage }: { open: boolean; onOpenChange: (open: boolean) => void; device: DevicePassport; onError: (value: string) => void; onMessage: (value: string) => void }) {
  const { addRepair, currentUser } = useApp();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("0");
  const [notes, setNotes] = useState("");
  const [affected, setAffected] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const verified = currentUser?.role === "TECHNICIAN" && currentUser.status === "ACTIVE";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const record: RepairInput = { date, description, cost: Number(cost) || 0, affectedComponentIds: affected, notes, verified };
    try {
      addRepair(device.id, record);
      onMessage("Repair record appended. Health score updated.");
      onError("");
      onOpenChange(false);
      setDescription(""); setCost("0"); setNotes(""); setAffected([]);
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : "Could not append repair record.");
    }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
    <DialogHeader><DialogTitle>Add repair record</DialogTitle><DialogDescription>This repair will be added to the permanent passport timeline.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm font-medium">Repair description<Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Battery replaced" required /></label>
      <div className="grid grid-cols-2 gap-3"><label className="grid gap-1.5 text-sm font-medium">Date<Input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><label className="grid gap-1.5 text-sm font-medium">Cost (INR)<Input type="number" min="0" value={cost} onChange={(event) => setCost(event.target.value)} /></label></div>
      <label className="grid gap-1.5 text-sm font-medium">Affected components <span className="text-xs font-normal text-muted-foreground">Selected parts are replaced and retained in the history.</span></label>
      <div className="grid max-h-36 gap-2 overflow-y-auto rounded-md border border-border p-3 sm:grid-cols-2">{device.components.filter((item) => item.active).map((item) => <label key={item.id} className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-primary" checked={affected.includes(item.id)} onChange={(event) => setAffected((previous) => event.target.checked ? [...previous, item.id] : previous.filter((id) => id !== item.id))} />{displayName(item.type)}<span className="text-xs text-muted-foreground">{item.condition}</span></label>)}</div>
      <label className="grid gap-1.5 text-sm font-medium">Notes<Textarea rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Service notes" /></label>
      <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${verified ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>{verified ? <ShieldCheck className="size-4" /> : <Wrench className="size-4" />}{verified ? "This record will receive a Technician Verified badge." : "This record will be marked Owner-Reported."}</div>
      {formError && <p role="alert" className="text-sm font-medium text-destructive">{formError}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit">Add repair record</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}

function AmendmentDialog({ open, onOpenChange, deviceId, repairId, onError, onMessage }: { open: boolean; onOpenChange: (open: boolean) => void; deviceId: string; repairId: string; onError: (value: string) => void; onMessage: (value: string) => void }) {
  const { amendRepair } = useApp();
  const [note, setNote] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      amendRepair(deviceId, repairId, note.trim());
      onError(""); onMessage("Amendment added without changing the original repair record."); onOpenChange(false); setNote("");
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Could not add amendment.");
    }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>
    <DialogHeader><DialogTitle>Add amendment note</DialogTitle><DialogDescription>The original repair details will remain unchanged.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="grid gap-4"><label className="grid gap-1.5 text-sm font-medium">Additional context<Textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} required placeholder="Add a dated note to this record" /></label><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit">Append note</Button></DialogFooter></form>
  </DialogContent></Dialog>;
}

function HealthReport({ assessment }: { assessment: ReturnType<typeof calculateAssessment> }) {
  const factors = [
    { label: "Device age", value: assessment.deductions.age, max: 30 },
    { label: "Repair count", value: assessment.deductions.repairs, max: 20 },
    { label: "Battery health", value: assessment.deductions.battery, max: 20 },
    { label: "Component condition", value: assessment.deductions.components, max: 20 },
    { label: "Critical replacement", value: assessment.deductions.critical, max: 10 },
  ];
  return <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
    <section className="flex flex-col items-center rounded-md border border-border bg-card p-6 text-center"><ScoreRing assessment={assessment} /><GradeBadge grade={assessment.grade} className="mt-4" /><h2 className="mt-3 text-xl font-bold">{assessment.score} / 100</h2><p className="mt-1 text-sm text-muted-foreground">Explainable health score</p><div className="mt-5"><RecommendationBadge recommendation={assessment.recommendation} /></div></section>
    <div className="space-y-5">
      <section className="rounded-md border border-border bg-card p-5 sm:p-6"><h2 className="font-semibold">Score deductions</h2><p className="mt-1 text-sm text-muted-foreground">Each factor is capped independently.</p><div className="mt-5 space-y-4">{factors.map((factor) => <div key={factor.label}><div className="mb-1.5 flex items-center justify-between gap-3 text-sm"><span className="font-medium">{factor.label}</span><span className="tabular-nums text-muted-foreground">−{factor.value} / {factor.max} pts</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.min(100, (factor.value / factor.max) * 100)}%` }} /></div></div>)}</div></section>
      <section className="rounded-md border border-border bg-card p-5 sm:p-6"><h2 className="font-semibold">Top reasons</h2><ol className="mt-3 space-y-2">{assessment.reasons.length ? assessment.reasons.map((reason, index) => <li key={reason} className="flex gap-3 text-sm"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">{index + 1}</span><span className="pt-0.5">{reason}</span></li>) : <li className="text-sm text-muted-foreground">No score deductions were recorded.</li>}</ol></section>
    </div>
    <p className="flex items-start gap-2 text-xs text-muted-foreground xl:col-span-2"><AlertTriangle className="mt-0.5 size-4 shrink-0" />This report is advisory and is not a substitute for professional hardware inspection.</p>
  </div>;
}

function SelectField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium">{label}{children}</label>;
}