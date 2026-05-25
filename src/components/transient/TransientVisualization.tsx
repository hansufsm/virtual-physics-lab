import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { formatSI, type TransientParams, type TransientResults } from "@/lib/physics";

interface Props { params: TransientParams; results: TransientResults }

export const TransientVisualization = ({ params, results }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const simTimeRef = useRef(0);
  const particlesRef = useRef<number[]>([]);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);

  // Inicializa partículas ao longo do loop (24 partículas em [0,1))
  useEffect(() => {
    particlesRef.current = Array.from({ length: 26 }, (_, i) => i / 26);
    simTimeRef.current = 0;
  }, [params.mode, params.phase, params.R, params.L, params.C, params.V0]);

  const reset = () => { simTimeRef.current = 0; lastRef.current = null; };

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

    // Loop retangular: 4 segmentos (top, right, bottom, left)
    const padX = 60, padY = 80;
    const x0 = padX, y0 = padY;
    const x1 = W - padX, y1 = H - padY - 90;
    const w = x1 - x0, h = y1 - y0;
    const perim = 2 * (w + h);
    const segs = [
      { len: w, fn: (s: number) => ({ x: x0 + s, y: y0 }) },                        // top L→R
      { len: h, fn: (s: number) => ({ x: x1, y: y0 + s }) },                        // right T→B
      { len: w, fn: (s: number) => ({ x: x1 - s, y: y1 }) },                        // bottom R→L
      { len: h, fn: (s: number) => ({ x: x0, y: y1 - s }) },                        // left B→T
    ];
    const posOnLoop = (u: number) => {
      let s = (u % 1 + 1) % 1 * perim;
      for (const seg of segs) {
        if (s <= seg.len) return seg.fn(s);
        s -= seg.len;
      }
      return { x: x0, y: y0 };
    };

    // Velocidade de referência: faz partículas darem ~1 volta/s para |i|=imax esperado
    const imaxRef = Math.max(1e-6, Math.abs(params.V0 / params.R), Math.abs(params.I_init));
    const visualScale = 0.6 / imaxRef; // voltas/s por A

    const draw = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dtReal = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;

      if (running) {
        const dtSim = dtReal * (params.tMax / 4) * speed; // 4 s reais ≈ tMax
        simTimeRef.current += dtSim;
        if (simTimeRef.current > params.tMax * 1.2) simTimeRef.current = 0;
      }
      const t = Math.min(simTimeRef.current, params.tMax);
      const i = results.i(t);
      const vC = params.mode === "RLC" ? results.vC(t) : 0;
      const vR = params.R * i;
      const vL = params.mode === "LR"
        ? (params.phase === "step" ? params.V0 : 0) - vR
        : (params.phase === "step" ? params.V0 : 0) - vR - vC;

      // background
      ctx.fillStyle = css("--card");
      ctx.fillRect(0, 0, W, H);

      // loop wires
      ctx.strokeStyle = css("--border");
      ctx.lineWidth = 3;
      ctx.strokeRect(x0, y0, w, h);

      // particles (current flow). Direction: positive i = horário (top L→R)
      if (running) {
        const du = i * visualScale * dtReal;
        particlesRef.current = particlesRef.current.map((p) => p + du);
      }
      const intensity = Math.min(1, Math.abs(i) / (imaxRef * 1.1));
      for (const p of particlesRef.current) {
        const { x, y } = posOnLoop(p);
        ctx.fillStyle = `hsla(200, 90%, 60%, ${0.25 + 0.7 * intensity})`;
        ctx.beginPath(); ctx.arc(x, y, 3 + 2 * intensity, 0, Math.PI * 2); ctx.fill();
      }

      // Component labels and boxes
      const drawBox = (cx: number, cy: number, label: string, sub: string, color: string) => {
        const bw = 78, bh = 34;
        ctx.fillStyle = css("--card");
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.fillRect(cx - bw / 2, cy - bh / 2, bw, bh);
        ctx.strokeRect(cx - bw / 2, cy - bh / 2, bw, bh);
        ctx.fillStyle = css("--foreground");
        ctx.font = "bold 13px ui-sans-serif, system-ui";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(label, cx, cy - 6);
        ctx.fillStyle = css("--muted-foreground");
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText(sub, cx, cy + 9);
      };

      // Source on left side
      drawBox(x0, (y0 + y1) / 2, params.phase === "step" ? `V₀=${params.V0.toFixed(1)}V` : "curto",
        params.phase === "step" ? "fonte" : "descarga", css("--primary"));
      // R on top
      drawBox((x0 + x1) / 2, y0, "R", `${formatSI(vR, "V", 2)}`, "hsl(0, 75%, 60%)");
      // L on right
      drawBox(x1, (y0 + y1) / 2, "L", `${formatSI(vL, "V", 2)}`, "hsl(280, 75%, 65%)");
      // C on bottom (only RLC)
      if (params.mode === "RLC") {
        drawBox((x0 + x1) / 2, y1, "C", `${formatSI(vC, "V", 2)}`, "hsl(140, 70%, 50%)");
      } else {
        // wire shorting bottom
        ctx.strokeStyle = css("--border"); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
      }

      // current arrow indicator
      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "left";
      ctx.fillText(`i(t) = ${formatSI(i, "A", 3)}  ${i >= 0 ? "↻ horário" : "↺ anti-horário"}`, 12, 22);
      ctx.fillText(`t = ${formatSI(t, "s", 3)} / tMax ${formatSI(params.tMax, "s", 2)}`, 12, 38);

      // Mini chart of i(t) at bottom
      const gx = padX, gy = y1 + 18, gW = w, gH = 60;
      ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
      ctx.strokeRect(gx, gy, gW, gH);
      // find imax for scale
      let imax = 1e-9;
      for (const s of results.series) imax = Math.max(imax, Math.abs(s.i));
      // zero line
      const zeroY = gy + gH / 2;
      ctx.strokeStyle = css("--muted-foreground");
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(gx, zeroY); ctx.lineTo(gx + gW, zeroY); ctx.stroke();
      ctx.setLineDash([]);
      // curve
      ctx.strokeStyle = "hsl(200, 90%, 60%)"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      const N = results.series.length;
      for (let k = 0; k < N; k++) {
        const s = results.series[k];
        const xx = gx + (s.t / params.tMax) * gW;
        const yy = zeroY - (s.i / imax) * (gH / 2 - 4);
        if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
      // live cursor
      const cx = gx + (t / params.tMax) * gW;
      const cy = zeroY - (i / imax) * (gH / 2 - 4);
      ctx.fillStyle = "hsl(20, 90%, 60%)";
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "hsla(20, 90%, 60%, 0.4)";
      ctx.beginPath(); ctx.moveTo(cx, gy); ctx.lineTo(cx, gy + gH); ctx.stroke();

      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "10px ui-monospace, monospace"; ctx.textAlign = "left";
      ctx.fillText(`i(t) ⋅ |imax|=${formatSI(imax, "A", 2)}`, gx + 4, gy + 11);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, [params, results, running, speed]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[460px] block" />
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-t border-border bg-gradient-subtle">
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={() => setRunning((v) => !v)}>
            {running ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
            {running ? "Pausar" : "Rodar"}
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reiniciar
          </Button>
          {[0.25, 1, 4, 16].map((s) => (
            <Button key={s} size="sm" variant={speed === s ? "default" : "outline"} onClick={() => setSpeed(s)}>
              {s}×
            </Button>
          ))}
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">
          {params.mode === "LR"
            ? `τ = L/R = ${formatSI(params.L / params.R, "s", 3)}`
            : `ζ = ${results.zeta.toFixed(3)} · Q = ${results.Q.toFixed(2)}`}
        </span>
      </div>
    </div>
  );
};