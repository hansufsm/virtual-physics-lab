import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { NMRResults } from "@/lib/physics";

export const NMRVisualization = ({ results }: { results: NMRResults }) => (
  <div className="space-y-3">
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">FID — Free Induction Decay</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={results.fid}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" type="number" domain={["auto","auto"]}
            tickFormatter={(v) => v.toFixed(0)}
            label={{ value: "t (ms)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis stroke="hsl(var(--primary))" domain={[-1, 1]}
            label={{ value: "S(t)", angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          <Line type="monotone" dataKey="signal" stroke="hsl(var(--primary))" dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Espectro (após FFT) — Lorentziana</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={results.spectrum}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="f" stroke="hsl(var(--muted-foreground))" type="number" domain={["auto","auto"]}
            tickFormatter={(v) => v.toFixed(2)}
            label={{ value: "Δν (kHz)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis stroke="hsl(var(--accent))" domain={[0, 1]}
            label={{ value: "intensidade", angle: -90, position: "insideLeft", fill: "hsl(var(--accent))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          <Line type="monotone" dataKey="amp" stroke="hsl(var(--accent))" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);