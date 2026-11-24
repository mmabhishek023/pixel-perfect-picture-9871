import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, Flashlight, Laptop, ScanLine, Smartphone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
  head: () => ({ meta: [
    { title: "Scan or Lookup · ReTech Passport" },
    { name: "description", content: "Scan a device passport QR code or look up a demo token." },
    { property: "og:title", content: "Scan or Lookup · ReTech Passport" },
    { property: "og:description", content: "Scan a device passport QR code or look up a demo token." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function ScanPage() {
  const navigate = useNavigate();
  const { devices, currentUser, getPublicPassport } = useApp();
  const [token, setToken] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  function resolve(rawValue: string) {
    const raw = rawValue.trim();
    let resolvedToken = raw;
    try {
      const parsed = new URL(raw);
      const segments = parsed.pathname.split("/").filter(Boolean);
      resolvedToken = segments.at(-1) ?? raw;
    } catch { /* A raw opaque token is also accepted. */ }
    const device = getPublicPassport(resolvedToken);
    setError("");
    if (!device) {
      void navigate({ to: "/p/$token", params: { token: "invalid-or-revoked" } });
      return;
    }
    const roleCanOpenFull = currentUser?.role === "OWNER" || currentUser?.role === "TECHNICIAN" || currentUser?.role === "ADMIN";
    if (roleCanOpenFull) void navigate({ to: "/devices/$id", params: { id: device.id } });
    else void navigate({ to: "/p/$token", params: { token: resolvedToken } });
  }

  useEffect(() => {
    if (!cameraActive) return;
    let alive = true;
    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!alive) return;
        const scanner = new Html5Qrcode("retech-qr-reader");
        scannerRef.current = scanner;
        await scanner.start({ facingMode }, { fps: 10, qrbox: { width: 220, height: 220 } }, (decoded) => { if (alive) { setCameraActive(false); resolve(decoded); } }, () => undefined);
      } catch {
        if (alive) { setCameraError("Camera access is unavailable. Use a demo scan or enter a token below."); setCameraActive(false); }
      }
    };
    void startScanner();
    return () => {
      alive = false;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) void scanner.stop().then(() => scanner.clear()).catch(() => undefined);
    };
  }, [cameraActive, facingMode]);

  async function toggleTorch() {
    const scanner = scannerRef.current;
    if (!scanner) return;
    const next = !torchOn;
    try {
      const constraints = { advanced: [{ torch: next } as MediaTrackConstraintSet & { torch: boolean }] } satisfies MediaTrackConstraints;
      await scanner.applyVideoConstraints(constraints);
      setTorchOn(next);
    } catch { setCameraError("Torch control is not supported by this camera."); }
  }

  return <AppShell title="Scan / Lookup" subtitle="Open a passport from its QR label or a demo token.">
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-md border border-border bg-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-semibold">QR scanner</h2><p className="mt-1 text-sm text-muted-foreground">Use your device camera to scan a passport label.</p></div><span className="grid size-10 place-items-center rounded-md bg-secondary text-primary"><ScanLine className="size-5" /></span></div>
        <div className="relative grid min-h-[280px] place-items-center overflow-hidden rounded-md bg-foreground text-background">
          <div id="retech-qr-reader" className="absolute inset-0 w-full [&_video]:h-full [&_video]:object-cover [&_img]:hidden" />
          {!cameraActive && <div className="relative z-10 flex flex-col items-center px-6 text-center"><span className="grid size-14 place-items-center rounded-full bg-background/10"><Camera className="size-7" /></span><p className="mt-4 font-semibold">Camera scan</p><p className="mt-1 max-w-xs text-sm text-background/70">Allow camera access to scan a device QR label.</p></div>}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 size-48 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-background/80" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => { setCameraError(""); setCameraActive((active) => !active); }}><Camera className="size-4" />{cameraActive ? "Stop camera" : "Start camera"}</Button><Button variant="outline" onClick={() => setFacingMode((mode) => mode === "environment" ? "user" : "environment")} disabled={!cameraActive}>Switch camera</Button><Button variant="outline" size="icon" onClick={() => void toggleTorch()} disabled={!cameraActive} aria-label={torchOn ? "Turn torch off" : "Turn torch on"} title={torchOn ? "Turn torch off" : "Turn torch on"}><Flashlight className="size-4" /></Button></div>
        {cameraError && <p role="status" className="mt-3 text-sm text-muted-foreground">{cameraError}</p>}
      </section>

      <div className="space-y-6">
        <section className="rounded-md border border-border bg-card p-5 sm:p-6">
          <h2 className="font-semibold">Manual token lookup</h2><p className="mt-1 text-sm text-muted-foreground">Enter the opaque token from a device QR label.</p>
          <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (!token.trim()) { setError("Enter a token to continue."); return; } resolve(token); }}><Input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Passport token" aria-label="Passport token" /><Button type="submit">Look up</Button></form>
          {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
        </section>
        <section className="rounded-md border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2"><ScanLine className="size-4 text-primary" /><h2 className="font-semibold">Simulate QR scan</h2></div>
          <p className="mt-1 text-sm text-muted-foreground">Open a seeded device passport instantly.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{devices.map((device) => { const Icon = device.deviceType === "LAPTOP" ? Laptop : Smartphone; return <Button key={device.id} variant="outline" className="h-auto justify-start py-3 text-left" onClick={() => resolve(device.qrToken)}><Icon className="size-4 shrink-0 text-primary" /><span className="min-w-0 truncate">{device.name}</span></Button>; })}<Button variant="ghost" className="justify-start text-destructive" onClick={() => resolve("revoked-demo-token")}><CameraOff className="size-4" />Invalid / revoked token</Button></div>
        </section>
      </div>
    </div>
  </AppShell>;
}