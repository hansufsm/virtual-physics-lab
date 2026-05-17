import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { simulateCollision, type CollisionParams } from "@/lib/physics";

interface Props { params: CollisionParams }
type View = "time" | "energy" | "eSweep";

export const CollisionDataTab = ({ params }: Props) => {
  const [view, setView] = useState<View>("time");

  const data = useMemo(() => {
    if (view === "time") {
      const r = simulateCollision(params);
      const step = Math.max(1, Math.floor(r.series.length / 300));
      return r.series.filter((_, i) => i % step === 0 || i === r.series.length - 1)
        .map((p) => ({ t: p.t, x1: p.x1, x2: p.x2, v1: p.v1, v2: p.v2 }));
    }
    if (view === "energy") {
      const r = simulateCollision(params);
      const step = Math.max(1, Math.floor(r.series.length / 300));
      return r.series.filter((_, i) => i % step === 0 || i === r.series.length - 1)
        .map((p) => ({ t: p.t, K: p.ke, p: p.p }));
    }
    // sweep on e
    const out: { e: number; v1: number; v2: number; K_after: number; lost: number }[] = [];
    const N = 40;
    for (let i = 0; i <= N; i++) {
      const e = i / N;
      const r = simulateCollision({ ...params, e });
      out.push({ e, v1: r.v1, v2: r.v2, K_after: r.ke_after, lost: r.ke_lost });
    }
    return out;
  }, [params, view]);

  const exportCsv = () => {
    let head = "", rows = "";
    if (view === "time") {
      head = "t_s,x1_m,x2_m,v1_m_s,v2_m_s\n";
      rows = (data as any[]).map((d) => `${d.t},${d.x1},${d.x2},${d.v1},${d.v2}`).join("\n");
    } else if (view === "energy") {
      head = "t_s,K_J,p_kg_m_s\n";
      rows = (data as any[]).map((d) => `${d.t},${d.K},${d.p}`).join("\n");
    } else {
      head = "e,v1_m_s,v2_m_s,K_after_J,K_lost_J\n";
      rows = (data as any[]).map((d) => `${d.e},${d.v1},${d.v2},${d.K_after},${d.lost}`).join("\n");
    }
    const blob = new Blob([head + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `colisao_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    time: "Posições e velocidades vs. tempo",
    energy: "Energia cinética e momento total vs. tempo",
    eSweep: "Varredura no coeficiente de restituição e",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">Análise gráfica e exportação dos dados.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["time", "energy", "eSweep"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "time" ? "x,v(t)" : k === "energy" ? "K,p(t)" : "vs. e"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            {view === "time" && (
              <>
                <XAxis dataKey="t" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "t (s)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="x1" name="x₁ (m)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="x2" name="x₂ (m)" stroke="hsl(var(--muted-foreground))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="v1" name="v₁ (m/s)" stroke="hsl(var(--primary))" strokeDasharray="4 3" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                <Line type="monotone" dataKey="v2" name="v₂ (m/s)" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              </>
            )}
            {view === "energy" && (
              <>
                <XAxis dataKey="t" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
                  label={{ value: "t (s)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="K" name="K (J)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="p" name="p (kg·m/s)" stroke="hsl(var(--muted-foreground))" dot={false} strokeWidth={2} isAnimationActive={false} />
              </>
            )}
            {view === "eSweep" && (
              <>
                <XAxis dataKey="e" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 1]}
                  label={{ value: "e", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="v1" name="v₁ (m/s)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="v2" name="v₂ (m/s)" stroke="hsl(var(--muted-foreground))" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="K_after" name="K depois (J)" stroke="hsl(var(--primary))" strokeDasharray="4 3" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                <Line type="monotone" dataKey="lost" name="ΔK dissipada (J)" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};