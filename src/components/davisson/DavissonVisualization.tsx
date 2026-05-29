import type { DavissonParams, DavissonResults } from "@/lib/physics";

interface Props { params: DavissonParams; results: DavissonResults }

export const DavissonVisualization = ({ results }: Props) => {
  const W = 720, H = 360;
  const cx = W/2, cy = H - 40;
  const r = 240;
  // Padrão polar de intensidade
  const maxI = Math.max(1e-6, ...results.pattern.map((p) => p.I));
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* cristal */}
        <rect x={cx-160} y={cy-2} width={320} height={20} fill="hsl(var(--muted))" stroke="hsl(var(--border))" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`p${i}`} x1={cx-160+i*40} y1={cy-2} x2={cx-160+i*40} y2={cy+18} stroke="hsl(var(--border))" />
        ))}
        {/* feixe incidente */}
        <line x1={cx} y1={20} x2={cx} y2={cy} stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="4 4" />
        <text x={cx+6} y={30} fontSize={11} fill="hsl(var(--muted-foreground))">e⁻ incidente</text>
        {/* semicirculo detector */}
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} stroke="hsl(var(--border))" fill="none" strokeDasharray="3 3" />
        {[15,30,45,60,75,90].map((a) => {
          const ar = a*Math.PI/180;
          const x1 = cx - Math.sin(ar)*(r-10), y1 = cy - Math.cos(ar)*(r-10);
          const x2 = cx - Math.sin(ar)*(r+10), y2 = cy - Math.cos(ar)*(r+10);
          return <g key={a}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--muted-foreground))" />
            <text x={cx - Math.sin(ar)*(r+25)} y={cy - Math.cos(ar)*(r+25)} fontSize={10}
              fill="hsl(var(--muted-foreground))" textAnchor="middle">{a}°</text>
          </g>;
        })}
        {/* intensidade radial */}
        <path d={
          results.pattern.map((pt, i) => {
            const a = pt.phi*Math.PI/180;
            const rad = (r-60) + (pt.I/maxI)*55;
            const x = cx + Math.sin(a)*rad;
            const y = cy - Math.cos(a)*rad;
            return `${i===0?"M":"L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
          }).join(" ")
        } fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} opacity={0.9} />
        {/* feixes nos picos */}
        {results.peaks.map((p) => {
          const a = p.phi_deg*Math.PI/180;
          const x2 = cx + Math.sin(a)*r;
          const y2 = cy - Math.cos(a)*r;
          return <g key={p.n}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="hsl(var(--primary))" strokeWidth={1.5} opacity={0.55} />
            <circle cx={x2} cy={y2} r={5} fill="hsl(var(--primary))" />
            <text x={x2+8} y={y2-6} fontSize={11} fill="hsl(var(--foreground))">n={p.n} · φ={p.phi_deg.toFixed(1)}°</text>
          </g>;
        })}
        <text x={20} y={H-10} fontSize={11} fill="hsl(var(--muted-foreground))">
          λ = {results.lambda_nm.toFixed(4)} nm · d = {results.preset.d_nm.toFixed(3)} nm
        </text>
      </svg>
    </div>
  );
};