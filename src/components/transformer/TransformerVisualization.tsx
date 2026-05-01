import { useEffect, useRef } from "react";
import { transformerWaveform, computeTransformer, type TransformerParams } from "@/lib/physics";

interface Props {
  params: TransformerParams;
  running: boolean;
}

export const TransformerVisualization = ({ params, running }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const tRef = useRef(0);
  const lastRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (running) tRef.current += dt;

      const dpr = window.devicePixelRatio || 1;
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const css = (v: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(v).trim()})`;
      ctx.fillStyle = css("--card");
      ctx.fillRect(0, 0, W, H);

      const r = computeTransformer(params);
      const wf = transformerWaveform(params, tRef.current);

      // Núcleo retangular no centro
      const coreX = W / 2 - 60;
      const coreY = H / 2 - 80;
      const coreW = 120;
      const coreH = 160;
      const inner = 24;
      ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()} / 0.6)`;
      ctx.lineWidth = 2;
      // núcleo "8" — retângulo externo + barra do meio? Usaremos retângulo simples + janelas
      ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted").trim()} / 0.4)`;
      ctx.fillRect(coreX, coreY, coreW, coreH);
      ctx.strokeRect(coreX, coreY, coreW, coreH);
      // janela interna (esquerda) para o primário
      ctx.fillStyle = css("--card");
      ctx.fillRect(coreX + inner, coreY + inner, 30, coreH - 2 * inner);
      ctx.fillRect(coreX + coreW - inner - 30, coreY + inner, 30, coreH - 2 * inner);
      ctx.strokeRect(coreX + inner, coreY + inner, 30, coreH - 2 * inner);
      ctx.strokeRect(coreX + coreW - inner - 30, coreY + inner, 30, coreH - 2 * inner);

      // Bobinas (espirais) sobre as colunas externas
      const drawCoil = (x: number, label: string, n: number, intensity: number, color: string) => {
        const turns = Math.min(20, Math.max(4, Math.round(Math.log10(Math.max(2, n)) * 5)));
        const top = coreY + 8;
        const bot = coreY + coreH - 8;
        const dy = (bot - top) / turns;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for (let i = 0; i < turns; i++) {
          const yA = top + i * dy;
          const yB = top + (i + 1) * dy;
          ctx.beginPath();
          ctx.ellipse(x, (yA + yB) / 2, 14, dy / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        // brilho proporcional à corrente / amplitude
        const glow = Math.min(1, intensity);
        ctx.fillStyle = `${color.replace(")", ` / ${0.05 + 0.25 * glow})`).replace("hsl(", "hsla(")}`;
        // fallback simples:
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.08 + 0.18 * glow;
        ctx.fillRect(x - 18, top, 36, bot - top);
        ctx.globalAlpha = 1;
        // label
        ctx.fillStyle = css("--foreground");
        ctx.font = "11px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.fillText(label, x, bot + 16);
        ctx.fillText(`N=${Math.round(n)}`, x, bot + 30);
        ctx.textAlign = "start";
      };

      const v1n = Math.abs(wf.v1) / Math.max(1, params.vPrimaryRms * Math.SQRT2);
      const v2n = Math.abs(wf.v2) / Math.max(1, params.vPrimaryRms * Math.SQRT2);
      drawCoil(coreX - 4, "Primário", params.n1, v1n, css("--primary"));
      drawCoil(coreX + coreW + 4, "Secundário", params.n2, v2n, css("--accent"));

      // Linhas de fluxo magnético (animadas)
      const flowOffset = (tRef.current * 60) % 16;
      ctx.strokeStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()} / ${0.3 + 0.5 * params.coupling})`;
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -flowOffset * Math.sign(wf.v1 || 1);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(coreX + 8, coreY + 8, coreW - 16, coreH - 16);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;

      // Setas indicando sentido das correntes/tensão
      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "10px ui-sans-serif, system-ui";
      ctx.fillText(`V₁ = ${wf.v1.toFixed(1)} V`, 12, 18);
      ctx.fillText(`V₂ = ${wf.v2.toFixed(1)} V`, 12, 32);
      ctx.fillText(`a = ${r.ratio.toFixed(3)} · η = ${(r.efficiency * 100).toFixed(1)}%`, 12, H - 10);

      // Carga (resistor) à direita
      const lx = coreX + coreW + 60;
      const ly = H / 2;
      ctx.strokeStyle = css("--foreground");
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(coreX + coreW + 18, ly - 30);
      ctx.lineTo(lx, ly - 30);
      ctx.lineTo(lx, ly - 12);
      // zig-zag
      const zw = 6, zh = 5;
      let zy = ly - 12;
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(lx + (i % 2 === 0 ? zw : -zw), zy + zh);
        zy += zh;
      }
      ctx.lineTo(lx, ly + 30);
      ctx.lineTo(coreX + coreW + 18, ly + 30);
      ctx.stroke();
      ctx.fillStyle = css("--foreground");
      ctx.fillText(`R_L = ${params.loadOhm.toFixed(2)} Ω`, lx + 14, ly);

      rafRef.current = requestAnimationFrame(draw);
    };
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [params, running]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[420px] block" />
    </div>
  );
};