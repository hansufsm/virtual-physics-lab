import { useMemo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { bAxis, type CoilParams } from "@/lib/physics";

interface Props { params: CoilParams }

export const CoilDataTab = ({ params }: Props) => {
  const R = params.radiusCm * 1e-2;
  const L = params.type === "solenoid" ? params.lengthCm * 1e-2 : R * 2;
  const zMax = Math.max(R * 4, L * 1.2);

  const series = useMemo(() => {
    const N = 200;
    const out: { z_cm: number; B_mT: number }[] = [];
    for (let k = 0; k <= N; k++) {
      const z = -zMax + (k / N) * 2 * zMax;
      out.push({
        z_cm: +(z * 100).toFixed(3),
        B_mT: +(bAxis(params, z) * 1e3).toFixed(6),
      });
    }
    return out;
  }, [params, zMax]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["z_m", "Bz_T"],
      ...series.map((p) => [p.z_cm / 100, p.B_mT / 1000]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `bobina_${params.type}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const bMax = Math.max(...series.map((p) => Math.abs(p.B_mT)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Perfil de Bz(z) ao longo do eixo da bobina. A janela cobre ±{(zMax * 100).toFixed(1)} cm,
          o suficiente para ver as bordas da geometria.
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h4 className="font-display font-semibold text-sm">Bz(z) no eixo</h4>
          <p className="text-xs text-muted-foreground">|B|max ≈ {bMax.toFixed(3)} mT</p>
        </div>
        <div className="p-3">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={series} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="z_cm" type="number" domain={[-zMax * 100, zMax * 100]}
                stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
                label={{ value: "z (cm)", position: "insideBottom", offset: -2, fontSize: 11 }} />
              <YAxis stroke="hsl(var(--primary))" tick={{ fontSize: 11 }}
                label={{ value: "Bz (mT)", angle: -90, position: "insideLeft", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => v.toFixed(4)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 4" />
              <Line type="monotone" dataKey="B_mT" name="Bz (mT)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};