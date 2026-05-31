import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";
import type { BlackbodyResults } from "@/lib/physics";
export const BlackbodyVisualization = ({ results }: { results: BlackbodyResults }) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card">
    <h4 className="text-sm font-semibold mb-2">Radiância espectral B(λ, T)</h4>
    <ResponsiveContainer width="100%" height={420}>
      <LineChart data={results.spectrum}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="lambda_nm" type="number" scale="log" domain={["dataMin","dataMax"]} stroke="hsl(var(--muted-foreground))"
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}μm` : `${v.toFixed(0)}nm`}
          label={{ value: "λ", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis scale="log" domain={["auto","auto"]} stroke="hsl(var(--muted-foreground))"
          tickFormatter={(v) => v.toExponential(0)}
          label={{ value: "B(λ)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          formatter={(v: number) => v.toExponential(2)} labelFormatter={(v: number) => `λ = ${v.toFixed(1)} nm`} />
        <Legend />
        <ReferenceLine x={results.peak_nm} stroke="hsl(var(--accent))" strokeDasharray="4 4" label={{ value: "λ_max", fill: "hsl(var(--accent))", fontSize: 11 }} />
        <Line type="monotone" dataKey="B_planck" name="Planck" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="B_rj"     name="Rayleigh–Jeans" stroke="hsl(var(--destructive))" dot={false} strokeWidth={1.5} strokeDasharray="4 3" />
        <Line type="monotone" dataKey="B_wien"   name="Wien (clássica)" stroke="hsl(var(--accent))" dot={false} strokeWidth={1.5} strokeDasharray="2 3" />
      </LineChart>
    </ResponsiveContainer>
    <p className="text-xs text-muted-foreground mt-2">Note como Rayleigh–Jeans diverge para λ pequeno (catástrofe do UV) e Wien falha para λ grande.</p>
  </div>
);
