import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { DavissonResults } from "@/lib/physics";

interface Props { results: DavissonResults }

export const DavissonDataTab = ({ results }: Props) => {
  const csv = () => {
    const rows = [["V (V)","lambda (nm)","phi_1 (deg)"]];
    results.scanByV.forEach((r) => rows.push([r.V.toFixed(3), r.lambda_nm.toFixed(5), r.firstPeak_deg.toFixed(3)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "davisson.csv"; a.click();
  };
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">λ(V) e ângulo do 1º pico</h3>
          <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={results.scanByV}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="V" tickFormatter={(v) => v.toFixed(0)} stroke="hsl(var(--muted-foreground))"
              label={{ value: "V (volts)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis yAxisId="l" tickFormatter={(v) => v.toFixed(3)} stroke="hsl(var(--primary))"
              label={{ value: "λ (nm)", angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }} />
            <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--accent))"
              label={{ value: "φ (°)", angle: 90, position: "insideRight", fill: "hsl(var(--accent))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Legend />
            <Line yAxisId="l" type="monotone" dataKey="lambda_nm" stroke="hsl(var(--primary))" dot={false} name="λ (nm)" />
            <Line yAxisId="r" type="monotone" dataKey="firstPeak_deg" stroke="hsl(var(--accent))" dot={false} name="φ₁ (°)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-3">Picos previstos (sen φ = nλ/d)</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground border-b border-border">
            <th className="py-1.5">n</th><th>sin φ</th><th>φ (°)</th><th>Intensidade rel.</th>
          </tr></thead>
          <tbody className="font-mono">
            {results.peaks.map((p) => (
              <tr key={p.n} className="border-b border-border/40">
                <td className="py-1">{p.n}</td>
                <td>{(Math.sin(p.phi_deg*Math.PI/180)).toFixed(4)}</td>
                <td>{p.phi_deg.toFixed(3)}</td>
                <td>{p.intensity.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};