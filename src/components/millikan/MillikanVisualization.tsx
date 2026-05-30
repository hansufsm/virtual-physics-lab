import type { MillikanParams, MillikanResults } from "@/lib/physics";

interface Props { params: MillikanParams; results: MillikanResults }

export const MillikanVisualization = ({ params, results }: Props) => {
  const W = 720, H = 380;
  // posição vertical: 0 (topo) a 1 (base). Suspensa em y = 0.5.
  const vMm_s = results.v_rise_mms;       // mm/s, positivo = sobe
  // mapeia velocidade para offset visual
  const offset = Math.tanh(vMm_s / 0.5) * 90;
  const y = H / 2 - offset;
  const polarity = params.voltage_V >= 0 ? "+" : "−";
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* placa superior */}
        <rect x={120} y={40} width={W-240} height={12} fill="hsl(var(--primary))" opacity={0.7} />
        <text x={W-110} y={50} fontSize={12} fill="hsl(var(--muted-foreground))">{polarity} ({params.voltage_V.toFixed(0)} V)</text>
        {/* placa inferior */}
        <rect x={120} y={H-52} width={W-240} height={12} fill="hsl(var(--primary))" opacity={0.7} />
        <text x={W-110} y={H-58} fontSize={12} fill="hsl(var(--muted-foreground))">terra</text>
        {/* linhas de campo */}
        {Array.from({length: 12}).map((_, i) => {
          const x = 150 + i * (W-300)/11;
          return <line key={i} x1={x} y1={56} x2={x} y2={H-56} stroke="hsl(var(--border))" strokeDasharray="2 4" />;
        })}
        {/* gota */}
        <g>
          <circle cx={W/2} cy={y} r={Math.max(4, params.radius_um * 6)} fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth={1.5} />
          <text x={W/2 + 14} y={y + 4} fontSize={11} fill="hsl(var(--foreground))">q = {results.q_over_e.toFixed(1)} e</text>
        </g>
        {/* vetor velocidade */}
        {Math.abs(offset) > 4 && (
          <line x1={W/2} y1={y} x2={W/2} y2={y - Math.sign(offset)*30} stroke="hsl(var(--primary))" strokeWidth={2}
            markerEnd="url(#arr)" />
        )}
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="hsl(var(--primary))" />
          </marker>
        </defs>
        <text x={20} y={H-10} fontSize={11} fill="hsl(var(--muted-foreground))">
          v_terminal = {vMm_s.toFixed(3)} mm/s · E = {results.E_Vm.toExponential(2)} V/m
        </text>
      </svg>
    </div>
  );
};