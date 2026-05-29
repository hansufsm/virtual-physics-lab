import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { SternResults } from "@/lib/physics";

interface Props { results: SternResults }

export const SternDataTab = ({ results }: Props) => {
  const csv = () => {
    const rows = [["gradient (T/m)","separation (mm)"]];
    results.scanByGrad.forEach((r) => rows.push([r.grad.toFixed(2), r.sep_mm.toFixed(4)]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "stern.csv"; a.click();
  };
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Separação Δz × Gradiente</h3>
          <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={results.scanByGrad}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="grad" stroke="hsl(var(--muted-foreground))"
              label={{ value: "∂B/∂z (T/m)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis stroke="hsl(var(--primary))"
              label={{ value: "Δz (mm)", angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Legend />
            <Line type="monotone" dataKey="sep_mm" stroke="hsl(var(--primary))" dot={false} name="Δz (mm)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-3">Componentes do feixe</h3>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-muted-foreground border-b border-border">
            <th className="py-1.5">m_s</th><th>z (mm)</th><th>peso</th>
          </tr></thead>
          <tbody className="font-mono">
            {results.beams.map((b, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-1">{b.ms > 0 ? "+1/2" : "−1/2"}</td>
                <td>{b.z_mm.toFixed(4)}</td>
                <td>{b.weight.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};