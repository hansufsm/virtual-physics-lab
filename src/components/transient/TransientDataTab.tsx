import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { formatSI, type TransientParams, type TransientResults } from "@/lib/physics";

interface Props { params: TransientParams; results: TransientResults }
type View = "i" | "v" | "energy";

export const TransientDataTab = ({ params, results }: Props) => {
  const [view, setView] = useState<View>("i");

  const data = useMemo(() => {
    return results.series.map((s) => ({
      t: s.t * 1000, // ms
      i: s.i,
      vR: s.vR, vL: s.vL, vC: s.vC,
      EL: s.energyL * 1000, // mJ
      EC: s.energyC * 1000,
    }));
  }, [results]);

  const exportCsv = () => {
    const header = "t_s,i_A,vR_V,vL_V,vC_V,EL_J,EC_J";
    const rows = results.series
      .map((s) => `${s.t},${s.i},${s.vR},${s.vL},${s.vC},${s.energyL},${s.energyC}`)
      .join("\n");
    const blob = new Blob([header + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `transitorio_${params.mode}_${params.phase}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    i: "Corrente i(t)",
    v: "Tensões nos componentes",
    energy: "Energia armazenada",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">
            tMax = {formatSI(params.tMax, "s", 3)} · regime: {results.regime}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["i", "v", "energy"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "i" ? "i(t)" : k === "v" ? "V" : "Energia"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="t" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: "t (ms)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
            {view === "i" && (
              <Line type="monotone" dataKey="i" name="i (A)" stroke="hsl(200, 90%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} />
            )}
            {view === "v" && (
              <>
                <Line type="monotone" dataKey="vR" name="V_R" stroke="hsl(0, 75%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="vL" name="V_L" stroke="hsl(280, 75%, 65%)" dot={false} strokeWidth={2} isAnimationActive={false} />
                {params.mode === "RLC" && (
                  <Line type="monotone" dataKey="vC" name="V_C" stroke="hsl(140, 70%, 50%)" dot={false} strokeWidth={2} isAnimationActive={false} />
                )}
              </>
            )}
            {view === "energy" && (
              <>
                <Line type="monotone" dataKey="EL" name="½Li² (mJ)" stroke="hsl(280, 75%, 65%)" dot={false} strokeWidth={2} isAnimationActive={false} />
                {params.mode === "RLC" && (
                  <Line type="monotone" dataKey="EC" name="½Cv² (mJ)" stroke="hsl(140, 70%, 50%)" dot={false} strokeWidth={2} isAnimationActive={false} />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {params.mode === "LR" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Em LR, i(t) = (V₀/R)[1 − e^(−t/τ)] (degrau) ou I₀ e^(−t/τ) (descarga). V_L = L·di/dt complementa V_R para totalizar V₀.
        </p>
      )}
      {params.mode === "RLC" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Trocas de energia entre L e C: no regime subamortecido, ½Li² e ½Cv² oscilam em quadratura enquanto R dissipa.
        </p>
      )}
    </div>
  );
};