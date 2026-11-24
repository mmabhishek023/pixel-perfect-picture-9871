import { useState, type FormEvent } from "react";
import { AlertTriangle, ArrowRight, Check, UserCheck } from "lucide-react";
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
import { useApp } from "@/context/AppContext";
import type { DevicePassport } from "@/types/passport";

export interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: DevicePassport;
  onComplete?: () => void;
}

export function TransferModal({
  open,
  onOpenChange,
  device,
  onComplete,
}: TransferModalProps) {
  const { transferDevice, state } = useApp();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeUsers = (state.users ?? []).filter((u) => u.status === "ACTIVE");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const email = recipientEmail.trim();
    if (!email) {
      setError("Please enter the buyer's registered email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      transferDevice(device.id, email);
      setIsSubmitting(false);
      onOpenChange(false);
      onComplete?.();
    } catch (cause) {
      setIsSubmitting(false);
      setError(cause instanceof Error ? cause.message : "Failed to transfer device ownership.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="size-5 text-primary" />
            Transfer Device to Buyer
          </DialogTitle>
          <DialogDescription>
            Assign this refurbished device to a buyer. This unlists the device from the public store and immediately revokes its old QR token.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Device:</span>
              <span className="font-semibold text-foreground">{device.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Passport ID:</span>
              <span className="font-mono text-foreground">{device.passportId}</span>
            </div>
            {device.listingPrice && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selling Price:</span>
                <span className="font-medium text-foreground">₹{device.listingPrice.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="buyer-email" className="block text-xs font-semibold text-foreground">
              Buyer&apos;s Registered Email *
            </label>
            <Input
              id="buyer-email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="e.g. buyer@example.org"
              className="mt-1.5"
              list="active-users-list"
              required
            />
            <datalist id="active-users-list">
              {activeUsers.map((u) => (
                <option key={u.id} value={u.email}>
                  {u.name} ({u.role})
                </option>
              ))}
            </datalist>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Select or type the registered buyer account email.
            </p>
          </div>

          <div className="flex gap-2.5 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Cryptographic QR Token Revocation</p>
              <p className="text-[11px] opacity-90">
                The existing QR token and public link will be revoked instantly. A new cryptographic token will be minted for the buyer, and the device will be unlisted from the marketplace.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
              {error}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Check className="size-4" />
              Confirm Transfer to Buyer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
