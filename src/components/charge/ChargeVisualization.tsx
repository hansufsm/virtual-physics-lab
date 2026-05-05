import { useEffect, useMemo, useRef } from "react";
import { integrateChargeTrajectory, type ChargeParams } from "@/lib/physics";

interface Props { params: ChargeParams; running: boolean }

export const ChargeVisualization = ({ params, running }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const idxRef = useRef(0);

  // Pré-calcula a trajetória
  const traj = useMemo(() => {
    const steps = params.mode === "cyclotron" ? 4000 : 1500;
    return integrateChargeTrajectory(params, steps, 1);
  }, [params]);

  // Define janela de visualização autoescalada
  const view = useMemo(() => {
    const xs = traj.x, ys = traj.y;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < xs.length; i++) {
      if (xs[i] < minX) minX = xs[i];
      if (xs[i] > maxX) maxX = xs[i];
      if (ys[i] < minY) minY = ys[i];
      if (ys[i] > maxY) maxY = ys[i];
    }
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const span = Math.max(maxX - minX, maxY - minY, 1e-3) * 1.15;
    return { cx, cy, span };
  }, [traj]);

  useEffect(() => { idxRef.current = 0; }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      const pad = 16;
      const size = Math.min(W, H) - pad * 2;
      const scale = size / view.span;
      const toPx = (x: number, y: number): [number, number] => [
        W / 2 + (x - view.cx) * scale,
        H / 2 - (y - view.cy) * scale,
      ];

      // Fundo
      ctx.fillStyle = "hsl(var(--card))";
      ctx.fillRect(0, 0, W, H);

      // Grade
      ctx.strokeStyle = "hsl(var(--border))";
      ctx.lineWidth = 1;
      const grid = 10;
      const stepWorld = view.span / grid;
      ctx.beginPath();
      for (let i = 0; i <= grid; i++) {
        const x = view.cx - view.span / 2 + i * stepWorld;
        const [px] = toPx(x, 0);
        ctx.moveTo(px, pad); ctx.lineTo(px, H - pad);
      }
      for (let i = 0; i <= grid; i++) {
        const y = view.cy - view.span / 2 + i * stepWorld;
        const [, py] = toPx(0, y);
        ctx.moveTo(pad, py); ctx.lineTo(W - pad, py);
      }
      ctx.stroke();

      // Eixos
      ctx.strokeStyle = "hsl(var(--muted-foreground) / 0.5)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      const [ox, oy] = toPx(0, 0);
      ctx.moveTo(pad, oy); ctx.lineTo(W - pad, oy);
      ctx.moveTo(ox, pad); ctx.lineTo(ox, H - pad);
      ctx.stroke();

      // Indicadores de campo
      ctx.fillStyle = "hsl(var(--muted-foreground))";
      ctx.font = "11px ui-sans-serif, system-ui";
      if (params.mode !== "eOnly" && Math.abs(params.B) > 1e-9) {
        const sym = params.B > 0 ? "⊙" : "⊗";
        ctx.fillStyle = "hsl(var(--primary) / 0.35)";
        ctx.font = "16px ui-sans-serif, system-ui";
        for (let gx = 0; gx < 4; gx++) for (let gy = 0; gy < 3; gy++) {
          ctx.fillText(sym, pad + 28 + gx * ((W - 2 * pad - 56) / 3), pad + 22 + gy * ((H - 2 * pad - 44) / 2));
        }
      }
      if ((params.mode === "eOnly" || params.mode === "selector") && Math.abs(params.E) > 1e-9) {
        // setas indicando direção de E (em y)
        ctx.strokeStyle = "hsl(var(--destructive) / 0.55)";
        ctx.lineWidth = 1.5;
        const dir = params.E > 0 ? 1 : -1;
        for (let i = 1; i <= 5; i++) {
          const xPx = pad + (i * (W - 2 * pad)) / 6;
          ctx.beginPath();
          ctx.moveTo(xPx, H / 2 - 18 * dir);
          ctx.lineTo(xPx, H / 2 + 18 * dir);
          ctx.lineTo(xPx - 4, H / 2 + (18 - 6) * dir);
          ctx.moveTo(xPx, H / 2 + 18 * dir);
          ctx.lineTo(xPx + 4, H / 2 + (18 - 6) * dir);
          ctx.stroke();
        }
      }

      // Trajetória completa (sombra)
      ctx.strokeStyle = "hsl(var(--primary) / 0.25)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < traj.x.length; i++) {
        const [px, py] = toPx(traj.x[i], traj.y[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Trajetória até o índice atual (forte)
      const idx = Math.min(idxRef.current, traj.x.length - 1);
      ctx.strokeStyle = "hsl(var(--primary))";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= idx; i++) {
        const [px, py] = toPx(traj.x[i], traj.y[i]);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Partícula
      const [pxP, pyP] = toPx(traj.x[idx], traj.y[idx]);
      ctx.fillStyle = params.chargeE >= 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))";
      ctx.beginPath();
      ctx.arc(pxP, pyP, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "hsl(var(--background))";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Vetor velocidade
      const vx = traj.vx[idx], vy = traj.vy[idx];
      const vmag = Math.hypot(vx, vy);
      if (vmag > 0) {
        const len = 28;
        const ex = (vx / vmag) * len;
        const ey = -(vy / vmag) * len;
        ctx.strokeStyle = "hsl(var(--foreground))";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pxP, pyP);
        ctx.lineTo(pxP + ex, pyP + ey);
        ctx.stroke();
      }

      // Escala
      ctx.fillStyle = "hsl(var(--muted-foreground))";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`escala: ${(view.span * 1000).toFixed(2)} mm`, 10, H - 10);
      ctx.fillText(`t: ${(traj.t[idx] * 1e9).toFixed(1)} ns`, W - 110, H - 10);
    };

    const loop = () => {
      if (running) {
        const stride = Math.max(1, Math.floor(traj.x.length / 600));
        idxRef.current = (idxRef.current + stride) % traj.x.length;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [params, traj, view, running]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} width={760} height={520} className="w-full block" />
    </div>
  );
};