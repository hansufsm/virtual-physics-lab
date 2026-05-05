import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { integrateChargeTrajectory, type ChargeParams } from "@/lib/physics";

interface Props { params: ChargeParams }

export const ChargeDataTab = ({ params }: Props) => {
  const data = useMemo(() => {
    const t = integrateChargeTrajectory(params, 1500, 1);
    const out: { t: number; x: number; y: number; v: number; KE: number }[] = [];
    const m = 1.6726e-27 * Math.max(1e-9, params.massP);
    for (let i = 0; i < t.x.length; i += 5) {
      const v = Math.hypot(t.vx[i], t.vy[i]);
      out.push({
        t: t.t[i] * 1e9, // ns
        x: t.x[i] * 1000, // mm
        y: t.y[i] * 1000,
        v,
        KE: 0.5 * m * v * v / 1.602e-19, // eV
      });
    }
    return out;
  }, [params]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="font-display text-base font-semibold mb-1">Trajetória y(x)</h3>
        <p className="text-xs text-muted-foreground mb-4">Posição da partícula no plano (mm).</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="x" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: "x (mm)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis dataKey="y" stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: "y (mm)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-semibold mb-1">|v|(t)</h3>
          <p className="text-xs text-muted-foreground mb-4">Módulo da velocidade no tempo.</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "t (ns)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-semibold mb-1">Energia cinética (eV)</h3>
          <p className="text-xs text-muted-foreground mb-4">Em B puro a energia se conserva; em E cresce.</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "t (ns)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="KE" name="KE (eV)" stroke="hsl(var(--destructive))" dot={false} strokeWidth={2} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};