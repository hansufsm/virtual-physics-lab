import type { SternParams, SternResults } from "@/lib/physics";

interface Props { params: SternParams; results: SternResults }

export const SternVisualization = ({ results }: Props) => {
  const W = 760, H = 320;
  const cy = H / 2;
  const maxSep = Math.max(10, Math.abs(results.beams[0].z_mm) * 1.4);
  const scale = (H/2 - 30) / maxSep; // mm → px
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Forno */}
        <rect x={10} y={cy-20} width={60} height={40} fill="hsl(var(--muted))" stroke="hsl(var(--border))" rx={4} />
        <text x={40} y={cy+4} fontSize={10} textAnchor="middle" fill="hsl(var(--muted-foreground))">Forno</text>
        {/* Ímã com gradiente */}
        <rect x={170} y={cy-46} width={220} height={28} fill="hsl(var(--primary)/0.18)" stroke="hsl(var(--primary))" />
        <rect x={170} y={cy+18} width={220} height={28} fill="hsl(var(--accent)/0.18)" stroke="hsl(var(--accent))" />
        <text x={280} y={cy-50} fontSize={10} textAnchor="middle" fill="hsl(var(--primary))">N (lâmina)</text>
        <text x={280} y={cy+58} fontSize={10} textAnchor="middle" fill="hsl(var(--accent))">S (canaleta)</text>
        {/* Detector */}
        <rect x={W-60} y={20} width={20} height={H-40} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <text x={W-50} y={15} fontSize={10} textAnchor="middle" fill="hsl(var(--muted-foreground))">Anteparo</text>
        {/* Trajetórias */}
        {results.beams.map((b, i) => {
          const yEnd = cy - b.z_mm * scale;
          const color = b.ms > 0 ? "hsl(var(--primary))" : "hsl(217 91% 60%)";
          return (
            <g key={i}>
              <path d={`M 70 ${cy} L 170 ${cy} Q 280 ${cy} 390 ${(cy + yEnd)/2} L ${W-60} ${yEnd}`}
                fill="none" stroke={color} strokeWidth={2} />
              <circle cx={W-60} cy={yEnd} r={8} fill={color} opacity={0.85} />
              <text x={W-95} y={yEnd+4} fontSize={11} textAnchor="end" fill="hsl(var(--foreground))">m_s={b.ms > 0 ? "+½" : "−½"}</text>
              <text x={W-95} y={yEnd+18} fontSize={10} textAnchor="end" fill="hsl(var(--muted-foreground))">{b.z_mm.toFixed(3)} mm</text>
            </g>
          );
        })}
        {/* feixe central de referência (clássico) */}
        <line x1={70} y1={cy} x2={W-60} y2={cy} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" opacity={0.5} />
        <text x={20} y={H-8} fontSize={10} fill="hsl(var(--muted-foreground))">
          Previsão clássica: faixa contínua. Resultado quântico: 2 pontos discretos.
        </text>
      </svg>
    </div>
  );
};