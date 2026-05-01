import { useMemo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  faradayInitialPos, faradayInitialVel, faradayState, faradayStep,
  type FaradayParams,
} from "@/lib/physics";

interface Props { params: FaradayParams }

export const FaradayDataTab = ({ params }: Props) => {
  const series = useMemo(() => {
    // Janela: simula até o evento terminar (espira sai da região OU ímã passa pela bobina + cair)
    const dt = 0.001;
    const tMax = params.mode === "loop"
      ? Math.max(0.1, ((params.regionWidthCm + params.loopWidthCm * 2) * 1e-2) / Math.max(1e-3, Math.abs(params.velocityCmS) * 1e-2))
      : 5;
    const N = Math.min(800, Math.max(200, Math.round(tMax / dt / 2)));
    const stride = Math.max(1, Math.round((tMax / dt) / N));

    let pos = faradayInitialPos(params);
    let vel = faradayInitialVel(params);
    let t = 0;
    const out: { t: number; emf: number; flux: number; current: number }[] = [];
    const stop = params.mode === "loop"
      ? () => pos > (params.regionWidthCm * 1e-2 / 2 + params.loopWidthCm * 1e-2 / 2 + 0.02)
      : () => pos < -(params.coilLengthCm * 1e-2 / 2 + 0.5);

    let step = 0;
    while (t < tMax && !stop()) {
      if (step % stride === 0) {
        const st = faradayState(params, t, pos, vel);
        out.push({
          t: +t.toFixed(4),
          emf: +st.emf.toFixed(6),
          flux: +st.flux.toFixed(8),
          current: +st.current.toFixed(6),
        });
      }
      const next = faradayStep(params, pos, vel, dt);
      pos = next.pos; vel = next.vel; t += dt; step++;
    }
    return out;
  }, [params]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["t_s", "Phi_Wb", "emf_V", "i_A"],
      ...series.map((p) => [p.t, p.flux, p.emf, p.current]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `faraday_${params.mode}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const integral = series.reduce((acc, p, i, arr) => {
    if (i === 0) return 0;
    const dt = p.t - arr[i - 1].t;
    return acc + p.emf * dt;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Evolução de Φ(t), ε(t) e i(t) durante todo o evento. ∫ε dt ≈ {integral.toExponential(3)} V·s
          deve coincidir com −ΔΦ.
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <ChartCard title="ε(t) — f.e.m. induzida" subtitle="Picos correspondem às bordas da região B (loop) ou às extremidades da bobina (ímã).">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={series} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="t" type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "t (s)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--primary))" tick={{ fontSize: 11 }}
              label={{ value: "ε (V)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toExponential(3)} />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
            <Line type="monotone" dataKey="emf" name="ε (V)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Φ(t) e i(t)" subtitle="Note que i(t) ∝ −dΦ/dt (lei de Lenz).">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={series} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="t" type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "t (s)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="hsl(var(--primary))" tick={{ fontSize: 11 }}
              label={{ value: "Φ (Wb)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" tick={{ fontSize: 11 }}
              label={{ value: "i (A)", angle: 90, position: "insideRight", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toExponential(3)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line yAxisId="left" type="monotone" dataKey="flux" name="Φ (Wb)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="current" name="i (A)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
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