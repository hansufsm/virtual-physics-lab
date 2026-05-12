import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { ProjectileResults } from "@/lib/physics";

interface Props { results: ProjectileResults; showVacuum?: boolean; vacuumTrajectory?: { x: number; y: number }[] }

export const ProjectileVisualization = ({ results, showVacuum, vacuumTrajectory }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [tIndex, setTIndex] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Reset animation when trajectory changes
  useEffect(() => { setTIndex(results.trajectory.length - 1); setPlaying(false); }, [results]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }
    const traj = results.trajectory;
    const totalT = traj[traj.length - 1].t || 1;
    const animate = (now: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const dtMs = now - lastTimeRef.current;
      lastTimeRef.current = now;
      // 1 simulation second per real second, but at least animate in 4s total
      const speed = Math.max(1, totalT / 4);
      const dtSim = (dtMs / 1000) * speed;
      const currentT = (traj[tIndex]?.t ?? 0) + dtSim;
      let idx = tIndex;
      while (idx < traj.length - 1 && traj[idx + 1].t <= currentT) idx++;
      setTIndex(idx);
      if (idx >= traj.length - 1) { setPlaying(false); return; }
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

    const padL = 44, padR = 16, padT = 16, padB = 32;
    const traj = results.trajectory;
    let xMax = Math.max(results.range, ...traj.map((p) => p.x), 1);
    let yMax = Math.max(results.maxHeight, ...traj.map((p) => p.y), 1);
    if (showVacuum && vacuumTrajectory) {
      xMax = Math.max(xMax, ...vacuumTrajectory.map((p) => p.x));
      yMax = Math.max(yMax, ...vacuumTrajectory.map((p) => p.y));
    }
    xMax *= 1.05; yMax *= 1.15;

    const X = (x: number) => padL + (x / xMax) * (W - padL - padR);
    const Y = (y: number) => H - padB - (y / yMax) * (H - padT - padB);

    // grid
    ctx.strokeStyle = "hsla(0,0%,60%,0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const yy = padT + (i / 5) * (H - padT - padB);
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
      const xx = padL + (i / 5) * (W - padL - padR);
      ctx.beginPath(); ctx.moveTo(xx, padT); ctx.lineTo(xx, H - padB); ctx.stroke();
    }

    // axes
    ctx.strokeStyle = css("--border");
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB);
    ctx.stroke();

    // axis labels
    ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()})`;
    ctx.font = "10px ui-sans-serif, system-ui";
    for (let i = 0; i <= 5; i++) {
      const x = (xMax * i) / 5;
      const y = (yMax * i) / 5;
      ctx.fillText(`${x.toFixed(0)}`, X(x) - 8, H - padB + 14);
      ctx.fillText(`${y.toFixed(0)}`, 6, Y(y) + 3);
    }
    ctx.fillText("x (m)", W - padR - 32, H - padB + 14);
    ctx.fillText("y (m)", 6, padT + 8);

    // vacuum reference trajectory
    if (showVacuum && vacuumTrajectory && vacuumTrajectory.length > 1) {
      ctx.strokeStyle = "hsla(0,0%,60%,0.55)";
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      vacuumTrajectory.forEach((p, i) => {
        if (i === 0) ctx.moveTo(X(p.x), Y(Math.max(0, p.y)));
        else ctx.lineTo(X(p.x), Y(Math.max(0, p.y)));
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // trajectory
    ctx.strokeStyle = css("--primary");
    ctx.lineWidth = 2;
    ctx.beginPath();
    traj.forEach((p, i) => {
      if (i === 0) ctx.moveTo(X(p.x), Y(Math.max(0, p.y)));
      else ctx.lineTo(X(p.x), Y(Math.max(0, p.y)));
    });
    ctx.stroke();

    // current point
    const idx = Math.min(tIndex, traj.length - 1);
    const cur = traj[idx];
    if (cur) {
      ctx.fillStyle = css("--primary");
      ctx.beginPath(); ctx.arc(X(cur.x), Y(Math.max(0, cur.y)), 5, 0, Math.PI * 2); ctx.fill();

      // velocity vector
      const v = Math.hypot(cur.vx, cur.vy);
      if (v > 0.01) {
        const scale = 0.18 * (W - padL - padR) / Math.max(results.trajectory[0].vx || 1, results.trajectory[0].vy || 1, 1);
        const x2 = X(cur.x) + cur.vx * scale * 0.4;
        const y2 = Y(Math.max(0, cur.y)) - cur.vy * scale * 0.4;
        ctx.strokeStyle = css("--primary");
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(X(cur.x), Y(Math.max(0, cur.y))); ctx.lineTo(x2, y2); ctx.stroke();
      }

      // info
      ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim()})`;
      ctx.font = "11px ui-monospace, monospace";
      const info = `t=${cur.t.toFixed(2)}s  x=${cur.x.toFixed(1)}m  y=${cur.y.toFixed(1)}m  |v|=${v.toFixed(1)}m/s`;
      ctx.fillText(info, padL + 8, padT + 14);
    }

    // ground
    ctx.strokeStyle = css("--border");
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(W - padR, Y(0)); ctx.stroke();
  }, [results, tIndex, showVacuum, vacuumTrajectory]);

  const reset = () => { setTIndex(0); setPlaying(false); };
  const toggle = () => {
    if (tIndex >= results.trajectory.length - 1) setTIndex(0);
    setPlaying((p) => !p);
  };

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
          {tIndex}/{results.trajectory.length - 1} pts
        </span>
      </div>
    </div>
  );
};