import type { FourierParams, FourierResults } from "@/lib/physics";
export const FourierVisualization = ({ params, results }: { params: FourierParams; results: FourierResults }) => {
  const W = 720, H = 320;
  const padL = 60, padR = 20, padT = 20, padB = 40;
  const xs = results.profile.map(p => p.x_m);
  const xMax = Math.max(...xs);
  const Tmin = Math.min(...results.profile.map(p => p.T_K));
  const Tmax = Math.max(...results.profile.map(p => p.T_K));
  const sx = (x: number) => padL + (x / (xMax || 1)) * (W - padL - padR);
  const sy = (T: number) => H - padB - ((T - Tmin) / (Tmax - Tmin || 1)) * (H - padT - padB);
  const path = results.profile.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x_m)} ${sy(p.T_K)}`).join(" ");
  let acc = 0;
  const seps = params.layers.map(l => { acc += l.L_m; return acc; });
  const palette = ["hsl(0 70% 60% / 0.18)", "hsl(45 80% 55% / 0.18)", "hsl(210 70% 55% / 0.18)", "hsl(150 60% 50% / 0.18)", "hsl(280 60% 60% / 0.18)"];
  let cur = 0;
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Perfil T(x) — regime permanente</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-background rounded-lg">
        {params.layers.map((l, i) => {
          const x0 = sx(cur); cur += l.L_m; const x1 = sx(cur);
          return <g key={i}>
            <rect x={x0} y={padT} width={x1 - x0} height={H - padT - padB} fill={palette[i % palette.length]} />
            <text x={(x0 + x1) / 2} y={padT + 12} fontSize="10" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="monospace">{l.name}</text>
          </g>;
        })}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="hsl(var(--border))" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="hsl(var(--border))" />
        <path d={path} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
        {seps.slice(0, -1).map((x, i) => (
          <line key={i} x1={sx(x)} y1={padT} x2={sx(x)} y2={H - padB} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        ))}
        <text x={W - padR} y={H - 12} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">x (m)</text>
        <text x={padL + 6} y={padT + 12} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">T (K)</text>
      </svg>
      <p className="text-xs text-muted-foreground mt-2">A inclinação dT/dx é maior em materiais com k menor (resistência térmica mais alta).</p>
    </div>
  );
};