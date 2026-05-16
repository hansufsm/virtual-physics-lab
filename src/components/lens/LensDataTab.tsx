import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { computeThinLens, type ThinLensParams } from "@/lib/physics";

interface Props { params: ThinLensParams }
type View = "di_vs_do" | "m_vs_do" | "newton";

export const LensDataTab = ({ params }: Props) => {
  const [view, setView] = useState<View>("di_vs_do");

  const data = useMemo(() => {
    const N = 200;
    const f = computeThinLens(params).focalCm;
    const minD = 1;
    const maxD = Math.max(80, Math.abs(f) * 6);
    return Array.from({ length: N }, (_, i) => {
      const dO = minD + (i / (N - 1)) * (maxD - minD);
      const r = computeThinLens({ ...params, objectDistanceCm: dO });
      const di = r.imageDistanceCm;
      const m = r.magnification;
      const safe = (v: number | null) => (v == null || !isFinite(v) || Math.abs(v) > 500 ? null : v);
      return {
        d0: dO,
        di: safe(di),
        m: safe(m),
        // Newton: (d0 - f)(di - f) = f²
        xi: safe(dO - f),
        yi: safe(di == null ? null : di - f),
      };
    });
  }, [params, view]);

  const exportCsv = () => {
    const head = "d0_cm,di_cm,m,xi,yi\n";
    const rows = data.map((d) => `${d.d0},${d.di ?? ""},${d.m ?? ""},${d.xi ?? ""},${d.yi ?? ""}`).join("\n");
    const blob = new Blob([head + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `lente_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const f = computeThinLens(params).focalCm;

  const titles: Record<View, string> = {
    di_vs_do: "Distância da imagem dᵢ × distância do objeto d₀",
    m_vs_do: "Ampliação m × distância do objeto d₀",
    newton: "Forma de Newton: (d₀ − f) × (dᵢ − f) = f²",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">Varredura de d₀ com a lente atual (f = {f.toFixed(2)} cm).</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["di_vs_do", "m_vs_do", "newton"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "di_vs_do" ? "dᵢ × d₀" : k === "m_vs_do" ? "m × d₀" : "Newton"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={view === "newton" ? "xi" : "d0"} type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{
                value: view === "newton" ? "d₀ − f (cm)" : "d₀ (cm)",
                position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11,
              }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {view === "di_vs_do" && (
              <>
                <ReferenceLine x={f} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "d₀ = f", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Line type="monotone" dataKey="di" name="dᵢ (cm)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls={false} />
              </>
            )}
            {view === "m_vs_do" && (
              <>
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                <Line type="monotone" dataKey="m" name="m" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls={false} />
              </>
            )}
            {view === "newton" && (
              <Line type="monotone" dataKey="yi" name="dᵢ − f (cm)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};