import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { computeRadioactiveDecay, formatDuration, type DecayParams } from "@/lib/physics";

interface Props { params: DecayParams }
type View = "N" | "A" | "logN";

export const DecayDataTab = ({ params }: Props) => {
  const [view, setView] = useState<View>("N");
  const r = useMemo(() => computeRadioactiveDecay(params), [params]);

  const data = useMemo(() => {
    if (view === "N") return r.curveN.map((d) => ({ x: d.t / params.halfLifeS, y: d.N }));
    if (view === "A") return r.curveN.map((d) => ({ x: d.t / params.halfLifeS, y: d.A }));
    return r.curveN
      .filter((d) => d.N > 0)
      .map((d) => ({ x: d.t / params.halfLifeS, y: Math.log(d.N) }));
  }, [r, view, params.halfLifeS]);

  const exportCsv = () => {
    const rows = r.curveN.map((d) => `${d.t},${d.N},${d.A}`).join("\n");
    const blob = new Blob(["t_s,N,A_Bq\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `decaimento_${params.isotopeName}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    N: "Número de núcleos N(t)",
    A: "Atividade A(t) = λN",
    logN: "ln N × t — reta de inclinação −λ",
  };
  const axisLabels: Record<View, { x: string; y: string }> = {
    N:    { x: "t / T½", y: "N" },
    A:    { x: "t / T½", y: "A (Bq)" },
    logN: { x: "t / T½", y: "ln N" },
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">
            T½ = {formatDuration(params.halfLifeS)} · janela 0 → {params.tMaxMultiplier.toFixed(1)} T½
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["N", "A", "logN"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "N" ? "N(t)" : k === "A" ? "A(t)" : "ln N(t)"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: axisLabels[view].x, position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: axisLabels[view].y, angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="y" name={axisLabels[view].y}
              stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            <ReferenceLine x={params.timeS / params.halfLifeS} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "t atual", fill: "hsl(var(--muted-foreground))", fontSize: 10, position: "top" }} />
            {view === "N" && <ReferenceLine y={params.N0 / 2} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "N₀/2", fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};