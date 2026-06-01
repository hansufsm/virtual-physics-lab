import type { MirrorParams, MirrorResults } from "@/lib/physics";
export const MirrorVisualization = ({ params, results }: { params: MirrorParams; results: MirrorResults }) => {
  const W = 700, H = 360;
  const axisY = H / 2;
  // Origem no espelho (lado direito)
  const mirrorX = W - 80;
  const maxDist = Math.max(params.p_cm, Math.abs(isFinite(results.pl_cm) ? results.pl_cm : 0), Math.abs(results.f_cm) * 2, 1) * 1.2;
  const sc = (W - 180) / maxDist; // cm → px
  // Objeto (à esquerda, p > 0)
  const objX = mirrorX - params.p_cm * sc;
  const objTopY = axisY - params.h_obj_cm * sc * 0.8;
  // Imagem
  const imgX = mirrorX - results.pl_cm * sc; // pl<0 ⇒ atrás do espelho
  const imgTopY = axisY - results.h_img_cm * sc * 0.8;
  // Foco e centro
  const fX = mirrorX - results.f_cm * sc;
  const cX = mirrorX - 2 * results.f_cm * sc;
  // Caminho do espelho (arco simples)
  const mirrorPath = params.kind === "concave"
    ? `M ${mirrorX+10},${axisY-90} Q ${mirrorX-30},${axisY} ${mirrorX+10},${axisY+90}`
    : `M ${mirrorX-10},${axisY-90} Q ${mirrorX+30},${axisY} ${mirrorX-10},${axisY+90}`;
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h4 className="text-sm font-semibold mb-2">Traçado de raios — espelho {params.kind === "concave" ? "côncavo" : "convexo"}</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-80 bg-background rounded-lg">
        {/* eixo óptico */}
        <line x1="20" y1={axisY} x2={W-20} y2={axisY} stroke="hsl(var(--border))" strokeDasharray="4 4" />
        {/* espelho */}
        <path d={mirrorPath} stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" />
        <line x1={mirrorX} y1={axisY-95} x2={mirrorX} y2={axisY+95} stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeDasharray="2 2" />
        {/* F e C */}
        {fX > 20 && fX < W-20 && (<><circle cx={fX} cy={axisY} r="3" fill="hsl(var(--accent))" /><text x={fX} y={axisY+18} textAnchor="middle" fontSize="11" fill="hsl(var(--accent))" fontFamily="monospace">F</text></>)}
        {cX > 20 && cX < W-20 && params.kind === "concave" && (<><circle cx={cX} cy={axisY} r="3" fill="hsl(var(--muted-foreground))" /><text x={cX} y={axisY+18} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="monospace">C</text></>)}
        {/* objeto (seta para cima) */}
        <line x1={objX} y1={axisY} x2={objX} y2={objTopY} stroke="hsl(var(--primary))" strokeWidth="2.5" markerEnd="url(#arrM)" />
        <text x={objX} y={axisY+18} textAnchor="middle" fontSize="11" fill="hsl(var(--primary))" fontFamily="monospace">objeto</text>
        {/* imagem */}
        {isFinite(results.pl_cm) && (<>
          <line x1={imgX} y1={axisY} x2={imgX} y2={imgTopY} stroke={results.isReal ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"} strokeWidth="2.5" strokeDasharray={results.isReal ? undefined : "5 3"} markerEnd="url(#arrM)" />
          <text x={imgX} y={results.h_img_cm > 0 ? axisY+18 : axisY-6} textAnchor="middle" fontSize="11" fill={results.isReal ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"} fontFamily="monospace">imagem</text>
        </>)}
        {/* Raio paralelo ao eixo → passa por F (côncavo) */}
        <line x1={objX} y1={objTopY} x2={mirrorX} y2={objTopY} stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.7" />
        {params.kind === "concave" ? (
          <line x1={mirrorX} y1={objTopY} x2={fX > 0 ? fX : 0} y2={axisY} stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.7" />
        ) : (
          <line x1={mirrorX} y1={objTopY} x2={mirrorX + 60} y2={objTopY - ((axisY - objTopY) / Math.max(1, mirrorX - fX)) * 60} stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
        )}
        {/* Raio passando pelo vértice */}
        <line x1={objX} y1={objTopY} x2={mirrorX} y2={axisY} stroke="hsl(var(--accent))" strokeWidth="1" opacity="0.7" />
        <line x1={mirrorX} y1={axisY} x2={objX} y2={2*axisY - objTopY} stroke="hsl(var(--accent))" strokeWidth="1" opacity="0.5" />
        <defs>
          <marker id="arrM" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="hsl(var(--foreground))" />
          </marker>
        </defs>
      </svg>
      <p className="text-xs text-muted-foreground mt-2">{results.region}. {isFinite(results.pl_cm) ? `Aumento = ${results.m.toFixed(2)}×` : "Imagem no infinito (objeto sobre o foco)"}.</p>
    </div>
  );
};