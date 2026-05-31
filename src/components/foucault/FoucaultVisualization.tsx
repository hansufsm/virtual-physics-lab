import type { FoucaultParams, FoucaultResults } from "@/lib/physics";
export const FoucaultVisualization = ({ params, results }: { params: FoucaultParams; results: FoucaultResults }) => {
  const W = 520;
  const max = results.trace.reduce((a, p) => Math.max(a, Math.hypot(p.x, p.y)), 0.01);
  const scale = (W / 2 - 30) / max;
  const path = results.trace.map((p, i) => `${i === 0 ? "M" : "L"} ${W/2 + p.x * scale} ${W/2 - p.y * scale}`).join(" ");
  // current direction line (rotation accumulated)
  const ang = (results.omega_prec * params.time_s);
  const x1 = W/2 + Math.cos(ang) * (W/2 - 20);
  const y1 = W/2 - Math.sin(ang) * (W/2 - 20);
  const x2 = W/2 - Math.cos(ang) * (W/2 - 20);
  const y2 = W/2 + Math.sin(ang) * (W/2 - 20);
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Traçado do pêndulo (visto de cima)</h4>
      <svg viewBox={`0 0 ${W} ${W}`} className="w-full max-w-md mx-auto block bg-background rounded-lg">
        <circle cx={W/2} cy={W/2} r={W/2 - 10} fill="none" stroke="hsl(var(--border))" />
        <line x1={W/2} y1="10" x2={W/2} y2={W-10} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <line x1="10" y1={W/2} x2={W-10} y2={W/2} stroke="hsl(var(--border))" strokeDasharray="3 3" />
        <text x={W/2} y="22" textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="monospace">N</text>
        <text x={W/2} y={W-8} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="monospace">S</text>
        <text x="16" y={W/2+4} fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="monospace">O</text>
        <text x={W-22} y={W/2+4} fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="monospace">L</text>
        <path d={path} stroke="hsl(var(--primary))" strokeWidth="1" fill="none" opacity="0.5" />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--accent))" strokeWidth="2.5" />
        <circle cx={W/2} cy={W/2} r="4" fill="hsl(var(--accent))" />
      </svg>
      <p className="text-xs text-muted-foreground mt-2">
        A linha em destaque mostra a direção atual do plano de oscilação após t = {(params.time_s/60).toFixed(1)} min.
        A roseta clara mostra a sobreposição dos traçados.
      </p>
    </div>
  );
};
