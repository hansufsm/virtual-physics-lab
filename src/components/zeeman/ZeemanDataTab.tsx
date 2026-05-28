import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import type { ZeemanParams, ZeemanResults } from "@/lib/physics";

interface Props { params: ZeemanParams; results: ZeemanResults }
type View = "scan" | "lines";

export const ZeemanDataTab = ({ params, results }: Props) => {
  const [view, setView] = useState<View>("scan");

  const scanData = useMemo(() => results.scanByB.map((p) => ({
    B: +p.B.toFixed(3), maxShift: +p.maxShift_pm.toFixed(5),
  })), [results]);

  const lineRows = useMemo(() =>
    [...results.lines].sort((a,b) => a.wavelengthShift_pm - b.wavelengthShift_pm),
    [results.lines]);

  const exportCsv = () => {
    let csv: string;
    if (view === "scan") {
      csv = "B_T,maxShift_pm\n" + scanData.map((p) => `${p.B},${p.maxShift}`).join("\n");
    } else {
      csv = "mUpper,mLower,polarization,deltaLambda_pm,deltaNu_GHz,deltaE_ueV\n" +
        lineRows.map((l) => `${l.mUpper},${l.mLower},${l.polarization},${l.wavelengthShift_pm.toFixed(5)},${l.frequencyShift_GHz.toFixed(3)},${(l.energyShift_eV*1e6).toFixed(4)}`).join("\n");
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `zeeman_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">
            {view === "scan" ? "Largura total do tripleto vs B" : "Tabela de componentes"}
          </h3>
          <p className="text-xs text-muted-foreground">{results.preset.name}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant={view === "scan" ? "default" : "outline"} onClick={() => setView("scan")}>Δλ_máx(B)</Button>
          <Button size="sm" variant={view === "lines" ? "default" : "outline"} onClick={() => setView("lines")}>Componentes</Button>
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      {view === "scan" ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scanData} margin={{ top: 8, right: 16, left: 0, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="B" type="number" domain={["auto","auto"]} stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: "B (T)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: "|Δλ| máx (pm)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <ReferenceLine x={params.B_T} stroke="hsl(var(--primary))" strokeDasharray="2 3" />
              <Line type="monotone" dataKey="maxShift" stroke="hsl(200, 90%, 60%)" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="py-2 pr-3">m_u</th>
                <th className="py-2 pr-3">m_l</th>
                <th className="py-2 pr-3">Polarização</th>
                <th className="py-2 pr-3 text-right">Δλ (pm)</th>
                <th className="py-2 pr-3 text-right">Δν (GHz)</th>
                <th className="py-2 pr-3 text-right">ΔE (μeV)</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {lineRows.map((l, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="py-1.5 pr-3">{l.mUpper}</td>
                  <td className="py-1.5 pr-3">{l.mLower}</td>
                  <td className="py-1.5 pr-3">
                    <span className={l.polarization === "pi" ? "text-amber-500" : l.polarization === "sigma+" ? "text-sky-500" : "text-pink-500"}>
                      {l.polarization === "pi" ? "π" : l.polarization === "sigma+" ? "σ⁺" : "σ⁻"}
                    </span>
                  </td>
                  <td className="py-1.5 pr-3 text-right">{l.wavelengthShift_pm.toFixed(4)}</td>
                  <td className="py-1.5 pr-3 text-right">{l.frequencyShift_GHz.toFixed(2)}</td>
                  <td className="py-1.5 pr-3 text-right">{(l.energyShift_eV * 1e6).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Para o efeito normal (S=0) a divisão é sempre um tripleto Lorentz com Δλ = ±λ²μ_B B / (h c). No efeito anômalo (S≠0) o número
        de componentes cresce com (2J_u+1)(2J_l+1) sob a regra |Δm| ≤ 1.
      </p>
    </div>
  );
};