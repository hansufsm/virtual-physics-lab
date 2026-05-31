import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import type { GratingResults } from "@/lib/physics";
export const GratingVisualization = ({ results }: { results: GratingResults }) => (
  <div className="space-y-3">
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Padrão de difração I(θ)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={results.intensity}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="angle_deg" type="number" stroke="hsl(var(--muted-foreground))" tickFormatter={(v)=>v.toFixed(0)+"°"}
            label={{ value: "θ (graus)", position:"insideBottom", offset:-2, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis domain={[0, 1.05]} stroke="hsl(var(--muted-foreground))"
            label={{ value: "I/I₀", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            formatter={(v: number) => v.toFixed(3)} labelFormatter={(v: number) => `θ = ${v.toFixed(2)}°`} />
          {results.orders.map((o) => (
            <ReferenceLine key={o.m} x={o.angle_deg} stroke="hsl(var(--accent))" strokeDasharray="3 3"
              label={{ value: `m=${o.m}`, fill: "hsl(var(--accent))", fontSize: 10, position: "top" }} />
          ))}
          <Line type="monotone" dataKey="I" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Posição dos máximos no anteparo</h4>
      <div className="relative h-12 rounded-md overflow-hidden bg-background">
        {results.orders.map((o) => {
          const left = 50 + (o.angle_deg / 90) * 50;
          return (
            <div key={o.m} className="absolute top-0 bottom-0" style={{ left: `${left}%`, width: 3, background: "hsl(var(--primary))", boxShadow: "0 0 10px hsl(var(--primary))" }}>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground">m={o.m}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-7 font-mono">
        <span>−90°</span><span>0°</span><span>+90°</span>
      </div>
    </div>
  </div>
);
