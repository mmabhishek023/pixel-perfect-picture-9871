import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, History, Laptop, Smartphone, Upload, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import type { DeviceInput, DeviceType } from "@/types/passport";

export const Route = createFileRoute("/devices/new")({
  component: RegisterDevice,
  head: () => ({ meta: [
    { title: "Register Device · ReTech Passport" },
    { name: "description", content: "Create a new electronic device passport with its core specifications and condition history." },
    { property: "og:title", content: "Register Device · ReTech Passport" },
    { property: "og:description", content: "Create a new electronic device passport with its core specifications and condition history." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const KNOWN_DAMAGE_OPTIONS = [
  "Screen Crack",
  "Battery Swelling/Drain",
  "Water/Liquid Damage",
  "Body Dents/Scratches",
  "Port/Charging Issue",
  "Camera/Speaker Fault",
] as const;

const emptyInput: DeviceInput = {
  deviceType: "LAPTOP",
  brand: "",
  model: "",
  serial: "",
  purchaseDate: "",
  os: "",
  ramGb: null,
  storageGb: null,
  processor: "",
  previousOwnersCount: 0,
  knownDamages: [],
  damageNotes: "",
  priorHistory: "",
  ownerPhotos: [],
};

function RegisterDevice() {
  const navigate = useNavigate();
  const { currentUser, registerDevice } = useApp();
  const [form, setForm] = useState<DeviceInput>(emptyInput);
  const [error, setError] = useState("");
  const canRegister = currentUser?.role === "OWNER" || (currentUser?.role === "TECHNICIAN" && currentUser.status === "ACTIVE");

  useEffect(() => {
    if (currentUser?.role === "VIEWER") {
      void navigate({ to: "/" });
    }
  }, [currentUser, navigate]);
  const update = <K extends keyof DeviceInput>(key: K, value: DeviceInput[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const toggleDamage = (damage: string) => {
    const current = form.knownDamages ?? [];
    const updated = current.includes(damage)
      ? current.filter((d) => d !== damage)
      : [...current, damage];
    update("knownDamages", updated);
  };

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setForm((previous) => ({
            ...previous,
            ownerPhotos: [...(previous.ownerPhotos ?? []), reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  }

  function removePhoto(index: number) {
    setForm((previous) => ({
      ...previous,
      ownerPhotos: (previous.ownerPhotos ?? []).filter((_, i) => i !== index),
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const device = registerDevice(form);
      void navigate({ to: "/devices/$id", params: { id: device.id } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to register device.");
    }
  }

  return (
    <AppShell title="Register device" subtitle="Start a durable record for a phone or computer." actions={<Link to="/"><Button variant="outline"><ArrowLeft className="size-4" /> My devices</Button></Link>}>
      {!canRegister ? (
        <div className="max-w-xl rounded-md border border-warning/50 bg-warning p-5">
          <h2 className="font-semibold text-warning-foreground">Registration unavailable</h2>
          <p className="mt-1 text-sm text-warning-foreground">Device registration is available to owners and Admin-approved technicians.</p>
          {currentUser?.status === "PENDING" && <p className="mt-2 text-sm font-medium text-warning-foreground">Your technician account is awaiting approval.</p>}
        </div>
      ) : (
        <form onSubmit={submit} className="max-w-4xl space-y-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Device type">
            {(["LAPTOP", "SMARTPHONE"] as const).map((type) => {
              const Icon = type === "LAPTOP" ? Laptop : Smartphone;
              const selected = form.deviceType === type;
              return <Button key={type} type="button" variant={selected ? "default" : "outline"} className="h-11 min-w-40 justify-start" onClick={() => update("deviceType", type)}><Icon className="size-4" />{type === "LAPTOP" ? "Laptop" : "Smartphone"}</Button>;
            })}
          </div>

          <section className="rounded-md border border-border bg-card p-5 sm:p-7">
            <h2 className="text-base font-semibold">Device identity</h2>
            <p className="mt-1 text-sm text-muted-foreground">The passport ID and private QR token are created when you save.</p>
            <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Brand" required><Input value={form.brand} onChange={(event) => update("brand", event.target.value)} placeholder="e.g. ExampleBrand" required /></Field>
              <Field label="Model" required><Input value={form.model} onChange={(event) => update("model", event.target.value)} placeholder="e.g. ExampleBook 14" required /></Field>
              <Field label="Serial number / IMEI" required><Input value={form.serial} onChange={(event) => update("serial", event.target.value)} placeholder="Unique device identifier" required /></Field>
              <Field label="Purchase date" required><Input type="date" value={form.purchaseDate} onChange={(event) => update("purchaseDate", event.target.value)} required /></Field>
              <Field label="Operating system"><Input value={form.os} onChange={(event) => update("os", event.target.value)} placeholder="e.g. Windows 11" /></Field>
              <Field label="Processor"><Input value={form.processor} onChange={(event) => update("processor", event.target.value)} placeholder="e.g. Intel Core i5" /></Field>
              <Field label="RAM (GB)"><Input type="number" min="0" value={form.ramGb ?? ""} onChange={(event) => update("ramGb", event.target.value ? Number(event.target.value) : null)} placeholder="8" /></Field>
              <Field label="Storage (GB)"><Input type="number" min="0" value={form.storageGb ?? ""} onChange={(event) => update("storageGb", event.target.value ? Number(event.target.value) : null)} placeholder="512" /></Field>
            </div>
          </section>

          {/* Prior History & Condition Section */}
          <section className="rounded-md border border-border bg-card p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <History className="size-5 text-primary" />
              <div>
                <h2 className="text-base font-semibold">Prior History & Condition</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Log known past ownership, existing defects, or prior repairs before issuing this passport.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              {/* Previous Owners */}
              <div className="max-w-xs">
                <Field label="Number of previous owners">
                  <Input
                    type="number"
                    min="0"
                    value={form.previousOwnersCount ?? 0}
                    onChange={(event) => update("previousOwnersCount", Math.max(0, parseInt(event.target.value) || 0))}
                    placeholder="0 (first owner)"
                  />
                </Field>
                <p className="mt-1 text-xs text-muted-foreground">Enter 0 if registering as the first / original owner.</p>
              </div>

              {/* Known Damages Checkboxes */}
              <div>
                <label className="text-sm font-medium">Existing / known damages</label>
                <p className="text-xs text-muted-foreground mb-3">Select any visible physical or functional damages present on the device.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {KNOWN_DAMAGE_OPTIONS.map((damage) => {
                    const checked = (form.knownDamages ?? []).includes(damage);
                    return (
                      <label
                        key={damage}
                        className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer text-sm font-medium transition-colors ${
                          checked
                            ? "border-primary/50 bg-primary/5 text-foreground"
                            : "border-border bg-card hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleDamage(damage)}
                        />
                        <span>{damage}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Additional Damage Notes */}
              <Field label="Additional damage notes">
                <Input
                  value={form.damageNotes ?? ""}
                  onChange={(event) => update("damageNotes", event.target.value)}
                  placeholder="e.g. Dent on top-right chassis corner; small hairline scratch on display"
                />
              </Field>

              {/* Prior Repair History Textarea */}
              <Field label="Prior device & repair history">
                <Textarea
                  value={form.priorHistory ?? ""}
                  onChange={(event) => update("priorHistory", event.target.value)}
                  placeholder="e.g. Motherboard serviced in 2023; refurbished battery installed by previous owner; water damage repaired in 2024"
                  rows={3}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-5 sm:p-7">
            <h2 className="text-base font-semibold">
              Device photos <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload existing photos or take a photo of the device for the intake record.
            </p>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              id="owner-photo-upload"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <label htmlFor="owner-photo-upload" className="cursor-pointer">
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="size-4" /> Upload from files
                  </span>
                </Button>
              </label>
              <label htmlFor="owner-photo-upload" className="cursor-pointer">
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Camera className="size-4" /> Take photo
                  </span>
                </Button>
              </label>
            </div>

            {form.ownerPhotos && form.ownerPhotos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.ownerPhotos.map((url, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-md border border-border">
                    <img src={url} alt={`Device photo ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={`Remove device photo ${index + 1}`}
                      className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive">{error}</p>}

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <Link to="/"><Button type="button" variant="outline">Cancel</Button></Link>
            <Button type="submit">Create passport</Button>
          </div>
        </form>
      )}
    </AppShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium">{label}{required && <span className="sr-only"> required</span>}{children}</label>;
}