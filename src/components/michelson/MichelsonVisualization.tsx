import { useEffect, useRef } from "react";
import type { MichelsonParams, MichelsonResults } from "@/lib/physics";

interface Props { params: MichelsonParams; results: MichelsonResults }

/** Aproximação simples λ(nm) → cor visível (CIE → sRGB simplificado). */
function wavelengthToRGB(nm: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / (440 - 380); g = 0; b = 1; }
  else if (nm < 490) { r = 0; g = (nm - 440) / (490 - 440); b = 1; }
  else if (nm < 510) { r = 0; g = 1; b = -(nm - 510) / (510 - 490); }
  else if (nm < 580) { r = (nm - 510) / (580 - 510); g = 1; b = 0; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / (645 - 580); b = 0; }
  else if (nm <= 780) { r = 1; g = 0; b = 0; }
  // atenuação nas bordas
  let factor = 1;
  if (nm >= 380 && nm < 420) factor = 0.3 + 0.7 * (nm - 380) / 40;
  else if (nm > 700) factor = 0.3 + 0.7 * (780 - nm) / 80;
  return [Math.round(255 * r * factor), Math.round(255 * g * factor), Math.round(255 * b * factor)];
}

export const MichelsonVisualization = ({ params, results }: Props) => {
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

    // background
    ctx.fillStyle = css("--card");
    ctx.fillRect(0, 0, W, H);

    const [Rc, Gc, Bc] = wavelengthToRGB(params.wavelengthNm);
    const beamColor = `rgb(${Rc},${Gc},${Bc})`;
    const beamSoft = `rgba(${Rc},${Gc},${Bc},0.35)`;

    // ---------- Lado esquerdo: esquema óptico ----------
    const leftW = W * 0.42;
    // separa as duas áreas
    ctx.strokeStyle = css("--border");
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(leftW, 16); ctx.lineTo(leftW, H - 16); ctx.stroke();

    // pontos chave
    const cx = leftW * 0.55, cy = H * 0.55; // BS
    const srcX = 24, srcY = cy;             // fonte (esq)
    const m2X = leftW - 32, m2Y = cy;       // espelho móvel (direita)
    const m1X = cx, m1Y = 40;               // espelho fixo (topo)
    const detX = cx, detY = H - 40;         // detector (base)

    // feixes (linhas)
    ctx.lineWidth = 3;
    ctx.strokeStyle = beamColor;
    // fonte → BS
    ctx.beginPath(); ctx.moveTo(srcX, srcY); ctx.lineTo(cx, cy); ctx.stroke();
    // BS → M1 (vertical)
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(m1X, m1Y); ctx.stroke();
    // BS → M2 (horizontal)
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(m2X, m2Y); ctx.stroke();
    // BS → detector (recombinado)
    ctx.strokeStyle = beamSoft;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(detX, detY); ctx.stroke();

    // BS (linha 45°)
    const bsLen = 36;
    ctx.strokeStyle = css("--foreground");
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - bsLen / Math.SQRT2, cy + bsLen / Math.SQRT2);
    ctx.lineTo(cx + bsLen / Math.SQRT2, cy - bsLen / Math.SQRT2);
    ctx.stroke();
    // hachuras leves no BS
    ctx.strokeStyle = css("--muted-foreground"); ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      const ox = i * 6;
      ctx.beginPath();
      ctx.moveTo(cx - bsLen / Math.SQRT2 + ox + 4, cy + bsLen / Math.SQRT2 + ox - 4);
      ctx.lineTo(cx - bsLen / Math.SQRT2 + ox + 8, cy + bsLen / Math.SQRT2 + ox - 8);
      ctx.stroke();
    }

    // Função auxiliar para desenhar espelho como retângulo com hachuras (lado refletor para o feixe)
    const drawMirror = (mx: number, my: number, dir: "up" | "right" | "down", tiltDeg = 0) => {
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate((tiltDeg * Math.PI) / 180);
      ctx.fillStyle = css("--foreground");
      const len = 50, thk = 6;
      if (dir === "up" || dir === "down") {
        ctx.fillRect(-len / 2, dir === "up" ? 0 : -thk, len, thk);
      } else {
        ctx.fillRect(dir === "right" ? -thk : 0, -len / 2, thk, len);
      }
      ctx.restore();
    };
    drawMirror(m1X, m1Y, "down");                         // M1 (fixo)
    drawMirror(m2X, m2Y, "right", params.mode === "linear" ? params.tiltMrad * 5 : 0); // M2 (móvel, mostra tilt amplificado)

    // Fonte (círculo)
    ctx.fillStyle = beamColor;
    ctx.beginPath(); ctx.arc(srcX, srcY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = css("--foreground"); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(srcX, srcY, 8, 0, Math.PI * 2); ctx.stroke();

    // Detector (placa)
    ctx.fillStyle = css("--muted");
    ctx.fillRect(detX - 28, detY - 4, 56, 10);
    ctx.strokeStyle = css("--foreground"); ctx.lineWidth = 1.5;
    ctx.strokeRect(detX - 28, detY - 4, 56, 10);

    // Labels
    ctx.fillStyle = css("--muted-foreground");
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillText("Fonte", srcX - 4, srcY - 14);
    ctx.fillText("BS", cx + 12, cy - 8);
    ctx.fillText(`M₁ (fixo) · L₁=${params.L1mm.toFixed(3)} mm`, m1X - 80, m1Y - 14);
    ctx.fillText(`M₂ · L₂=${params.L2mm.toFixed(3)} mm`, m2X - 80, m2Y - 14);
    ctx.fillText("Anteparo", detX + 32, detY + 6);

    // Indicador Δ
    ctx.fillStyle = css("--foreground");
    ctx.font = "bold 12px ui-sans-serif, system-ui";
    ctx.fillText(`Δ = 2(L₂ − L₁) = ${(results.pathDiffM * 1e6).toFixed(3)} μm`, 16, 22);
    ctx.fillStyle = css("--muted-foreground"); ctx.font = "11px ui-monospace, monospace";
    ctx.fillText(`m₀ = Δ/λ = ${results.orderCenter.toFixed(2)}`, 16, 38);

    // ---------- Lado direito: padrão de franjas no anteparo ----------
    const rightX = leftW + 16, rightY = 16;
    const rightW = W - rightX - 16, rightH = H - 32;
    // moldura
    ctx.strokeStyle = css("--border"); ctx.lineWidth = 1;
    ctx.strokeRect(rightX, rightY, rightW, rightH);
    ctx.fillStyle = css("--muted-foreground");
    ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "left";
    ctx.fillText(`Padrão no anteparo · ${params.screenSizeMm.toFixed(0)} mm`, rightX + 6, rightY + 14);

    // renderiza a matriz de intensidade num ImageData quadrado, mantendo proporção
    const N = results.gridN;
    const map = results.intensityMap;
    const side = Math.min(rightW - 8, rightH - 28);
    const offX = rightX + (rightW - side) / 2;
    const offY = rightY + 20 + (rightH - 28 - side) / 2;

    const tmp = document.createElement("canvas");
    tmp.width = N; tmp.height = N;
    const tctx = tmp.getContext("2d");
    if (tctx) {
      const img = tctx.createImageData(N, N);
      for (let i = 0; i < N * N; i++) {
        const I = map[i]; // 0..1
        img.data[i * 4 + 0] = Math.round(Rc * I);
        img.data[i * 4 + 1] = Math.round(Gc * I);
        img.data[i * 4 + 2] = Math.round(Bc * I);
        img.data[i * 4 + 3] = 255;
      }
      tctx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(tmp, offX, offY, side, side);
    }

    // escala (régua simples no eixo x)
    ctx.strokeStyle = css("--muted-foreground"); ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(offX, offY + side + 4); ctx.lineTo(offX + side, offY + side + 4); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = css("--muted-foreground"); ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`−${(params.screenSizeMm / 2).toFixed(1)} mm`, offX, offY + side + 16);
    ctx.fillText("0", offX + side / 2, offY + side + 16);
    ctx.fillText(`+${(params.screenSizeMm / 2).toFixed(1)} mm`, offX + side, offY + side + 16);

    // legenda
    ctx.fillStyle = css("--foreground"); ctx.font = "11px ui-monospace, monospace"; ctx.textAlign = "left";
    const mode = params.mode === "circular" ? "Franjas circulares (igual inclinação)" : "Franjas retilíneas (igual espessura)";
    ctx.fillText(mode, rightX + 6, rightY + rightH - 6);
  }, [params, results]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[500px] block" />
    </div>
  );
};