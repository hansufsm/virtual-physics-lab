import type { StefanResults } from "@/lib/physics";
export const StefanVisualization = ({ results }: { results: StefanResults }) => {
  const W = 720, H = 280, padL = 60, padR = 20, padT = 20, padB = 40;
  const lamMax = Math.max(...results.spectrum.map(p => p.lambda_nm));
  const Bmax = Math.max(...results.spectrum.map(p => p.B));
  const sx = (l: number) => padL + (l / lamMax) * (W - padL - padR);
  const sy = (b: number) => H - padB - (b / Bmax) * (H - padT - padB);
  const path = results.spectrum.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.lambda_nm)} ${sy(p.B)}`).join(" ");
  // P vs T
  const tMax = Math.max(...results.curveT.map(p => p.T_K));
  const pMax = Math.max(...results.curveT.map(p => p.P)) || 1;
  const sxT = (t: number) => padL + (t / tMax) * (W - padL - padR);
  const syT = (p: number) => H - padB - (p / pMax) * (H - padT - padB);
  const pathT = results.curveT.map((p, i) => `${i === 0 ? "M" : "L"} ${sxT(p.T_K)} ${syT(p.P)}`).join(" ");
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Radiância espectral de Planck (corpo a T₁)</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-background rounded-lg">
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="hsl(var(--border))" />
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="hsl(var(--border))" />
          <path d={path} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <line x1={sx(results.lambda_max_m * 1e9)} y1={padT} x2={sx(results.lambda_max_m * 1e9)} y2={H - padB} stroke="hsl(var(--accent))" strokeDasharray="3 3" />
          <text x={sx(results.lambda_max_m * 1e9) + 4} y={padT + 12} fontSize="10" fill="hsl(var(--accent))" fontFamily="monospace">λ_máx</text>
          <text x={W - padR} y={H - 12} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">λ (nm)</text>
        </svg>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">P(T) ∝ T⁴ — Stefan-Boltzmann</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 bg-background rounded-lg">
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="hsl(var(--border))" />
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="hsl(var(--border))" />
          <path d={pathT} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <text x={W - padR} y={H - 12} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">T (K)</text>
        </svg>
      </div>
    </div>
  );
};