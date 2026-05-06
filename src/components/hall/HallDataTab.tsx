import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { computeHall, type HallParams } from "@/lib/physics";

interface Props { params: HallParams }

type SweepKey = "B" | "I" | "n" | "t";

const RANGES: Record<SweepKey, { min: number; max: number; unit: string; label: string; log?: boolean }> = {
  B: { min: -2, max: 2, unit: "T", label: "B (T)" },
  I: { min: -5, max: 5, unit: "A", label: "I (A)" },
  n: { min: 18, max: 30, unit: "log m⁻³", label: "log₁₀(n)", log: true },
  t: { min: -6, max: -3, unit: "log m", label: "log₁₀(t)", log: true },
};

export const HallDataTab = ({ params }: Props) => {
  const [sweep, setSweep] = useState<SweepKey>("B");
  const N = 60;

  const data = useMemo(() => {
    const r = RANGES[sweep];
    const out: { x: number; vH: number; rho: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const v = r.min + (r.max - r.min) * (i / N);
      const real = r.log ? Math.pow(10, v) : v;
      const p: HallParams = { ...params, [sweep]: real } as HallParams;
      const d = computeHall(p);
      out.push({
        x: r.log ? v : v,
        vH: d.vHall * 1000, // mV
        rho: isFinite(d.rhoXX) ? d.rhoXX : 0,
      });
    }
    return out;
  }, [params, sweep]);

  const exportCsv = () => {
    const r = RANGES[sweep];
    const header = `${r.label},V_H(mV),rho_xx(Ohm·m)\n`;
    const body = data.map((d) => `${d.x},${d.vH},${d.rho}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `hall_sweep_${sweep}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-base font-semibold">Varredura paramétrica</h3>
            <p className="text-xs text-muted-foreground">Selecione a variável e veja V_H em função dela.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(RANGES) as SweepKey[]).map((k) => (
              <Button key={k} size="sm" variant={sweep === k ? "default" : "outline"}
                onClick={() => setSweep(k)}>{k}</Button>
            ))}
            <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="x" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["dataMin", "dataMax"]}
                label={{ value: RANGES[sweep].label, position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: "V_H (mV)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="vH" name="V_H (mV)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="font-display text-base font-semibold mb-1">ρ_xx vs varredura</h3>
        <p className="text-xs text-muted-foreground mb-4">Resistividade longitudinal ao longo da mesma varredura.</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="x" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["dataMin", "dataMax"]} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="rho" name="ρ_xx (Ω·m)" stroke="hsl(var(--accent-foreground))" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};