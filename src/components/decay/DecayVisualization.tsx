import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { DecayParams, DecayResults } from "@/lib/physics";

interface Props { params: DecayParams; results: DecayResults }

// Limite visual de núcleos plotados; se N0 > MAX, cada ponto representa N0/MAX núcleos.
const MAX_DOTS = 1500;

export const DecayVisualization = ({ params, results }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const aliveRef = useRef<boolean[]>([]);
  const positionsRef = useRef<{ x: number; y: number }[]>([]);
  const decayFlashRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const simTimeRef = useRef(0);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1); // multiplicador (em "tempo do experimento" por segundo real)
  const [aliveCount, setAliveCount] = useState(0);

  // Reset quando params estruturais mudam
  useEffect(() => {
    const total = Math.min(MAX_DOTS, Math.max(20, Math.round(params.N0)));
    aliveRef.current = new Array(total).fill(true);
    positionsRef.current = new Array(total).fill(0).map(() => ({ x: Math.random(), y: Math.random() }));
    decayFlashRef.current = [];
    simTimeRef.current = 0;
    setAliveCount(total);
  }, [params.isotopeName, params.N0, params.halfLifeS]);

  // Velocidade automática: 4·T½ percorridos em ~20 s reais (× speed)
  const simRate = (4 * params.halfLifeS) / 20 * speed;

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

    const total = aliveRef.current.length;
    const padX = 16, padY = 16;
    const gridW = W - padX * 2;
    const gridH = H - padY * 2 - 80; // espaço inferior p/ gráfico

    const draw = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dtReal = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;

      if (running) {
        const dtSim = dtReal * simRate;
        simTimeRef.current += dtSim;
        const p = 1 - Math.exp(-results.lambda * dtSim);
        let count = 0;
        for (let i = 0; i < total; i++) {
          if (aliveRef.current[i]) {
            if (Math.random() < p) {
              aliveRef.current[i] = false;
              const pos = positionsRef.current[i];
              decayFlashRef.current.push({
                x: padX + pos.x * gridW,
                y: padY + pos.y * gridH,
                t: 0,
              });
            } else {
              count++;
            }
          }
        }
        if (count !== aliveCount) setAliveCount(count);
      }

      // bg
      ctx.fillStyle = css("--card");
      ctx.fillRect(0, 0, W, H);

      // núcleos
      for (let i = 0; i < total; i++) {
        const pos = positionsRef.current[i];
        const x = padX + pos.x * gridW;
        const y = padY + pos.y * gridH;
        if (aliveRef.current[i]) {
          ctx.fillStyle = "hsl(200, 85%, 60%)";
          ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = "hsl(0, 0%, 30%)";
          ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill();
        }
      }

      // flashes de decaimento
      const remaining: typeof decayFlashRef.current = [];
      for (const f of decayFlashRef.current) {
        f.t += dtReal;
        const a = Math.max(0, 1 - f.t / 0.6);
        if (a > 0) {
          ctx.strokeStyle = `hsla(20, 90%, 60%, ${a})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(f.x, f.y, 4 + (1 - a) * 14, 0, Math.PI * 2); ctx.stroke();
          remaining.push(f);
        }
      }
      decayFlashRef.current = remaining;

      // gráfico inferior: N(t) analítico vs. simulado
      const gx = padX, gy = padY + gridH + 14, gW = gridW, gH = 60;
      ctx.strokeStyle = css("--border");
      ctx.strokeRect(gx, gy, gW, gH);
      const tMaxView = params.halfLifeS * params.tMaxMultiplier;
      // curva analítica
      ctx.strokeStyle = css("--primary"); ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const tt = (i / 100) * tMaxView;
        const Nt = total * Math.exp(-results.lambda * tt);
        const xx = gx + (tt / tMaxView) * gW;
        const yy = gy + gH - (Nt / total) * gH;
        if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
      // ponto da simulação
      const tNow = Math.min(simTimeRef.current, tMaxView);
      const sx = gx + (tNow / tMaxView) * gW;
      const sy = gy + gH - (aliveCount / total) * gH;
      ctx.fillStyle = "hsl(20, 90%, 60%)";
      ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`vivos: ${aliveCount}/${total} · t_sim acumulado`, gx + 4, gy + 12);
      ctx.fillText(`N₀ representado por ${total} pontos (1 ponto ≈ ${(params.N0 / total).toFixed(1)} núcleo${params.N0 / total >= 1.5 ? "s" : ""})`,
        gx + 4, gy + gH - 4);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, [params, results, running, simRate, aliveCount]);

  const reset = () => {
    const total = aliveRef.current.length;
    aliveRef.current = new Array(total).fill(true);
    decayFlashRef.current = [];
    simTimeRef.current = 0;
    setAliveCount(total);
  };

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
          Sim: {aliveCount}/{aliveRef.current.length} vivos · Analítico: N(t)/N₀ = {(Math.exp(-results.lambda * params.timeS)).toFixed(3)}
        </span>
      </div>
    </div>
  );
};