import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { CalorimetryParams, CalorimetryResults } from "@/lib/physics";

interface Props { params: CalorimetryParams; results: CalorimetryResults }

export const CalorimetryVisualization = ({ params, results }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  const tMax = Math.max(1, params.tauSeconds * 5);

  useEffect(() => { setT(0); }, [params.tauSeconds, params.mWater, params.mSolid, params.mIce, params.TWater, params.TSolid, params.cSolid]);

  useEffect(() => {
    if (!playing) { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastRef.current = null; return; }
    const step = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setT((prev) => Math.min(tMax, prev + dt));
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, tMax]);

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

    // interpola série
    const series = results.series;
    const idx = Math.min(series.length - 1, Math.max(0, Math.round((t / tMax) * (series.length - 1))));
    const s = series[idx];

    // temperatura -> cor (azul -> vermelho)
    const tempColor = (T: number) => {
      const x = Math.max(0, Math.min(1, (T + 20) / 140));
      const r = Math.round(40 + x * 200);
      const b = Math.round(220 - x * 200);
      const g = Math.round(100 + Math.abs(0.5 - x) * 60);
      return `rgb(${r},${g},${b})`;
    };

    // calorímetro: retângulo no centro
    const calX = 80, calY = 80, calW = W - 160, calH = H - 160;
    ctx.strokeStyle = css("--muted-foreground");
    ctx.lineWidth = 3;
    ctx.strokeRect(calX, calY, calW, calH);
    // isolamento (linhas externas)
    ctx.strokeStyle = "hsla(0,0%,60%,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(calX - 8, calY - 8, calW + 16, calH + 16);

    // água
    const waterTop = calY + calH * 0.25;
    ctx.fillStyle = tempColor(s.TWater);
    ctx.globalAlpha = 0.65;
    ctx.fillRect(calX + 2, waterTop, calW - 4, calH - (waterTop - calY) - 2);
    ctx.globalAlpha = 1;

    // superfície ondulada
    ctx.strokeStyle = "hsla(0,0%,100%,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = calX; x <= calX + calW; x += 4) {
      const y = waterTop + Math.sin((x + idx * 4) * 0.08) * 1.5;
      if (x === calX) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // sólido (afunda na água)
    if (params.mSolid > 0) {
      const sr = 10 + Math.cbrt(params.mSolid * 1000) * 6;
      const sx = calX + calW * 0.32;
      const sy = calY + calH * 0.7;
      ctx.fillStyle = tempColor(s.TSolid);
      ctx.strokeStyle = css("--foreground");
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = css("--foreground");
      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${s.TSolid.toFixed(0)}°C`, sx, sy + 4);
      ctx.textAlign = "left";
    }

    // gelo
    if (results.remainingIce > 1e-4 || (params.mIce > 0 && t < tMax * 0.3)) {
      // representa gelo proporcional ao que resta naquele instante (aproximação linear)
      const frac = params.mIce > 0
        ? 1 - (1 - results.remainingIce / params.mIce) * Math.min(1, t / (params.tauSeconds * 2))
        : 0;
      const iceMass = params.mIce * Math.max(0, frac);
      if (iceMass > 1e-4) {
        const ir = 8 + Math.cbrt(iceMass * 1000) * 6;
        const ix = calX + calW * 0.7;
        const iy = calY + calH * 0.35;
        ctx.fillStyle = "hsla(200, 80%, 88%, 0.95)";
        ctx.strokeStyle = "hsla(200, 60%, 60%, 1)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.rect(ix - ir, iy - ir, ir * 2, ir * 2);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "hsla(210, 40%, 30%, 1)";
        ctx.font = "10px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText("gelo", ix, iy + 3);
        ctx.textAlign = "left";
      }
    }

    // termômetro à direita
    const thX = W - 50, thY1 = calY + 10, thY2 = calY + calH - 10;
    ctx.strokeStyle = css("--muted-foreground");
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(thX, thY1); ctx.lineTo(thX, thY2); ctx.stroke();
    ctx.beginPath(); ctx.arc(thX, thY2 + 6, 7, 0, Math.PI * 2); ctx.stroke();
    // escala
    ctx.fillStyle = css("--muted-foreground");
    ctx.font = "9px ui-monospace, monospace";
    for (let T = 0; T <= 100; T += 25) {
      const y = thY2 - (T / 100) * (thY2 - thY1);
      ctx.fillText(`${T}`, thX + 5, y + 3);
      ctx.beginPath(); ctx.moveTo(thX - 4, y); ctx.lineTo(thX, y); ctx.stroke();
    }
    // indicador
    const TshowR = Math.max(-10, Math.min(110, s.TWater));
    const yInd = thY2 - (TshowR / 100) * (thY2 - thY1);
    ctx.fillStyle = tempColor(TshowR);
    ctx.beginPath(); ctx.arc(thX, thY2 + 6, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(thX - 2, yInd, 4, thY2 - yInd);

    // legenda
    ctx.fillStyle = css("--foreground");
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillText(`t = ${t.toFixed(1)} s · T_água = ${s.TWater.toFixed(2)} °C · T_sólido = ${s.TSolid.toFixed(2)} °C`, 20, 24);
    ctx.fillStyle = css("--muted-foreground");
    ctx.fillText(`T_eq = ${results.Tf.toFixed(2)} °C`, 20, 42);
  }, [t, params, results, tMax]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[460px] block" />
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-t border-border bg-gradient-subtle">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
            {playing ? "Pausar" : "Animar"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setT(0); setPlaying(false); }}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reiniciar
          </Button>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">aproximação exponencial · τ = {params.tauSeconds.toFixed(1)} s</span>
      </div>
    </div>
  );
};