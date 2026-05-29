import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";
import type { QHallResults } from "@/lib/physics";

interface Props { results: QHallResults }

export const QHallVisualization = ({ results }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={results.curve} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="B" tickFormatter={(v) => v.toFixed(1)} stroke="hsl(var(--muted-foreground))"
            label={{ value: "B (T)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis yAxisId="xy" stroke="hsl(var(--primary))"
            label={{ value: "R_xy (Ω)", angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }} />
          <YAxis yAxisId="xx" orientation="right" stroke="hsl(var(--accent))"
            label={{ value: "R_xx (Ω)", angle: 90, position: "insideRight", fill: "hsl(var(--accent))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          <Legend />
          <Line yAxisId="xy" type="monotone" dataKey="R_xy" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} name="R_xy (Ω)" />
          <Line yAxisId="xx" type="monotone" dataKey="R_xx" stroke="hsl(var(--accent))" dot={false} strokeWidth={1.5} name="R_xx (Ω)" />
          {[1,2,3,4,5,6].map((nu) => (
            <ReferenceLine key={nu} yAxisId="xy" y={25812.807/nu} stroke="hsl(var(--primary)/0.25)" strokeDasharray="2 3"
              label={{ value: `ν=${nu}`, position: "right", fill: "hsl(var(--primary))", fontSize: 10 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};