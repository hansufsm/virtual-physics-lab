import { useEffect, useRef } from "react";
import type { GaussParams } from "@/lib/physics";

interface Props { params: GaussParams }

export const GaussVisualization = ({ params }: Props) => {
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

      const cx = W / 2, cy = H / 2;
      // World half-width: 30 cm
      const halfWorld = 0.30;
      const scale = (Math.min(W, H) * 0.45) / halfWorld;

      const sign = signOfSource(params);
      drawSource(ctx, params, cx, cy, scale, dpr, c);
      drawFieldLines(ctx, params, cx, cy, scale, dpr, sign, c);
      drawGaussian(ctx, params, cx, cy, scale, dpr, c);
      drawProbe(ctx, params, cx, cy, scale, dpr, c);
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

function signOfSource(p: GaussParams): number {
  switch (p.geometry) {
    case "point":
    case "sphere": return Math.sign(p.Q) || 1;
    case "line": return Math.sign(p.lambda) || 1;
    case "plane": return Math.sign(p.sigma) || 1;
  }
}

function drawSource(
  ctx: CanvasRenderingContext2D, p: GaussParams,
  cx: number, cy: number, scale: number, dpr: number,
  c: (t: string, a?: number) => string,
) {
  const sign = signOfSource(p);
  const fill = sign >= 0 ? c("--destructive", 0.85) : c("--primary", 0.85);
  ctx.fillStyle = fill;
  ctx.strokeStyle = c("--foreground");
  ctx.lineWidth = 1.5 * dpr;

  if (p.geometry === "point") {
    ctx.beginPath();
    ctx.arc(cx, cy, 8 * dpr, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = c("--foreground");
    ctx.font = `${12 * dpr}px ui-monospace, monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(sign >= 0 ? "+" : "−", cx, cy);
  } else if (p.geometry === "sphere") {
    const R = p.sourceRadiusCm * 1e-2 * scale;
    ctx.globalAlpha = 0.55;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
    ctx.fillStyle = c("--foreground");
    ctx.font = `${11 * dpr}px ui-sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(`R=${p.sourceRadiusCm.toFixed(1)}cm`, cx, cy + R + 14 * dpr);
  } else if (p.geometry === "line") {
    // vertical line
    ctx.strokeStyle = fill;
    ctx.lineWidth = 4 * dpr;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, ctx.canvas.height); ctx.stroke();
    ctx.fillStyle = c("--muted-foreground");
    ctx.font = `${11 * dpr}px ui-sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`λ = ${(p.lambda * 1e9).toFixed(1)} nC/m`, cx + 10 * dpr, 16 * dpr);
  } else if (p.geometry === "plane") {
    // vertical plane (edge-on view: line)
    ctx.strokeStyle = fill;
    ctx.lineWidth = 4 * dpr;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, ctx.canvas.height); ctx.stroke();
    // hatching to denote a plane
    ctx.strokeStyle = c("--foreground", 0.35);
    ctx.lineWidth = 1 * dpr;
    for (let y = 10 * dpr; y < ctx.canvas.height; y += 14 * dpr) {
      ctx.beginPath();
      ctx.moveTo(cx - 10 * dpr, y);
      ctx.lineTo(cx + 10 * dpr, y - 8 * dpr);
      ctx.stroke();
    }
    ctx.fillStyle = c("--muted-foreground");
    ctx.font = `${11 * dpr}px ui-sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(`σ = ${(p.sigma * 1e9).toFixed(1)} nC/m²`, cx + 14 * dpr, 16 * dpr);
  }
}

function drawFieldLines(
  ctx: CanvasRenderingContext2D, p: GaussParams,
  cx: number, cy: number, scale: number, dpr: number, sign: number,
  c: (t: string, a?: number) => string,
) {
  ctx.strokeStyle = c("--primary", 0.55);
  ctx.fillStyle = c("--primary", 0.7);
  ctx.lineWidth = 1.2 * dpr;

  const arrow = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const a = 5 * dpr;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - a * Math.cos(ang - 0.4), y2 - a * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - a * Math.cos(ang + 0.4), y2 - a * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  };

  if (p.geometry === "point" || p.geometry === "sphere" || p.geometry === "line") {
    const N = p.geometry === "line" ? 8 : 16;
    const Rstart = p.geometry === "sphere" ? p.sourceRadiusCm * 1e-2 * scale + 4 * dpr : 14 * dpr;
    const Rend = Math.min(ctx.canvas.width, ctx.canvas.height) * 0.46;
    if (p.geometry === "line") {
      // horizontal radial lines (in plane perpendicular to wire)
      for (let i = 0; i < N; i++) {
        const y = (i + 0.5) * (ctx.canvas.height / N);
        for (const dirx of [-1, 1]) {
          const x1 = cx + dirx * Rstart;
          const x2 = cx + dirx * Rend;
          if (sign > 0) arrow(x1, y, x2, y);
          else arrow(x2, y, x1, y);
        }
      }
    } else {
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * Rstart;
        const y1 = cy + Math.sin(a) * Rstart;
        const x2 = cx + Math.cos(a) * Rend;
        const y2 = cy + Math.sin(a) * Rend;
        if (sign > 0) arrow(x1, y1, x2, y2);
        else arrow(x2, y2, x1, y1);
      }
    }
  } else if (p.geometry === "plane") {
    const N = 9;
    for (let i = 0; i < N; i++) {
      const y = (i + 0.5) * (ctx.canvas.height / N);
      for (const dirx of [-1, 1]) {
        const x1 = cx + dirx * 8 * dpr;
        const x2 = cx + dirx * Math.min(ctx.canvas.width, ctx.canvas.height) * 0.46;
        if (sign > 0) arrow(x1, y, x2, y);
        else arrow(x2, y, x1, y);
      }
    }
  }
}

function drawGaussian(
  ctx: CanvasRenderingContext2D, p: GaussParams,
  cx: number, cy: number, scale: number, dpr: number,
  c: (t: string, a?: number) => string,
) {
  ctx.strokeStyle = c("--accent-foreground");
  ctx.lineWidth = 2 * dpr;
  ctx.setLineDash([6 * dpr, 4 * dpr]);
  const rs = p.surfaceRadiusCm * 1e-2 * scale;

  if (p.surface === "sphere") {
    ctx.beginPath(); ctx.arc(cx, cy, rs, 0, Math.PI * 2); ctx.stroke();
  } else if (p.surface === "cylinder") {
    const Lpix = Math.min(ctx.canvas.height * 0.85, p.surfaceLengthCm * 1e-2 * scale);
    const top = cy - Lpix / 2, bot = cy + Lpix / 2;
    // two horizontal lines (cylindrical lateral, edge-on around vertical wire)
    ctx.beginPath(); ctx.moveTo(cx - rs, top); ctx.lineTo(cx - rs, bot); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + rs, top); ctx.lineTo(cx + rs, bot); ctx.stroke();
    // top/bottom caps (ellipses suggesting depth)
    ctx.beginPath(); ctx.ellipse(cx, top, rs, rs * 0.25, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, bot, rs, rs * 0.25, 0, 0, Math.PI * 2); ctx.stroke();
  } else if (p.surface === "pillbox") {
    // pillbox crossing the plane: two faces parallel to plane
    const half = rs;
    const offset = Math.max(20 * dpr, rs * 0.4);
    ctx.beginPath();
    ctx.ellipse(cx - offset, cy, half * 0.25, half, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + offset, cy, half * 0.25, half, 0, 0, Math.PI * 2); ctx.stroke();
    // connect faces
    ctx.beginPath();
    ctx.moveTo(cx - offset, cy - half); ctx.lineTo(cx + offset, cy - half);
    ctx.moveTo(cx - offset, cy + half); ctx.lineTo(cx + offset, cy + half);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawProbe(
  ctx: CanvasRenderingContext2D, p: GaussParams,
  cx: number, cy: number, scale: number, dpr: number,
  c: (t: string, a?: number) => string,
) {
  const r = p.probeRcm * 1e-2 * scale;
  const px = cx + r;
  const py = cy;
  ctx.fillStyle = c("--primary");
  ctx.beginPath(); ctx.arc(px, py, 4 * dpr, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c("--muted-foreground");
  ctx.font = `${11 * dpr}px ui-sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(`P (r = ${p.probeRcm.toFixed(1)} cm)`, px + 8 * dpr, py - 8 * dpr);
}