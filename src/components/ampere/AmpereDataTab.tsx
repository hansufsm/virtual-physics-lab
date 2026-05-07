import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { computeAmpere, type AmpereParams } from "@/lib/physics";

interface Props { params: AmpereParams }

type SweepKey = "distance" | "I" | "N" | "rMean";

export const AmpereDataTab = ({ params }: Props) => {
  const [sweep, setSweep] = useState<SweepKey>("distance");
  const N = 80;

  const data = useMemo(() => {
    const out: { x: number; y: number; y2?: number }[] = [];
    for (let i = 1; i <= N; i++) {
      const t = i / N;
      let x = 0; let y = 0; let y2: number | undefined;
      if (sweep === "distance") {
        const d = 0.005 + t * 0.20; // 0.5 cm to 20 cm
        // single wire B vs distance
        const p2: AmpereParams = { ...params, geometry: "single", probeXcm: d * 100, probeYcm: 0 };
        const dr = computeAmpere(p2);
        x = d * 100; // cm
        y = dr.bAtProbe * 1e6; // µT
      } else if (sweep === "I") {
        const I = -50 + t * 100;
        const p2: AmpereParams = { ...params, I1: I };
        const dr = computeAmpere(p2);
        x = I;
        y = (params.geometry === "toroid" ? dr.bToroidInside : dr.bAtProbe) * 1e6;
        if (params.geometry === "parallel") y2 = dr.forcePerLength * 1e3; // mN/m
      } else if (sweep === "N") {
        const Nt = Math.round(10 + t * 1990);
        const p2: AmpereParams = { ...params, geometry: "toroid", N: Nt };
        const dr = computeAmpere(p2);
        x = Nt; y = dr.bToroidInside * 1e3; // mT
      } else if (sweep === "rMean") {
        const r = 1 + t * 29; // cm
        const p2: AmpereParams = { ...params, geometry: "toroid", rMeanCm: r };
        const dr = computeAmpere(p2);
        x = r; y = dr.bToroidInside * 1e3; // mT
      }
      out.push({ x, y, y2 });
    }
    return out;
  }, [params, sweep]);

  const labels: Record<SweepKey, { x: string; y: string; y2?: string; title: string }> = {
    distance: { x: "d (cm)", y: "B (µT)", title: "B vs distância (fio único)" },
    I: { x: "I (A)", y: "B (µT)", y2: "F/L (mN/m)", title: "B (e F/L) vs corrente" },
    N: { x: "N (espiras)", y: "B (mT)", title: "B no toroide vs N" },
    rMean: { x: "R (cm)", y: "B (mT)", title: "B no toroide vs R médio" },
  };

  const exportCsv = () => {
    const l = labels[sweep];
    const head = `${l.x},${l.y}${l.y2 ? "," + l.y2 : ""}\n`;
    const body = data.map((d) => `${d.x},${d.y}${l.y2 ? "," + (d.y2 ?? "") : ""}`).join("\n");
    const blob = new Blob([head + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ampere_${sweep}.csv`; a.click();
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
          {(["distance", "I", "N", "rMean"] as SweepKey[]).map((k) => (
            <Button key={k} size="sm" variant={sweep === k ? "default" : "outline"} onClick={() => setSweep(k)}>
              {k === "rMean" ? "R" : k}
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