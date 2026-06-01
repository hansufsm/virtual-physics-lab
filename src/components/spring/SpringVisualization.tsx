import type { SpringParams, SpringResults } from "@/lib/physics";
export const SpringVisualization = ({ params, results }: { params: SpringParams; results: SpringResults }) => {
  // Cena vertical: teto, mola, bloco
  const SW = 240, SH = 360;
  const ceilY = 30;
  const naturalLen = 140;
  const xPx = (results.x_t_m / Math.max(0.01, params.amplitude_m)) * 50; // ± 50px
  const blockY = ceilY + naturalLen + xPx;
  // Espiral simples: zigue-zague
  const coils = 12;
  const points: string[] = [];
  const xCenter = SW / 2;
  const len = blockY - ceilY - 10;
  for (let i = 0; i <= coils * 2; i++) {
    const t = i / (coils * 2);
    const y = ceilY + t * len;
    const x = xCenter + ((i % 2 === 0) ? -10 : 10);
    points.push(`${x},${y}`);
  }
  // gráfico x(t)
  const W = 540, H = 220;
  const traj = results.trajectory;
  const maxT = traj[traj.length - 1].t;
  const A = Math.max(0.001, Math.max(...traj.map(p => Math.abs(p.x))));
  const sx = (t: number) => 40 + (t / maxT) * (W - 60);
  const sy = (x: number) => H / 2 - (x / A) * (H / 2 - 20);
  const path = traj.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.t)} ${sy(p.x)}`).join(" ");
  const ballX = sx(params.time_s % maxT);
  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Cena MHS</h4>
        <svg viewBox={`0 0 ${SW} ${SH}`} className="w-full bg-background rounded-lg">
          <line x1="20" y1={ceilY} x2={SW-20} y2={ceilY} stroke="hsl(var(--foreground))" strokeWidth="3" />
          {Array.from({length: 8}).map((_, i) => (
            <line key={i} x1={20 + i * ((SW-40)/8)} y1={ceilY} x2={20 + i * ((SW-40)/8) + 8} y2={ceilY - 8} stroke="hsl(var(--foreground))" />
          ))}
          <polyline points={points.join(" ")} stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
          <rect x={xCenter - 24} y={blockY} width="48" height="44" fill="hsl(var(--primary))" rx="3" />
          <text x={xCenter} y={blockY + 26} textAnchor="middle" fontSize="11" fill="hsl(var(--primary-foreground))" fontFamily="monospace">{params.mass_kg}kg</text>
          {/* eixo x */}
          <line x1={SW-30} y1={ceilY+naturalLen-60} x2={SW-30} y2={ceilY+naturalLen+60} stroke="hsl(var(--border))" />
          <text x={SW-26} y={ceilY+naturalLen} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">x=0</text>
        </svg>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">x(t) — MHS</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56 bg-background rounded-lg">
          <line x1="40" y1={H/2} x2={W-20} y2={H/2} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <line x1="40" y1="10" x2="40" y2={H-10} stroke="hsl(var(--border))" />
          <path d={path} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <line x1={ballX} y1="10" x2={ballX} y2={H-10} stroke="hsl(var(--accent))" strokeDasharray="2 3" />
          <circle cx={ballX} cy={sy(results.x_t_m)} r="5" fill="hsl(var(--accent))" />
          <text x={W-20} y={H/2-6} fontSize="10" fill="hsl(var(--muted-foreground))" textAnchor="end" fontFamily="monospace">t (s)</text>
        </svg>
        <p className="text-xs text-muted-foreground mt-1">Período T = {results.T_s.toFixed(3)} s · ω = {results.omega_rad_s.toFixed(2)} rad/s</p>
      </div>
    </div>
  );
};