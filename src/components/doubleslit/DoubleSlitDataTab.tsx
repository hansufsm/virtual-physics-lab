import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { dsEnvelope, dsIntensity, type DoubleSlitParams } from "@/lib/physics";

interface Props { params: DoubleSlitParams }
type SweepKey = "y" | "lambda" | "d";

export const DoubleSlitDataTab = ({ params }: Props) => {
  const [sweep, setSweep] = useState<SweepKey>("y");
  const N = 400;

  const data = useMemo(() => {
    const lambda0 = params.wavelengthNm * 1e-9;
    const a = params.slitWidthUm * 1e-6;
    const d0 = params.slitSepUm * 1e-6;
    const L = params.screenDistanceM;
    const Ns = Math.max(1, Math.round(params.numSlits));
    const out: { x: number; I: number; env: number }[] = [];

    if (sweep === "y") {
      const yMax = Math.max(0.005, Math.min(0.05, (3 * lambda0 * L) / a));
      for (let i = 0; i <= N; i++) {
        const yScreen = -yMax + (2 * yMax * i) / N;
        const theta = Math.atan2(yScreen, L);
        const I = Ns > 1 ? dsIntensity(theta, lambda0, a, d0, Ns) : dsEnvelope(theta, lambda0, a);
        out.push({ x: yScreen * 1e3, I, env: dsEnvelope(theta, lambda0, a) });
      }
    } else if (sweep === "lambda") {
      const yScreen = params.probeMm * 1e-3;
      const theta = Math.atan2(yScreen, L);
      for (let i = 0; i <= N; i++) {
        const nm = 380 + (400 * i) / N;
        const lam = nm * 1e-9;
        const I = Ns > 1 ? dsIntensity(theta, lam, a, d0, Ns) : dsEnvelope(theta, lam, a);
        out.push({ x: nm, I, env: dsEnvelope(theta, lam, a) });
      }
    } else {
      const yScreen = params.probeMm * 1e-3;
      const theta = Math.atan2(yScreen, L);
      for (let i = 0; i <= N; i++) {
        const dUm = 2 + (200 * i) / N;
        const dM = dUm * 1e-6;
        const I = Ns > 1 ? dsIntensity(theta, lambda0, a, dM, Ns) : dsEnvelope(theta, lambda0, a);
        out.push({ x: dUm, I, env: dsEnvelope(theta, lambda0, a) });
      }
    }
    return out;
  }, [params, sweep]);

  const labels: Record<SweepKey, { x: string; title: string }> = {
    y: { x: "y (mm)", title: "Intensidade I(y) na tela" },
    lambda: { x: "λ (nm)", title: "Intensidade vs λ no ponto de prova" },
    d: { x: "d (µm)", title: "Intensidade vs separação d no ponto de prova" },
  };

  const exportCsv = () => {
    const head = `${labels[sweep].x},I/I0,envelope\n`;
    const body = data.map((d) => `${d.x},${d.I},${d.env}`).join("\n");
    const blob = new Blob([head + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `fenda_dupla_${sweep}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{labels[sweep].title}</h3>
          <p className="text-xs text-muted-foreground">Linha cheia: I total. Tracejada: envelope sinc² (fenda única).</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["y", "lambda", "d"] as SweepKey[]).map((k) => (
            <Button key={k} size="sm" variant={sweep === k ? "default" : "outline"} onClick={() => setSweep(k)}>
              {k === "lambda" ? "λ" : k}
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
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 1]} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="I" name="I/I₀" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            <Line type="monotone" dataKey="env" name="envelope" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 3" dot={false} strokeWidth={1.5} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};