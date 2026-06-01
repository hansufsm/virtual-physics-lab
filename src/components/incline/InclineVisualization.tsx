import type { InclineParams, InclineResults } from "@/lib/physics";
export const InclineVisualization = ({ params, results }: { params: InclineParams; results: InclineResults }) => {
  const W = 600, H = 360;
  const th = (params.angle_deg * Math.PI) / 180;
  // Triângulo do plano
  const baseY = H - 40;
  const baseX0 = 60;
  const baseX1 = 560;
  const baseLen = baseX1 - baseX0;
  const heightPx = baseLen * Math.tan(th);
  const topY = Math.max(40, baseY - heightPx);
  const apexX = baseX0;
  // Posição do bloco (no meio do plano)
  const bx = baseX0 + Math.cos(th) * baseLen * 0.5;
  const by = baseY - Math.sin(th) * baseLen * 0.5;
  // Escala das forças
  const Fmax = Math.max(results.Fg_paral_N, results.Fg_norm_N, results.Normal_N, results.F_atrito_max_N, 1);
  const sc = 60 / Fmax;
  // Vetores no bloco
  // Peso (sempre para baixo)
  const Pmag = results.Fg_paral_N / Math.sin(th || 0.0001);
  const Pvy = Math.min(80, Pmag * sc);
  // Normal (perpendicular ao plano, sentido afastando do plano)
  const nx = Math.sin(th), ny = -Math.cos(th);
  const Nlen = results.Normal_N * sc;
  // Atrito (ao longo do plano, sentido oposto ao movimento — para cima do plano se desce)
  const ax = -Math.cos(th), ay = Math.sin(th);
  const fLen = (results.willMove ? results.F_atrito_cin_N : Math.min(results.Fg_paral_N, results.F_atrito_max_N)) * sc;
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Diagrama do plano inclinado e forças</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-80 bg-background rounded-lg">
        <line x1="0" y1={baseY} x2={W} y2={baseY} stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        {/* triângulo */}
        <polygon points={`${apexX},${topY} ${baseX1},${baseY} ${baseX0},${baseY}`} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        <text x={baseX0+30} y={baseY-6} fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="monospace">θ={params.angle_deg.toFixed(1)}°</text>
        {/* bloco */}
        <g transform={`translate(${bx} ${by}) rotate(${-params.angle_deg})`}>
          <rect x="-22" y="-32" width="44" height="32" fill="hsl(var(--primary))" rx="3" />
          <text x="0" y="-12" textAnchor="middle" fontSize="10" fill="hsl(var(--primary-foreground))" fontFamily="monospace">{params.mass_kg}kg</text>
        </g>
        {/* Vetor peso */}
        <line x1={bx} y1={by} x2={bx} y2={by + Pvy} stroke="hsl(var(--destructive))" strokeWidth="2.2" markerEnd="url(#arr2)" />
        <text x={bx+6} y={by + Pvy} fontSize="10" fill="hsl(var(--destructive))" fontFamily="monospace">P</text>
        {/* Normal */}
        <line x1={bx} y1={by} x2={bx + nx * Nlen} y2={by + ny * Nlen} stroke="hsl(var(--accent))" strokeWidth="2.2" markerEnd="url(#arr2)" />
        <text x={bx + nx * Nlen + 4} y={by + ny * Nlen} fontSize="10" fill="hsl(var(--accent))" fontFamily="monospace">N</text>
        {/* Atrito */}
        {fLen > 0.5 && (<>
          <line x1={bx} y1={by} x2={bx + ax * fLen} y2={by + ay * fLen} stroke="hsl(var(--primary))" strokeWidth="2.2" markerEnd="url(#arr2)" />
          <text x={bx + ax * fLen - 14} y={by + ay * fLen - 2} fontSize="10" fill="hsl(var(--primary))" fontFamily="monospace">f</text>
        </>)}
        <defs>
          <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--foreground))" />
          </marker>
        </defs>
      </svg>
      <p className="text-xs text-muted-foreground mt-2">
        {results.willMove ? `O bloco desce com a = ${results.acceleration_m_s2.toFixed(2)} m/s².` : `Em repouso: atrito estático equilibra F∥ (≤ μ_s·N = ${results.F_atrito_max_N.toFixed(2)} N).`}
        {" "}Ângulo crítico θ_c = arctan(μ_s) = {results.angle_critical_deg.toFixed(2)}°.
      </p>
    </div>
  );
};