import { useEffect, useRef } from "react";
import { dcMotorStep, type DCMotorParams } from "@/lib/physics";

interface Props {
  params: DCMotorParams;
  running: boolean;
  onTelemetry?: (rpm: number, current: number, torque: number) => void;
}

export const MotorVisualization = ({ params, running, onTelemetry }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const stateRef = useRef({ theta: 0, omega: 0, current: 0, torque: 0 });
  const lastRef = useRef(performance.now());
  const lastEmitRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = (v: string) =>
      `hsl(${getComputedStyle(document.documentElement).getPropertyValue(v).trim()})`;

    const draw = (now: number) => {
      const realDt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;

      if (running) {
        // Substep para estabilidade quando ω é grande
        const subs = 8;
        const dt = realDt / subs;
        for (let s = 0; s < subs; s++) {
          const r = dcMotorStep(params, stateRef.current.theta, stateRef.current.omega, dt);
          stateRef.current = r;
        }
      }

      if (onTelemetry && now - lastEmitRef.current > 100) {
        const rpm = (stateRef.current.omega * 60) / (2 * Math.PI);
        onTelemetry(rpm, stateRef.current.current, stateRef.current.torque);
        lastEmitRef.current = now;
      }

      const dpr = window.devicePixelRatio || 1;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr; canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = css("--card");
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const radius = Math.min(W, H) * 0.32;

      // Polos N/S do ímã (esquerda N, direita S)
      const poleW = W * 0.13, poleH = H * 0.55;
      ctx.fillStyle = "hsl(0 70% 55% / 0.8)";
      ctx.fillRect(cx - radius - poleW - 4, cy - poleH / 2, poleW, poleH);
      ctx.fillStyle = "hsl(220 70% 55% / 0.8)";
      ctx.fillRect(cx + radius + 4, cy - poleH / 2, poleW, poleH);
      ctx.fillStyle = css("--primary-foreground");
      ctx.font = "bold 16px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.fillText("N", cx - radius - poleW / 2 - 4, cy + 6);
      ctx.fillText("S", cx + radius + poleW / 2 + 4, cy + 6);
      ctx.textAlign = "left";

      // Linhas de campo (esquerda → direita)
      ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()} / 0.25)`;
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        const yy = cy + i * (poleH / 8);
        ctx.beginPath();
        ctx.moveTo(cx - radius - 4, yy);
        ctx.lineTo(cx + radius + 4, yy);
        ctx.stroke();
      }

      // Eixo do rotor
      ctx.fillStyle = css("--muted-foreground");
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();

      // Espira girando
      const theta = stateRef.current.theta;
      const cosT = Math.cos(theta), sinT = Math.sin(theta);
      // Lados ativos (entrando/saindo do plano) — pontos extremos da espira
      const lx = cx + cosT * radius;
      const ly = cy + sinT * radius * 0.35; // perspectiva achatada
      const rx = cx - cosT * radius;
      const ry = cy - sinT * radius * 0.35;

      // Plano da espira
      ctx.strokeStyle = css("--primary");
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.35, theta, 0, Math.PI * 2);
      ctx.stroke();

      // Indicação de corrente nos lados ativos: ⊙ (saindo) e ⊗ (entrando)
      const i = stateRef.current.current;
      const dir = i >= 0 ? 1 : -1;
      const drawSym = (x: number, y: number, out: boolean) => {
        ctx.fillStyle = css("--card");
        ctx.strokeStyle = css("--accent");
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = css("--accent");
        if (out) {
          ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(x - 6, y - 6); ctx.lineTo(x + 6, y + 6);
          ctx.moveTo(x + 6, y - 6); ctx.lineTo(x - 6, y + 6);
          ctx.strokeStyle = css("--accent"); ctx.stroke();
        }
      };
      // Comutador inverte sentido a cada meia volta — força corrente sempre no sentido que mantém torque
      const upSideOut = dir * (Math.cos(theta) >= 0 ? 1 : -1) > 0;
      drawSym(lx, ly, upSideOut);
      drawSym(rx, ry, !upSideOut);

      // Vetores de força F = I·L × B nos lados ativos
      const fLen = Math.min(60, Math.abs(i) * 30 + 10);
      const fy = upSideOut ? -fLen : fLen;
      drawArrow(ctx, lx, ly, lx, ly + fy, css("--accent"), "F");
      drawArrow(ctx, rx, ry, rx, ry - fy, css("--accent"), "F");

      // HUD
      const rpm = (stateRef.current.omega * 60) / (2 * Math.PI);
      ctx.fillStyle = css("--foreground");
      ctx.font = "12px ui-sans-serif, system-ui";
      ctx.fillText(`ω = ${stateRef.current.omega.toFixed(2)} rad/s`, 12, 18);
      ctx.fillText(`n = ${rpm.toFixed(0)} RPM`, 12, 34);
      ctx.fillStyle = css("--accent");
      ctx.fillText(`I = ${(i * 1000).toFixed(1)} mA`, 12, 50);
      ctx.fillStyle = css("--primary");
      ctx.fillText(`τ = ${(stateRef.current.torque * 1000).toFixed(2)} mN·m`, 12, 66);

      rafRef.current = requestAnimationFrame(draw);
    };
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [params, running, onTelemetry]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[420px] block" />
    </div>
  );
};

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, label?: string) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 8 * Math.cos(ang - 0.4), y2 - 8 * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - 8 * Math.cos(ang + 0.4), y2 - 8 * Math.sin(ang + 0.4));
  ctx.closePath(); ctx.fill();
  if (label) {
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillText(label, x2 + 4, y2 - 4);
  }
}