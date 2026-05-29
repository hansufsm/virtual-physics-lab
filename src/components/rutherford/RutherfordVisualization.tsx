import type { RutherfordParams, RutherfordResults } from "@/lib/physics";

interface Props { params: RutherfordParams; results: RutherfordResults }

export const RutherfordVisualization = ({ results }: Props) => {
  const W = 720, H = 380;
  const cx = W/2, cy = H/2;
  const pts = results.trajectory;
  const maxR = Math.max(...pts.map((p) => Math.hypot(p.x, p.y)), 1);
  const scale = (Math.min(W, H)/2 - 40) / maxR;
  // r_min ponto
  let pmin = pts[0]; let rmin = Infinity;
  for (const p of pts) { const r = Math.hypot(p.x,p.y); if (r < rmin) { rmin = r; pmin = p; } }
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* eixos */}
        <line x1={20} y1={cy} x2={W-20} y2={cy} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <line x1={cx} y1={20} x2={cx} y2={H-20} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        {/* núcleo */}
        <circle cx={cx} cy={cy} r={8} fill="hsl(var(--primary))" />
        <text x={cx + 12} y={cy - 8} fontSize={11} fill="hsl(var(--foreground))">Z = {/* sufixo via attr */}</text>
        <text x={cx + 12} y={cy + 8} fontSize={11} fill="hsl(var(--muted-foreground))">núcleo</text>
        {/* trajetória */}
        <path d={pts.map((p, i) => `${i===0?"M":"L"} ${(cx + p.x*scale).toFixed(2)} ${(cy - p.y*scale).toFixed(2)}`).join(" ")}
          fill="none" stroke="hsl(var(--accent))" strokeWidth={2} />
        {/* assintotas */}
        {pts.length > 0 && (
          <g>
            <circle cx={cx + pts[0].x*scale} cy={cy - pts[0].y*scale} r={5} fill="hsl(var(--accent))" />
            <circle cx={cx + pts[pts.length-1].x*scale} cy={cy - pts[pts.length-1].y*scale} r={5} fill="hsl(var(--accent))" />
          </g>
        )}
        {/* ponto r_min */}
        <circle cx={cx + pmin.x*scale} cy={cy - pmin.y*scale} r={4} fill="hsl(var(--primary))" stroke="hsl(var(--background))" />
        <text x={cx + pmin.x*scale + 8} y={cy - pmin.y*scale} fontSize={10} fill="hsl(var(--primary))">
          r_min = {results.distance_min_fm.toFixed(2)} fm
        </text>
        {/* legenda */}
        <text x={20} y={H-10} fontSize={11} fill="hsl(var(--muted-foreground))">
          θ = {results.scatteringAngle_deg.toFixed(2)}° · escala automática (fm)
        </text>
      </svg>
    </div>
  );
};