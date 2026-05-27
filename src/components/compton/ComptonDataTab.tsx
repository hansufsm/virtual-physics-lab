import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { computeCompton, type ComptonParams, type ComptonResults } from "@/lib/physics";

interface Props { params: ComptonParams; results: ComptonResults }
type View = "dlambda" | "Eprime" | "phi" | "kn";

export const ComptonDataTab = ({ params, results }: Props) => {
  const [view, setView] = useState<View>("dlambda");

  const data = useMemo(() => results.scanByTheta.map((p) => ({
    theta: p.theta,
    dlambda: p.deltaLambda * 1e12, // pm
    Eprime: p.Eprime,
    phi: p.phi,
    KN: p.KN,
  })), [results]);

  const dataKey = view === "dlambda" ? "dlambda" : view === "Eprime" ? "Eprime" : view === "phi" ? "phi" : "KN";
  const yLabel = view === "dlambda" ? "Δλ (pm)" : view === "Eprime" ? "E' (keV)" : view === "phi" ? "φ (°)" : "dσ/dΩ (barn/sr)";

  const exportCsv = () => {
    const csv = "theta_deg,deltaLambda_pm,Eprime_keV,phi_deg,KN_b_per_sr\n" +
      data.map((p) => `${p.theta},${p.dlambda},${p.Eprime},${p.phi},${p.KN}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `compton_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    dlambda: "Δλ em função do ângulo θ",
    Eprime: "Energia do fóton espalhado E'(θ)",
    phi: "Ângulo de recuo do elétron φ(θ)",
    kn: "Seção de choque diferencial — Klein–Nishina",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">E₀ = {params.E0_keV.toFixed(1)} keV</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["dlambda", "Eprime", "phi", "kn"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "dlambda" ? "Δλ(θ)" : k === "Eprime" ? "E'(θ)" : k === "phi" ? "φ(θ)" : "Klein–Nishina"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="theta" type="number" domain={[0, 180]} ticks={[0, 30, 60, 90, 120, 150, 180]}
              stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: "θ (graus)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: yLabel, angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <ReferenceLine x={params.thetaDeg} stroke="hsl(var(--primary))" strokeDasharray="2 3" />
            <Line type="monotone" dataKey={dataKey} stroke="hsl(200, 90%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Δλ depende apenas de θ (não de E₀), enquanto E' e φ dependem fortemente de α = E₀/m_e c². Klein–Nishina é a versão QED da seção de choque.
      </p>
    </div>
  );
};