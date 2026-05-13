import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { PendulumResults, PendulumParams } from "@/lib/physics";

interface Props { results: PendulumResults; params: PendulumParams }

export const PendulumVisualization = ({ results, params }: Props) => {
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
      const speed = Math.max(1, totalT / 8); // play in ~8s if very long
      const dtSim = (dtMs / 1000) * speed;
      const currentT = (series[tIndex]?.t ?? 0) + dtSim;
      let idx = tIndex;
      while (idx < series.length - 1 && series[idx + 1].t <= currentT) idx++;
      if (idx >= series.length - 1) idx = 0; // loop
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
    const theta = cur.theta;

    const pivotX = W / 2;
    const pivotY = 60;
    // Scale: longest L → 60% of available height
    const maxL = 5;
    const pxPerM = (H - pivotY - 40) / maxL;
    const lengthPx = params.length * pxPerM;

    const bobX = pivotX + lengthPx * Math.sin(theta);
    const bobY = pivotY + lengthPx * Math.cos(theta);

    // arc reference
    ctx.strokeStyle = "hsla(0,0%,60%,0.25)";
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, lengthPx, Math.PI / 2 - Math.abs(theta), Math.PI / 2 + Math.abs(theta));
    ctx.stroke();
    ctx.setLineDash([]);

    // rest line (vertical)
    ctx.strokeStyle = "hsla(0,0%,60%,0.25)";
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + lengthPx + 6);
    ctx.stroke();

    // pivot mount
    ctx.fillStyle = css("--muted-foreground");
    ctx.fillRect(pivotX - 30, pivotY - 8, 60, 6);

    // rod
    ctx.strokeStyle = css("--primary");
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // bob
    const bobR = Math.max(8, Math.min(28, 6 + 4 * Math.cbrt(params.mass)));
    ctx.fillStyle = css("--primary");
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = css("--background");
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // pivot dot
    ctx.fillStyle = css("--foreground");
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
    ctx.fill();

    // info
    ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim()})`;
    ctx.font = "11px ui-monospace, monospace";
    const info = `t=${cur.t.toFixed(2)}s  θ=${((cur.theta * 180) / Math.PI).toFixed(1)}°  θ̇=${cur.omega.toFixed(2)} rad/s  E=${cur.energy.toFixed(3)} J`;
    ctx.fillText(info, 12, H - 12);
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