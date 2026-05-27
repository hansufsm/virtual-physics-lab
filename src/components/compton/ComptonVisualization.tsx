import { useEffect, useRef } from "react";
import type { ComptonParams, ComptonResults } from "@/lib/physics";

interface Props { params: ComptonParams; results: ComptonResults }

export const ComptonVisualization = ({ params, results }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = (v: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(v).trim()})`;

    ctx.fillStyle = css("--card");
    ctx.fillRect(0, 0, W, H);

    // origem (elétron)
    const cx = W * 0.5, cy = H * 0.55;
    const R = Math.min(W, H) * 0.32;

    // grade circular sutil
    ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
    for (const f of [0.33, 0.66, 1.0]) {
      ctx.beginPath(); ctx.arc(cx, cy, R * f, 0, Math.PI * 2); ctx.stroke();
    }
    // eixo X (direção do fóton incidente)
    ctx.strokeStyle = css("--muted-foreground");
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx - R * 1.05, cy); ctx.lineTo(cx + R * 1.05, cy); ctx.stroke();
    ctx.setLineDash([]);

    // marcadores de ângulo (0, 90, 180)
    ctx.fillStyle = css("--muted-foreground");
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("0°", cx + R + 14, cy + 4);
    ctx.fillText("90°", cx, cy - R - 6);
    ctx.fillText("180°", cx - R - 18, cy + 4);

    // setas helper
    const arrow = (x0: number, y0: number, x1: number, y1: number, color: string, w = 3, label?: string) => {
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      const ang = Math.atan2(y1 - y0, x1 - x0);
      const hl = 10;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - hl * Math.cos(ang - 0.4), y1 - hl * Math.sin(ang - 0.4));
      ctx.lineTo(x1 - hl * Math.cos(ang + 0.4), y1 - hl * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
      if (label) {
        ctx.font = "bold 11px ui-monospace, monospace";
        ctx.fillText(label, (x0 + x1) / 2 + 8, (y0 + y1) / 2 - 6);
      }
    };

    // fóton incidente (vermelho) vindo da esquerda
    arrow(cx - R, cy, cx - 12, cy, "hsl(0,80%,60%)", 3, `γ  E₀=${params.E0_keV.toFixed(0)} keV`);

    // fóton espalhado (verde) — escurece conforme E'/E0
    const k = Math.max(0.25, Math.min(1, results.energyRatio));
    const greenL = 30 + 35 * k;
    const theta = (params.thetaDeg * Math.PI) / 180;
    const tx = cx + R * Math.cos(theta);
    const ty = cy - R * Math.sin(theta); // y para cima
    arrow(cx + 6, cy, tx, ty, `hsl(140,70%,${greenL}%)`, 3, `γ'  E'=${results.Eprime_keV.toFixed(0)} keV`);

    // elétron espalhado (azul) — ângulo φ abaixo do eixo X
    const phi = (results.recoilPhiDeg * Math.PI) / 180;
    const ex = cx + R * 0.85 * Math.cos(phi);
    const ey = cy + R * 0.85 * Math.sin(phi);
    arrow(cx + 6, cy, ex, ey, "hsl(210,90%,60%)", 3, `e⁻  K=${results.K_electron_keV.toFixed(0)} keV`);

    // arco para θ
    ctx.strokeStyle = css("--foreground"); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, 36, -theta, 0, false); ctx.stroke();
    ctx.fillStyle = css("--foreground"); ctx.font = "bold 12px ui-sans-serif, system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`θ = ${params.thetaDeg.toFixed(1)}°`, cx + 42, cy - 6);
    // arco para φ
    if (results.recoilPhiDeg > 0.5) {
      ctx.beginPath(); ctx.arc(cx, cy, 56, 0, phi, false); ctx.stroke();
      ctx.fillText(`φ = ${results.recoilPhiDeg.toFixed(1)}°`, cx + 62, cy + 18);
    }

    // elétron alvo
    ctx.fillStyle = css("--muted");
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = css("--foreground"); ctx.lineWidth = 1.5; ctx.stroke();

    // título superior
    ctx.fillStyle = css("--foreground");
    ctx.font = "bold 13px ui-sans-serif, system-ui";
    ctx.textAlign = "left";
    ctx.fillText("Diagrama cinemático do espalhamento Compton", 16, 22);
    ctx.fillStyle = css("--muted-foreground"); ctx.font = "11px ui-monospace, monospace";
    ctx.fillText(`Δλ = ${(results.deltaLambda_m * 1e12).toFixed(4)} pm  ·  λ_C ≈ 2.4263 pm`, 16, 38);
  }, [params, results]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[500px] block" />
    </div>
  );
};