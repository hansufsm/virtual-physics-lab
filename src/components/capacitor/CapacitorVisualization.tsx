import { useEffect, useRef } from "react";
import type { CapacitorParams, CapacitorResults } from "@/lib/physics";

interface Props {
  params: CapacitorParams;
  results: CapacitorResults;
  showDielectric: boolean;
}

/**
 * Canvas visualization of a parallel-plate capacitor:
 * - Two plates with surface charges (+ / −)
 * - Electric field lines (density proportional to E)
 * - Optional dielectric slab between the plates
 */
export const CapacitorVisualization = ({ params, results, showDielectric }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const css = getComputedStyle(document.documentElement);
    const hsl = (name: string, a = 1) => `hsl(${css.getPropertyValue(name).trim()} / ${a})`;

    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = hsl("--border", 0.5);
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Plate geometry — distance scales the visible gap
      const minGap = 40;
      const maxGap = Math.min(H * 0.55, 240);
      const dNorm = Math.min(1, params.distanceMm / 20);
      const gap = minGap + (maxGap - minGap) * dNorm;

      const plateW = Math.min(W * 0.7, 360);
      const plateH = 14;
      const cx = W / 2;
      const cy = H / 2;
      const topY = cy - gap / 2 - plateH / 2;
      const botY = cy + gap / 2 - plateH / 2;
      const left = cx - plateW / 2;

      // Polarity (voltage may be negative)
      const polarity = Math.sign(params.voltage) || 1;
      const topColor = polarity > 0 ? hsl("--positive") : hsl("--negative");
      const botColor = polarity > 0 ? hsl("--negative") : hsl("--positive");

      // Dielectric slab
      if (showDielectric && params.epsilonR > 1) {
        const slabTop = topY + plateH;
        const slabH = botY - (topY + plateH);
        ctx.fillStyle = hsl("--dielectric", 0.12);
        ctx.strokeStyle = hsl("--dielectric", 0.5);
        ctx.lineWidth = 1.5;
        ctx.fillRect(left, slabTop, plateW, slabH);
        ctx.strokeRect(left, slabTop, plateW, slabH);
        ctx.fillStyle = hsl("--dielectric", 0.9);
        ctx.font = "500 11px Inter, sans-serif";
        ctx.fillText(`εᵣ = ${params.epsilonR.toFixed(2)}`, left + 8, slabTop + 16);
      }

      // Plates
      const drawPlate = (y: number, color: string, label: string) => {
        ctx.fillStyle = hsl("--plate");
        ctx.fillRect(left, y, plateW, plateH);
        ctx.fillStyle = color;
        ctx.fillRect(left, y, plateW, 4);
        ctx.fillRect(left, y + plateH - 4, plateW, 4);
        ctx.fillStyle = color;
        ctx.font = "600 13px 'JetBrains Mono', monospace";
        ctx.fillText(label, left + plateW + 10, y + plateH);
      };
      drawPlate(topY, topColor, polarity > 0 ? "+Q" : "−Q");
      drawPlate(botY, botColor, polarity > 0 ? "−Q" : "+Q");

      // Surface charges
      const chargeCount = Math.max(4, Math.min(20, Math.round(Math.log10(Math.abs(results.charge) * 1e12 + 10) * 4)));
      ctx.font = "600 14px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      for (let i = 0; i < chargeCount; i++) {
        const x = left + (plateW / (chargeCount + 1)) * (i + 1);
        ctx.fillStyle = topColor;
        ctx.fillText(polarity > 0 ? "+" : "−", x, topY - 4);
        ctx.fillStyle = botColor;
        ctx.fillText(polarity > 0 ? "−" : "+", x, botY + plateH + 14);
      }
      ctx.textAlign = "start";

      // Field lines — moving dashes proportional to E
      const lineCount = Math.max(3, Math.min(14, chargeCount - 2));
      const Emag = Math.min(1, Math.abs(results.electricField) / 5e5);
      ctx.strokeStyle = hsl("--field-line", 0.35 + 0.55 * Emag);
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -tRef.current * (1 + Emag * 4);
      for (let i = 0; i < lineCount; i++) {
        const x = left + (plateW / (lineCount + 1)) * (i + 1);
        ctx.beginPath();
        if (polarity > 0) { ctx.moveTo(x, topY + plateH); ctx.lineTo(x, botY); }
        else { ctx.moveTo(x, botY); ctx.lineTo(x, topY + plateH); }
        ctx.stroke();

        // Arrow head at midpoint
        const my = (topY + plateH + botY) / 2;
        const dir = polarity > 0 ? 1 : -1;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x - 4, my - 4 * dir);
        ctx.lineTo(x, my + 2 * dir);
        ctx.lineTo(x + 4, my - 4 * dir);
        ctx.stroke();
        ctx.setLineDash([6, 6]);
      }
      ctx.setLineDash([]);

      // Distance label
      ctx.strokeStyle = hsl("--muted-foreground", 0.6);
      ctx.fillStyle = hsl("--muted-foreground");
      ctx.font = "500 11px Inter, sans-serif";
      const arrX = left - 28;
      ctx.beginPath();
      ctx.moveTo(arrX, topY + plateH);
      ctx.lineTo(arrX, botY);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(arrX - 4, topY + plateH + 4); ctx.lineTo(arrX, topY + plateH); ctx.lineTo(arrX + 4, topY + plateH + 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(arrX - 4, botY - 4); ctx.lineTo(arrX, botY); ctx.lineTo(arrX + 4, botY - 4); ctx.stroke();
      ctx.fillText(`d = ${params.distanceMm.toFixed(2)} mm`, arrX - 60, (topY + botY) / 2 + 4);

      // Voltage source indicator
      ctx.fillStyle = hsl("--foreground");
      ctx.font = "600 12px 'JetBrains Mono', monospace";
      ctx.fillText(`V = ${params.voltage.toFixed(1)} V`, left, topY - 24);

      tRef.current += 1;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [params, results, showDielectric]);

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl border border-border bg-card overflow-hidden shadow-card">
      <canvas ref={canvasRef} className="w-full h-full" aria-label="Visualização do capacitor de placas paralelas" />
    </div>
  );
};