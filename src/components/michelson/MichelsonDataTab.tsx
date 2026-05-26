import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { computeMichelson, type MichelsonParams, type MichelsonResults } from "@/lib/physics";

interface Props { params: MichelsonParams; results: MichelsonResults }
type View = "scan" | "lambda" | "radial";

export const MichelsonDataTab = ({ params, results }: Props) => {
  const [view, setView] = useState<View>("scan");

  // Curva I(λ) para o Δ atual
  const lambdaCurve = useMemo(() => {
    const arr: { lambda: number; I: number }[] = [];
    for (let nm = 380; nm <= 780; nm += 1) {
      const r = computeMichelson({ ...params, wavelengthNm: nm });
      arr.push({ lambda: nm, I: r.centralIntensity });
    }
    return arr;
  }, [params]);

  // Perfil radial da intensidade no anteparo (linha central horizontal)
  const radial = useMemo(() => {
    const N = results.gridN;
    const arr: { r: number; I: number }[] = [];
    const row = Math.floor(N / 2);
    for (let ix = 0; ix < N; ix++) {
      const x = ((ix / (N - 1)) - 0.5) * params.screenSizeMm; // mm
      arr.push({ r: x, I: results.intensityMap[row * N + ix] });
    }
    return arr;
  }, [results, params.screenSizeMm]);

  const exportCsv = () => {
    let csv = "";
    if (view === "scan") {
      csv = "dx_nm,I\n" + results.scanCurve.map((p) => `${p.dx},${p.I}`).join("\n");
    } else if (view === "lambda") {
      csv = "lambda_nm,I_center\n" + lambdaCurve.map((p) => `${p.lambda},${p.I}`).join("\n");
    } else {
      csv = "x_mm,I\n" + radial.map((p) => `${p.r},${p.I}`).join("\n");
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `michelson_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    scan: "Varredura de M₂ — I_central(δx)",
    lambda: "Resposta espectral — I_central(λ) para o Δ atual",
    radial: "Perfil radial da intensidade no anteparo",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">λ = {params.wavelengthNm.toFixed(1)} nm · modo {params.mode}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["scan", "lambda", "radial"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "scan" ? "I(δx)" : k === "lambda" ? "I(λ)" : "Perfil radial"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={view === "scan" ? results.scanCurve : view === "lambda" ? lambdaCurve : radial}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={view === "scan" ? "dx" : view === "lambda" ? "lambda" : "r"}
              type="number"
              domain={["dataMin", "dataMax"]}
              stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{
                value: view === "scan" ? "δx em M₂ (nm)" : view === "lambda" ? "λ (nm)" : "x no anteparo (mm)",
                position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11,
              }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 1]} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <ReferenceLine y={0.5} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 3" />
            <Line type="monotone" dataKey="I" stroke="hsl(200, 90%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {view === "scan" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Período da senóide = λ/2 em deslocamento de M₂: cada λ/2 ↔ uma franja completa pelo centro.
        </p>
      )}
      {view === "lambda" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Para Δ fixo, varrer λ produz batimentos cada vez mais rápidos no UV (Δ contém muitas λ). Base do FTIR.
        </p>
      )}
      {view === "radial" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Em modo circular, os mínimos se compactam à medida que o raio cresce (cos θ → 1 − θ²/2).
        </p>
      )}
    </div>
  );
};