import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { IdealGasParams, IdealGasResults } from "@/lib/physics";

interface Props { params: IdealGasParams; results: IdealGasResults }

export const IdealGasVisualization = ({ params, results }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [s, setS] = useState(0); // 0..1
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);

  useEffect(() => { setS(0); setPlaying(true); }, [results]);

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
      setS((cur) => {
        const next = cur + dt / 4; // 4 s para completar
        return next > 1 ? 0 : next;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

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

    // Estado interpolado pelo path
    const idx = Math.min(results.path.length - 1, Math.floor(s * (results.path.length - 1)));
    const cur = results.path[idx];
    const Vmin = Math.min(...results.path.map(p => p.V));
    const Vmax = Math.max(...results.path.map(p => p.V));
    const Tmin = Math.min(...results.path.map(p => p.T));
    const Tmax = Math.max(...results.path.map(p => p.T));
    const Pmin = Math.min(...results.path.map(p => p.P));
    const Pmax = Math.max(...results.path.map(p => p.P));

    // Cilindro (esquerda)
    const cylX = 60, cylY = 60;
    const cylW = Math.min(280, W * 0.45);
    const cylH = H - 120;
    // Piston position by V (relative)
    const vNorm = Vmax > Vmin ? (cur.V - Vmin) / (Vmax - Vmin) : 0.5;
    const pistonY = cylY + cylH - 20 - vNorm * (cylH - 60);
    const gasH = cylY + cylH - pistonY;

    // Cilindro paredes
    ctx.strokeStyle = css("--muted-foreground");
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cylX, cylY);
    ctx.lineTo(cylX, cylY + cylH);
    ctx.lineTo(cylX + cylW, cylY + cylH);
    ctx.lineTo(cylX + cylW, cylY);
    ctx.stroke();

    // Gás (cor dependente de T)
    const tNorm = Tmax > Tmin ? (cur.T - Tmin) / (Tmax - Tmin) : 0.5;
    const hue = 220 - tNorm * 220; // azul (frio) -> vermelho (quente)
    ctx.fillStyle = `hsla(${hue}, 70%, 55%, 0.18)`;
    ctx.fillRect(cylX + 1, pistonY, cylW - 2, gasH);

    // Partículas (representam moléculas)
    const Nparts = Math.max(20, Math.min(160, Math.floor(20 + params.moles * 30)));
    if (particlesRef.current.length !== Nparts) {
      particlesRef.current = Array.from({ length: Nparts }, () => ({
        x: cylX + 5 + Math.random() * (cylW - 10),
        y: pistonY + 5 + Math.random() * Math.max(10, gasH - 10),
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
      }));
    }
    const speed = 50 + tNorm * 250;
    const parts = particlesRef.current;
    ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
    for (const p of parts) {
      // Mover (passo fixo curto para simplificar)
      const ds = 0.016;
      const norm = Math.hypot(p.vx, p.vy) || 1;
      p.vx = (p.vx / norm) * speed;
      p.vy = (p.vy / norm) * speed;
      p.x += p.vx * ds;
      p.y += p.vy * ds;
      // Reflexão nas paredes do gás
      if (p.x < cylX + 4) { p.x = cylX + 4; p.vx = -p.vx; }
      if (p.x > cylX + cylW - 4) { p.x = cylX + cylW - 4; p.vx = -p.vx; }
      if (p.y < pistonY + 4) { p.y = pistonY + 4; p.vy = -p.vy; }
      if (p.y > cylY + cylH - 4) { p.y = cylY + cylH - 4; p.vy = -p.vy; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pistão
    ctx.fillStyle = css("--primary");
    ctx.fillRect(cylX, pistonY - 10, cylW, 10);
    // Haste do pistão
    ctx.fillStyle = css("--muted-foreground");
    ctx.fillRect(cylX + cylW / 2 - 4, cylY - 30, 8, pistonY - cylY - 10);

    // Painel direito: indicador PV
    const pvX = cylX + cylW + 50;
    const pvY = cylY + 20;
    const pvW = W - pvX - 30;
    const pvH = cylH - 40;
    if (pvW > 80) {
      // eixos
      ctx.strokeStyle = css("--border");
      ctx.lineWidth = 1;
      ctx.strokeRect(pvX, pvY, pvW, pvH);
      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillText("P", pvX - 18, pvY + 12);
      ctx.fillText("V", pvX + pvW - 10, pvY + pvH + 16);

      // Curva do processo
      const xOf = (V: number) => pvX + ((V - Vmin) / Math.max(Vmax - Vmin, 1e-9)) * pvW;
      const yOf = (P: number) => pvY + pvH - ((P - Pmin) / Math.max(Pmax - Pmin, 1e-9)) * pvH;
      ctx.strokeStyle = css("--primary");
      ctx.lineWidth = 2;
      ctx.beginPath();
      results.path.forEach((pt, i) => {
        const x = xOf(pt.V), y = yOf(pt.P);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      // ponto atual
      const cx = xOf(cur.V), cy = yOf(cur.P);
      ctx.fillStyle = css("--primary");
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = css("--foreground");
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`V=${cur.V.toFixed(2)} L`, pvX + 6, pvY + pvH - 18);
      ctx.fillText(`P=${(cur.P / 1000).toFixed(2)} kPa`, pvX + 6, pvY + pvH - 6);
      ctx.fillText(`T=${cur.T.toFixed(1)} K`, pvX + 6, pvY + 12);
    }

    // Info inferior
    ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim()})`;
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillText(`processo: ${params.process}    γ=${params.gamma.toFixed(3)}    n=${params.moles.toFixed(3)} mol`, 12, H - 14);
  }, [s, results, params]);

  const reset = () => { setS(0); setPlaying(false); };
  const toggle = () => setPlaying((p) => !p);

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
        <span className="text-[11px] text-muted-foreground font-mono">{(s * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};