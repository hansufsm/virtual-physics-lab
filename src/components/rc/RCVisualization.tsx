import { useEffect, useRef } from "react";
import type { RCParams } from "@/lib/physics";

interface Props {
  params: RCParams;
  vc: number;       // tensão atual no capacitor
  ic: number;       // corrente atual
  running: boolean;
}

/**
 * Esquemático SVG do circuito RC com:
 * - Fonte E à esquerda
 * - Chave (mostrando carga/descarga)
 * - Resistor (zig-zag)
 * - Capacitor (placas) com preenchimento proporcional à carga
 * - Pontos de corrente animados ao longo do fio (densidade ∝ |i|)
 */
export const RCVisualization = ({ params, vc, ic, running }: Props) => {
  const offsetRef = useRef(0);
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(performance.now());
  const dotsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const tick = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (running) {
        // Velocidade dos pontos proporcional a corrente (mA escala)
        const speed = Math.sign(ic) * Math.min(120, Math.abs(ic) * 1e3 * 6);
        offsetRef.current = (offsetRef.current + speed * dt) % 24;
        if (dotsRef.current) {
          dotsRef.current.setAttribute("transform", `translate(${offsetRef.current}, 0)`);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [ic, running]);

  // Preenchimento do capacitor (placa positiva): proporcional a |Vc|/Vmax
  const vMax = Math.max(Math.abs(params.emf), Math.abs(params.v0), 1);
  const fillRatio = Math.max(0, Math.min(1, Math.abs(vc) / vMax));

  const W = 640, H = 320;
  // Coordenadas do laço
  const x1 = 70, x2 = 570, yTop = 90, yBot = 230;

  // Geração dos pontos animados (densidade fixa, posições em x)
  const dotXs: number[] = [];
  for (let x = x1 + 12; x <= x2 - 12; x += 24) dotXs.push(x);
  const dotIntensity = Math.min(1, Math.abs(ic) * 1e3 / 20); // 20 mA satura

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Circuito RC">
        {/* Wire frame */}
        <g stroke="hsl(var(--wire))" strokeWidth={2.5} fill="none" strokeLinecap="round">
          {/* top wire */}
          <line x1={x1} y1={yTop} x2={x2} y2={yTop} />
          {/* left wire (down to source) */}
          <line x1={x1} y1={yTop} x2={x1} y2={yBot} />
          {/* bottom wire */}
          <line x1={x1} y1={yBot} x2={x2} y2={yBot} />
          {/* right wire (down to capacitor) */}
          <line x1={x2} y1={yTop} x2={x2} y2={yBot} />
        </g>

        {/* Animated current dots along the loop (top wire only — represents direction) */}
        <g ref={dotsRef}>
          {dotXs.map((x, i) => (
            <circle
              key={i}
              cx={x} cy={yTop}
              r={3.2}
              fill="hsl(var(--current-flow))"
              opacity={0.25 + 0.75 * dotIntensity}
            />
          ))}
        </g>

        {/* Source (battery) on left wire */}
        <g transform={`translate(${x1}, ${(yTop + yBot) / 2})`}>
          <line x1={-14} y1={-14} x2={14} y2={-14} stroke="hsl(var(--foreground))" strokeWidth={3} />
          <line x1={-8} y1={-2} x2={8} y2={-2} stroke="hsl(var(--foreground))" strokeWidth={5} />
          <line x1={-14} y1={10} x2={14} y2={10} stroke="hsl(var(--foreground))" strokeWidth={3} />
          <line x1={-8} y1={22} x2={8} y2={22} stroke="hsl(var(--foreground))" strokeWidth={5} />
          {/* Mask wire behind */}
          <rect x={-2} y={-30} width={4} height={20} fill="hsl(var(--card))" />
          <rect x={-2} y={26} width={4} height={20} fill="hsl(var(--card))" />
          <text x={26} y={6} fontSize={13} fontFamily="monospace" fill="hsl(var(--foreground))">
            E = {params.emf.toFixed(1)} V
          </text>
        </g>

        {/* Switch at top-left (visual hint of mode) */}
        <g transform={`translate(${x1 + 90}, ${yTop})`}>
          <rect x={-14} y={-22} width={28} height={20} rx={3} fill="hsl(var(--card))"
            stroke={params.mode === "charge" ? "hsl(var(--switch-on))" : "hsl(var(--switch-off))"} strokeWidth={1.5} />
          <text x={0} y={-7} textAnchor="middle" fontSize={10} fontFamily="monospace"
            fill={params.mode === "charge" ? "hsl(var(--switch-on))" : "hsl(var(--switch-off))"}>
            {params.mode === "charge" ? "CARGA" : "DESCARGA"}
          </text>
        </g>

        {/* Resistor (zigzag) on top wire */}
        <g transform={`translate(${(x1 + x2) / 2 - 60}, ${yTop})`}>
          <rect x={-4} y={-8} width={128} height={16} fill="hsl(var(--card))" />
          <polyline
            points="0,0 10,-10 22,10 34,-10 46,10 58,-10 70,10 82,-10 94,10 106,-10 118,0"
            stroke="hsl(var(--resistor))" strokeWidth={2.5} fill="none" strokeLinejoin="round"
          />
          <text x={60} y={-18} textAnchor="middle" fontSize={12} fontFamily="monospace" fill="hsl(var(--foreground))">
            R = {formatR(params.resistanceK)}
          </text>
        </g>

        {/* Capacitor (right side) */}
        <g transform={`translate(${x2}, ${(yTop + yBot) / 2})`}>
          <rect x={-2} y={-50} width={4} height={26} fill="hsl(var(--card))" />
          <rect x={-2} y={24} width={4} height={26} fill="hsl(var(--card))" />
          {/* top plate (positive) */}
          <line x1={-26} y1={-12} x2={26} y2={-12} stroke="hsl(var(--plate))" strokeWidth={4} />
          {/* fill indicator above top plate (orange = +Q) */}
          <rect x={-22} y={-12 - 14 * fillRatio} width={44} height={14 * fillRatio}
            fill="hsl(var(--positive))" opacity={0.55} />
          {/* bottom plate (negative) */}
          <line x1={-26} y1={12} x2={26} y2={12} stroke="hsl(var(--plate))" strokeWidth={4} />
          <rect x={-22} y={12} width={44} height={14 * fillRatio}
            fill="hsl(var(--negative))" opacity={0.55} />
          {/* Symbols + / - */}
          <text x={32} y={-8} fontSize={14} fontFamily="monospace" fill="hsl(var(--positive))">+</text>
          <text x={32} y={20} fontSize={14} fontFamily="monospace" fill="hsl(var(--negative))">−</text>
          <text x={36} y={48} fontSize={12} fontFamily="monospace" fill="hsl(var(--foreground))">
            C = {formatC(params.capacitanceUf)}
          </text>
          <text x={36} y={62} fontSize={11} fontFamily="monospace" fill="hsl(var(--muted-foreground))">
            Vc = {vc.toFixed(2)} V
          </text>
        </g>

        {/* Voltmeter readout */}
        <g transform={`translate(${(x1 + x2) / 2}, ${yBot + 50})`}>
          <text textAnchor="middle" fontSize={11} fontFamily="monospace" fill="hsl(var(--muted-foreground))">
            i(t) = {(ic * 1e3).toFixed(3)} mA &nbsp;·&nbsp; Vc(t) = {vc.toFixed(3)} V
          </text>
        </g>
      </svg>
    </div>
  );
};

function formatR(k: number) {
  if (k >= 1000) return `${(k / 1000).toFixed(1)} MΩ`;
  if (k >= 1) return `${k.toFixed(2)} kΩ`;
  return `${(k * 1000).toFixed(0)} Ω`;
}
function formatC(uf: number) {
  if (uf >= 1000) return `${(uf / 1000).toFixed(2)} mF`;
  if (uf >= 1) return `${uf.toFixed(2)} µF`;
  return `${(uf * 1000).toFixed(1)} nF`;
}