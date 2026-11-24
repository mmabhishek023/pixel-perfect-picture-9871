import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Download, Printer, Smartphone } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/devices/$id/qr")({
  component: QrPage,
  head: () => ({ meta: [
    { title: "QR Label · ReTech Passport" },
    { name: "description", content: "Download or print the secure QR label for a device passport." },
    { property: "og:title", content: "QR Label · ReTech Passport" },
    { property: "og:description", content: "Download or print the secure QR label for a device passport." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function QrPage() {
  const { id } = Route.useParams();
  const { getDevice } = useApp();
  const device = getDevice(id);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { if (device) setUrl(`${window.location.origin}/p/${device.qrToken}`); }, [device]);

  async function copyLink() {
    try { await navigator.clipboard.writeText(url); setMessage("Public link copied."); }
    catch { setMessage("Copy is unavailable in this browser."); }
  }
  function download() {
    const canvas = document.querySelector<HTMLCanvasElement>("#passport-qr canvas");
    if (!canvas) { setMessage("QR image is not ready yet."); return; }
    const link = document.createElement("a");
    link.download = `${device?.passportId ?? "retech-passport"}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  if (!device) return <AppShell title="QR label unavailable"><p className="text-sm text-muted-foreground">This device passport could not be found.</p></AppShell>;

  return <AppShell title="QR label" subtitle="A scannable link to this device's limited public passport." actions={<Link to="/devices/$id" params={{ id: device.id }}><Button variant="outline"><ArrowLeft className="size-4" />Back to passport</Button></Link>}>
    <div className="grid max-w-4xl gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="grid place-items-center rounded-md border border-border bg-card p-7 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-sm font-bold"><span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><Smartphone className="size-4" /></span>RETECH PASSPORT</div>
          <div id="passport-qr" className="mt-6 rounded-md border border-border bg-card p-3">{url && <QRCodeCanvas value={url} size={240} level="M" includeMargin />}</div>
          <p className="mt-5 font-mono text-sm font-semibold">{device.passportId}</p>
          <p className="mt-1 text-sm text-muted-foreground">{device.model}</p>
        </div>
      </section>
      <section className="flex flex-col justify-center rounded-md border border-border bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Passport label</h2>
        <p className="mt-2 break-all rounded-sm bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">{url || "Preparing public link…"}</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button onClick={download}><Download className="size-4" />Download PNG</Button>
          <Button variant="outline" onClick={() => void copyLink()}><Copy className="size-4" />Copy public link</Button>
          <Button variant="outline" className="sm:col-span-2" onClick={() => window.print()}><Printer className="size-4" />Print sticker label</Button>
        </div>
        {message && <p role="status" className="mt-4 text-sm text-primary">{message}</p>}
      </section>
    </div>
    <div className="print-sticker"><p className="text-sm font-bold">RETECH PASSPORT</p><div className="my-4 inline-block self-center"><QRCodeCanvas value={url || "https://retech.invalid"} size={180} level="M" includeMargin /></div><p className="font-mono text-sm font-semibold">{device.passportId}</p><p className="mt-1 text-sm">{device.model}</p></div>
  </AppShell>;
}