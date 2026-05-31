import type { HydrogenResults } from "@/lib/physics";
function lambdaToColor(nm: number): string {
  if (nm < 380) return "#7d3aff";
  if (nm > 780) return "#7a1a1a";
  const t = (nm - 380) / 400;
  if (nm < 440) return "#8a00ff";
  if (nm < 490) return "#0080ff";
  if (nm < 510) return "#00ffd5";
  if (nm < 580) return "#80ff00";
  if (nm < 645) return "#ffd000";
  return "#ff2010";
}
export const HydrogenVisualization = ({ results }: { results: HydrogenResults }) => {
  const lines = results.lines;
  const visMin = 380, visMax = 780;
  const lo = Math.min(visMin, ...lines.map((l) => l.lambda_nm));
  const hi = Math.max(visMax, ...lines.map((l) => l.lambda_nm));
  const visLines = lines.filter((l) => l.visible);
  const Emin = -results.ionization_eV - 0.5;
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Diagrama de níveis e transições — {results.series.name}</h4>
        <svg viewBox="0 0 600 320" className="w-full h-72 bg-background rounded-lg">
          {results.levels.map((lv) => {
            const y = 300 - ((lv.E_eV - Emin) / (0 - Emin)) * 280;
            return (
              <g key={lv.n}>
                <line x1="80" y1={y} x2="540" y2={y} stroke="hsl(var(--border))" strokeWidth="1.5" />
                <text x="50" y={y + 4} fontSize="11" fill="hsl(var(--muted-foreground))" textAnchor="end" fontFamily="monospace">n={lv.n}</text>
                <text x="560" y={y + 4} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">{lv.E_eV.toFixed(2)} eV</text>
              </g>
            );
          })}
          {results.lines.map((ln, i) => {
            const yU = 300 - ((-13.605693 / (ln.n_up * ln.n_up) - Emin) / (0 - Emin)) * 280;
            const yL = 300 - ((-13.605693 / (ln.n_low * ln.n_low) - Emin) / (0 - Emin)) * 280;
            const x = 120 + i * 28;
            const col = ln.visible ? lambdaToColor(ln.lambda_nm) : "hsl(var(--muted-foreground))";
            return (
              <g key={i}>
                <line x1={x} y1={yU} x2={x} y2={yL} stroke={col} strokeWidth="1.8" markerEnd="url(#arrow)" opacity={ln.visible ? 1 : 0.5} />
              </g>
            );
          })}
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--foreground))" />
            </marker>
          </defs>
        </svg>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Espectro de emissão</h4>
        <div className="relative h-20 rounded-md overflow-hidden bg-background">
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #1a1a2a, #1a1a2a)" }} />
          {lines.map((ln, i) => {
            const left = ((ln.lambda_nm - lo) / (hi - lo)) * 100;
            const col = ln.visible ? lambdaToColor(ln.lambda_nm) : "rgba(180,180,200,0.5)";
            return (
              <div key={i} className="absolute top-0 bottom-0" style={{ left: `${left}%`, width: 2, background: col, boxShadow: `0 0 8px ${col}` }} />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
          <span>{lo.toFixed(0)} nm</span><span>visível: 380–780 nm</span><span>{hi.toFixed(0)} nm</span>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Visíveis ({visLines.length}):{" "}
          {visLines.slice(0, 6).map((l) => `${l.lambda_nm.toFixed(1)}nm (n=${l.n_up}→${l.n_low})`).join(" · ")}
        </div>
      </div>
    </div>
  );
};
