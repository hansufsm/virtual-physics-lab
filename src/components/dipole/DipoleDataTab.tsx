import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { computeDipole, type DipoleParams } from "@/lib/physics";

interface Props { params: DipoleParams }
type SweepKey = "theta" | "Eext" | "r";

export const DipoleDataTab = ({ params }: Props) => {
  const [sweep, setSweep] = useState<SweepKey>("theta");
  const N = 120;

  const data = useMemo(() => {
    const out: { x: number; y: number; y2?: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      let x = 0, y = 0; let y2: number | undefined;
      if (sweep === "theta") {
        const th = -180 + t * 360;
        const dr = computeDipole({ ...params, thetaDeg: th });
        x = th; y = dr.torque; y2 = dr.energy;
      } else if (sweep === "Eext") {
        const E = t * 500000;
        const dr = computeDipole({ ...params, Eext: E });
        x = E / 1000; y = dr.torque; y2 = dr.energy;
      } else {
        const r = 0.005 + t * 0.30;
        const dr = computeDipole({ ...params, probeXcm: r * 100, probeYcm: 0 });
        x = r * 100; y = dr.Emag;
      }
      out.push({ x, y, y2 });
    }
    return out;
  }, [params, sweep]);

  const labels: Record<SweepKey, { x: string; y: string; y2?: string; title: string }> = {
    theta: { x: "θ (°)", y: "τ (N·m)", y2: "U (J)", title: "Torque e energia × ângulo" },
    Eext: { x: "E (kV/m)", y: "τ (N·m)", y2: "U (J)", title: "Resposta linear ao campo externo" },
    r: { x: "r (cm) sobre o eixo", y: "|E_dip| (V/m)", title: "Campo do dipolo: |E| ∝ 1/r³" },
  };

  const exportCsv = () => {
    const l = labels[sweep];
    const head = `${l.x},${l.y}${l.y2 ? "," + l.y2 : ""}\n`;
    const body = data.map((d) => `${d.x},${d.y}${l.y2 ? "," + (d.y2 ?? "") : ""}`).join("\n");
    const blob = new Blob([head + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `dipolo_${sweep}.csv`; a.click();
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
          {(["theta", "Eext", "r"] as SweepKey[]).map((k) => (
            <Button key={k} size="sm" variant={sweep === k ? "default" : "outline"} onClick={() => setSweep(k)}>
              {k === "theta" ? "θ" : k === "Eext" ? "E" : "r"}
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