import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { computeCalorimetry, type CalorimetryParams } from "@/lib/physics";

interface Props { params: CalorimetryParams }
type View = "timeline" | "TfvsMs" | "TfvsMice";

export const CalorimetryDataTab = ({ params }: Props) => {
  const [view, setView] = useState<View>("timeline");

  const data = useMemo(() => {
    if (view === "timeline") {
      const r = computeCalorimetry(params);
      return r.series.map((s) => ({ t: +s.t.toFixed(2), Agua: +s.TWater.toFixed(2), Solido: +s.TSolid.toFixed(2), Gelo: +s.TIce.toFixed(2) }));
    }
    if (view === "TfvsMs") {
      const out: { x: number; Tf: number }[] = [];
      const N = 40;
      for (let i = 0; i <= N; i++) {
        const m = (i / N) * 0.5;
        const r = computeCalorimetry({ ...params, mSolid: m });
        out.push({ x: m * 1000, Tf: r.Tf });
      }
      return out;
    }
    // Tf vs massa de gelo
    const out: { x: number; Tf: number }[] = [];
    const N = 40;
    for (let i = 0; i <= N; i++) {
      const m = (i / N) * 0.3;
      const r = computeCalorimetry({ ...params, mIce: m });
      out.push({ x: m * 1000, Tf: r.Tf });
    }
    return out;
  }, [params, view]);

  const exportCsv = () => {
    let head = "", rows = "";
    if (view === "timeline") {
      head = "t_s,T_agua,T_solido,T_gelo\n";
      rows = (data as any[]).map((d) => `${d.t},${d.Agua},${d.Solido},${d.Gelo}`).join("\n");
    } else if (view === "TfvsMs") {
      head = "m_solido_g,Tf_C\n";
      rows = (data as any[]).map((d) => `${d.x},${d.Tf}`).join("\n");
    } else {
      head = "m_gelo_g,Tf_C\n";
      rows = (data as any[]).map((d) => `${d.x},${d.Tf}`).join("\n");
    }
    const blob = new Blob([head + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `calorimetria_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    timeline: "Temperatura vs. tempo (aproximação ao equilíbrio)",
    TfvsMs: "Temperatura final vs. massa do sólido",
    TfvsMice: "Temperatura final vs. massa de gelo",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">Evolução térmica e varreduras paramétricas.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["timeline", "TfvsMs", "TfvsMice"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "timeline" ? "T(t)" : k === "TfvsMs" ? "Tf(mₛ)" : "Tf(m_gelo)"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={view === "timeline" ? "t" : "x"} type="number"
              stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: view === "timeline" ? "t (s)" : view === "TfvsMs" ? "m_sólido (g)" : "m_gelo (g)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: view === "timeline" ? "T (°C)" : "T_eq (°C)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {view === "timeline" ? (
              <>
                <Line type="monotone" dataKey="Agua" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="Solido" stroke="hsl(0,72%,55%)" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="Gelo" stroke="hsl(200,80%,55%)" dot={false} strokeWidth={2} isAnimationActive={false} strokeDasharray="4 3" />
              </>
            ) : (
              <>
                <Line type="monotone" dataKey="Tf" name="T_eq (°C)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <ReferenceLine y={0} stroke="hsl(200,60%,50%)" strokeDasharray="3 3" />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};