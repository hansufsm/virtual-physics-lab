import type { BernoulliResults } from "@/lib/physics";
export const BernoulliVisualization = ({ results }: { results: BernoulliResults }) => {
  const W = 720, H = 260, padL = 60, padR = 20, padT = 20, padB = 40;
  const xs = (x: number) => padL + x * (W - padL - padR);
  const Amax = Math.max(...results.profile.map(p => p.A));
  const halfH = (H - padT - padB) / 2;
  const centerY = padT + halfH;
  const ys = (A: number) => (A / Amax) * halfH;
  const top = results.profile.map((p, i) => `${i === 0 ? "M" : "L"} ${xs(p.x)} ${centerY - ys(p.A)}`).join(" ");
  const bot = results.profile.slice().reverse().map((p) => `L ${xs(p.x)} ${centerY + ys(p.A)}`).join(" ");
  // pressure plot
  const Pmax = Math.max(...results.profile.map(p => p.P));
  const Pmin = Math.min(...results.profile.map(p => p.P));
  const PH = 200, padBP = 36;
  const syP = (P: number) => padT + (1 - (P - Pmin) / Math.max(1, Pmax - Pmin)) * (PH - padT - padBP);
  const pathP = results.profile.map((p, i) => `${i === 0 ? "M" : "L"} ${xs(p.x)} ${syP(p.P)}`).join(" ");
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Geometria do tubo de Venturi</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-background rounded-lg">
          <path d={`${top} ${bot} Z`} fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="2" />
          <line x1={padL} y1={centerY} x2={W - padR} y2={centerY} stroke="hsl(var(--border))" strokeDasharray="2 4" />
          <text x={padL + 8} y={padT + 12} fontSize="11" fill="hsl(var(--primary))" fontFamily="monospace">A₁ · v₁ · P₁</text>
          <text x={W - padR - 80} y={padT + 12} fontSize="11" fill="hsl(var(--accent))" fontFamily="monospace">A₂ · v₂ · P₂</text>
        </svg>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Pressão ao longo do tubo</h4>
        <svg viewBox={`0 0 ${W} ${PH}`} className="w-full bg-background rounded-lg">
          <line x1={padL} y1={PH - padBP} x2={W - padR} y2={PH - padBP} stroke="hsl(var(--border))" />
          <line x1={padL} y1={padT} x2={padL} y2={PH - padBP} stroke="hsl(var(--border))" />
          <path d={pathP} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
          <text x={W - padR} y={PH - 10} fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" fontFamily="monospace">x (entrada → saída)</text>
        </svg>
      </div>
    </div>
  );
};