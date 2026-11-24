import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Laptop, Smartphone } from "lucide-react";
import { GradeBadge, RecommendationBadge } from "@/components/passport-ui";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { calculateAssessment } from "@/utils/scoringEngine";

export const Route = createFileRoute("/p/$token")({
  component: PublicPassport,
  head: () => ({ meta: [
    { title: "Public Device Passport · ReTech Passport" },
    { name: "description", content: "View the limited public identity and lifecycle recommendation for a device." },
    { property: "og:title", content: "Public Device Passport · ReTech Passport" },
    { property: "og:description", content: "View the limited public identity and lifecycle recommendation for a device." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
});

function PublicPassport() {
  const { token } = Route.useParams();
  const { getPublicPassport } = useApp();
  const device = getPublicPassport(token);
  if (!device) return <main className="grid min-h-screen place-items-center bg-background px-4 py-10"><section className="w-full max-w-md rounded-md border border-border bg-card p-7 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive"><AlertCircle className="size-6" /></span><h1 className="mt-4 text-xl font-bold">Invalid or Revoked QR Token</h1><p className="mt-2 text-sm text-muted-foreground">This public link is no longer active or could not be found.</p><Link to="/login" className="mt-5 inline-flex"><Button>Log in <ArrowRight className="size-4" /></Button></Link></section></main>;

  const assessment = calculateAssessment(device);
  const Icon = device.deviceType === "LAPTOP" ? Laptop : Smartphone;
  return <main className="min-h-screen bg-background px-4 py-8 sm:px-8 sm:py-12"><div className="mx-auto max-w-2xl">
    <header className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><Icon className="size-5" /></span><span className="text-sm font-bold">RETECH PASSPORT</span></header>
    <section className="mt-9 rounded-md border border-border bg-card p-5 sm:p-8">
      <p className="text-xs font-semibold uppercase text-primary">Limited public view</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">{device.model}</h1><p className="mt-2 text-sm text-muted-foreground">Device identity and lifecycle summary</p>
      <dl className="mt-7 grid gap-5 border-y border-border py-5 sm:grid-cols-2"><div><dt className="text-xs font-medium text-muted-foreground">Device type</dt><dd className="mt-1 text-sm font-semibold">{device.deviceType}</dd></div><div><dt className="text-xs font-medium text-muted-foreground">Passport ID</dt><dd className="mt-1 font-mono text-sm font-semibold">{device.passportId}</dd></div></dl>
      <div className="mt-5 flex flex-wrap items-center gap-2"><GradeBadge grade={assessment.grade} /><RecommendationBadge recommendation={assessment.recommendation} /></div>
      <div className="mt-6 rounded-md border border-info/40 bg-info p-4"><p className="text-sm font-semibold text-info-foreground">Limited Public View</p><p className="mt-1 text-sm text-info-foreground">Personal owner information, component inventory, and repair history are hidden until login.</p></div>
      <Link to="/login" className="mt-6 inline-flex"><Button>Log in to view full passport <ArrowRight className="size-4" /></Button></Link>
    </section>
    <p className="mt-5 text-center text-xs text-muted-foreground">This lifecycle recommendation is advisory.</p>
  </div></main>;
}