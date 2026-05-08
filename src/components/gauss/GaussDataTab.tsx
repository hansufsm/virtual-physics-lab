import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { computeGauss, gaussField, type GaussParams } from "@/lib/physics";

interface Props { params: GaussParams }

type SweepKey = "r" | "Q" | "rs";

export const GaussDataTab = ({ params }: Props) => {
  const [sweep, setSweep] = useState<SweepKey>("r");
  const N = 100;

  const data = useMemo(() => {
    const out: { x: number; y: number; y2?: number }[] = [];
    for (let i = 1; i <= N; i++) {
      const t = i / N;
      let x = 0, y = 0; let y2: number | undefined;
      if (sweep === "r") {
        const r = 0.002 + t * 0.40; // 0.2 to 40 cm
        const p2: GaussParams = { ...params, probeRcm: r * 100 };
        x = r * 100; y = gaussField(p2);
      } else if (sweep === "Q") {
        const Q = -100e-9 + t * 200e-9;
        const p2: GaussParams = { ...params, Q, lambda: Q, sigma: Q };
        const dr = computeGauss(p2);
        x = Q * 1e9; y = dr.flux; y2 = dr.E;
      } else {
        const rs = 0.005 + t * 0.40;
        const p2: GaussParams = { ...params, surfaceRadiusCm: rs * 100 };
        const dr = computeGauss(p2);
        x = rs * 100; y = dr.Qenc; y2 = dr.flux;
      }
      out.push({ x, y, y2 });
    }
    return out;
  }, [params, sweep]);

  const labels: Record<SweepKey, { x: string; y: string; y2?: string; title: string }> = {
    r: { x: "r (cm)", y: "E (V/m)", title: "E em função da distância" },
    Q: { x: "fonte (nC, nC/m, nC/m²)", y: "Φ (V·m)", y2: "E (V/m)", title: "Linearidade Φ × fonte" },
    rs: { x: "raio gaussiana (cm)", y: "Q_enc (C)", y2: "Φ (V·m)", title: "Q_enc e Φ vs tamanho da gaussiana" },
  };

  const exportCsv = () => {
    const l = labels[sweep];
    const head = `${l.x},${l.y}${l.y2 ? "," + l.y2 : ""}\n`;
    const body = data.map((d) => `${d.x},${d.y}${l.y2 ? "," + (d.y2 ?? "") : ""}`).join("\n");
    const blob = new Blob([head + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `gauss_${sweep}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{labels[sweep].title}</h3>
          <p className="text-xs text-muted-foreground">Selecione a varredura.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["r", "Q", "rs"] as SweepKey[]).map((k) => (
            <Button key={k} size="sm" variant={sweep === k ? "default" : "outline"} onClick={() => setSweep(k)}>
              {k === "rs" ? "raio S" : k === "Q" ? "fonte" : "r"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="x" type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={["dataMin", "dataMax"]}
              label={{ value: labels[sweep].x, position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
              label={{ value: labels[sweep].y, angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="y" name={labels[sweep].y} stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            {labels[sweep].y2 && (
              <Line type="monotone" dataKey="y2" name={labels[sweep].y2!} stroke="hsl(var(--accent-foreground))" dot={false} strokeWidth={2} isAnimationActive={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};