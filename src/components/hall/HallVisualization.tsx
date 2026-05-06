import { useEffect, useRef } from "react";
import { computeHall, type HallParams } from "@/lib/physics";

interface Props { params: HallParams; running: boolean }

interface Carrier { x: number; y: number; phase: number }

export const HallVisualization = ({ params, running }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carriersRef = useRef<Carrier[]>([]);
  const rafRef = useRef<number>();

  useEffect(() => {
    const N = 60;
    if (carriersRef.current.length !== N) {
      carriersRef.current = Array.from({ length: N }, () => ({
        x: Math.random(),
        y: Math.random(),
        phase: Math.random(),
      }));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssGet = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const c = (token: string, alpha = 1) => `hsl(${cssGet(token)} / ${alpha})`;

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const W = canvas.width = canvas.clientWidth * devicePixelRatio;
      const H = canvas.height = canvas.clientHeight * devicePixelRatio;
      ctx.scale(1, 1);
      ctx.clearRect(0, 0, W, H);

      const d = computeHall(params);

      // Hall bar geometry (drawn). Map L:w aspect to nice rectangle in the canvas.
      const aspect = Math.max(1.5, Math.min(6, params.L / Math.max(1e-6, params.w)));
      const padX = W * 0.10;
      const padY = H * 0.18;
      const barW = W - padX * 2;
      const barH = Math.min(H - padY * 2, barW / aspect);
      const x0 = padX;
      const y0 = (H - barH) / 2;

      // bar fill
      ctx.fillStyle = c("--secondary", 0.6);
      ctx.strokeStyle = c("--border");
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.fillRect(x0, y0, barW, barH);
      ctx.strokeRect(x0, y0, barW, barH);

      // accumulated charge on edges (sign of V_H determines which edge)
      const sgn = Math.sign(d.vHall) || 0;
      const intensity = Math.min(1, Math.abs(d.vHall) / 0.05);
      // top edge
      ctx.fillStyle = sgn > 0 ? c("--primary", 0.25 * intensity) : c("--destructive", 0.25 * intensity);
      ctx.fillRect(x0, y0, barW, barH * 0.18);
      ctx.fillStyle = sgn > 0 ? c("--destructive", 0.25 * intensity) : c("--primary", 0.25 * intensity);
      ctx.fillRect(x0, y0 + barH * 0.82, barW, barH * 0.18);

      // labels for + / − on edges
      ctx.fillStyle = c("--foreground", 0.7);
      ctx.font = `${12 * devicePixelRatio}px ui-monospace, monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const topSign = sgn > 0 ? "+" : sgn < 0 ? "−" : "·";
      const botSign = sgn > 0 ? "−" : sgn < 0 ? "+" : "·";
      for (let i = 1; i < 5; i++) {
        const xx = x0 + (barW * i) / 5;
        ctx.fillText(topSign, xx, y0 + barH * 0.09);
        ctx.fillText(botSign, xx, y0 + barH * 0.91);
      }

      // current arrows along bar (left/right contacts)
      const Idir = Math.sign(params.I);
      ctx.strokeStyle = c("--primary");
      ctx.fillStyle = c("--primary");
      ctx.lineWidth = 2 * devicePixelRatio;
      // left contact
      ctx.fillRect(x0 - 14 * devicePixelRatio, y0 + barH * 0.35, 14 * devicePixelRatio, barH * 0.30);
      ctx.fillRect(x0 + barW, y0 + barH * 0.35, 14 * devicePixelRatio, barH * 0.30);
      ctx.beginPath();
      const yMid = y0 + barH / 2;
      const ax1 = x0 - 30 * devicePixelRatio, ax2 = x0 + barW + 30 * devicePixelRatio;
      ctx.moveTo(ax1, yMid);
      ctx.lineTo(ax2, yMid);
      ctx.stroke();
      // arrow head
      const ah = 8 * devicePixelRatio;
      const headX = Idir >= 0 ? ax2 : ax1;
      const headDir = Idir >= 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(headX, yMid);
      ctx.lineTo(headX - headDir * ah, yMid - ah * 0.6);
      ctx.lineTo(headX - headDir * ah, yMid + ah * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = c("--muted-foreground");
      ctx.font = `${11 * devicePixelRatio}px ui-sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(`I = ${params.I.toFixed(2)} A`, x0 + barW / 2, y0 + barH + 22 * devicePixelRatio);

      // B field markers across the bar
      ctx.strokeStyle = c("--accent-foreground", 0.5);
      ctx.fillStyle = c("--accent-foreground", 0.5);
      ctx.lineWidth = 1.2 * devicePixelRatio;
      const Bsym = params.B >= 0 ? "⊙" : "⊗";
      ctx.font = `${14 * devicePixelRatio}px ui-monospace, monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const cols = 6, rows = 2;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = x0 + barW * (i + 0.5) / cols;
          const py = y0 + barH * (0.30 + 0.40 * (j / Math.max(1, rows - 1)));
          ctx.fillText(Bsym, px, py);
        }
      }
      ctx.fillStyle = c("--muted-foreground");
      ctx.font = `${11 * devicePixelRatio}px ui-sans-serif`;
      ctx.fillText(`B = ${params.B.toFixed(3)} T (${params.B >= 0 ? "saindo" : "entrando"})`,
        x0 + barW / 2, y0 - 14 * devicePixelRatio);

      // voltmeter (top-right showing V_H)
      const vmW = 110 * devicePixelRatio, vmH = 48 * devicePixelRatio;
      const vmX = x0 + barW - vmW;
      const vmY = y0 - vmH - 30 * devicePixelRatio;
      ctx.fillStyle = c("--card");
      ctx.strokeStyle = c("--border");
      ctx.lineWidth = 1.5 * devicePixelRatio;
      ctx.fillRect(vmX, vmY, vmW, vmH);
      ctx.strokeRect(vmX, vmY, vmW, vmH);
      ctx.fillStyle = c("--muted-foreground");
      ctx.font = `${10 * devicePixelRatio}px ui-sans-serif`;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText("V_H", vmX + 8 * devicePixelRatio, vmY + 6 * devicePixelRatio);
      ctx.fillStyle = c("--primary");
      ctx.font = `${16 * devicePixelRatio}px ui-monospace, monospace`;
      const vTxt = formatVolt(d.vHall);
      ctx.fillText(vTxt, vmX + 8 * devicePixelRatio, vmY + 22 * devicePixelRatio);
      // wire from voltmeter to bar
      ctx.strokeStyle = c("--border");
      ctx.beginPath();
      ctx.moveTo(vmX + vmW * 0.25, vmY + vmH);
      ctx.lineTo(vmX + vmW * 0.25, y0);
      ctx.moveTo(vmX + vmW * 0.75, vmY + vmH);
      ctx.lineTo(vmX + vmW * 0.75, y0 + barH);
      ctx.stroke();

      // animate carriers
      // Speed proportional to drift; if too small, give a baseline visual speed
      const visualSpeed = Math.max(0.02, Math.min(1.2, Math.abs(d.vDrift) * 1e6));
      // Hall deflection direction (visual): positive V_H => carriers pushed to top edge for negative carriers; we just show the deflection direction = sgn(q)*sgn(I)*sgn(B) inverted
      // Simpler: drift vy_visual proportional to (μ B) for the carrier sign
      const carrierSign = params.carrier === "electron" ? -1 : 1;
      const driftY = -carrierSign * Math.tanh(params.mobility * params.B) * 0.3; // visual fraction per second
      const driftX = Math.sign(params.I) * (params.carrier === "electron" ? -1 : 1) * visualSpeed;

      ctx.fillStyle = params.carrier === "electron" ? c("--destructive") : c("--primary");
      const r = 3 * devicePixelRatio;
      const arr = carriersRef.current;
      for (const p of arr) {
        if (running) {
          p.x += driftX * dt;
          p.y += driftY * dt;
          if (p.x > 1) p.x -= 1;
          if (p.x < 0) p.x += 1;
          if (p.y > 1) p.y = 1;
          if (p.y < 0) p.y = 0;
        }
        const px = x0 + p.x * barW;
        const py = y0 + (0.10 + 0.80 * p.y) * barH;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // legend
      ctx.fillStyle = c("--muted-foreground");
      ctx.font = `${11 * devicePixelRatio}px ui-sans-serif`;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(
        params.carrier === "electron" ? "Portadores: elétrons (−)" : "Portadores: buracos (+)",
        x0, y0 + barH + 38 * devicePixelRatio,
      );

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [params, running]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-[420px]" />
    </div>
  );
};

function formatVolt(v: number) {
  const a = Math.abs(v);
  if (a >= 1) return `${v.toFixed(3)} V`;
  if (a >= 1e-3) return `${(v * 1e3).toFixed(3)} mV`;
  if (a >= 1e-6) return `${(v * 1e6).toFixed(3)} µV`;
  return `${(v * 1e9).toFixed(3)} nV`;
}