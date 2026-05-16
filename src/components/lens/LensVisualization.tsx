import { useEffect, useRef } from "react";
import type { ThinLensParams, ThinLensResults } from "@/lib/physics";

interface Props { params: ThinLensParams; results: ThinLensResults }

export const LensVisualization = ({ params, results }: Props) => {
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

    const cx = W / 2;
    const cy = H / 2;

    // Escala: ajustar para caber objeto, foco e (se possível) imagem
    const f = results.focalCm;
    const dO = params.objectDistanceCm;
    const di = results.imageDistanceCm;
    const maxCm = Math.max(Math.abs(dO), Math.abs(f) * 1.2, di && isFinite(di) ? Math.abs(di) : 0, 30);
    const scale = (W * 0.42) / maxCm; // px / cm
    const cmToX = (cmFromLens: number) => cx + cmFromLens * scale;
    const cmToY = (cmAxis: number) => cy - cmAxis * scale;

    // Eixo óptico
    ctx.strokeStyle = css("--border");
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(W - 20, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Lente (símbolo): linha vertical com setas
    const lensH = H * 0.36;
    const converging = results.isConverging;
    ctx.strokeStyle = css("--primary");
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy - lensH); ctx.lineTo(cx, cy + lensH); ctx.stroke();
    // setas
    ctx.beginPath();
    if (converging) {
      // setas para fora (>)
      ctx.moveTo(cx - 8, cy - lensH + 10); ctx.lineTo(cx, cy - lensH); ctx.lineTo(cx + 8, cy - lensH + 10);
      ctx.moveTo(cx - 8, cy + lensH - 10); ctx.lineTo(cx, cy + lensH); ctx.lineTo(cx + 8, cy + lensH - 10);
    } else {
      // setas para dentro (<)
      ctx.moveTo(cx - 8, cy - lensH - 10); ctx.lineTo(cx, cy - lensH); ctx.lineTo(cx + 8, cy - lensH - 10);
      ctx.moveTo(cx - 8, cy + lensH + 10); ctx.lineTo(cx, cy + lensH); ctx.lineTo(cx + 8, cy + lensH + 10);
    }
    ctx.stroke();

    // Focos
    const fx1 = cmToX(-Math.abs(f));
    const fx2 = cmToX(Math.abs(f));
    ctx.fillStyle = css("--muted-foreground");
    [fx1, fx2].forEach((x) => {
      ctx.beginPath(); ctx.arc(x, cy, 3, 0, Math.PI * 2); ctx.fill();
    });
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillText("F", fx1 - 4, cy + 16);
    ctx.fillText("F'", fx2 - 4, cy + 16);

    // Objeto (à esquerda da lente, em -dO)
    const ho = params.objectHeightCm;
    const objX = cmToX(-dO);
    const objTopY = cmToY(ho);
    ctx.strokeStyle = css("--foreground");
    ctx.fillStyle = css("--foreground");
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(objX, cy); ctx.lineTo(objX, objTopY); ctx.stroke();
    // ponta de seta
    ctx.beginPath();
    ctx.moveTo(objX - 5, objTopY + 7); ctx.lineTo(objX, objTopY); ctx.lineTo(objX + 5, objTopY + 7);
    ctx.stroke();
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillText("objeto", objX - 18, cy + 16);

    // Traçado dos três raios principais
    const rayColors = [css("--primary"), css("--accent-foreground"), css("--muted-foreground")];
    ctx.lineWidth = 1.5;

    // helpers
    const drawSegment = (x1: number, y1: number, x2: number, y2: number, color: string, dashed = false) => {
      ctx.strokeStyle = color;
      if (dashed) ctx.setLineDash([5, 4]); else ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
    };

    const hi = results.imageHeightCm ?? 0;
    const diCm = di ?? 0;
    const imgX = cmToX(diCm);
    const imgY = cmToY(hi);
    const hasImage = results.imageType !== "no-image" && di != null && isFinite(di);

    // Raio 1: paralelo ao eixo, refrata passando pelo foco F' (do outro lado, +|f|)
    // converging: passa por F' = (+|f|, 0)
    // diverging: parece vir de F = (-|f|, 0) — desenhar segmento até borda e linha tracejada para trás
    {
      const yObj = objTopY;
      drawSegment(objX, yObj, cx, yObj, rayColors[0]);
      if (converging) {
        // após lente: passa por (cx + |f|*scale, cy)
        // continua além: extrapolar
        const xEnd = W - 20;
        const t = (xEnd - cx) / (fx2 - cx);
        const yEnd = yObj + t * (cy - yObj);
        drawSegment(cx, yObj, xEnd, yEnd, rayColors[0]);
      } else {
        // refrata como se viesse de F (no mesmo lado do objeto)
        // direção: do ponto F=(fx1,cy) ao ponto (cx, yObj). Continuar para a direita.
        const dx = cx - fx1, dy = yObj - cy;
        const xEnd = W - 20;
        const t = (xEnd - cx) / dx;
        const yEnd = yObj + t * dy;
        drawSegment(cx, yObj, xEnd, yEnd, rayColors[0]);
        // tracejado virtual de volta a F
        drawSegment(cx, yObj, fx1, cy, rayColors[0], true);
      }
    }

    // Raio 2: pelo centro óptico — segue reto
    {
      const yObj = objTopY;
      const xEnd = W - 20;
      const t = (xEnd - objX) / (cx - objX);
      const yEnd = yObj + t * (cy - yObj);
      drawSegment(objX, yObj, xEnd, yEnd, rayColors[1]);
    }

    // Raio 3: passando pelo foco F do lado do objeto, sai paralelo ao eixo
    // (válido para convergente; para divergente: dirigido a F' do lado oposto, sai paralelo)
    {
      const yObj = objTopY;
      if (converging) {
        // de (objX, yObj) passa por (fx1, cy) → atinge lente em algum y; depois paralelo
        const dx = fx1 - objX, dy = cy - yObj;
        const t = (cx - objX) / dx;
        const yLens = yObj + t * dy;
        drawSegment(objX, yObj, cx, yLens, rayColors[2]);
        drawSegment(cx, yLens, W - 20, yLens, rayColors[2]);
      } else {
        // dirigido a F' (do outro lado, em fx2). Sai paralelo ao eixo a partir do ponto onde cruza a lente.
        const dx = fx2 - objX, dy = cy - yObj;
        const t = (cx - objX) / dx;
        const yLens = yObj + t * dy;
        drawSegment(objX, yObj, cx, yLens, rayColors[2]);
        drawSegment(cx, yLens, W - 20, yLens, rayColors[2]);
        // tracejado de continuação até F'
        drawSegment(cx, yLens, fx2, cy, rayColors[2], true);
      }
    }

    // Imagem
    if (hasImage) {
      const isVirtual = results.imageType === "virtual";
      ctx.strokeStyle = isVirtual ? css("--muted-foreground") : css("--primary");
      ctx.lineWidth = 2.5;
      if (isVirtual) ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(imgX, cy); ctx.lineTo(imgX, imgY); ctx.stroke();
      // ponta de seta
      ctx.beginPath();
      const arrowDir = imgY < cy ? 1 : -1;
      ctx.moveTo(imgX - 5, imgY + 7 * arrowDir);
      ctx.lineTo(imgX, imgY);
      ctx.lineTo(imgX + 5, imgY + 7 * arrowDir);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = isVirtual ? css("--muted-foreground") : css("--primary");
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText(isVirtual ? "imagem virtual" : "imagem real", imgX - 30, cy - 6);
    }

    // Info inferior
    ctx.fillStyle = css("--foreground");
    ctx.font = "11px ui-monospace, monospace";
    const dITxt = di == null || !isFinite(di) ? "—" : `${di.toFixed(2)} cm`;
    const mTxt = results.magnification == null ? "—" : results.magnification.toFixed(2);
    ctx.fillText(
      `f=${f.toFixed(2)} cm   d₀=${dO.toFixed(2)} cm   dᵢ=${dITxt}   m=${mTxt}   (${results.isConverging ? "convergente" : "divergente"})`,
      12,
      H - 12,
    );
  }, [params, results]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[460px] block" />
    </div>
  );
};