import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Plus,
  Recycle,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import { formatDate } from "@/components/passport-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import type { DevicePassport, RepairInput } from "@/types/passport";
import { calculateAssessment } from "@/utils/scoringEngine";

const STANDARD_DAMAGES = [
  "Water/Liquid Damage",
  "Battery Swelling/Drain",
  "Screen Crack",
  "Port/Charging Issue",
  "Camera/Speaker Fault",
  "Body Dents/Scratches",
] as const;

interface InspectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: DevicePassport;
  onComplete: () => void;
}

export function InspectionModal({ open, onOpenChange, device, onComplete }: InspectionModalProps) {
  const { currentUser, completeInspection } = useApp();

  const [resolvedDamageIds, setResolvedDamageIds] = useState<string[]>([]);
  const [extraActiveDamages, setExtraActiveDamages] = useState<string[]>([]);
  const [selectedStandardDamage, setSelectedStandardDamage] = useState<string>("");
  const [customDamage, setCustomDamage] = useState("");

  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [cost, setCost] = useState("0");
  const [notes, setNotes] = useState("");

  const [listingPhotos, setListingPhotos] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<"REFURBISHED" | "RECYCLED" | null>(null);
  const [error, setError] = useState("");

  const isTechVerified = currentUser?.role === "TECHNICIAN" && currentUser.status === "ACTIVE";
  const initialDamages = device.activeDamages ?? [];
  const ownerPhotos = device.ownerPhotos ?? [];

  const projectedAssessment = useMemo(() => {
    const remainingDamages = initialDamages.filter((dmg) => !resolvedDamageIds.includes(dmg));
    return calculateAssessment({
      ...device,
      activeDamages: [...remainingDamages, ...extraActiveDamages],
    });
  }, [device, initialDamages, resolvedDamageIds, extraActiveDamages]);

  useEffect(() => {
    if (open) {
      setResolvedDamageIds([]);
      setExtraActiveDamages([]);
      setSelectedStandardDamage("");
      setCustomDamage("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      setCost("0");
      setNotes("");
      setListingPhotos([]);
      setOutcome(null);
      setError("");
    }
  }, [open, device.id]);

  function toggleResolvedDamage(dmg: string) {
    setResolvedDamageIds((prev) =>
      prev.includes(dmg) ? prev.filter((item) => item !== dmg) : [...prev, dmg],
    );
  }

  function addExtraDamage() {
    const toAdd = (selectedStandardDamage || customDamage).trim();
    if (!toAdd) return;
    if (
      initialDamages.includes(toAdd) ||
      extraActiveDamages.includes(toAdd)
    ) {
      setError(`Damage "${toAdd}" is already in the list.`);
      return;
    }
    setExtraActiveDamages((prev) => [...prev, toAdd]);
    setSelectedStandardDamage("");
    setCustomDamage("");
    setError("");
  }

  function removeExtraDamage(dmg: string) {
    setExtraActiveDamages((prev) => prev.filter((item) => item !== dmg));
  }

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    for (const file of fileList) {
      if (!file.type.startsWith("image/")) continue;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setListingPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setListingPhotos((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Repair description is required.");
      return;
    }
    if (!outcome) {
      setError("Please select a final outcome: Mark as REFURBISHED or Mark as RECYCLED.");
      return;
    }

    const repairRecord: RepairInput = {
      date,
      description: description.trim(),
      cost: Number(cost) || 0,
      affectedComponentIds: [],
      notes: notes.trim(),
      verified: isTechVerified,
    };

    try {
      completeInspection(device.id, {
        outcome,
        payoutAmount: null,
        resolvedDamageIds,
        extraActiveDamages,
        repairRecord,
        listingPhotos,
      });
      onOpenChange(false);
      onComplete();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to complete inspection.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="size-5 text-primary" />
            Technician Inspection & Repair
          </DialogTitle>
          <DialogDescription>
            Verify owner intake condition, log technical repair work, upload post-repair photos, and mark refurbished or recycled.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-1">
          {/* Section 1: Owner's Intake Info */}
          <section className="rounded-md border border-border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold">1. Owner&apos;s Intake Info</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Device</p>
                <p className="text-sm font-medium">{device.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Passport ID</p>
                <p className="font-mono text-sm font-medium">{device.passportId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registered</p>
                <p className="text-sm font-medium">{formatDate(device.createdAt)}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground">Known damages</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {initialDamages.length > 0 ? (
                  initialDamages.map((dmg) => (
                    <Badge
                      key={dmg}
                      variant="outline"
                      className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    >
                      {dmg}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No known damages reported.</span>
                )}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground">Prior history</p>
              <p className="mt-1 text-sm text-foreground">
                {device.priorHistory || "No prior history provided."}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground">Owner intake photos</p>
              {ownerPhotos.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {ownerPhotos.map((src, idx) => (
                    <a
                      key={`${src.slice(0, 32)}-${idx}`}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="overflow-hidden rounded-md border border-border bg-muted"
                    >
                      <img
                        src={src}
                        alt={`Owner intake photo ${idx + 1}`}
                        className="h-20 w-full object-cover transition-transform hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">No owner photos provided.</p>
              )}
            </div>
          </section>

          {/* Section 2: Damage Verification */}
          <section className="rounded-md border border-border p-4">
            <h3 className="text-sm font-semibold">2. Damage Verification</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Check off damages resolved during repair. Unchecked items continue to reduce the health score.
            </p>

            <div className="mt-3 space-y-2">
              {initialDamages.length > 0 ? (
                initialDamages.map((dmg) => {
                  const isResolved = resolvedDamageIds.includes(dmg);
                  return (
                    <label
                      key={dmg}
                      className="flex cursor-pointer items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isResolved}
                          onChange={() => toggleResolvedDamage(dmg)}
                          className="size-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className={isResolved ? "line-through text-muted-foreground" : "font-medium"}>
                          {dmg}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          isResolved
                            ? "border-success/40 bg-success/10 text-success-foreground"
                            : "border-warning/40 bg-warning/10 text-warning-foreground"
                        }
                      >
                        {isResolved ? "Repaired / Resolved" : "Active Damage"}
                      </Badge>
                    </label>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground">No reported damages from intake.</p>
              )}
            </div>

            {/* Additional damages discovered during inspection */}
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Discovered Additional Damages
              </p>
              {extraActiveDamages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {extraActiveDamages.map((dmg) => (
                    <Badge
                      key={dmg}
                      variant="outline"
                      className="gap-1 border-destructive/40 bg-destructive/10 text-destructive"
                    >
                      {dmg}
                      <button
                        type="button"
                        onClick={() => removeExtraDamage(dmg)}
                        className="ml-1 hover:text-foreground"
                        aria-label={`Remove ${dmg}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Select
                  value={selectedStandardDamage}
                  onValueChange={(val) => {
                    setSelectedStandardDamage(val);
                    setCustomDamage("");
                  }}
                >
                  <SelectTrigger className="w-[200px] bg-card text-xs">
                    <SelectValue placeholder="Standard damage..." />
                  </SelectTrigger>
                  <SelectContent>
                    {STANDARD_DAMAGES.map((dmg) => (
                      <SelectItem key={dmg} value={dmg} className="text-xs">
                        {dmg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={customDamage}
                  onChange={(e) => {
                    setCustomDamage(e.target.value);
                    setSelectedStandardDamage("");
                  }}
                  placeholder="Or custom fault..."
                  className="w-[180px] text-xs"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExtraDamage}
                  className="text-xs"
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>
            </div>
          </section>

          {/* Section 3: Repair Work Log */}
          <section className="rounded-md border border-border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">3. Repair Work Log</h3>
              <Badge
                variant="outline"
                className={
                  isTechVerified
                    ? "border-success/40 bg-success/10 text-success-foreground"
                    : "border-warning/40 bg-warning/10 text-warning-foreground"
                }
              >
                {isTechVerified ? "Technician Verified" : "Pending Approval"}
              </Badge>
            </div>

            <div className="mt-3 space-y-3">
              <label className="grid gap-1.5 text-sm font-medium">
                Repair Description *
                <Input
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Replaced cracked OLED display assembly and calibrated touch controller"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium">
                  Date
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-medium">
                  Repair Cost (₹)
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="Parts + labor cost in ₹"
                  />
                </label>
              </div>

              <label className="grid gap-1.5 text-sm font-medium">
                Diagnostic & Work Notes
                <Textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Diagnostic observations, parts replaced, thermal test results..."
                />
              </label>
            </div>
          </section>

          {/* Section 4: Post-Repair Photos */}
          <section className="rounded-md border border-border p-4">
            <div className="flex items-center gap-2">
              <Camera className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">4. Post-Repair Photos</h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload photos of the repaired device for Admin review and buyer listing.
            </p>

            <div className="mt-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-2.5 text-sm font-medium hover:bg-muted/60">
                <ImagePlus className="size-4 text-primary" />
                <span>Choose or capture photos</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            </div>

            {listingPhotos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {listingPhotos.map((src, idx) => (
                  <div key={`${src.slice(0, 32)}-${idx}`} className="group relative">
                    <img
                      src={src}
                      alt={`Post-repair photo ${idx + 1}`}
                      className="h-24 w-full rounded-md border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/90 text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                      aria-label={`Remove photo ${idx + 1}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 5: Final Outcome */}
          <section className="rounded-md border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">5. Final Outcome</h3>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Projected score: <strong className="text-foreground">{projectedAssessment.score}/100</strong> (Grade {projectedAssessment.grade})
              </span>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setOutcome("REFURBISHED")}
                className={`flex items-center justify-center gap-2.5 rounded-md border-2 p-4 text-sm font-semibold transition-colors ${
                  outcome === "REFURBISHED"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted/50"
                }`}
              >
                <CheckCircle2 className="size-5" />
                Mark as REFURBISHED
              </button>
              <button
                type="button"
                onClick={() => setOutcome("RECYCLED")}
                className={`flex items-center justify-center gap-2.5 rounded-md border-2 p-4 text-sm font-semibold transition-colors ${
                  outcome === "RECYCLED"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-card text-foreground hover:bg-muted/50"
                }`}
              >
                <Recycle className="size-5" />
                Mark as RECYCLED
              </button>
            </div>

            <div className="mt-3.5 flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
              <Sparkles className="size-4 shrink-0 text-primary" />
              <span>
                Owner trade-in payout and public selling price will be reviewed and approved by the System Administrator based on your logged repair cost and final health score.
              </span>
            </div>
          </section>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!outcome}>
              Submit Technical Inspection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
