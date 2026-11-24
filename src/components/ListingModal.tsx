import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Camera,
  CheckCircle2,
  DollarSign,
  ImagePlus,
  Store,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import { formatCurrency } from "@/components/passport-ui";
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
import type { DevicePassport, Grade } from "@/types/passport";
import { calculateAssessment } from "@/utils/scoringEngine";

interface ListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: DevicePassport;
  onComplete?: () => void;
}

const CONDITION_PRESETS = [
  "Like New (Grade A)",
  "Good (Grade B)",
  "Fair (Grade C)",
  "Needs Attention (Grade D)",
] as const;

function getDefaultCondition(grade: Grade): string {
  switch (grade) {
    case "A":
      return "Like New (Grade A)";
    case "B":
      return "Good (Grade B)";
    case "C":
      return "Fair (Grade C)";
    case "D":
      return "Needs Attention (Grade D)";
  }
}

export function ListingModal({ open, onOpenChange, device, onComplete }: ListingModalProps) {
  const { listDeviceForSale, unlistDevice } = useApp();
  const assessment = calculateAssessment(device);

  const [priceInput, setPriceInput] = useState("");
  const [condition, setCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setError("");
      setCondition(device.listingCondition || getDefaultCondition(assessment.grade));
      setPriceInput(
        device.listingPrice !== null && device.listingPrice !== undefined
          ? String(device.listingPrice)
          : String(Math.round((device.payoutAmount ?? 15000) * 1.25)),
      );
      setNotes(
        device.listingNotes ||
          `Verified Grade ${assessment.grade} refurbished device. Passed technician testing and component diagnostics.`,
      );
      setPhotos(device.listingPhotos ?? []);
    }
  }, [open, device, assessment.grade]);

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
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const price = Number(priceInput);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid selling price greater than ₹0.");
      return;
    }
    if (!condition.trim()) {
      setError("Please specify the listing condition.");
      return;
    }

    try {
      listDeviceForSale(device.id, {
        price,
        condition: condition.trim(),
        notes: notes.trim(),
        listingPhotos: photos,
      });
      onOpenChange(false);
      onComplete?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to list device for sale.");
    }
  }

  function handleUnlist() {
    setError("");
    try {
      unlistDevice(device.id);
      onOpenChange(false);
      onComplete?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to unlist device.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="size-5 text-primary" />
            {device.isListedForSale ? "Edit Marketplace Listing" : "List Refurbished Device for Sale"}
          </DialogTitle>
          <DialogDescription>
            Publish this verified device to the public Viewer marketplace with buyer pricing and post-repair photos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePublish} className="space-y-5 pt-1">
          {/* Device summary banner */}
          <div className="rounded-md border border-border bg-muted/30 p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{device.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{device.passportId}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="border-success/50 bg-success/10 text-success-foreground">
                  Grade {assessment.grade} · {assessment.score}/100
                </Badge>
                {device.payoutAmount !== null && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Payout cost: {formatCurrency(device.payoutAmount)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Condition & Price */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="listing-condition" className="block text-xs font-medium text-foreground">
                Listing Condition
              </label>
              <div className="mt-1.5 space-y-2">
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger id="listing-condition" className="bg-card">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_PRESETS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="Or type custom condition"
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="listing-price" className="block text-xs font-medium text-foreground">
                Selling Price (₹)
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="listing-price"
                  type="number"
                  min="0"
                  step="1"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="e.g. 24999"
                  className="pl-7 tabular-nums"
                  required
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Visible to buyers in the public catalog.
              </p>
            </div>
          </div>

          {/* Buyer-Facing Description */}
          <div>
            <label htmlFor="listing-notes" className="block text-xs font-medium text-foreground">
              Buyer-Facing Description & Notes
            </label>
            <Textarea
              id="listing-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Highlight cosmetic condition, warranty, upgrades, or included accessories..."
              rows={3}
              className="mt-1.5 bg-card text-xs"
            />
          </div>

          {/* Post-Repair Listing Photos */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Listing Photos ({photos.length})
              </label>
              <span className="text-[11px] text-muted-foreground">
                Buyers only see these verified photos
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((src, index) => (
                <div key={index} className="group relative aspect-video overflow-hidden rounded-md border border-border bg-muted">
                  <img src={src} alt={`Listing photo ${index + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute right-1 top-1 rounded bg-background/80 p-1 text-destructive opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                    title="Remove photo"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}

              <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-muted-foreground hover:border-primary hover:text-primary">
                <ImagePlus className="size-5" />
                <span className="mt-1 text-[11px]">Add photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
            {device.isListedForSale ? (
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:bg-destructive/10"
                onClick={handleUnlist}
              >
                <XCircle className="size-4" />
                Unlist from Store
              </Button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Tag className="size-4" />
                {device.isListedForSale ? "Update Listing" : "Publish Listing"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
