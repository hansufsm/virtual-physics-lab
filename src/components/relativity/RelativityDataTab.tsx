import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import type { RelativityParams, RelativityResults } from "@/lib/physics";

interface Props { params: RelativityParams; results: RelativityResults }
type View = "gamma" | "length" | "twin";

export const RelativityDataTab = ({ params, results }: Props) => {
  const [view, setView] = useState<View>("gamma");

  const gammaData = results.gammaCurve;

  const lengthData = useMemo(() => gammaData.map((p) => ({
    beta: p.beta,
    Lratio: 1 / p.gamma,
    dtRatio: p.gamma,
  })), [gammaData]);

  const twinData = useMemo(() => {
    const arr: { beta: number; earth: number; traveler: number }[] = [];
    for (let i = 1; i <= 200; i++) {
      const b = (i / 200) * 0.999;
      const earth = 2 * params.travelDistanceLy / b;
      const trav = earth * Math.sqrt(1 - b * b);
      arr.push({ beta: b, earth, traveler: trav });
    }
    return arr;
  }, [params.travelDistanceLy]);

  const exportCsv = () => {
    let csv = "";
    if (view === "gamma") csv = "beta,gamma\n" + gammaData.map((p) => `${p.beta},${p.gamma}`).join("\n");
    else if (view === "length") csv = "beta,L_over_L0,dt_over_dt0\n" + lengthData.map((p) => `${p.beta},${p.Lratio},${p.dtRatio}`).join("\n");
    else csv = "beta,earth_years,traveler_years\n" + twinData.map((p) => `${p.beta},${p.earth},${p.traveler}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `relativity_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    gamma: "Fator de Lorentz γ(β)",
    length: "L/L₀ e Δt/Δt₀ vs β",
    twin: "Paradoxo dos gêmeos: tempos vs β",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">β atual = {results.beta.toFixed(3)} · γ = {results.gamma.toFixed(3)}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["gamma", "length", "twin"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "gamma" ? "γ(β)" : k === "length" ? "L, Δt" : "Gêmeos"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={view === "gamma" ? gammaData : view === "length" ? lengthData : twinData}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="beta" type="number" domain={[0, 1]} stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: "β = v/c", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
              domain={view === "length" ? [0, 8] : undefined}
              scale={view !== "length" ? "log" : "linear"} allowDataOverflow
              tickFormatter={(v: number) => v >= 1000 ? v.toExponential(0) : v.toFixed(2)} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <ReferenceLine x={results.beta} stroke="hsl(var(--primary))" strokeDasharray="2 3" />
            {view === "gamma" && (
              <Line type="monotone" dataKey="gamma" stroke="hsl(200, 90%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} />
            )}
            {view === "length" && (
              <>
                <Line type="monotone" dataKey="Lratio" stroke="hsl(0, 80%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} name="L/L₀" />
                <Line type="monotone" dataKey="dtRatio" stroke="hsl(140, 70%, 50%)" dot={false} strokeWidth={2} isAnimationActive={false} name="Δt/Δt₀" />
              </>
            )}
            {view === "twin" && (
              <>
                <Line type="monotone" dataKey="earth" stroke="hsl(0, 80%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} name="Terra" />
                <Line type="monotone" dataKey="traveler" stroke="hsl(200, 90%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} name="Viajante" />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        γ diverge em β → 1; L/L₀ vai a zero e Δt/Δt₀ ao infinito. No paradoxo dos gêmeos, o viajante envelhece menos por √(1−β²).
      </p>
    </div>
  );
};