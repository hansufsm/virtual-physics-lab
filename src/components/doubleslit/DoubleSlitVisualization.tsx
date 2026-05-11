import { useEffect, useRef } from "react";
import { dsEnvelope, dsIntensity, wavelengthToRgb, type DoubleSlitParams } from "@/lib/physics";

interface Props { params: DoubleSlitParams }

export const DoubleSlitVisualization = ({ params }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const lambda = params.wavelengthNm * 1e-9;
    const a = params.slitWidthUm * 1e-6;
    const d = params.slitSepUm * 1e-6;
    const L = params.screenDistanceM;
    const N = Math.max(1, Math.round(params.numSlits));
    const [r, g, b] = wavelengthToRgb(params.wavelengthNm);

    // Janela vertical na tela: ~3 envelopes centrais
    const yMax = Math.max(0.005, Math.min(0.05, (3 * lambda * L) / a));
    const toScreenY = (yMm: number) => {
      // y on screen meters; map [-yMax, +yMax] => [pad, H-pad]
      const pad = 24;
      return pad + ((-yMm * 1e-3 + yMax) / (2 * yMax)) * (H - 2 * pad);
    };

    // ===== Faixa esquerda: padrão na tela (banda colorida) =====
    const bandX = 0, bandW = Math.min(140, W * 0.22);
    const stripe = ctx.createImageData(bandW, H);
    for (let py = 0; py < H; py++) {
      const t = (py - 24) / (H - 48);
      const yScreen = (1 - 2 * t) * yMax; // top = +yMax
      const theta = Math.atan2(yScreen, L);
      const I = N > 1 ? dsIntensity(theta, lambda, a, d, N) : dsEnvelope(theta, lambda, a);
      const intensity = Math.max(0, Math.min(1, I));
      const rr = Math.round(r * intensity);
      const gg = Math.round(g * intensity);
      const bb = Math.round(b * intensity);
      for (let px = 0; px < bandW; px++) {
        const idx = (py * bandW + px) * 4;
        stripe.data[idx] = rr; stripe.data[idx + 1] = gg; stripe.data[idx + 2] = bb; stripe.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(stripe, bandX, 0);
    ctx.strokeStyle = css("--border");
    ctx.strokeRect(bandX + 0.5, 0.5, bandW - 1, H - 1);

    // ===== Lado direito: gráfico I(y) =====
    const plotX0 = bandW + 24, plotX1 = W - 16;
    const plotW = plotX1 - plotX0;
    // eixo
    ctx.strokeStyle = css("--border");
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plotX0, 24); ctx.lineTo(plotX0, H - 24);
    ctx.lineTo(plotX1, H - 24);
    ctx.stroke();
    // grade y=0
    const yZero = toScreenY(0);
    ctx.strokeStyle = "hsla(0,0%,60%,0.25)";
    ctx.beginPath(); ctx.moveTo(plotX0, yZero); ctx.lineTo(plotX1, yZero); ctx.stroke();

    // envelope (sinc²) opcional
    if (params.showEnvelope && N > 1) {
      ctx.strokeStyle = "hsla(0,0%,75%,0.55)";
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let py = 24; py <= H - 24; py++) {
        const t = (py - 24) / (H - 48);
        const yScreen = (1 - 2 * t) * yMax;
        const theta = Math.atan2(yScreen, L);
        const E = dsEnvelope(theta, lambda, a);
        const x = plotX0 + E * plotW;
        if (py === 24) ctx.moveTo(x, py); else ctx.lineTo(x, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // intensidade total
    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let py = 24; py <= H - 24; py++) {
      const t = (py - 24) / (H - 48);
      const yScreen = (1 - 2 * t) * yMax;
      const theta = Math.atan2(yScreen, L);
      const I = N > 1 ? dsIntensity(theta, lambda, a, d, N) : dsEnvelope(theta, lambda, a);
      const x = plotX0 + Math.max(0, Math.min(1, I)) * plotW;
      if (py === 24) ctx.moveTo(x, py); else ctx.lineTo(x, py);
    }
    ctx.stroke();

    // Linha do ponto de prova
    const probeY = toScreenY(params.probeMm);
    if (probeY > 24 && probeY < H - 24) {
      ctx.strokeStyle = css("--primary");
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, probeY); ctx.lineTo(W, probeY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = css("--primary");
      ctx.beginPath(); ctx.arc(plotX0, probeY, 3, 0, Math.PI * 2); ctx.fill();
    }

    // Rótulos
    ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()})`;
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillText("Tela", bandX + 6, 16);
    ctx.fillText("I(y) / I₀", plotX0 + 4, 16);
    ctx.fillText(`±${(yMax * 1e3).toFixed(2)} mm`, plotX1 - 78, H - 8);
    ctx.fillText(`λ = ${params.wavelengthNm.toFixed(0)} nm  ·  N = ${N}`, bandX + 6, H - 8);
  }, [params]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[460px] block" />
    </div>
  );
};