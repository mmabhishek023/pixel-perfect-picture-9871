import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  DollarSign,
  ImagePlus,
  IndianRupee,
  Info,
  Sparkles,
  Store,
  Tag,
  Wrench,
} from "lucide-react";
import { formatCurrency, GradeBadge, RecommendationBadge, ScoreRing } from "@/components/passport-ui";
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
import {
  calculatePricing,
  calculateSellingPriceFromPayout,
  calculateTotalRepairCost,
} from "@/utils/pricingEngine";

export interface AdminPayoutReviewModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  device: DevicePassport;
  onComplete?: () => void;
  onApproved?: () => void;
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

export function AdminPayoutReviewModal({
  open,
  onOpenChange,
  onClose,
  device,
  onComplete,
  onApproved,
}: AdminPayoutReviewModalProps) {
  const { adminApprovePayoutAndListing } = useApp();
  const assessment = calculateAssessment(device);
  const totalRepairCost = calculateTotalRepairCost(device);
  const pricing = useMemo(
    () => calculatePricing(device, assessment.score),
    [device, assessment.score],
  );

  const [payoutInput, setPayoutInput] = useState("");
  const [listForSale, setListForSale] = useState(true);
  const [sellingPriceInput, setSellingPriceInput] = useState("");
  const [priceManuallyEdited, setPriceManuallyEdited] = useState(false);
  const [condition, setCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const isRefurbished = device.internalStatus === "REFURBISHED";
  const isRecycled = device.internalStatus === "RECYCLED";

  useEffect(() => {
    if (open) {
      setError("");
      const initialPayout =
        device.payoutAmount !== null && device.payoutAmount !== undefined && device.payoutAmount > 0
          ? device.payoutAmount
          : pricing.suggestedPayout;

      setPayoutInput(String(initialPayout));
      setListForSale(device.isListedForSale || isRefurbished);

      const initialSellingPrice =
        device.listingPrice !== null && device.listingPrice !== undefined && device.listingPrice > 0
          ? device.listingPrice
          : calculateSellingPriceFromPayout(initialPayout, totalRepairCost);

      setSellingPriceInput(String(initialSellingPrice));
      setPriceManuallyEdited(Boolean(device.listingPrice));

      setCondition(device.listingCondition || getDefaultCondition(assessment.grade));
      setNotes(
        device.listingNotes ||
          `Certified Grade ${assessment.grade} refurbished device. Passed technician testing and verified repair diagnostics.`,
      );
    }
  }, [open, device, assessment.grade, pricing.suggestedPayout, totalRepairCost, isRefurbished]);

  // When admin changes payout amount, auto-calculate suggested selling price unless manually overridden
  function handlePayoutChange(value: string) {
    setPayoutInput(value);
    const num = Number(value);
    if (!priceManuallyEdited && Number.isFinite(num) && num > 0) {
      setSellingPriceInput(String(calculateSellingPriceFromPayout(num, totalRepairCost)));
    }
  }

  function handleSellingPriceChange(value: string) {
    setSellingPriceInput(value);
    setPriceManuallyEdited(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const payoutAmount = Number(payoutInput);
    if (!Number.isFinite(payoutAmount) || payoutAmount <= 0) {
      setError("Please enter a valid owner payout amount greater than ₹0.");
      return;
    }

    let finalSellingPrice: number | null = null;
    if (isRefurbished && listForSale) {
      finalSellingPrice = Number(sellingPriceInput);
      if (!Number.isFinite(finalSellingPrice) || finalSellingPrice <= 0) {
        setError("Please enter a valid selling price greater than ₹0 for the public catalog.");
        return;
      }
      if (finalSellingPrice < payoutAmount + totalRepairCost) {
        setError(
          `Selling price (₹${finalSellingPrice.toLocaleString("en-IN")}) should cover owner payout + repair cost (₹${(payoutAmount + totalRepairCost).toLocaleString("en-IN")}).`,
        );
        return;
      }
    }

    try {
      adminApprovePayoutAndListing(device.id, {
        payoutAmount,
        isListedForSale: isRefurbished ? listForSale : false,
        listingPrice: finalSellingPrice,
        listingCondition: isRefurbished && listForSale ? condition.trim() : null,
        listingNotes: isRefurbished && listForSale ? notes.trim() : null,
      });
      onOpenChange?.(false);
      onClose?.();
      onComplete?.();
      onApproved?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to approve payout and listing.");
    }
  }

  const latestRepair = device.repairs && device.repairs.length > 0 ? device.repairs[0] : null;

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Admin Review: Trade-In Payout & Marketplace Listing
          </DialogTitle>
          <DialogDescription>
            Verify technician repair work, approve owner trade-in payout, and configure public marketplace pricing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Section 1: Device & Health Summary */}
          <section className="rounded-md border border-border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">{device.name}</h3>
                <p className="font-mono text-xs text-muted-foreground">{device.passportId} · {device.brand}</p>
              </div>
              <div className="flex items-center gap-2">
                <ScoreRing assessment={assessment} size="small" />
                <GradeBadge grade={assessment.grade} />
                <Badge
                  variant="outline"
                  className={
                    isRefurbished
                      ? "border-success/50 bg-success/10 text-success-foreground font-semibold"
                      : "border-recycle/40 bg-recycle/10 text-recycle font-semibold"
                  }
                >
                  {device.internalStatus}
                </Badge>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
              <div>
                <span className="text-muted-foreground">Specifications:</span>
                <p className="font-medium mt-0.5">{device.ramGb ?? "—"}GB RAM · {device.storageGb ?? "—"}GB · {device.os || "OS"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Logged Repair Cost:</span>
                <p className="font-bold text-foreground mt-0.5">₹{totalRepairCost.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Latest Repair:</span>
                <p className="font-medium truncate mt-0.5">{latestRepair?.description || "No repair details"}</p>
              </div>
            </div>

            {/* Photos preview comparison */}
            <div className="mt-3.5 border-t border-border pt-3">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Verified Post-Repair Photos ({device.listingPhotos?.length ?? 0})</span>
                <span>Intake Photos ({device.ownerPhotos?.length ?? 0})</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(device.listingPhotos ?? []).slice(0, 3).map((src, idx) => (
                  <img
                    key={`listing-preview-${idx}`}
                    src={src}
                    alt="Post-repair"
                    className="size-14 rounded-md border border-primary/40 object-cover"
                    title="Technician Post-Repair Photo"
                  />
                ))}
                {(device.ownerPhotos ?? []).slice(0, 2).map((src, idx) => (
                  <img
                    key={`owner-preview-${idx}`}
                    src={src}
                    alt="Owner intake"
                    className="size-14 rounded-md border border-border opacity-70 object-cover"
                    title="Owner Intake Photo"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Transparent Payout Calculation */}
          <section className="rounded-md border border-border p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Owner Trade-In Payout</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                Suggested: <strong className="text-foreground">₹{pricing.suggestedPayout.toLocaleString("en-IN")}</strong>
              </span>
            </div>

            {/* Formula breakdown */}
            <div className="mt-2.5 rounded-md bg-muted/40 p-3 text-xs space-y-1.5 text-muted-foreground">
              <div className="flex justify-between">
                <span>Base Device Value ({device.deviceType}):</span>
                <span className="font-medium text-foreground">₹{pricing.effectiveBaseValue.toLocaleString("en-IN")}</span>
              </div>
              {isRefurbished ? (
                <>
                  <div className="flex justify-between">
                    <span>Health Score Factor ({assessment.score}%):</span>
                    <span className="font-medium text-foreground">
                      ₹{Math.round(pricing.effectiveBaseValue * pricing.healthMultiplier).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Less Technician Repair Cost:</span>
                    <span>−₹{totalRepairCost.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-muted-foreground">
                  <span>Recycled Salvage Value (15%):</span>
                  <span className="font-medium text-foreground">₹{pricing.suggestedPayout.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            <div className="mt-3.5">
              <label htmlFor="admin-payout-input" className="block text-xs font-semibold text-foreground">
                Approved Owner Payout (₹) *
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="admin-payout-input"
                  type="number"
                  min="0"
                  step="1"
                  value={payoutInput}
                  onChange={(e) => handlePayoutChange(e.target.value)}
                  className="pl-7 text-sm font-bold tabular-nums"
                  required
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Disbursed to owner&apos;s account upon approval.
              </p>
            </div>
          </section>

          {/* Section 3: Marketplace Listing (Only for Refurbished) */}
          {isRefurbished && (
            <section className="rounded-md border border-primary/30 bg-primary/[0.02] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Viewer Marketplace Listing</h3>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={listForSale}
                    onChange={(e) => setListForSale(e.target.checked)}
                    className="size-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>List for sale immediately</span>
                </label>
              </div>

              {listForSale ? (
                <div className="mt-3.5 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="admin-selling-price" className="block text-xs font-semibold text-foreground">
                        Public Selling Price (₹) *
                      </label>
                      <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          id="admin-selling-price"
                          type="number"
                          min="0"
                          step="1"
                          value={sellingPriceInput}
                          onChange={(e) => handleSellingPriceChange(e.target.value)}
                          className="pl-7 text-sm font-bold tabular-nums"
                          required
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Covers Payout (₹{Number(payoutInput) || 0}) + Repair (₹{totalRepairCost}) + 20% margin.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="admin-listing-condition" className="block text-xs font-semibold text-foreground">
                        Listing Condition
                      </label>
                      <div className="mt-1.5">
                        <Select value={condition} onValueChange={setCondition}>
                          <SelectTrigger id="admin-listing-condition" className="bg-card text-xs">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITION_PRESETS.map((item) => (
                              <SelectItem key={item} value={item} className="text-xs">
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="admin-listing-notes" className="block text-xs font-semibold text-foreground">
                      Buyer-Facing Summary & Warranty Notes
                    </label>
                    <Textarea
                      id="admin-listing-notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Verified condition summary visible to buyers..."
                      className="mt-1.5 bg-card text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-2.5 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                  Device payout will be approved as PAID, but the item will remain unlisted from the public catalog. You can list it anytime later.
                </div>
              )}
            </section>
          )}

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Check className="size-4" />
              {isRefurbished
                ? listForSale
                  ? "Approve Payout & List for Sale"
                  : "Approve Payout (Unlisted)"
                : "Approve Payout (Recycled)"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
