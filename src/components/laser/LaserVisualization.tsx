import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import type { LaserResults } from "@/lib/physics";

export const LaserVisualization = ({ results }: { results: LaserResults }) => (
  <div className="space-y-3">
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Curva de ganho × modos longitudinais</h4>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={results.gainCurve}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="f_GHz" type="number" domain={["auto","auto"]} stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => v.toFixed(1)}
            label={{ value: "Δν (GHz)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis stroke="hsl(var(--primary))" domain={[0, 1.05]}
            label={{ value: "ganho", angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          <Line type="monotone" dataKey="g" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
          {results.modes.map((m, i) => (
            <ReferenceLine key={i} x={m.f_GHz}
              stroke={m.lasing ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"}
              strokeDasharray={m.lasing ? undefined : "2 3"}
              strokeWidth={m.lasing ? 1.5 : 0.8} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Transmissão do Fabry–Perot (Airy)</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={results.airy}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="f_GHz" type="number" domain={["auto","auto"]} stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => v.toFixed(2)}
            label={{ value: "Δν (GHz)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis stroke="hsl(var(--accent))" domain={[0,1]}
            label={{ value: "T(ν)", angle: -90, position: "insideLeft", fill: "hsl(var(--accent))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          <Line type="monotone" dataKey="T" stroke="hsl(var(--accent))" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);