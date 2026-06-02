import type { BeatsParams, BeatsResults } from "@/lib/physics";
export const BeatsVisualization = ({ params, results }: { params: BeatsParams; results: BeatsResults }) => {
  const W = 720, H = 260;
  const traj = results.trajectory;
  const tMax = traj[traj.length - 1].t;
  const yAbs = results.Amax_m;
  const sx = (t: number) => 40 + (t / tMax) * (W - 60);
  const sy = (y: number) => H / 2 - (y / yAbs) * (H / 2 - 20);
  const path = traj.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.t)} ${sy(p.x)}`).join(" ");
  const envU = traj.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.t)} ${sy(Math.abs(p.env))}`).join(" ");
  const envL = traj.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.t)} ${sy(-Math.abs(p.env))}`).join(" ");

  // Componentes individuais f1, f2
  const N = 600;
  const c1: string[] = []; const c2: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * tMax;
    const y1 = params.A_m * Math.cos(2 * Math.PI * params.f1_Hz * t);
    const y2 = params.A_m * Math.cos(2 * Math.PI * params.f2_Hz * t);
    c1.push(`${i === 0 ? "M" : "L"} ${sx(t)} ${sy(y1)}`);
    c2.push(`${i === 0 ? "M" : "L"} ${sx(t)} ${sy(y2)}`);
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Soma x(t) = x₁(t) + x₂(t) — envelope cos(πΔf·t)</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-background rounded-lg">
          <line x1="40" y1={H / 2} x2={W - 20} y2={H / 2} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <line x1="40" y1="10" x2="40" y2={H - 10} stroke="hsl(var(--border))" />
          <path d={envU} stroke="hsl(var(--accent))" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.7" />
          <path d={envL} stroke="hsl(var(--accent))" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.7" />
          <path d={path} stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" />
          <text x={W - 20} y={H / 2 - 6} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">t (s)</text>
        </svg>
        <p className="text-xs text-muted-foreground mt-1">
          f₁ = {params.f1_Hz.toFixed(2)} Hz, f₂ = {params.f2_Hz.toFixed(2)} Hz → batimento em {results.fBeat_Hz.toFixed(3)} Hz (T_b = {isFinite(results.Tbeat_s) ? results.Tbeat_s.toFixed(3) + " s" : "∞"}).
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h4 className="text-sm font-semibold mb-2">x₁(t) = A·cos(2π f₁ t)</h4>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 bg-background rounded-lg">
            <line x1="40" y1={H / 2} x2={W - 20} y2={H / 2} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <path d={c1.join(" ")} stroke="hsl(var(--primary))" strokeWidth="1.2" fill="none" />
          </svg>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h4 className="text-sm font-semibold mb-2">x₂(t) = A·cos(2π f₂ t)</h4>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 bg-background rounded-lg">
            <line x1="40" y1={H / 2} x2={W - 20} y2={H / 2} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <path d={c2.join(" ")} stroke="hsl(var(--accent))" strokeWidth="1.2" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};