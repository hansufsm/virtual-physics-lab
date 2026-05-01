import { useMemo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer,
  Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { computeOhm, linearRegression, type OhmParams } from "@/lib/physics";

interface Props { params: OhmParams }

export const OhmDataTab = ({ params }: Props) => {
  // Sweep voltage from -V to +V (in steps), with optional measurement noise
  const vMax = Math.max(1, Math.abs(params.voltage) || 12);
  const vSweep = useMemo(() => {
    const points: { V: number; I_mA: number; I_ideal_mA: number }[] = [];
    // deterministic pseudo-noise so chart doesn't jitter
    const rand = mulberry32(42);
    for (let v = -vMax; v <= vMax + 1e-9; v += vMax / 20) {
      const r = computeOhm({ ...params, voltage: v });
      const noise = (rand() - 0.5) * 2 * params.noisePct * Math.abs(r.current);
      points.push({
        V: +v.toFixed(3),
        I_mA: +((r.current + noise) * 1e3).toFixed(4),
        I_ideal_mA: +(r.current * 1e3).toFixed(4),
      });
    }
    return points;
  }, [params, vMax]);

  // Linear fit on the (noisy) sweep — slope is 1/(R+r) in S → derive R+r
  const fit = useMemo(() => {
    const pts = vSweep.map((p) => ({ x: p.V, y: p.I_mA / 1000 }));
    return linearRegression(pts);
  }, [vSweep]);

  const fitInverse = fit.slope !== 0 ? 1 / fit.slope : Infinity;

  // Sweep length L → R(L) and I(L)
  const lSweep = useMemo(() => {
    const points: { L: number; R: number; I_mA: number }[] = [];
    for (let L = 5; L <= 500; L += 10) {
      const r = computeOhm({ ...params, lengthCm: L });
      points.push({ L, R: +r.resistance.toFixed(4), I_mA: +(r.current * 1e3).toFixed(4) });
    }
    return points;
  }, [params]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["voltage_V", "current_A_measured", "current_A_ideal"],
      ...vSweep.map((p) => [p.V, p.I_mA / 1000, p.I_ideal_mA / 1000]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ohm_VxI.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Varredura de tensão para verificar a linearidade da Lei de Ohm. O ajuste linear estima a resistência total
          (R + r) a partir do coeficiente angular.
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <ChartCard
        title="V × I — Lei de Ohm"
        subtitle={`Pontos medidos (com ruído) e reta ideal. Ajuste linear: 1/slope ≈ ${formatR(fitInverse)}, R² = ${fit.r2.toFixed(4)}.`}
      >
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis type="number" dataKey="V" name="V" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "V (V)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis type="number" dataKey="I_mA" name="I" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "I (mA)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(3)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Scatter name="Medido" data={vSweep} fill="hsl(var(--primary))" />
            <Scatter name="Ideal" data={vSweep.map(p => ({ V: p.V, I_mA: p.I_ideal_mA }))} fill="hsl(var(--accent))" line shape="cross" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="R(L) e I(L)" subtitle="Como a resistência e a corrente variam com o comprimento do fio (V e ⌀ fixos).">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lSweep} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="L" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "L (cm)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="hsl(var(--primary))" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line yAxisId="left" type="monotone" dataKey="R" name="R (Ω)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="I_mA" name="I (mA)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground space-y-1">
        <div>Configuração base: V = {params.voltage.toFixed(2)} V · L = {params.lengthCm.toFixed(0)} cm · ⌀ = {params.diameterMm.toFixed(2)} mm · ρ = {params.resistivity.toExponential(2)} Ω·m · r = {params.internalOhm.toFixed(2)} Ω · ruído = {(params.noisePct * 100).toFixed(1)}%.</div>
        <div>Coef. angular do ajuste linear (V×I) = {fit.slope.toExponential(3)} S → R+r ≈ {formatR(fitInverse)} (esperado: R+r = {formatR(computeOhm(params).resistance + params.internalOhm)}).</div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
    <div className="px-5 py-3 border-b border-border">
      <h4 className="font-display font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
    <div className="p-3">{children}</div>
  </div>
);

function formatR(R: number): string {
  if (!isFinite(R)) return "∞ Ω";
  if (Math.abs(R) >= 1e3) return `${(R / 1e3).toFixed(2)} kΩ`;
  if (Math.abs(R) >= 1) return `${R.toFixed(2)} Ω`;
  return `${(R * 1e3).toFixed(2)} mΩ`;
}

// Tiny seedable PRNG so the chart noise is stable between re-renders
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}