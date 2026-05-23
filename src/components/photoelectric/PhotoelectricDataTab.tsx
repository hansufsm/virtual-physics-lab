import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { computePhotoelectric, PLANCK_H, ELECTRON_E, type PhotoelectricParams } from "@/lib/physics";

interface Props { params: PhotoelectricParams }
type View = "iv" | "vsVsF" | "iVsLambda";

export const PhotoelectricDataTab = ({ params }: Props) => {
  const [view, setView] = useState<View>("iv");

  const data = useMemo(() => {
    if (view === "iv") {
      return computePhotoelectric(params).ivCurve.map((d) => ({ x: d.V, y: d.I * 1e9 })); // nA
    }
    if (view === "vsVsF") {
      return computePhotoelectric(params).vsVsFreq.map((d) => ({ x: d.f, y: d.Vs }));
    }
    // corrente saturada vs comprimento de onda
    const out: { x: number; y: number }[] = [];
    for (let nm = 150; nm <= 750; nm += 10) {
      const r = computePhotoelectric({ ...params, wavelengthNm: nm });
      out.push({ x: nm, y: r.saturationCurrent * 1e9 });
    }
    return out;
  }, [params, view]);

  const exportCsv = () => {
    const headers: Record<View, string> = {
      iv: "V_volts,I_nA",
      vsVsF: "f_x10^14_Hz,Vs_V",
      iVsLambda: "lambda_nm,Isat_nA",
    };
    const rows = (data as any[]).map((d) => `${d.x},${d.y}`).join("\n");
    const blob = new Blob([headers[view] + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `fotoeletrico_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    iv: "Curva I × V (fotocorrente vs. tensão aplicada)",
    vsVsF: "Tensão de frenagem V_s × frequência (slope = h/e)",
    iVsLambda: "Corrente de saturação × comprimento de onda",
  };

  const axisLabels: Record<View, { x: string; y: string }> = {
    iv: { x: "V (V)", y: "I (nA)" },
    vsVsF: { x: "f (×10¹⁴ Hz)", y: "V_s (V)" },
    iVsLambda: { x: "λ (nm)", y: "I_sat (nA)" },
  };

  const hOverE = PLANCK_H / ELECTRON_E;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">
            {view === "vsVsF" ? `h/e ≈ ${(hOverE * 1e15).toFixed(3)} ×10⁻¹⁵ V·s` : "Análise paramétrica do efeito fotoelétrico."}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["iv", "vsVsF", "iVsLambda"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "iv" ? "I(V)" : k === "vsVsF" ? "V_s(f)" : "I_sat(λ)"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: axisLabels[view].x, position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: axisLabels[view].y, angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="y" name={axisLabels[view].y}
              stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            {view === "iv" && <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />}
            {view === "vsVsF" && <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};