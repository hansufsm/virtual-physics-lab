import type { StokesResults } from "@/lib/physics";
export const StokesVisualization = ({ results }: { results: StokesResults }) => {
  const W = 720, H = 260, padL = 60, padR = 20, padT = 20, padB = 40;
  const tMax = Math.max(...results.series.map(p => p.t));
  const vMax = Math.max(...results.series.map(p => Math.abs(p.v))) || 1;
  const sx = (t: number) => padL + (t / tMax) * (W - padL - padR);
  const sy = (v: number) => H - padB - (Math.abs(v) / vMax) * (H - padT - padB);
  const path = results.series.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.t)} ${sy(p.v)}`).join(" ");
  const yt = sy(Math.abs(results.v_terminal));
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">v(t) — aproximação assintótica da velocidade terminal</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-background rounded-lg">
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="hsl(var(--border))" />
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="hsl(var(--border))" />
          <line x1={padL} y1={yt} x2={W - padR} y2={yt} stroke="hsl(var(--accent))" strokeDasharray="3 3" />
          <text x={W - padR - 4} y={yt - 4} fontSize="10" textAnchor="end" fill="hsl(var(--accent))" fontFamily="monospace">v_t</text>
          <path d={path} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <text x={W - padR} y={H - 12} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">t (s)</text>
          <text x={padL + 4} y={padT + 12} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">|v| (m/s)</text>
        </svg>
      </div>
    </div>
  );
};