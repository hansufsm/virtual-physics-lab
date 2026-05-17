import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { CollisionResults, CollisionParams } from "@/lib/physics";

interface Props { results: CollisionResults; params: CollisionParams }

export const CollisionVisualization = ({ results, params }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [tIndex, setTIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => { setTIndex(0); setPlaying(true); }, [results]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
      return;
    }
    const series = results.series;
    const totalT = series[series.length - 1].t || 1;
    const animate = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dtMs = now - lastRef.current;
      lastRef.current = now;
      const speed = Math.max(1, totalT / 8);
      const dtSim = (dtMs / 1000) * speed;
      const currentT = (series[tIndex]?.t ?? 0) + dtSim;
      let idx = tIndex;
      while (idx < series.length - 1 && series[idx + 1].t <= currentT) idx++;
      if (idx >= series.length - 1) idx = 0;
      setTIndex(idx);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, results, tIndex]);

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

    const cur = results.series[Math.min(tIndex, results.series.length - 1)];

    // Determine world extent based on whole trajectory
    let xMin = Infinity, xMax = -Infinity;
    for (const s of results.series) {
      xMin = Math.min(xMin, s.x1 - params.r1, s.x2 - params.r2);
      xMax = Math.max(xMax, s.x1 + params.r1, s.x2 + params.r2);
    }
    const pad = (xMax - xMin) * 0.08 + 0.5;
    xMin -= pad; xMax += pad;
    const worldW = xMax - xMin || 1;
    const pxPerM = W / worldW;

    const groundY = H * 0.65;
    const toX = (x: number) => (x - xMin) * pxPerM;

    // Track / floor
    ctx.strokeStyle = "hsla(0,0%,60%,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    // Origin marker
    const ox = toX(0);
    ctx.strokeStyle = "hsla(0,0%,60%,0.25)";
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(ox, 20);
    ctx.lineTo(ox, H - 30);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = css("--muted-foreground");
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("x=0", ox + 4, 30);

    // Bodies
    const drawBody = (x: number, r: number, mass: number, label: string, vel: number, color: string) => {
      const cx = toX(x);
      const rPx = Math.max(10, Math.min(60, r * pxPerM));
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, groundY - rPx, rPx, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = css("--background");
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // label inside
      ctx.fillStyle = css("--primary-foreground");
      ctx.font = "bold 12px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, cx, groundY - rPx);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      // mass label
      ctx.fillStyle = css("--foreground");
      ctx.font = "11px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${mass.toFixed(2)} kg`, cx, groundY + 14);
      ctx.textAlign = "left";
      // velocity arrow
      const arrowScale = 30;
      const ax = cx;
      const ay = groundY - rPx - 6;
      const tx = ax + Math.sign(vel) * Math.min(rPx + 50, Math.abs(vel) * arrowScale);
      if (Math.abs(vel) > 1e-3) {
        ctx.strokeStyle = css("--foreground");
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(tx, ay);
        ctx.stroke();
        const dir = Math.sign(vel);
        ctx.beginPath();
        ctx.moveTo(tx, ay);
        ctx.lineTo(tx - dir * 6, ay - 4);
        ctx.lineTo(tx - dir * 6, ay + 4);
        ctx.closePath();
        ctx.fillStyle = css("--foreground");
        ctx.fill();
      }
    };

    drawBody(cur.x1, params.r1, params.m1, "1", cur.v1, css("--primary"));
    drawBody(cur.x2, params.r2, params.m2, "2", cur.v2, css("--muted-foreground"));

    // Info
    ctx.fillStyle = css("--foreground");
    ctx.font = "11px ui-monospace, monospace";
    const info = `t=${cur.t.toFixed(2)}s  v₁=${cur.v1.toFixed(2)} m/s  v₂=${cur.v2.toFixed(2)} m/s  K=${cur.ke.toFixed(2)} J  p=${cur.p.toFixed(2)} kg·m/s`;
    ctx.fillText(info, 12, H - 12);

    // Collision marker
    if (results.collisionTime !== null && cur.t >= results.collisionTime) {
      ctx.fillStyle = "hsla(0,0%,60%,0.7)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`colisão em t=${results.collisionTime.toFixed(3)} s`, 12, 18);
    }
  }, [results, tIndex, params]);

  const reset = () => { setTIndex(0); setPlaying(false); };
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
        <span className="text-[11px] text-muted-foreground font-mono">
          {tIndex}/{results.series.length - 1} pts
        </span>
      </div>
    </div>
  );
};