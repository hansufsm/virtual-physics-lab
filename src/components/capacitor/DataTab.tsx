import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { computeCapacitor, formatSI, type CapacitorParams } from "@/lib/physics";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useMemo } from "react";

interface Props { params: CapacitorParams; }

export const DataTab = ({ params }: Props) => {
  // Sweep distance d, holding other params constant
  const dataD = useMemo(() => {
    const points = [];
    for (let d = 0.5; d <= 20; d += 0.5) {
      const r = computeCapacitor({ ...params, distanceMm: d });
      points.push({ d, C_pF: r.capacitance * 1e12, Q_nC: r.charge * 1e9 });
    }
    return points;
  }, [params]);

  // Sweep voltage V
  const dataV = useMemo(() => {
    const points = [];
    for (let v = -50; v <= 50; v += 2) {
      const r = computeCapacitor({ ...params, voltage: v });
      points.push({ V: v, Q_nC: r.charge * 1e9, U_nJ: r.energy * 1e9 });
    }
    return points;
  }, [params]);

  const exportCsv = () => {
    const rows = [
      ["distance_mm", "capacitance_F", "charge_C"],
      ...dataD.map(p => [p.d.toFixed(2), (p.C_pF * 1e-12).toExponential(4), (p.Q_nC * 1e-9).toExponential(4)]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "capacitor_C_vs_d.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Varreduras de parâmetros mantendo os demais constantes. Use os controles ao lado para mudar a configuração base.
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <ChartCard title="Capacitância C(d) — d em mm, C em pF" subtitle="Mantendo V, A e εᵣ constantes">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dataD} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} label={{ value: "d (mm)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} label={{ value: "C (pF)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => v.toFixed(3)} />
            <Line type="monotone" dataKey="C_pF" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Q(V) e U(V)" subtitle="Carga e energia em função da tensão">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={dataV} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="V" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} label={{ value: "V (V)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Q_nC" name="Q (nC)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="U_nJ" name="U (nJ)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">
          Configuração base: V = {params.voltage.toFixed(1)} V · A = {params.areaCm2} cm² · εᵣ = {params.epsilonR.toFixed(2)}.
          Para a curva C(d), C atual = {formatSI(computeCapacitor(params).capacitance, "F")}.
        </p>
      </div>
    </div>
  );
};

const ChartCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
    <div className="px-5 py-3 border-b border-border">
      <h4 className="font-display font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
    <div className="p-3">{children}</div>
  </div>
);