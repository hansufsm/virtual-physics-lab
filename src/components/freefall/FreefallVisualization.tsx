import type { FreefallParams, FreefallResults } from "@/lib/physics";
export const FreefallVisualization = ({ params, results }: { params: FreefallParams; results: FreefallResults }) => {
  const W = 600, H = 320;
  const maxT = Math.max(results.t_fall_s, ...results.trajectoryNoDrag.map(t => t.t));
  const maxY = params.h0_m;
  const scaleX = (t: number) => 40 + (t / maxT) * (W - 60);
  const scaleY = (y: number) => 20 + (1 - y / maxY) * (H - 40);
  const pathDrag = results.trajectory.map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.t)} ${scaleY(p.y)}`).join(" ");
  const pathNo = results.trajectoryNoDrag.map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.t)} ${scaleY(p.y)}`).join(" ");
  // Cena: bola caindo
  const SW = 200, SH = 360;
  const ballT = results.trajectory[Math.floor(results.trajectory.length * 0.5)];
  const ballY = ballT ? 20 + (1 - ballT.y / maxY) * (SH - 60) : 20;
  return (
    <div className="grid md:grid-cols-[1fr_220px] gap-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Posição y(t)</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-72 bg-background rounded-lg">
          <line x1="40" y1={H-20} x2={W-20} y2={H-20} stroke="hsl(var(--border))" />
          <line x1="40" y1="20" x2="40" y2={H-20} stroke="hsl(var(--border))" />
          <text x={W/2} y={H-4} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">tempo (s)</text>
          <text x="10" y={H/2} fontSize="11" fill="hsl(var(--muted-foreground))" transform={`rotate(-90 10 ${H/2})`}>y (m)</text>
          {params.drag && <path d={pathNo} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />}
          <path d={pathDrag} stroke="hsl(var(--primary))" strokeWidth="2.2" fill="none" />
          <text x={W-20} y="30" textAnchor="end" fontSize="10" fill="hsl(var(--primary))" fontFamily="monospace">y(t)</text>
          {params.drag && <text x={W-20} y="44" textAnchor="end" fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">sem arrasto</text>}
        </svg>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Cena</h4>
        <svg viewBox={`0 0 ${SW} ${SH}`} className="w-full bg-background rounded-lg">
          <line x1="20" y1="20" x2="20" y2={SH-20} stroke="hsl(var(--border))" strokeDasharray="2 3" />
          <line x1="20" y1={SH-20} x2={SW-10} y2={SH-20} stroke="hsl(var(--foreground))" strokeWidth="2" />
          <text x="30" y="20" fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">h₀={params.h0_m.toFixed(1)}m</text>
          <circle cx={SW/2} cy={ballY} r="10" fill="hsl(var(--primary))" />
          <text x={SW/2+18} y={ballY+4} fontSize="10" fill="hsl(var(--primary))" fontFamily="monospace">↓ g</text>
        </svg>
        <p className="text-xs text-muted-foreground mt-2">g = {params.g} m/s² · {params.drag ? "com arrasto" : "vácuo"}</p>
      </div>
    </div>
  );
};