import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import type { FranckHertzResults } from "@/lib/physics";

export const FranckHertzVisualization = ({ results }: { results: FranckHertzResults }) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card">
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={results.curve}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="V" stroke="hsl(var(--muted-foreground))" type="number" domain={["auto", "auto"]}
          tickFormatter={(v) => v.toFixed(0)}
          label={{ value: "Tensão de aceleração V (V)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis stroke="hsl(var(--primary))" tickFormatter={(v) => v.toFixed(1)}
          label={{ value: "Corrente I (u.a.)", angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
          formatter={(v: number) => v.toFixed(2)} labelFormatter={(l) => `V = ${Number(l).toFixed(2)} V`} />
        <Line type="monotone" dataKey="I" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
        {results.peaks.map((p) => (
          <ReferenceLine key={p.n} x={p.V} stroke="hsl(var(--accent))" strokeDasharray="4 4"
            label={{ value: `n=${p.n}`, position: "top", fill: "hsl(var(--accent))", fontSize: 11 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);