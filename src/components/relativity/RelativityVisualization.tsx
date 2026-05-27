import { useEffect, useRef } from "react";
import type { RelativityParams, RelativityResults } from "@/lib/physics";

interface Props { params: RelativityParams; results: RelativityResults }

export const RelativityVisualization = ({ params, results }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = (v: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(v).trim()})`;

    ctx.fillStyle = css("--card");
    ctx.fillRect(0, 0, W, H);

    // ----- Topo: nave em laboratório (mostra contração de Lorentz) -----
    const topH = H * 0.5;
    ctx.fillStyle = css("--muted-foreground");
    ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "left";
    ctx.fillText("Referencial do laboratório — comprimento observado L = L₀ / γ", 16, 20);

    // base — pista
    const baseY = topH - 30;
    ctx.strokeStyle = css("--border");
    ctx.beginPath(); ctx.moveTo(16, baseY); ctx.lineTo(W - 16, baseY); ctx.stroke();
    for (let x = 16; x < W - 16; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, baseY); ctx.lineTo(x + 4, baseY); ctx.stroke();
    }

    // nave própria vs contraída
    const maxShipW = W * 0.45;
    const properW = maxShipW;
    const contractedW = properW / results.gamma;
    const shipH = 36;
    const cy0 = baseY - shipH / 2 - 10;

    // sombra fantasma (próprio)
    ctx.fillStyle = "hsla(200,80%,60%,0.12)";
    ctx.strokeStyle = "hsla(200,80%,60%,0.5)";
    drawShip(ctx, 16, cy0, properW, shipH);
    ctx.fillStyle = css("--muted-foreground"); ctx.font = "10px ui-monospace, monospace";
    ctx.fillText(`L₀ = ${params.L0_m.toFixed(1)} m  (próprio)`, 16, cy0 - 8);

    // nave contraída (real no lab)
    ctx.fillStyle = "hsl(200,80%,55%)";
    ctx.strokeStyle = css("--foreground");
    drawShip(ctx, 16, baseY - shipH - 4, contractedW, shipH);
    ctx.fillStyle = css("--foreground"); ctx.font = "bold 11px ui-monospace, monospace";
    ctx.fillText(`L = ${results.L_contracted_m.toFixed(2)} m  (lab)`, 16, baseY + 14);

    // setas de velocidade
    ctx.strokeStyle = css("--primary"); ctx.lineWidth = 2;
    const sx = 16 + contractedW + 20, sy = baseY - shipH / 2 - 4;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 70, sy); ctx.stroke();
    ctx.fillStyle = css("--primary");
    ctx.beginPath(); ctx.moveTo(sx + 70, sy); ctx.lineTo(sx + 62, sy - 5); ctx.lineTo(sx + 62, sy + 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css("--foreground"); ctx.font = "bold 12px ui-sans-serif, system-ui";
    ctx.fillText(`v = ${(results.beta).toFixed(3)} c`, sx + 6, sy - 8);

    // ----- Divisor -----
    ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(16, topH); ctx.lineTo(W - 16, topH); ctx.stroke();

    // ----- Inferior: dois relógios (próprio vs lab) -----
    ctx.fillStyle = css("--muted-foreground"); ctx.font = "11px ui-monospace, monospace";
    ctx.fillText("Dilatação do tempo — relógio próprio (a bordo) vs lab", 16, topH + 20);

    const clockY = topH + (H - topH) / 2 + 10;
    const r = Math.min(70, (H - topH) * 0.32);
    const cxA = W * 0.27, cxB = W * 0.73;

    drawClock(ctx, cxA, clockY, r, params.dt0_s, css, "Próprio (a bordo)");
    drawClock(ctx, cxB, clockY, r, results.dt_dilated_s, css, "Laboratório");

    ctx.fillStyle = css("--foreground"); ctx.font = "bold 12px ui-monospace, monospace"; ctx.textAlign = "center";
    ctx.fillText(`Δt₀ = ${params.dt0_s.toFixed(3)} s`, cxA, clockY + r + 22);
    ctx.fillText(`Δt = γΔt₀ = ${results.dt_dilated_s.toFixed(3)} s`, cxB, clockY + r + 22);

    // sumário central
    ctx.fillStyle = css("--primary"); ctx.font = "bold 14px ui-sans-serif, system-ui";
    ctx.fillText(`γ = ${results.gamma.toFixed(3)}`, W / 2, clockY - 4);

  }, [params, results]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[520px] block" />
    </div>
  );
};

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const nose = Math.min(40, w * 0.3);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w - nose, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w - nose, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // janelas
  ctx.save();
  ctx.fillStyle = "hsla(50,100%,80%,0.9)";
  const n = Math.max(1, Math.floor(w / 30));
  for (let i = 0; i < n; i++) {
    const wx = x + 10 + i * (w - 20 - nose) / Math.max(1, n);
    ctx.beginPath(); ctx.arc(wx, y + h / 2, Math.min(4, h / 6), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawClock(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, t_s: number, css: (v: string) => string, label: string) {
  ctx.fillStyle = css("--background");
  ctx.strokeStyle = css("--foreground"); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // marcas
  ctx.strokeStyle = css("--muted-foreground"); ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6));
    ctx.lineTo(cx + Math.cos(a) * (r - 1), cy + Math.sin(a) * (r - 1));
    ctx.stroke();
  }
  // ponteiro de segundos (gira proporcional a t_s mod 60)
  const ang = ((t_s % 60) / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.strokeStyle = css("--primary"); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(ang) * (r - 10), cy + Math.sin(ang) * (r - 10));
  ctx.stroke();
  ctx.fillStyle = css("--primary");
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css("--muted-foreground");
  ctx.font = "10px ui-monospace, monospace"; ctx.textAlign = "center";
  ctx.fillText(label, cx, cy - r - 6);
}