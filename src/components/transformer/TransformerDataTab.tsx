import { useMemo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { computeTransformer, transformerWaveform, type TransformerParams } from "@/lib/physics";

interface Props { params: TransformerParams }

export const TransformerDataTab = ({ params }: Props) => {
  // Forma de onda (2 períodos)
  const wave = useMemo(() => {
    const T = 1 / params.freqHz;
    const N = 400;
    const out: { t_ms: number; V1: number; V2: number }[] = [];
    for (let k = 0; k <= N; k++) {
      const t = (k / N) * 2 * T;
      const w = transformerWaveform(params, t);
      out.push({ t_ms: +(t * 1000).toFixed(3), V1: +w.v1.toFixed(3), V2: +w.v2.toFixed(3) });
    }
    return out;
  }, [params]);

  // Varredura de N₂
  const sweep = useMemo(() => {
    const out: { N2: number; V2: number; eta_pct: number; I2: number }[] = [];
    for (let n = 5; n <= 2000; n = Math.round(n * 1.15)) {
      const r = computeTransformer({ ...params, n2: n });
      out.push({ N2: n, V2: +r.vSecondary.toFixed(3), eta_pct: +(r.efficiency * 100).toFixed(2), I2: +r.iSecondary.toFixed(4) });
    }
    return out;
  }, [params]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["N2", "V2_V", "I2_A", "eta_pct"],
      ...sweep.map((p) => [p.N2, p.V2, p.I2, p.eta_pct]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `trafo_sweepN2.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Compare V₁(t) e V₂(t) para a configuração atual e veja como V₂ e η variam com N₂.
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" /> Exportar varredura N₂
        </Button>
      </div>

      <ChartCard title="V₁(t) e V₂(t)" subtitle="Duas formas de onda em fase para carga resistiva.">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={wave} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="t_ms" type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "t (ms)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "V (V)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(2)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
            <Line type="monotone" dataKey="V1" name="V₁ (V)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="V2" name="V₂ (V)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="V₂ e η em função de N₂" subtitle="Mantém todos os outros parâmetros fixos.">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={sweep} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="N2" type="number" scale="log" domain={[5, 2000]} stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11 }}
              label={{ value: "N₂ (log)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="hsl(var(--primary))" tick={{ fontSize: 11 }}
              label={{ value: "V₂ (V)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" tick={{ fontSize: 11 }}
              domain={[0, 100]}
              label={{ value: "η (%)", angle: 90, position: "insideRight", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(3)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line yAxisId="left" type="monotone" dataKey="V2" name="V₂ (V)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="eta_pct" name="η (%)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
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