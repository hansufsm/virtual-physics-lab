import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { simulatePendulum, type PendulumParams } from "@/lib/physics";

interface Props { params: PendulumParams }
type View = "time" | "phase" | "lengthSweep";

export const PendulumDataTab = ({ params }: Props) => {
  const [view, setView] = useState<View>("time");

  const data = useMemo(() => {
    if (view === "time") {
      const r = simulatePendulum(params);
      const step = Math.max(1, Math.floor(r.series.length / 400));
      return r.series
        .filter((_, i) => i % step === 0 || i === r.series.length - 1)
        .map((p) => ({ t: p.t, theta: (p.theta * 180) / Math.PI, omega: p.omega, energy: p.energy }));
    }
    if (view === "phase") {
      const r = simulatePendulum(params);
      const step = Math.max(1, Math.floor(r.series.length / 400));
      return r.series
        .filter((_, i) => i % step === 0)
        .map((p) => ({ theta: (p.theta * 180) / Math.PI, omega: p.omega }));
    }
    // length sweep: T(L)
    const out: { L: number; T_meas: number; T_th: number }[] = [];
    const N = 30;
    for (let i = 1; i <= N; i++) {
      const L = (5 * i) / N;
      const r = simulatePendulum({ ...params, length: L, damping: 0, duration: Math.max(20, 8 * Math.sqrt(L / params.gravity) * 2 * Math.PI) });
      out.push({ L, T_meas: r.periodMeasured ?? r.periodSmallAngle, T_th: r.periodSmallAngle });
    }
    return out;
  }, [params, view]);

  const exportCsv = () => {
    let head = "", rows = "";
    if (view === "time") {
      head = "t_s,theta_deg,omega_rad_s,energy_J\n";
      rows = (data as any[]).map((d) => `${d.t},${d.theta},${d.omega},${d.energy}`).join("\n");
    } else if (view === "phase") {
      head = "theta_deg,omega_rad_s\n";
      rows = (data as any[]).map((d) => `${d.theta},${d.omega}`).join("\n");
    } else {
      head = "L_m,T_measured_s,T_theory_s\n";
      rows = (data as any[]).map((d) => `${d.L},${d.T_meas},${d.T_th}`).join("\n");
    }
    const blob = new Blob([head + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pendulo_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    time: "Série temporal: θ(t), θ̇(t), E(t)",
    phase: "Espaço de fase θ × θ̇",
    lengthSweep: "Período T(L) — validação T = 2π√(L/g)",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">Análise gráfica e exportação dos dados.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["time", "phase", "lengthSweep"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "time" ? "θ(t)" : k === "phase" ? "θ × θ̇" : "T(L)"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            {view === "time" && (
              <>
                <XAxis dataKey="t" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "t (s)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="theta" name="θ (°)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="omega" name="θ̇ (rad/s)" stroke="hsl(var(--muted-foreground))" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                <Line type="monotone" dataKey="energy" name="E (J)" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              </>
            )}
            {view === "phase" && (
              <>
                <XAxis dataKey="theta" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "θ (°)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis dataKey="omega" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "θ̇ (rad/s)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="omega" name="θ̇ vs θ" stroke="hsl(var(--primary))" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              </>
            )}
            {view === "lengthSweep" && (
              <>
                <XAxis dataKey="L" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "L (m)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "T (s)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="T_meas" name="T medido" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="T_th" name="T = 2π√(L/g)" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};