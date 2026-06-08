import type { CarnotResults } from "@/lib/physics";
export const CarnotVisualization = ({ results }: { results: CarnotResults }) => {
  const W = 720, H = 360;
  const pts = results.cycle;
  const Vmin = Math.min(...pts.map(p => p.V_L));
  const Vmax = Math.max(...pts.map(p => p.V_L));
  const Pmin = Math.min(...pts.map(p => p.P_Pa));
  const Pmax = Math.max(...pts.map(p => p.P_Pa));
  const padL = 60, padR = 20, padT = 20, padB = 40;
  const sx = (V: number) => padL + ((V - Vmin) / (Vmax - Vmin || 1)) * (W - padL - padR);
  const sy = (P: number) => H - padB - ((P - Pmin) / (Pmax - Pmin || 1)) * (H - padT - padB);
  const colors: Record<number, string> = { 1: "hsl(0 84% 60%)", 2: "hsl(45 90% 55%)", 3: "hsl(210 90% 60%)", 4: "hsl(150 60% 50%)" };
  const segs = [1, 2, 3, 4].map(leg => pts.filter(p => p.leg === leg));
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Diagrama P × V — Ciclo de Carnot</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-background rounded-lg">
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="hsl(var(--border))" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="hsl(var(--border))" />
        {segs.map((seg, i) => {
          const d = seg.map((p, j) => `${j === 0 ? "M" : "L"} ${sx(p.V_L)} ${sy(p.P_Pa)}`).join(" ");
          return <path key={i} d={d} stroke={colors[i + 1]} strokeWidth="2" fill="none" />;
        })}
        <text x={W - padR} y={H - 12} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">V (L)</text>
        <text x={padL + 6} y={padT + 12} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">P (Pa)</text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-mono">
        <span style={{ color: colors[1] }}>■ 1→2 isotérmica Th</span>
        <span style={{ color: colors[2] }}>■ 2→3 adiabática</span>
        <span style={{ color: colors[3] }}>■ 3→4 isotérmica Tc</span>
        <span style={{ color: colors[4] }}>■ 4→1 adiabática</span>
      </div>
    </div>
  );
};