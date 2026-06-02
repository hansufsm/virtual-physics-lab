import type { ForcedParams, ForcedResults } from "@/lib/physics";
export const ForcedVisualization = ({ params, results }: { params: ForcedParams; results: ForcedResults }) => {
  // --- Curva A(ω) ---
  const W = 540, H = 220;
  const wMax = Math.max(...results.sweep.map(s => s.omega));
  const Amax = Math.max(...results.sweep.map(s => s.A));
  const sx = (w: number) => 40 + (w / wMax) * (W - 60);
  const sy = (a: number) => H - 20 - (a / Math.max(1e-9, Amax)) * (H - 40);
  const path = results.sweep.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.omega)} ${sy(p.A)}`).join(" ");
  const cx = sx(params.driveOmega_rad_s);
  const cy = sy(results.A_drive_m);
  const wrX = results.omegaR_rad_s > 0 ? sx(results.omegaR_rad_s) : null;

  // --- Curva φ(ω) ---
  const sy2 = (ph: number) => H - 20 - (ph / Math.PI) * (H - 40);
  const path2 = results.sweep.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.omega)} ${sy2(p.phase)}`).join(" ");

  // --- x(t) estacionário ---
  const traj = results.trajectory;
  const tMax = traj[traj.length - 1].t;
  const xAbs = Math.max(0.001, ...traj.map(p => Math.abs(p.x)));
  const tx = (t: number) => 40 + (t / tMax) * (W - 60);
  const ty = (x: number) => H / 2 - (x / xAbs) * (H / 2 - 20);
  const xPath = traj.map((p, i) => `${i === 0 ? "M" : "L"} ${tx(p.t)} ${ty(p.x)}`).join(" ");

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Curva de ressonância A(ω)</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56 bg-background rounded-lg">
          <line x1="40" y1={H - 20} x2={W - 20} y2={H - 20} stroke="hsl(var(--border))" />
          <line x1="40" y1="10" x2="40" y2={H - 20} stroke="hsl(var(--border))" />
          {wrX !== null && <line x1={wrX} y1="10" x2={wrX} y2={H - 20} stroke="hsl(var(--accent))" strokeDasharray="3 3" />}
          <path d={path} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <circle cx={cx} cy={cy} r="5" fill="hsl(var(--accent))" />
          <text x={W - 20} y={H - 6} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">ω (rad/s)</text>
          <text x={44} y={18} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">A (m)</text>
        </svg>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h4 className="text-sm font-semibold mb-2">Defasagem φ(ω)</h4>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-48 bg-background rounded-lg">
            <line x1="40" y1={H - 20} x2={W - 20} y2={H - 20} stroke="hsl(var(--border))" />
            <line x1="40" y1="10" x2="40" y2={H - 20} stroke="hsl(var(--border))" />
            <line x1="40" y1={sy2(Math.PI / 2)} x2={W - 20} y2={sy2(Math.PI / 2)} stroke="hsl(var(--border))" strokeDasharray="2 3" />
            <path d={path2} stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
            <text x={44} y={sy2(Math.PI / 2) - 4} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">π/2</text>
            <text x={44} y={18} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">φ</text>
          </svg>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h4 className="text-sm font-semibold mb-2">Resposta estacionária x(t)</h4>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-48 bg-background rounded-lg">
            <line x1="40" y1={H / 2} x2={W - 20} y2={H / 2} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <path d={xPath} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
            <text x={W - 20} y={H / 2 - 4} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">t (s)</text>
          </svg>
        </div>
      </div>
    </div>
  );
};