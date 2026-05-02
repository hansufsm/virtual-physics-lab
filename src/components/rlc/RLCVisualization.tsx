import { useEffect, useRef } from "react";
import { computeRLC, rlcWaveform, type RLCParams } from "@/lib/physics";

interface Props {
  params: RLCParams;
  running: boolean;
}

export const RLCVisualization = ({ params, running }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const tRef = useRef(0);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = (v: string) =>
      `hsl(${getComputedStyle(document.documentElement).getPropertyValue(v).trim()})`;

    const draw = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (running) tRef.current += dt * Math.min(1, 60 / Math.max(1, params.freqHz));

      const dpr = window.devicePixelRatio || 1;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = css("--card");
      ctx.fillRect(0, 0, W, H);

      const r = computeRLC(params);
      const wf = rlcWaveform(params, tRef.current);

      // ---- Diagrama de fasores (lado esquerdo) ----
      const cx = W * 0.28;
      const cy = H / 2;
      const maxV = Math.max(r.vR, r.vL, r.vC, params.vSourceRms, 1);
      const scale = Math.min(W * 0.18, H * 0.35) / maxV;

      ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--border").trim()})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 120, cy); ctx.lineTo(cx + 120, cy);
      ctx.moveTo(cx, cy - 120); ctx.lineTo(cx, cy + 120);
      ctx.stroke();
      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText("Re", cx + 122, cy + 4);
      ctx.fillText("Im", cx + 4, cy - 122);

      const arrow = (dx: number, dy: number, color: string, label: string) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dx, cy - dy);
        ctx.stroke();
        const ang = Math.atan2(-dy, dx);
        ctx.beginPath();
        ctx.moveTo(cx + dx, cy - dy);
        ctx.lineTo(cx + dx - 8 * Math.cos(ang - 0.4), cy - dy + 8 * Math.sin(ang - 0.4));
        ctx.lineTo(cx + dx - 8 * Math.cos(ang + 0.4), cy - dy + 8 * Math.sin(ang + 0.4));
        ctx.closePath();
        ctx.fill();
        ctx.font = "11px ui-sans-serif, system-ui";
        ctx.fillText(label, cx + dx + 4, cy - dy - 4);
      };
      // V_R no eixo real (em fase com I)
      arrow(r.vR * scale, 0, css("--primary"), "V_R");
      // V_L para cima
      arrow(0, r.vL * scale, css("--accent"), "V_L");
      // V_C para baixo
      arrow(0, -r.vC * scale, "hsl(0 70% 60%)", "V_C");
      // V_total (V_R + j(V_L - V_C))
      const vx = r.vR * scale;
      const vy = (r.vL - r.vC) * scale;
      arrow(vx, vy, css("--foreground"), "V");

      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "10px ui-sans-serif, system-ui";
      ctx.fillText(`φ = ${r.phaseDeg.toFixed(1)}°`, cx - 130, cy - 130);
      ctx.fillText(`f = ${params.freqHz.toFixed(1)} Hz   f₀ = ${r.f0.toFixed(1)} Hz`, cx - 130, cy + 140);

      // ---- Forma de onda v(t) e i(t) (lado direito) ----
      const ox = W * 0.56;
      const ow = W * 0.42 - 8;
      const oy = H * 0.12;
      const oh = H * 0.76;
      const midY = oy + oh / 2;

      ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--border").trim()})`;
      ctx.strokeRect(ox, oy, ow, oh);
      ctx.beginPath();
      ctx.moveTo(ox, midY); ctx.lineTo(ox + ow, midY);
      ctx.stroke();

      const T = 1 / Math.max(0.1, params.freqHz);
      const totalT = 2 * T;
      const N = 240;
      const vMax = params.vSourceRms * Math.SQRT2;
      const iMax = r.currentRms * Math.SQRT2;
      const vScale = (oh / 2 - 6) / Math.max(vMax, 1e-9);
      const iScale = (oh / 2 - 6) / Math.max(iMax, 1e-9);

      // v(t)
      ctx.strokeStyle = css("--primary");
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const tt = (k / N) * totalT;
        const w = rlcWaveform(params, tt);
        const x = ox + (k / N) * ow;
        const y = midY - w.v * vScale;
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // i(t)
      ctx.strokeStyle = css("--accent");
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const tt = (k / N) * totalT;
        const w = rlcWaveform(params, tt);
        const x = ox + (k / N) * ow;
        const y = midY - w.i * iScale;
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Cursor temporal
      const tCursor = tRef.current % totalT;
      const xc = ox + (tCursor / totalT) * ow;
      ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()} / 0.6)`;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(xc, oy); ctx.lineTo(xc, oy + oh);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = css("--primary");
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText(`v(t) = ${wf.v.toFixed(2)} V`, ox + 8, oy + 14);
      ctx.fillStyle = css("--accent");
      ctx.fillText(`i(t) = ${(wf.i * 1000).toFixed(2)} mA`, ox + 8, oy + 28);
      ctx.fillStyle = css("--muted-foreground");
      ctx.fillText("2 períodos", ox + ow - 60, oy + oh - 6);

      rafRef.current = requestAnimationFrame(draw);
    };

    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [params, running]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[420px] block" />
    </div>
  );
};