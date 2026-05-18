import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { computeStandingWave, type StandingWaveParams } from "@/lib/physics";

interface Props { params: StandingWaveParams }

export const StandingWaveVisualization = ({ params }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
      return;
    }
    const animate = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      // tempo lento o suficiente para ver oscilação independentemente da frequência real
      const slowFactor = Math.min(1, 4 / Math.max(0.5, params.mode) / Math.max(1, computeStandingWave(params).frequency));
      setTime((t) => t + dt * slowFactor * 30);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, params]);

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

    const r = computeStandingWave(params, time);
    const padX = 40;
    const midY = H / 2;
    const usableW = W - padX * 2;
    // escala vertical baseada na amplitude
    const yScale = Math.min(midY - 30, midY * 0.7) / Math.max(params.amplitude, 1e-6);
    const toX = (x: number) => padX + (x / params.L) * usableW;
    const toY = (y: number) => midY - y * yScale;

    // eixo zero
    ctx.strokeStyle = "hsla(0,0%,60%,0.25)";
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, midY); ctx.lineTo(W - padX, midY); ctx.stroke();
    ctx.setLineDash([]);

    // envelope
    ctx.strokeStyle = "hsla(0,0%,60%,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    r.envelope.forEach((pt, i) => {
      const X = toX(pt.x), Y = toY(pt.yPos);
      if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    });
    ctx.stroke();
    ctx.beginPath();
    r.envelope.forEach((pt, i) => {
      const X = toX(pt.x), Y = toY(pt.yNeg);
      if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    });
    ctx.stroke();

    // corda (snapshot)
    ctx.strokeStyle = css("--primary");
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    r.shape.forEach((pt, i) => {
      const X = toX(pt.x), Y = toY(pt.y);
      if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    });
    ctx.stroke();

    // nós e ventres
    r.nodes.forEach((xn) => {
      ctx.fillStyle = css("--foreground");
      ctx.beginPath();
      ctx.arc(toX(xn), midY, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    r.antinodes.forEach((xa) => {
      ctx.strokeStyle = "hsla(0,80%,60%,0.5)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(toX(xa), midY - params.amplitude * yScale);
      ctx.lineTo(toX(xa), midY + params.amplitude * yScale);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // suportes (parede em x=0, parede ou anel em x=L)
    ctx.fillStyle = css("--muted-foreground");
    ctx.fillRect(padX - 6, midY - 18, 4, 36);
    if (params.boundary === "fixed-fixed") {
      ctx.fillRect(W - padX + 2, midY - 18, 4, 36);
    } else {
      ctx.strokeStyle = css("--muted-foreground");
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(W - padX, midY, 7, 0, Math.PI * 2);
      ctx.stroke();
    }

    // legenda
    ctx.fillStyle = css("--foreground");
    ctx.font = "11px ui-monospace, monospace";
    const info = `n=${params.mode}  f=${r.frequency.toFixed(2)} Hz  λ=${r.wavelength.toFixed(3)} m  v=${r.v.toFixed(2)} m/s  t=${time.toFixed(2)} s`;
    ctx.fillText(info, padX, H - 10);
    ctx.fillStyle = css("--muted-foreground");
    ctx.fillText("● nós   ┊ ventres", W - padX - 130, H - 10);
  }, [params, time]);

  const toggle = () => setPlaying((p) => !p);
  const reset = () => { setTime(0); setPlaying(false); };

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[460px] block" />
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-t border-border bg-gradient-subtle">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={toggle}>
            {playing ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
            {playing ? "Pausar" : "Animar"}
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reiniciar
          </Button>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">tempo simulado</span>
      </div>
    </div>
  );
};