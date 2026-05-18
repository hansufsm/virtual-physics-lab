import { useMemo, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { computeStandingWave, type StandingWaveParams } from "@/lib/physics";

interface Props { params: StandingWaveParams }
type View = "modes" | "fvsT" | "fvsMu";

export const StandingWaveDataTab = ({ params }: Props) => {
  const [view, setView] = useState<View>("modes");

  const data = useMemo(() => {
    if (view === "modes") {
      const r = computeStandingWave(params);
      return r.modeTable.map((m) => ({ n: m.n, f: m.f, wavelength: m.wavelength }));
    }
    if (view === "fvsT") {
      const out: { T: number; f: number }[] = [];
      const N = 40;
      for (let i = 0; i <= N; i++) {
        const T = 5 + (i / N) * 295;
        const r = computeStandingWave({ ...params, T });
        out.push({ T, f: r.frequency });
      }
      return out;
    }
    // f vs μ
    const out: { mu: number; f: number }[] = [];
    const N = 40;
    for (let i = 0; i <= N; i++) {
      const mu = 0.0005 + (i / N) * 0.05;
      const r = computeStandingWave({ ...params, mu });
      out.push({ mu, f: r.frequency });
    }
    return out;
  }, [params, view]);

  const exportCsv = () => {
    let head = "", rows = "";
    if (view === "modes") {
      head = "n,f_Hz,wavelength_m\n";
      rows = (data as any[]).map((d) => `${d.n},${d.f},${d.wavelength}`).join("\n");
    } else if (view === "fvsT") {
      head = "T_N,f_Hz\n";
      rows = (data as any[]).map((d) => `${d.T},${d.f}`).join("\n");
    } else {
      head = "mu_kg_m,f_Hz\n";
      rows = (data as any[]).map((d) => `${d.mu},${d.f}`).join("\n");
    }
    const blob = new Blob([head + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `corda_${view}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const titles: Record<View, string> = {
    modes: "Frequências dos primeiros modos normais",
    fvsT: "Frequência fundamental vs. tração T",
    fvsMu: "Frequência fundamental vs. densidade linear μ",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">{titles[view]}</h3>
          <p className="text-xs text-muted-foreground">Espectro harmônico e varreduras.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["modes", "fvsT", "fvsMu"] as View[]).map((k) => (
            <Button key={k} size="sm" variant={view === k ? "default" : "outline"} onClick={() => setView(k)}>
              {k === "modes" ? "Modos" : k === "fvsT" ? "f(T)" : "f(μ)"}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV</Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {view === "modes" ? (
            <BarChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="n" stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: "modo n", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: "f (Hz)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="f" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data as any[]} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey={view === "fvsT" ? "T" : "mu"} type="number" stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: view === "fvsT" ? "T (N)" : "μ (kg/m)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11}
                label={{ value: "f (Hz)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="f" name="f₁ (Hz)" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};