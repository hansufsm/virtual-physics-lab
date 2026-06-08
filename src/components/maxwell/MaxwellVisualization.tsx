import type { MaxwellResults } from "@/lib/physics";
export const MaxwellVisualization = ({ results }: { results: MaxwellResults }) => {
  const W = 720, H = 320, padL = 60, padR = 20, padT = 20, padB = 40;
  const vMax = Math.max(...results.distribution.map(p => p.v));
  const fMax = Math.max(...results.distribution.map(p => p.f));
  const sx = (v: number) => padL + (v / vMax) * (W - padL - padR);
  const sy = (f: number) => H - padB - (f / fMax) * (H - padT - padB);
  const path = results.distribution.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.v)} ${sy(p.f)}`).join(" ");
  const cmax = Math.max(...results.histogram.map(h => h.count)) || 1;
  const bw = (W - padL - padR) / results.histogram.length;
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">f(v) e histograma simulado</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-background rounded-lg">
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="hsl(var(--border))" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="hsl(var(--border))" />
        {results.histogram.map((h, i) => {
          const hPx = (h.count / cmax) * (H - padT - padB);
          return <rect key={i} x={padL + i * bw + 1} y={H - padB - hPx} width={bw - 2} height={hPx} fill="hsl(var(--accent) / 0.45)" />;
        })}
        <path d={path} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
        <line x1={sx(results.v_mp)} y1={padT} x2={sx(results.v_mp)} y2={H - padB} stroke="hsl(var(--primary))" strokeDasharray="3 3" opacity="0.6" />
        <text x={sx(results.v_mp) + 4} y={padT + 12} fontSize="10" fill="hsl(var(--primary))" fontFamily="monospace">v_mp</text>
        <line x1={sx(results.v_avg)} y1={padT} x2={sx(results.v_avg)} y2={H - padB} stroke="hsl(var(--accent))" strokeDasharray="3 3" opacity="0.6" />
        <text x={sx(results.v_avg) + 4} y={padT + 24} fontSize="10" fill="hsl(var(--accent))" fontFamily="monospace">v̄</text>
        <text x={W - padR} y={H - 12} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">v (m/s)</text>
      </svg>
    </div>
  );
};