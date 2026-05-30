import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { MillikanResults } from "@/lib/physics";

export const MillikanDataTab = ({ results }: { results: MillikanResults }) => {
  const csv = () => {
    const rows = [["n_cargas","contagem"]];
    results.histogram.forEach((r) => rows.push([r.e_units.toString(), r.count.toString()]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "millikan.csv"; a.click();
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">Histograma de cargas medidas (múltiplos de e)</h3>
        <Button size="sm" variant="outline" onClick={csv}>Exportar CSV</Button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={results.histogram}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="e_units" stroke="hsl(var(--muted-foreground))"
            label={{ value: "q / e", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis stroke="hsl(var(--primary))"
            label={{ value: "contagem", angle: -90, position: "insideLeft", fill: "hsl(var(--primary))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
          <Bar dataKey="count" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground mt-2">As cargas se agrupam em valores inteiros de e — a observação chave de Millikan.</p>
    </div>
  );
};