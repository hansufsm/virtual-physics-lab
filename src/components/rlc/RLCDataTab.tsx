import { useMemo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { computeRLC, rlcCurrentAtFreq, type RLCParams } from "@/lib/physics";

interface Props { params: RLCParams }

export const RLCDataTab = ({ params }: Props) => {
  const r = useMemo(() => computeRLC(params), [params]);

  // Varredura logarítmica em torno de f₀
  const sweep = useMemo(() => {
    const fmin = Math.max(1, r.f0 / 50);
    const fmax = r.f0 * 50;
    const N = 220;
    const out: { f: number; I_mA: number; phase: number; Z: number }[] = [];
    for (let k = 0; k <= N; k++) {
      const f = fmin * Math.pow(fmax / fmin, k / N);
      const omega = 2 * Math.PI * f;
      const X = omega * r.lH - 1 / (omega * r.cF);
      const Z = Math.sqrt(r.rOhm * r.rOhm + X * X);
      const I = rlcCurrentAtFreq(params, f);
      const phase = (Math.atan2(X, r.rOhm) * 180) / Math.PI;
      out.push({
        f: +f.toFixed(2),
        I_mA: +(I * 1000).toFixed(4),
        phase: +phase.toFixed(2),
        Z: +Z.toFixed(3),
      });
    }
    return out;
  }, [params, r]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["f_Hz", "I_mA", "phase_deg", "Z_ohm"],
      ...sweep.map((p) => [p.f, p.I_mA, p.phase, p.Z]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `rlc_resposta_freq.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Curva de resson&acirc;ncia: |I(f)| atinge m&aacute;ximo em f₀ = {r.f0.toFixed(2)} Hz.
          Largura de banda Δf ≈ {r.bandwidthHz.toFixed(2)} Hz, fator Q = {r.Q.toFixed(2)}.
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" /> Exportar varredura
        </Button>
      </div>

      <ChartCard title="Corrente |I(f)|" subtitle="Resposta em frequência: pico na ressonância.">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={sweep} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="f" type="number" scale="log" domain={["auto", "auto"]}
              stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "f (Hz, log)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "I (mA)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(3)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine x={r.f0} stroke="hsl(var(--accent))" strokeDasharray="4 4"
              label={{ value: "f₀", position: "top", fontSize: 11, fill: "hsl(var(--accent))" }} />
            <Line type="monotone" dataKey="I_mA" name="I (mA)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Fase φ(f)" subtitle="Negativa abaixo de f₀ (capacitivo), positiva acima (indutivo).">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={sweep} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="f" type="number" scale="log" domain={["auto", "auto"]}
              stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "f (Hz, log)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} domain={[-90, 90]}
              label={{ value: "φ (°)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(2)} />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
            <ReferenceLine x={r.f0} stroke="hsl(var(--accent))" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="phase" name="φ (°)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
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