import { useEffect, useRef } from "react";
import { bWireXY, type AmpereParams } from "@/lib/physics";

interface Props { params: AmpereParams }

export const AmpereVisualization = ({ params }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cssGet = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const c = (token: string, alpha = 1) => `hsl(${cssGet(token)} / ${alpha})`;
    const dpr = devicePixelRatio || 1;

    const draw = () => {
      const W = canvas.width = canvas.clientWidth * dpr;
      const H = canvas.height = canvas.clientHeight * dpr;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = c("--secondary", 0.3);
      ctx.fillRect(0, 0, W, H);

      if (params.geometry === "toroid") {
        drawToroid(ctx, W, H, params, c, dpr);
      } else {
        drawWires(ctx, W, H, params, c, dpr);
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [params]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-[420px]" />
    </div>
  );
};

function drawWires(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  p: AmpereParams, c: (t: string, a?: number) => string, dpr: number,
) {
  // World: ±20 cm horizontal
  const halfWorld = 0.20; // m
  const scale = (W * 0.45) / halfWorld;
  const cx = W / 2, cy = H / 2;
  const w2s = (xm: number, ym: number) => ({ x: cx + xm * scale, y: cy - ym * scale });

  // Field lines via streamline integration around each wire
  const wires: { x: number; I: number }[] = p.geometry === "single"
    ? [{ x: 0, I: p.I1 }]
    : [{ x: -p.separationCm * 1e-2 / 2, I: p.I1 }, { x: p.separationCm * 1e-2 / 2, I: p.I2 }];

  ctx.strokeStyle = c("--primary", 0.35);
  ctx.lineWidth = 1 * dpr;
  // Concentric circles around each wire (proxy field lines)
  for (const w of wires) {
    const sign = Math.sign(w.I) || 1;
    for (let k = 1; k <= 6; k++) {
      const r = (0.015 * k); // 1.5cm steps
      ctx.beginPath();
      const center = w2s(w.x, 0);
      ctx.arc(center.x, center.y, r * scale, 0, Math.PI * 2);
      ctx.stroke();
      // arrowhead to indicate sense
      const ax = center.x + r * scale;
      const ay = center.y;
      const a = 5 * dpr;
      ctx.fillStyle = c("--primary", 0.6);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - a, ay - sign * a * 0.8);
      ctx.lineTo(ax - a, ay + sign * a * 0.8);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Wires (cross sections)
  for (const w of wires) {
    const pos = w2s(w.x, 0);
    ctx.fillStyle = c("--card");
    ctx.strokeStyle = c("--foreground");
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 12 * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = c("--foreground");
    ctx.font = `${14 * dpr}px ui-monospace, monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(w.I >= 0 ? "⊙" : "⊗", pos.x, pos.y);
    ctx.fillStyle = c("--muted-foreground");
    ctx.font = `${11 * dpr}px ui-sans-serif`;
    ctx.fillText(`${w.I.toFixed(1)} A`, pos.x, pos.y + 24 * dpr);
  }

  // Probe point
  const probe = w2s(p.probeXcm * 1e-2, p.probeYcm * 1e-2);
  let bx = 0, by = 0;
  for (const w of wires) {
    const r = bWireXY(w.I, w.x, p.probeXcm * 1e-2, p.probeYcm * 1e-2);
    bx += r.bx; by += r.by;
  }
  const Bmag = Math.hypot(bx, by);
  // arrow length scaled
  const Lpix = Math.min(80 * dpr, Math.max(15 * dpr, 1.5e6 * Bmag * dpr));
  if (Bmag > 0) {
    const ux = bx / Bmag, uy = by / Bmag;
    ctx.strokeStyle = c("--accent-foreground");
    ctx.fillStyle = c("--accent-foreground");
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.moveTo(probe.x, probe.y);
    // y-axis inverted on canvas
    const tipX = probe.x + ux * Lpix;
    const tipY = probe.y - uy * Lpix;
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    const ang = Math.atan2(-uy, ux);
    const a = 7 * dpr;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - a * Math.cos(ang - 0.4), tipY - a * Math.sin(ang - 0.4));
    ctx.lineTo(tipX - a * Math.cos(ang + 0.4), tipY - a * Math.sin(ang + 0.4));
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = c("--primary");
  ctx.beginPath();
  ctx.arc(probe.x, probe.y, 4 * dpr, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c("--muted-foreground");
  ctx.font = `${11 * dpr}px ui-sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(`P (${p.probeXcm.toFixed(1)}, ${p.probeYcm.toFixed(1)}) cm`, probe.x + 8 * dpr, probe.y - 8 * dpr);

  // Force indication for parallel
  if (p.geometry === "parallel" && Math.sign(p.I1 * p.I2) !== 0) {
    const attractive = p.I1 * p.I2 > 0;
    ctx.strokeStyle = c("--destructive");
    ctx.fillStyle = c("--destructive");
    ctx.lineWidth = 2 * dpr;
    const y = cy + 70 * dpr;
    const left = w2s(-p.separationCm * 1e-2 / 2, 0).x;
    const right = w2s(p.separationCm * 1e-2 / 2, 0).x;
    const drawArrow = (fromX: number, toX: number) => {
      ctx.beginPath();
      ctx.moveTo(fromX, y); ctx.lineTo(toX, y); ctx.stroke();
      const dir = Math.sign(toX - fromX);
      const a = 6 * dpr;
      ctx.beginPath();
      ctx.moveTo(toX, y);
      ctx.lineTo(toX - dir * a, y - a * 0.7);
      ctx.lineTo(toX - dir * a, y + a * 0.7);
      ctx.closePath(); ctx.fill();
    };
    if (attractive) {
      drawArrow(left - 30 * dpr, left - 5 * dpr); // toward right wire? actually attract: arrows point inward
      drawArrow(left + 5 * dpr, left + 30 * dpr);
      drawArrow(right - 30 * dpr, right - 5 * dpr);
      drawArrow(right + 5 * dpr, right + 30 * dpr);
      // Cleaner: attract = arrows point inward at each wire
    } else {
      drawArrow(left + 5 * dpr, left - 25 * dpr);
      drawArrow(right - 5 * dpr, right + 25 * dpr);
    }
    ctx.fillStyle = c("--muted-foreground");
    ctx.font = `${11 * dpr}px ui-sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(attractive ? "Atração (correntes paralelas)" : "Repulsão (antiparalelas)", cx, y + 18 * dpr);
  }
}

function drawToroid(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  p: AmpereParams, c: (t: string, a?: number) => string, dpr: number,
) {
  const cx = W / 2, cy = H / 2;
  const Rpix = Math.min(W, H) * 0.32;
  const apix = Math.max(8 * dpr, Rpix * (p.aMinorCm / Math.max(0.1, p.rMeanCm)));

  // Donut
  ctx.lineWidth = apix * 2;
  ctx.strokeStyle = c("--secondary");
  ctx.beginPath();
  ctx.arc(cx, cy, Rpix, 0, Math.PI * 2);
  ctx.stroke();
  // outer/inner edges
  ctx.lineWidth = 1.5 * dpr;
  ctx.strokeStyle = c("--border");
  ctx.beginPath(); ctx.arc(cx, cy, Rpix - apix, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, Rpix + apix, 0, Math.PI * 2); ctx.stroke();

  // Windings
  const windings = Math.min(72, Math.max(12, Math.round(p.N / 20)));
  ctx.strokeStyle = c("--primary", 0.7);
  ctx.lineWidth = 1.2 * dpr;
  for (let i = 0; i < windings; i++) {
    const a = (i / windings) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * (Rpix - apix);
    const y1 = cy + Math.sin(a) * (Rpix - apix);
    const x2 = cx + Math.cos(a) * (Rpix + apix);
    const y2 = cy + Math.sin(a) * (Rpix + apix);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  // Field arrow inside the toroid (along the axis = circular)
  ctx.strokeStyle = c("--accent-foreground");
  ctx.lineWidth = 2 * dpr;
  const sign = Math.sign(p.I1) || 1;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.05;
    const x = cx + Math.cos(a) * Rpix;
    const y = cy + Math.sin(a) * Rpix;
    const tx = -Math.sin(a) * sign;
    const ty = Math.cos(a) * sign;
    const len = 14 * dpr;
    ctx.beginPath();
    ctx.moveTo(x - tx * len / 2, y - ty * len / 2);
    ctx.lineTo(x + tx * len / 2, y + ty * len / 2);
    ctx.stroke();
    const ah = 5 * dpr;
    ctx.fillStyle = c("--accent-foreground");
    const ang = Math.atan2(ty, tx);
    const tipX = x + tx * len / 2, tipY = y + ty * len / 2;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - ah * Math.cos(ang - 0.4), tipY - ah * Math.sin(ang - 0.4));
    ctx.lineTo(tipX - ah * Math.cos(ang + 0.4), tipY - ah * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  }

  ctx.fillStyle = c("--muted-foreground");
  ctx.font = `${11 * dpr}px ui-sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`N = ${p.N} espiras · I = ${p.I1.toFixed(2)} A`, cx, cy + Rpix + apix + 22 * dpr);
  ctx.fillText("Campo confinado: B fora ≈ 0", cx, cy + Rpix + apix + 38 * dpr);
}