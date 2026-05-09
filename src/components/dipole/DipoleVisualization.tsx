import { useEffect, useRef } from "react";
import type { DipoleParams } from "@/lib/physics";

interface Props { params: DipoleParams }

export const DipoleVisualization = ({ params }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const css = (v: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(v).trim()})`;
    ctx.fillStyle = css("--card");
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const extent = 0.30; // 30 cm field of view
    const scale = (Math.min(W, H) * 0.9) / (2 * extent);
    const toX = (x: number) => cx + x * scale;
    const toY = (y: number) => cy - y * scale;

    const theta = (params.thetaDeg * Math.PI) / 180;
    const d = params.dCm * 1e-2;
    const ux = Math.cos(theta), uy = Math.sin(theta);
    const xPos = (d / 2) * ux, yPos = (d / 2) * uy;
    const xNeg = -(d / 2) * ux, yNeg = -(d / 2) * uy;

    const muted = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()} / 0.4)`;

    if (params.mode === "torque" && params.Eext > 0) {
      // Setas horizontais de campo externo (eixo +x)
      ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()} / 0.55)`;
      ctx.lineWidth = 1.2;
      const cols = 9, rows = 7;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = (i + 0.5) / cols * W;
          const py = (j + 0.5) / rows * H;
          arrow(ctx, px - 16, py, px + 16, py, 5);
        }
      }
      ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--accent-foreground").trim()})`;
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText(`E = ${(params.Eext / 1000).toFixed(1)} kV/m →`, 12, 18);
    } else if (params.mode === "field") {
      drawDipoleField(ctx, W, H, toX, toY, xPos, yPos, xNeg, yNeg, params, muted);
    }

    // Eixo do dipolo (linha entre as cargas)
    ctx.strokeStyle = muted;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(toX(xNeg), toY(yNeg));
    ctx.lineTo(toX(xPos), toY(yPos));
    ctx.stroke();

    // Vetor p (do -q ao +q, escalado)
    ctx.strokeStyle = css("--primary");
    ctx.lineWidth = 2.5;
    arrow(ctx, toX(xNeg), toY(yNeg), toX(xPos), toY(yPos), 9);

    // Cargas
    drawCharge(ctx, toX(xPos), toY(yPos), "+", "hsl(0 70% 55%)");
    drawCharge(ctx, toX(xNeg), toY(yNeg), "−", "hsl(220 80% 55%)");

    ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()})`;
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillText("p", toX(xPos / 2 + uy * 0.012) + 6, toY(yPos / 2 - ux * 0.012));

    if (params.mode === "field") {
      // Ponto de prova
      const px = toX(params.probeXcm * 1e-2);
      const py = toY(params.probeYcm * 1e-2);
      ctx.fillStyle = css("--primary");
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()})`;
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText(`P(${params.probeXcm.toFixed(1)}, ${params.probeYcm.toFixed(1)}) cm`, px + 8, py - 8);
    }
  }, [params]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[420px] block" />
    </div>
  );
};

function drawCharge(ctx: CanvasRenderingContext2D, x: number, y: number, sign: string, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "bold 14px ui-sans-serif, system-ui";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(sign, x, y + 1);
  ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, head: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.stroke();
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(ang - 0.4), y2 - head * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - head * Math.cos(ang + 0.4), y2 - head * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle as string;
  ctx.fill();
}

function drawDipoleField(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  toX: (x: number) => number, toY: (y: number) => number,
  xPos: number, yPos: number, xNeg: number, yNeg: number,
  p: DipoleParams, muted: string,
) {
  // Vetorial em grade
  const cols = 14, rows = 10;
  ctx.strokeStyle = muted; ctx.fillStyle = muted; ctx.lineWidth = 1;
  const k = 1 / (4 * Math.PI * 8.854e-12);
  const q = p.qNc * 1e-9;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const px = (i + 0.5) / cols * W;
      const py = (j + 0.5) / rows * H;
      const x = (px - W / 2) / ((Math.min(W, H) * 0.9) / 0.6);
      const y = -(py - H / 2) / ((Math.min(W, H) * 0.9) / 0.6);
      const xp = x - xPos, yp = y - yPos;
      const xn = x - xNeg, yn = y - yNeg;
      const rp = Math.hypot(xp, yp), rn = Math.hypot(xn, yn);
      if (rp < 0.005 || rn < 0.005) continue;
      const Ex = k * q * (xp / rp ** 3 - xn / rn ** 3);
      const Ey = k * q * (yp / rp ** 3 - yn / rn ** 3);
      const mag = Math.hypot(Ex, Ey);
      if (mag < 1) continue;
      const len = Math.min(16, 4 + Math.log10(mag) * 2);
      const ang = Math.atan2(-Ey, Ex); // canvas y invertido
      arrow(ctx, px - Math.cos(ang) * len / 2, py - Math.sin(ang) * len / 2,
              px + Math.cos(ang) * len / 2, py + Math.sin(ang) * len / 2, 4);
    }
  }
}