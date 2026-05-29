import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { RutherfordResults } from "@/lib/physics";

interface Props { results: RutherfordResults }

export const RutherfordDataTab = ({ results }: Props) => {
  const csv = () => {
    const rows = [["theta (deg)","dsigma/dOmega (b/sr)"]];
    results.csVsTheta.forEach((r) => rows.push([r.theta.toFixed(1), r.ds.toExponential(4)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "rutherford.csv"; a.click();
  };
  // log scale data
  const dsLog = results.csVsTheta.map((r) => ({ theta: r.theta, logDs: Math.log10(Math.max(1e-10, r.ds)) }));
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">θ(b) — ângulo vs. parâmetro de impacto</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={results.angleVsB}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="b_fm" stroke="hsl(var(--muted-foreground))"
              label={{ value: "b (fm)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis stroke="hsl(var(--primary))"
              label={{ value: "θ (°)", angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Legend />
            <Line type="monotone" dataKey="theta_deg" stroke="hsl(var(--primary))" dot={false} name="θ(b)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">dσ/dΩ × θ (escala log)</h3>
          <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dsLog}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="theta" stroke="hsl(var(--muted-foreground))"
              label={{ value: "θ (°)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis stroke="hsl(var(--accent))" tickFormatter={(v) => v.toFixed(1)}
              label={{ value: "log₁₀(dσ/dΩ, b/sr)", angle: -90, position: "insideLeft", fill: "hsl(var(--accent))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Legend />
            <Line type="monotone" dataKey="logDs" stroke="hsl(var(--accent))" dot={false} name="log₁₀ dσ/dΩ" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};