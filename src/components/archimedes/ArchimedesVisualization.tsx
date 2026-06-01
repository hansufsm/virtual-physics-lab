import type { ArchimedesParams, ArchimedesResults } from "@/lib/physics";
export const ArchimedesVisualization = ({ params, results }: { params: ArchimedesParams; results: ArchimedesResults }) => {
  const W = 520, H = 380;
  const tankX = 60, tankW = 400, tankY = 50, tankH = 280;
  const waterTop = tankY + 80;
  // Tamanho do bloco baseado em V
  const side = Math.max(40, Math.min(140, Math.cbrt(results.V_m3) * 1000 * 0.6));
  const blockX = tankX + tankW / 2 - side / 2;
  let blockY: number;
  if (results.floats) {
    // afunda fração·side abaixo da linha d'água
    const submerged = results.fraction_submerged * side;
    blockY = waterTop - (side - submerged);
  } else {
    blockY = tankY + tankH - side - 6;
  }
  // setas
  const cx = blockX + side / 2;
  const cyTop = blockY;
  const cyBot = blockY + side;
  const Fmax = Math.max(results.weight_N, results.buoyancy_eq_N, 0.001);
  const wLen = (results.weight_N / Fmax) * 70;
  const bLen = (results.buoyancy_eq_N / Fmax) * 70;
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Recipiente com fluido</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-96 bg-background rounded-lg">
        {/* recipiente */}
        <rect x={tankX} y={tankY} width={tankW} height={tankH} fill="none" stroke="hsl(var(--foreground))" strokeWidth="2" />
        {/* fluido */}
        <rect x={tankX+2} y={waterTop} width={tankW-4} height={tankY+tankH-waterTop-2} fill="hsl(var(--primary))" opacity="0.20" />
        <line x1={tankX} y1={waterTop} x2={tankX+tankW} y2={waterTop} stroke="hsl(var(--primary))" strokeDasharray="4 4" strokeWidth="1.5" />
        <text x={tankX+tankW+6} y={waterTop+4} fontSize="10" fill="hsl(var(--primary))" fontFamily="monospace">linha d'água</text>
        <text x={tankX+6} y={tankY+tankH-6} fontSize="10" fill="hsl(var(--muted-foreground))" fontFamily="monospace">ρ_f = {params.rho_fluid_kg_m3} kg/m³</text>
        {/* bloco */}
        <rect x={blockX} y={blockY} width={side} height={side} fill={results.floats ? "hsl(var(--accent))" : "hsl(var(--destructive))"} stroke="hsl(var(--foreground))" />
        <text x={cx} y={blockY+side/2+4} textAnchor="middle" fontSize="11" fill="hsl(var(--background))" fontFamily="monospace">ρ={params.rho_obj_kg_m3}</text>
        {/* peso para baixo */}
        <line x1={cx} y1={cyBot} x2={cx} y2={cyBot + wLen} stroke="hsl(var(--destructive))" strokeWidth="2.4" markerEnd="url(#arr3)" />
        <text x={cx+6} y={cyBot + wLen} fontSize="10" fill="hsl(var(--destructive))" fontFamily="monospace">P</text>
        {/* empuxo para cima */}
        <line x1={cx-10} y1={cyTop} x2={cx-10} y2={cyTop - bLen} stroke="hsl(var(--primary))" strokeWidth="2.4" markerEnd="url(#arr3)" />
        <text x={cx-30} y={cyTop - bLen} fontSize="10" fill="hsl(var(--primary))" fontFamily="monospace">E</text>
        <defs>
          <marker id="arr3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--foreground))" />
          </marker>
        </defs>
      </svg>
      <p className="text-xs text-muted-foreground mt-2">
        {results.floats
          ? `O objeto flutua: fração submersa = ρ_obj/ρ_fluido = ${(results.fraction_submerged*100).toFixed(1)}%.`
          : `O objeto afunda (ρ_obj > ρ_fluido). Peso aparente submerso = ${results.apparent_weight_N.toFixed(2)} N.`}
      </p>
    </div>
  );
};