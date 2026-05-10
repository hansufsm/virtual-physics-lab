import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { buildCharges, fieldAt, potentialAt, type PotentialParams } from "@/lib/physics";

interface Props { params: PotentialParams }
type SweepKey = "x" | "y" | "radial";

export const PotentialDataTab = ({ params }: Props) => {
  const [sweep, setSweep] = useState<SweepKey>("x");
  const N = 200;

  const data = useMemo(() => {
    const charges = buildCharges(params);
    const out: { x: number; V: number; E: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      let xm = 0, ym = 0, xLabel = 0;
      if (sweep === "x") {
        xm = -0.25 + t * 0.5; ym = params.probeYcm * 1e-2; xLabel = xm * 100;
      } else if (sweep === "y") {
        xm = params.probeXcm * 1e-2; ym = -0.25 + t * 0.5; xLabel = ym * 100;
      } else {
        const r = 0.005 + t * 0.30;
        xm = r; ym = 0; xLabel = r * 100;
      }
      const V = potentialAt(charges, xm, ym);
      const f = fieldAt(charges, xm, ym);
      out.push({ x: xLabel, V, E: Math.hypot(f.Ex, f.Ey) });
    }
    return out;
  }, [params, sweep]);

  const labels: Record<SweepKey, { x: string; title: string }> = {
    x: { x: "x (cm)", title: "Perfil V(x) e |E|(x)" },
    y: { x: "y (cm)", title: "Perfil V(y) e |E|(y)" },
    radial: { x: "r (cm) sobre +x", title: "V(r) e |E|(r) ao longo de +x" },
  };

  const exportCsv = () => {
    const head = `${labels[sweep].x},V (V),|E| (V/m)\n`;
    const body = data.map((d) => `${d.x},${d.V},${d.E}`).join("\n");
    const blob = new Blob([head + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `potencial_${sweep}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{labels[sweep].title}</h3>
          <p className="text-xs text-muted-foreground">E = −∇V — observe que |E| é maior onde V varia mais rápido.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["x", "y", "radial"] as SweepKey[]).map((k) => (
            <Button key={k} size="sm" variant={sweep === k ? "default" : "outline"} onClick={() => setSweep(k)}>
              {k === "radial" ? "r" : k}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["dataMin", "dataMax"]}
              label={{ value: labels[sweep].x, position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis yAxisId="V" stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: "V (V)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis yAxisId="E" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="V" type="monotone" dataKey="V" name="V (V)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line yAxisId="E" type="monotone" dataKey="E" name="|E| (V/m)" stroke="hsl(var(--accent-foreground))" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};