import { useMemo } from "react";
import type { ZeemanParams, ZeemanResults, ZeemanPolarization } from "@/lib/physics";

interface Props { params: ZeemanParams; results: ZeemanResults }

const polColor = (p: ZeemanPolarization) =>
  p === "pi" ? "hsl(45, 95%, 60%)" : p === "sigma+" ? "hsl(200, 90%, 60%)" : "hsl(330, 85%, 65%)";

const fmtM = (m: number) => {
  if (Math.abs(m - Math.round(m)) < 1e-6) return `${m > 0 ? "+" : ""}${Math.round(m)}`;
  const n = Math.round(2 * m);
  return `${n > 0 ? "+" : ""}${n}/2`;
};

export const ZeemanVisualization = ({ params, results }: Props) => {
  const { preset, gU, gL, lines } = results;

  // Energy level diagram
  const mUs = useMemo(() => {
    const a: number[] = []; for (let m = -preset.Ju; m <= preset.Ju + 1e-9; m++) a.push(m); return a;
  }, [preset.Ju]);
  const mLs = useMemo(() => {
    const a: number[] = []; for (let m = -preset.Jl; m <= preset.Jl + 1e-9; m++) a.push(m); return a;
  }, [preset.Jl]);

  const W = 720, H = 380;
  const padX = 60;
  const splitScale = 28; // px per (g*m) unit, visualization-only
  const yU = 90, yL = 290;

  // Spectrum panel
  const maxShift = Math.max(0.0001, ...lines.map((l) => Math.abs(l.wavelengthShift_pm)));
  const Ws = 720, Hs = 160;
  const cx = Ws / 2;
  const scale = (Ws / 2 - 40) / Math.max(maxShift, 0.05);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-sm font-semibold">Diagrama de níveis</h3>
          <div className="flex items-center gap-3 text-[11px]">
            <Legend color={polColor("pi")} label="π (Δm=0)" />
            <Legend color={polColor("sigma+")} label="σ⁺ (Δm=+1)" />
            <Legend color={polColor("sigma-")} label="σ⁻ (Δm=−1)" />
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* central reference (B=0) lines */}
          <line x1={padX - 20} x2={W - padX + 20} y1={yU} y2={yU} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 4" strokeWidth={1} opacity={0.5} />
          <line x1={padX - 20} x2={W - padX + 20} y1={yL} y2={yL} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 4" strokeWidth={1} opacity={0.5} />
          <text x={padX - 24} y={yU - 6} fontSize={11} textAnchor="end" fill="hsl(var(--muted-foreground))">superior (J={preset.Ju}, g={gU.toFixed(3)})</text>
          <text x={padX - 24} y={yL + 14} fontSize={11} textAnchor="end" fill="hsl(var(--muted-foreground))">inferior (J={preset.Jl}, g={gL.toFixed(3)})</text>

          {/* sublevel positions */}
          {mUs.map((m) => {
            const x = W / 2 + gU * m * splitScale * (params.B_T > 0 ? 1 : 0);
            const y = yU - gU * m * splitScale * (params.B_T > 0 ? 0.6 : 0);
            return (
              <g key={`u${m}`}>
                <line x1={x - 36} x2={x + 36} y1={y} y2={y} stroke="hsl(var(--primary))" strokeWidth={2.2} />
                <text x={x + 42} y={y + 4} fontSize={10} fill="hsl(var(--foreground))">m={fmtM(m)}</text>
              </g>
            );
          })}
          {mLs.map((m) => {
            const x = W / 2 + gL * m * splitScale * (params.B_T > 0 ? 1 : 0);
            const y = yL + gL * m * splitScale * (params.B_T > 0 ? 0.6 : 0);
            return (
              <g key={`l${m}`}>
                <line x1={x - 36} x2={x + 36} y1={y} y2={y} stroke="hsl(200, 80%, 55%)" strokeWidth={2.2} />
                <text x={x + 42} y={y + 4} fontSize={10} fill="hsl(var(--foreground))">m={fmtM(m)}</text>
              </g>
            );
          })}

          {/* transitions */}
          {lines.map((ln, i) => {
            const xu = W / 2 + gU * ln.mUpper * splitScale * (params.B_T > 0 ? 1 : 0);
            const yu = yU - gU * ln.mUpper * splitScale * (params.B_T > 0 ? 0.6 : 0);
            const xl = W / 2 + gL * ln.mLower * splitScale * (params.B_T > 0 ? 1 : 0);
            const yl = yL + gL * ln.mLower * splitScale * (params.B_T > 0 ? 0.6 : 0);
            return (
              <line key={i} x1={xu} y1={yu} x2={xl} y2={yl}
                stroke={polColor(ln.polarization)} strokeWidth={1.4} opacity={0.85} />
            );
          })}

          <text x={W / 2} y={H - 8} fontSize={11} textAnchor="middle" fill="hsl(var(--muted-foreground))">
            transições permitidas (|Δm| ≤ 1) · B = {params.B_T.toFixed(2)} T · observação {params.observation === "longitudinal" ? "longitudinal" : "transversal"}
          </text>
        </svg>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-sm font-semibold">Espectro</h3>
          <span className="text-[11px] text-muted-foreground font-mono">centro: {preset.lambda0_nm.toFixed(3)} nm</span>
        </div>
        <svg viewBox={`0 0 ${Ws} ${Hs}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <line x1={20} x2={Ws - 20} y1={Hs - 30} y2={Hs - 30} stroke="hsl(var(--border))" />
          <line x1={cx} y1={20} x2={cx} y2={Hs - 30} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 3" opacity={0.5} />
          {[-1, -0.5, 0, 0.5, 1].map((f) => {
            const x = cx + f * (Ws / 2 - 40);
            return (
              <g key={f}>
                <line x1={x} x2={x} y1={Hs - 33} y2={Hs - 27} stroke="hsl(var(--muted-foreground))" />
                <text x={x} y={Hs - 14} fontSize={10} textAnchor="middle" fill="hsl(var(--muted-foreground))">
                  {(f * maxShift).toFixed(2)} pm
                </text>
              </g>
            );
          })}
          {lines.map((ln, i) => {
            const x = cx + ln.wavelengthShift_pm * scale;
            const h = 75 * ln.intensity;
            return (
              <line key={i} x1={x} x2={x} y1={Hs - 30} y2={Hs - 30 - h}
                stroke={polColor(ln.polarization)} strokeWidth={2.4} opacity={0.95} />
            );
          })}
          <text x={20} y={16} fontSize={11} fill="hsl(var(--muted-foreground))">
            {lines.length} componente{lines.length !== 1 ? "s" : ""} · {results.type}
          </text>
        </svg>
      </div>
    </div>
  );
};

const Legend = ({ color, label }: { color: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
    <span className="inline-block h-2 w-3 rounded-sm" style={{ background: color }} /> {label}
  </span>
);