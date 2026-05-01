import { useMemo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { computeRC, rcCurrent, rcVoltage, type RCParams } from "@/lib/physics";

interface Props { params: RCParams }

export const RCDataTab = ({ params }: Props) => {
  const { tau, vFinal } = computeRC(params);
  const tEnd = Math.max(tau * 6, 1e-3);

  const series = useMemo(() => {
    const N = 200;
    const out: { t: number; Vc: number; i_mA: number }[] = [];
    for (let k = 0; k <= N; k++) {
      const t = (k / N) * tEnd;
      out.push({
        t: +t.toFixed(6),
        Vc: +rcVoltage(params, t).toFixed(5),
        i_mA: +(rcCurrent(params, t) * 1e3).toFixed(5),
      });
    }
    return out;
  }, [params, tEnd]);

  // Linearização: ln|Vc - V∞| vs t → slope = -1/τ
  const lnSeries = useMemo(() => {
    return series
      .map((p) => ({ t: p.t, y: Math.log(Math.max(1e-9, Math.abs(p.Vc - vFinal))) }))
      .filter((p) => isFinite(p.y));
  }, [series, vFinal]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["t_s", "Vc_V", "i_A"],
      ...series.map((p) => [p.t, p.Vc, p.i_mA / 1000]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `rc_${params.mode}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Resposta transitória do circuito RC. A janela é fixada em 6τ ≈ {(tau * 6).toExponential(2)} s, suficiente
          para o regime permanente (Vc atinge ~99,75% de V∞).
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <ChartCard title="Vc(t) e i(t)" subtitle={`τ = ${tau.toExponential(3)} s · V∞ = ${vFinal.toFixed(2)} V`}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={series} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="t" type="number" domain={[0, tEnd]} stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11 }} tickFormatter={(v) => v.toExponential(1)}
              label={{ value: "t (s)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="hsl(var(--primary))" tick={{ fontSize: 11 }}
              label={{ value: "Vc (V)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" tick={{ fontSize: 11 }}
              label={{ value: "i (mA)", angle: 90, position: "insideRight", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(4)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine yAxisId="left" y={vFinal} stroke="hsl(var(--primary))" strokeDasharray="4 4"
              label={{ value: "V∞", fontSize: 10, fill: "hsl(var(--primary))" }} />
            <ReferenceLine x={tau} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 4"
              label={{ value: "τ", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Line yAxisId="left" type="monotone" dataKey="Vc" name="Vc (V)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="i_mA" name="i (mA)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Linearização: ln|Vc − V∞| × t"
        subtitle="Em escala mono-log a curva exponencial vira reta. O coeficiente angular vale −1/τ.">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lnSeries} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="t" type="number" domain={[0, tEnd]} stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 11 }} tickFormatter={(v) => v.toExponential(1)}
              label={{ value: "t (s)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "ln|Vc − V∞|", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(4)} />
            <Line type="monotone" dataKey="y" name="ln|Vc − V∞|" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
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