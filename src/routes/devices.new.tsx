import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Laptop, Smartphone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import type { DeviceInput, DeviceType } from "@/types/passport";

export const Route = createFileRoute("/devices/new")({
  component: RegisterDevice,
  head: () => ({ meta: [
    { title: "Register Device · ReTech Passport" },
    { name: "description", content: "Create a new electronic device passport with its core specifications." },
    { property: "og:title", content: "Register Device · ReTech Passport" },
    { property: "og:description", content: "Create a new electronic device passport with its core specifications." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

const emptyInput: DeviceInput = {
  deviceType: "LAPTOP", brand: "", model: "", serial: "", purchaseDate: "", os: "", ramGb: null, storageGb: null, processor: "",
};

function RegisterDevice() {
  const navigate = useNavigate();
  const { currentUser, registerDevice } = useApp();
  const [form, setForm] = useState<DeviceInput>(emptyInput);
  const [error, setError] = useState("");
  const canRegister = currentUser?.role === "OWNER" || (currentUser?.role === "TECHNICIAN" && currentUser.status === "ACTIVE");
  const update = (key: keyof DeviceInput, value: string | number | null) => setForm((previous) => ({ ...previous, [key]: value }));

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
        <form onSubmit={submit} className="max-w-4xl">
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Device type">
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
            {error && <p role="alert" className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive">{error}</p>}
            <div className="mt-7 flex flex-wrap justify-end gap-2 border-t border-border pt-5">
              <Link to="/"><Button type="button" variant="outline">Cancel</Button></Link>
              <Button type="submit">Create passport</Button>
            </div>
          </section>
        </form>
      )}
    </AppShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium">{label}{required && <span className="sr-only"> required</span>}{children}</label>;
}