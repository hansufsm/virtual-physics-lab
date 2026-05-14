import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { simulateIdealGas, type IdealGasParams } from "@/lib/physics";

interface Props { params: IdealGasParams }
type View = "pv" | "tv" | "isoSweep";

export const IdealGasDataTab = ({ params }: Props) => {
  const [view, setView] = useState<View>("pv");

  const data = useMemo(() => {
    if (view === "pv" || view === "tv") {
      const r = simulateIdealGas(params);
      return r.path.map((p) => ({ V: p.V, P_kPa: p.P / 1000, T: p.T }));
    }
    // Comparar 4 isotermas a temperaturas diferentes (P × V)
    const Ts = [params.T1 * 0.5, params.T1, params.T1 * 1.5, params.T1 * 2];
    const Vs = Array.from({ length: 60 }, (_, i) => 0.5 + (i / 59) * 49.5);
    return Vs.map((V) => {
      const row: Record<string, number> = { V };
      Ts.forEach((T) => {
        const P = (params.moles * 8.314462618 * T) / (V * 1e-3);
        row[`T${Math.round(T)}K`] = P / 1000;
      });
      return row;
    });
  }, [params, view]);

  const exportCsv = () => {
    let head = "", rows = "";
    if (view === "pv" || view === "tv") {
      head = "V_L,P_kPa,T_K\n";
      rows = (data as any[]).map((d) => `${d.V},${d.P_kPa},${d.T}`).join("\n");
    } else {
      const keys = Object.keys((data as any[])[0]);
      head = keys.join(",") + "\n";
      rows = (data as any[]).map((d) => keys.map((k) => d[k]).join(",")).join("\n");
    }
    const blob = new Blob([head + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `gas_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    pv: "Diagrama P × V do processo",
    tv: "Temperatura T × V ao longo do processo",
    isoSweep: "Isotermas: P × V para diferentes T (gás ideal)",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">Análise gráfica e exportação dos dados.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["pv", "tv", "isoSweep"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "pv" ? "P × V" : k === "tv" ? "T × V" : "Isotermas"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="V" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: "V (L)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {view === "pv" && (
              <Line type="monotone" dataKey="P_kPa" name="P (kPa)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            )}
            {view === "tv" && (
              <Line type="monotone" dataKey="T" name="T (K)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            )}
            {view === "isoSweep" && Object.keys((data as any[])[0]).filter((k) => k !== "V").map((k, i) => (
              <Line key={k} type="monotone" dataKey={k} name={k} dot={false} strokeWidth={1.5} isAnimationActive={false}
                stroke={i === 1 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                strokeDasharray={i === 1 ? undefined : "4 3"} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};