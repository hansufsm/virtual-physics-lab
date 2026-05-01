import { useEffect, useRef } from "react";
import type { FaradayParams, FaradayState } from "@/lib/physics";

interface Props {
  params: FaradayParams;
  state: FaradayState;
}

export const FaradayVisualization = ({ params, state }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const css = (v: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(v).trim()})`;
    ctx.fillStyle = css("--card");
    ctx.fillRect(0, 0, W, H);

    if (params.mode === "loop") drawLoop(ctx, W, H, params, state, css);
    else drawMagnet(ctx, W, H, params, state, css);
  }, [params, state]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[420px] block" />
    </div>
  );
};

function drawLoop(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  p: FaradayParams, s: FaradayState, css: (v: string) => string,
) {
  // Mundo: -extent..+extent metros horizontalmente
  const Wm = p.regionWidthCm * 1e-2;
  const wm = p.loopWidthCm * 1e-2;
  const extent = Math.max(Wm * 0.8, wm * 1.5, 0.15);
  const scale = (W * 0.9) / (2 * extent);
  const cx = W / 2;
  const cy = H / 2;
  const toX = (x: number) => cx + x * scale;
  const lh = p.loopHeightCm * 1e-2 * scale;

  // Região de campo B
  const bIntensity = Math.min(1, Math.abs(p.bField) / 0.5);
  const into = p.bField >= 0; // convenção: B>0 entra no plano
  const x1 = toX(-Wm / 2);
  const x2 = toX(Wm / 2);
  const ry1 = cy - H * 0.4;
  const ry2 = cy + H * 0.4;
  ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()} / ${0.06 + 0.18 * bIntensity})`;
  ctx.fillRect(x1, ry1, x2 - x1, ry2 - ry1);
  ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()} / 0.5)`;
  ctx.setLineDash([4, 4]); ctx.strokeRect(x1, ry1, x2 - x1, ry2 - ry1); ctx.setLineDash([]);

  // Símbolos ⊗ ou ⊙ no campo
  const cols = 8, rows = 5;
  ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()} / 0.7)`;
  ctx.strokeStyle = ctx.fillStyle as string;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const px = x1 + ((i + 0.5) / cols) * (x2 - x1);
      const py = ry1 + ((j + 0.5) / rows) * (ry2 - ry1);
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.stroke();
      if (into) {
        ctx.beginPath();
        ctx.moveTo(px - 3, py - 3); ctx.lineTo(px + 3, py + 3);
        ctx.moveTo(px + 3, py - 3); ctx.lineTo(px - 3, py + 3);
        ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // Espira
  const lx = toX(s.pos - wm / 2);
  const lw = wm * scale;
  const ly = cy - lh / 2;
  ctx.strokeStyle = css("--primary");
  ctx.lineWidth = 3;
  ctx.strokeRect(lx, ly, lw, lh);

  // Setas de corrente baseadas no sinal de ε
  const dir = Math.sign(s.emf);
  if (Math.abs(s.current) > 1e-9) {
    ctx.fillStyle = css("--primary");
    const arr = (px: number, py: number, ang: number) => {
      ctx.save();
      ctx.translate(px, py); ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(-7, -4); ctx.lineTo(-7, 4); ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    // Topo: direita se dir>0, esquerda se dir<0
    arr(lx + lw * 0.7, ly, dir > 0 ? 0 : Math.PI);
    arr(lx + lw * 0.3, ly + lh, dir > 0 ? Math.PI : 0);
    arr(lx, ly + lh * 0.3, dir > 0 ? -Math.PI / 2 : Math.PI / 2);
    arr(lx + lw, ly + lh * 0.7, dir > 0 ? Math.PI / 2 : -Math.PI / 2);
  }

  // Vetor velocidade
  ctx.strokeStyle = css("--foreground");
  ctx.lineWidth = 1.5;
  const vx = Math.sign(p.velocityCmS) * 30;
  ctx.beginPath();
  ctx.moveTo(lx + lw / 2, ly - 15);
  ctx.lineTo(lx + lw / 2 + vx, ly - 15);
  ctx.stroke();
  ctx.fillStyle = css("--foreground");
  ctx.font = "11px ui-sans-serif, system-ui";
  ctx.fillText(`v = ${p.velocityCmS.toFixed(1)} cm/s`, lx + lw / 2 + (vx > 0 ? vx + 6 : vx - 80), ly - 11);

  // Label
  ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()})`;
  ctx.font = "11px ui-sans-serif, system-ui";
  ctx.fillText(`B = ${p.bField.toFixed(3)} T (${into ? "⊗ entra" : "⊙ sai"})`, x1 + 6, ry1 - 6);
}

function drawMagnet(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  p: FaradayParams, s: FaradayState, css: (v: string) => string,
) {
  // Eixo vertical: z em metros. Origem (z=0) no centro da bobina, posicionada em y = H*0.6
  const extent = Math.max(p.dropHeightCm * 1e-2 * 1.2, 0.1);
  const scale = (H * 0.7) / (2 * extent);
  const cx = W / 2;
  const cy = H * 0.6;
  const toY = (z: number) => cy - z * scale;

  // Eixo
  ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()} / 0.3)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, 0); ctx.lineTo(cx, H);
  ctx.stroke();

  // Bobina: caixa com várias espiras
  const R = p.coilRadiusCm * 1e-2 * scale;
  const L = p.coilLengthCm * 1e-2 * scale;
  const cyTop = toY(p.coilLengthCm * 1e-2 / 2);
  ctx.strokeStyle = css("--primary");
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - R, cyTop, 2 * R, L);
  ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()} / 0.08)`;
  ctx.fillRect(cx - R, cyTop, 2 * R, L);
  // Espiras estilizadas
  const K = Math.min(15, Math.max(3, Math.round(p.turns / 20)));
  ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()} / 0.5)`;
  ctx.lineWidth = 1;
  for (let k = 0; k < K; k++) {
    const yk = cyTop + (L * (k + 0.5)) / K;
    ctx.beginPath();
    ctx.ellipse(cx, yk, R, R * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Ímã: barra vertical N/S
  const magH = Math.max(20, p.coilLengthCm * 1e-2 * scale * 0.5);
  const magW = Math.max(10, R * 0.7);
  const my = toY(s.pos);
  // metade norte (vermelho via accent), metade sul (muted)
  ctx.fillStyle = `hsl(0 70% 55%)`;
  ctx.fillRect(cx - magW / 2, my - magH / 2, magW, magH / 2);
  ctx.fillStyle = `hsl(220 15% 45%)`;
  ctx.fillRect(cx - magW / 2, my, magW, magH / 2);
  ctx.fillStyle = "white";
  ctx.font = "bold 11px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.fillText("N", cx, my - magH / 4 + 4);
  ctx.fillText("S", cx, my + magH / 4 + 4);
  ctx.textAlign = "start";

  // Vetor velocidade
  ctx.strokeStyle = css("--foreground");
  ctx.lineWidth = 1.5;
  const vlen = Math.max(-60, Math.min(60, s.vel * 60));
  ctx.beginPath();
  ctx.moveTo(cx + magW / 2 + 8, my);
  ctx.lineTo(cx + magW / 2 + 8, my - vlen);
  ctx.stroke();
  ctx.fillStyle = css("--foreground");
  ctx.font = "11px ui-sans-serif, system-ui";
  ctx.fillText(`v = ${s.vel.toFixed(2)} m/s`, cx + magW / 2 + 14, my);

  // Indicador de polaridade da corrente induzida (lei de Lenz) no topo da bobina
  if (Math.abs(s.current) > 1e-9) {
    const muted = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()})`;
    ctx.fillStyle = muted;
    ctx.font = "10px ui-sans-serif, system-ui";
    const dir = Math.sign(s.current);
    ctx.fillText(dir > 0 ? "i: sentido +" : "i: sentido −", cx + R + 12, cyTop + 12);
  }

  // Régua de altura
  ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()})`;
  ctx.font = "10px ui-sans-serif, system-ui";
  ctx.fillText(`z = ${(s.pos * 100).toFixed(1)} cm`, 10, 16);
  ctx.fillText(`g ${p.withGravity ? "ON" : "OFF"}`, 10, H - 10);
}