import type { PoiseuilleResults } from "@/lib/physics";
export const PoiseuilleVisualization = ({ results }: { results: PoiseuilleResults }) => {
  const W = 720, H = 280, padL = 60, padR = 60, padT = 20, padB = 40;
  const R = Math.max(...results.profile.map(p => Math.abs(p.r))) || 1;
  const vMax = Math.max(...results.profile.map(p => p.v)) || 1;
  const cy = padT + (H - padT - padB) / 2;
  const sr = (r: number) => cy + (r / R) * ((H - padT - padB) / 2);
  // perfil parabólico: dirige a velocidade horizontal v(r) → desenhamos como deslocamento em x
  const baseX = padL + 40;
  const scaleV = (W - padL - padR - 80) / vMax;
  const top = results.profile.map((p, i) => `${i === 0 ? "M" : "L"} ${baseX + p.v * scaleV} ${sr(p.r)}`).join(" ");
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Perfil de velocidade v(r) — parabólico</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-background rounded-lg">
          {/* parede do tubo */}
          <line x1={padL} y1={sr(-R)} x2={W - padR} y2={sr(-R)} stroke="hsl(var(--border))" strokeWidth="3" />
          <line x1={padL} y1={sr(R)} x2={W - padR} y2={sr(R)} stroke="hsl(var(--border))" strokeWidth="3" />
          <line x1={baseX} y1={sr(-R)} x2={baseX} y2={sr(R)} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 3" />
          <line x1={padL} y1={cy} x2={W - padR} y2={cy} stroke="hsl(var(--border))" strokeDasharray="2 4" />
          {/* vetores velocidade */}
          {results.profile.filter((_, i) => i % 8 === 0).map((p, i) => (
            <line key={i} x1={baseX} y1={sr(p.r)} x2={baseX + p.v * scaleV} y2={sr(p.r)} stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" />
          ))}
          {/* envelope */}
          <path d={top} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <text x={padL + 4} y={padT + 12} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">r</text>
          <text x={W - padR - 80} y={cy - 6} fontSize="10" fill="hsl(var(--accent))" fontFamily="monospace">v_max (eixo)</text>
        </svg>
      </div>
    </div>
  );
};