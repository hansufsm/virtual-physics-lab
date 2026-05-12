import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { simulateProjectile, type ProjectileParams } from "@/lib/physics";

interface Props { params: ProjectileParams }
type SweepKey = "trajectory" | "angle" | "speed";

export const ProjectileDataTab = ({ params }: Props) => {
  const [sweep, setSweep] = useState<SweepKey>("trajectory");

  const data = useMemo(() => {
    if (sweep === "trajectory") {
      const r = simulateProjectile(params);
      // sub-sample for chart
      const step = Math.max(1, Math.floor(r.trajectory.length / 200));
      return r.trajectory.filter((_, i) => i % step === 0 || i === r.trajectory.length - 1)
        .map((p) => ({ x: p.x, y: Math.max(0, p.y), v: Math.hypot(p.vx, p.vy) }));
    }
    const out: { x: number; range: number; height: number; time: number }[] = [];
    const N = 90;
    for (let i = 0; i <= N; i++) {
      const p = { ...params };
      let key: number;
      if (sweep === "angle") {
        key = (90 * i) / N; p.angleDeg = key;
      } else {
        key = 1 + (99 * i) / N; p.speed = key;
      }
      const r = simulateProjectile(p);
      out.push({ x: key, range: r.range, height: r.maxHeight, time: r.flightTime });
    }
    return out;
  }, [params, sweep]);

  const exportCsv = () => {
    const head = sweep === "trajectory" ? "x_m,y_m,v_m_s\n" : "param,range_m,maxHeight_m,flightTime_s\n";
    const body = sweep === "trajectory"
      ? (data as any[]).map((d) => `${d.x},${d.y},${d.v}`).join("\n")
      : (data as any[]).map((d) => `${d.x},${d.range},${d.height},${d.time}`).join("\n");
    const blob = new Blob([head + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `projeteis_${sweep}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const labels: Record<SweepKey, { x: string; title: string }> = {
    trajectory: { x: "x (m)", title: "Trajetória y(x)" },
    angle: { x: "θ (°)", title: "Alcance, altura e tempo vs ângulo" },
    speed: { x: "v₀ (m/s)", title: "Alcance, altura e tempo vs velocidade inicial" },
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{labels[sweep].title}</h3>
          <p className="text-xs text-muted-foreground">
            {sweep === "trajectory" ? "Posição vertical em função da posição horizontal." : "Varredura mantendo demais parâmetros fixos."}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["trajectory", "angle", "speed"] as SweepKey[]).map((k) => (
            <Button key={k} size="sm" variant={sweep === k ? "default" : "outline"} onClick={() => setSweep(k)}>
              {k === "trajectory" ? "y(x)" : k === "angle" ? "vs θ" : "vs v₀"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["dataMin", "dataMax"]}
              label={{ value: labels[sweep].x, position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {sweep === "trajectory" ? (
              <>
                <Line type="monotone" dataKey="y" name="y (m)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="v" name="|v| (m/s)" stroke="hsl(var(--muted-foreground))" dot={false} strokeWidth={1.5} strokeDasharray="4 3" isAnimationActive={false} />
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="range" name="R (m)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="height" name="H (m)" stroke="hsl(var(--muted-foreground))" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                <Line type="monotone" dataKey="time" name="T (s)" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};