import { useEffect, useRef } from "react";
import type { OhmParams, OhmResults } from "@/lib/physics";

interface Props {
  params: OhmParams;
  results: OhmResults;
}

/**
 * Canvas visualization of a simple DC circuit:
 *  battery (V) — ammeter (A) — resistor (wire of length L) — back to battery,
 *  with a voltmeter (V) across the resistor. Animated dots show current direction
 *  and density proportional to |I|.
 */
export const CircuitVisualization = ({ params, results }: Props) => {
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
      for (let x = 0; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Layout — rectangular loop
      const margin = 60;
      const x0 = margin, x1 = W - margin;
      const y0 = margin + 10, y1 = H - margin;
      const corners = [
        { x: x0, y: y0 }, { x: x1, y: y0 },
        { x: x1, y: y1 }, { x: x0, y: y1 },
      ];

      // Wires
      ctx.strokeStyle = hsl("--wire");
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y);
      ctx.lineTo(corners[0].x, corners[0].y);
      ctx.stroke();

      // --- Battery on the left side (vertical) ---
      const battCx = x0;
      const battCy = (y0 + y1) / 2;
      const polarity = Math.sign(params.voltage) || 1;
      // Clear the wire under the symbol
      ctx.fillStyle = hsl("--card");
      ctx.fillRect(battCx - 14, battCy - 22, 28, 44);
      // Long line (+) and short line (−)
      ctx.strokeStyle = hsl("--foreground");
      ctx.lineWidth = 3;
      const longY = polarity > 0 ? battCy - 6 : battCy + 6;
      const shortY = polarity > 0 ? battCy + 6 : battCy - 6;
      ctx.beginPath(); ctx.moveTo(battCx - 14, longY); ctx.lineTo(battCx + 14, longY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(battCx - 8, shortY); ctx.lineTo(battCx + 8, shortY); ctx.stroke();
      ctx.fillStyle = hsl("--foreground");
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${params.voltage.toFixed(1)} V`, battCx - 18, battCy + 4);
      ctx.textAlign = "left";
      ctx.fillText(polarity > 0 ? "+" : "−", battCx + 18, longY + 4);
      ctx.fillText(polarity > 0 ? "−" : "+", battCx + 18, shortY + 4);

      // --- Ammeter on top wire ---
      const ammCx = (x0 + x1) / 2 - 80;
      const ammCy = y0;
      drawMeter(ctx, hsl, ammCx, ammCy, "A", `${formatCurrent(results.current)}`);

      // --- Resistor (wire spool) on top-right area ---
      const resCx = (x0 + x1) / 2 + 40;
      const resCy = y0;
      const resW = 110;
      const resH = 26;
      // mask wire under it
      ctx.fillStyle = hsl("--card");
      ctx.fillRect(resCx - resW / 2, resCy - resH / 2, resW, resH);
      ctx.strokeStyle = hsl("--resistor");
      ctx.lineWidth = 2.5;
      ctx.strokeRect(resCx - resW / 2, resCy - resH / 2, resW, resH);
      // zigzag inside
      ctx.beginPath();
      const zigs = 6;
      const zw = resW / zigs;
      for (let i = 0; i <= zigs; i++) {
        const xx = resCx - resW / 2 + i * zw;
        const yy = resCy + (i % 2 === 0 ? -resH / 3 : resH / 3);
        if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
      ctx.fillStyle = hsl("--foreground");
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`R = ${formatOhm(results.resistance)}`, resCx, resCy - resH / 2 - 8);
      ctx.fillText(`L = ${params.lengthCm.toFixed(0)} cm · ⌀ ${params.diameterMm.toFixed(2)} mm`, resCx, resCy + resH / 2 + 16);

      // --- Voltmeter across resistor (drawn below) ---
      const voltCx = resCx;
      const voltCy = (y0 + y1) / 2 + 30;
      // dashed leads from resistor ends
      ctx.strokeStyle = hsl("--muted-foreground", 0.7);
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(resCx - resW / 2, resCy + resH / 2);
      ctx.lineTo(voltCx - 26, voltCy - 18);
      ctx.moveTo(resCx + resW / 2, resCy + resH / 2);
      ctx.lineTo(voltCx + 26, voltCy - 18);
      ctx.stroke();
      ctx.setLineDash([]);
      drawMeter(ctx, hsl, voltCx, voltCy, "V", `${formatVolt(results.voltageDrop)}`);

      // --- Animated current dots along the loop ---
      const Imag = Math.min(1, Math.abs(results.current) / 5);
      const dotCount = Math.max(8, Math.round(20 + Imag * 30));
      const segs: { a: { x: number; y: number }; b: { x: number; y: number }; len: number }[] = [];
      let total = 0;
      for (let i = 0; i < corners.length; i++) {
        const a = corners[i];
        const b = corners[(i + 1) % corners.length];
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        segs.push({ a, b, len });
        total += len;
      }
      // direction: positive V drives conventional current from + terminal (top of battery if pol>0)
      // through the loop clockwise. We map t -> position along loop accordingly.
      const dir = polarity > 0 ? 1 : -1;
      const speed = 0.4 + 1.6 * Imag;
      tRef.current += speed;
      ctx.fillStyle = hsl("--current-flow", 0.85);
      for (let k = 0; k < dotCount; k++) {
        let s = ((k / dotCount) * total + tRef.current * dir) % total;
        if (s < 0) s += total;
        let acc = 0;
        for (const seg of segs) {
          if (s <= acc + seg.len) {
            const t = (s - acc) / seg.len;
            const x = seg.a.x + (seg.b.x - seg.a.x) * t;
            const y = seg.a.y + (seg.b.y - seg.a.y) * t;
            ctx.beginPath();
            ctx.arc(x, y, 2.5 + Imag * 1.5, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          acc += seg.len;
        }
      }

      // Power label
      ctx.fillStyle = hsl("--muted-foreground");
      ctx.font = "500 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`P = ${formatPower(results.power)} dissipados no resistor`, x0, y1 + 24);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [params, results]);

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl border border-border bg-card overflow-hidden shadow-card">
      <canvas ref={canvasRef} className="w-full h-full" aria-label="Visualização do circuito da Lei de Ohm" />
    </div>
  );
};

function drawMeter(
  ctx: CanvasRenderingContext2D,
  hsl: (n: string, a?: number) => string,
  cx: number, cy: number, label: string, value: string,
) {
  const r = 22;
  ctx.fillStyle = hsl("--card");
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = hsl("--primary");
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = hsl("--primary");
  ctx.font = "700 13px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, cy);
  ctx.fillStyle = hsl("--foreground");
  ctx.font = "600 10px 'JetBrains Mono', monospace";
  ctx.fillText(value, cx, cy - r - 10);
  ctx.textBaseline = "alphabetic";
}

function formatCurrent(I: number): string {
  const a = Math.abs(I);
  if (a >= 1) return `${I.toFixed(2)} A`;
  if (a >= 1e-3) return `${(I * 1e3).toFixed(1)} mA`;
  if (a >= 1e-6) return `${(I * 1e6).toFixed(1)} µA`;
  return `${I.toExponential(1)} A`;
}
function formatVolt(V: number): string {
  const a = Math.abs(V);
  if (a >= 1) return `${V.toFixed(2)} V`;
  if (a >= 1e-3) return `${(V * 1e3).toFixed(1)} mV`;
  return `${V.toExponential(1)} V`;
}
function formatOhm(R: number): string {
  if (!isFinite(R)) return "∞ Ω";
  if (R >= 1e6) return `${(R / 1e6).toFixed(2)} MΩ`;
  if (R >= 1e3) return `${(R / 1e3).toFixed(2)} kΩ`;
  if (R >= 1) return `${R.toFixed(2)} Ω`;
  if (R >= 1e-3) return `${(R * 1e3).toFixed(2)} mΩ`;
  return `${R.toExponential(2)} Ω`;
}
function formatPower(P: number): string {
  const a = Math.abs(P);
  if (a >= 1) return `${P.toFixed(2)} W`;
  if (a >= 1e-3) return `${(P * 1e3).toFixed(1)} mW`;
  return `${(P * 1e6).toFixed(1)} µW`;
}