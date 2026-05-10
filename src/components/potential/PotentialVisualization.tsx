import { useEffect, useRef } from "react";
import { fieldAt, potentialAt, type PotentialParams, type PointCharge } from "@/lib/physics";

interface Props { params: PotentialParams; charges: PointCharge[] }

export const PotentialVisualization = ({ params, charges }: Props) => {
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

    const extent = 0.30; // 30 cm
    const scale = (Math.min(W, H) * 0.95) / (2 * extent);
    const cx = W / 2, cy = H / 2;
    const toX = (x: number) => cx + x * scale;
    const toY = (y: number) => cy - y * scale;
    const fromX = (px: number) => (px - cx) / scale;
    const fromY = (py: number) => -(py - cy) / scale;

    // Grade de V para heatmap + contornos
    const NX = 90, NY = 70;
    const Vgrid: number[] = new Array(NX * NY);
    let vmax = 0;
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const x = fromX((i / (NX - 1)) * W);
        const y = fromY((j / (NY - 1)) * H);
        const v = potentialAt(charges, x, y);
        Vgrid[j * NX + i] = v;
        const a = Math.abs(v);
        if (isFinite(a) && a > vmax) vmax = a;
      }
    }
    // Heatmap suave (clamp logarítmico)
    const img = ctx.createImageData(W, H);
    const ref = Math.max(1, vmax * 0.6);
    for (let py = 0; py < H; py++) {
      const fy = (py / (H - 1)) * (NY - 1);
      const j0 = Math.floor(fy), j1 = Math.min(NY - 1, j0 + 1);
      const ty = fy - j0;
      for (let px = 0; px < W; px++) {
        const fx = (px / (W - 1)) * (NX - 1);
        const i0 = Math.floor(fx), i1 = Math.min(NX - 1, i0 + 1);
        const tx = fx - i0;
        const v00 = Vgrid[j0 * NX + i0], v10 = Vgrid[j0 * NX + i1];
        const v01 = Vgrid[j1 * NX + i0], v11 = Vgrid[j1 * NX + i1];
        const v = (1 - ty) * ((1 - tx) * v00 + tx * v10) + ty * ((1 - tx) * v01 + tx * v11);
        // mapear para [-1, 1] com tanh
        const t = Math.tanh(v / ref);
        // azul (negativo) -> neutro -> vermelho (positivo)
        let r = 30, g = 35, b = 50;
        if (t > 0) {
          r = 30 + Math.round(180 * t); g = 35 + Math.round(20 * t); b = 50 - Math.round(15 * t);
        } else {
          const tt = -t;
          b = 50 + Math.round(180 * tt); g = 35 + Math.round(40 * tt); r = 30 - Math.round(10 * tt);
        }
        const idx = (py * W + px) * 4;
        img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b; img.data[idx + 3] = 110;
      }
    }
    ctx.putImageData(img, 0, 0);
    // sobrepor a cor do card por baixo: usamos blend - na prática o heatmap já carrega cor de fundo.

    // Equipotenciais via marching squares
    if (params.showEquip) {
      const N = Math.max(3, params.numLevels);
      const levels: number[] = [];
      for (let k = 1; k <= N; k++) {
        const f = k / (N + 1);
        levels.push(+ref * f);
        levels.push(-ref * f);
      }
      ctx.lineWidth = 1.2;
      const stepX = W / (NX - 1), stepY = H / (NY - 1);
      for (const L of levels) {
        ctx.strokeStyle = L >= 0 ? "hsla(0, 80%, 75%, 0.9)" : "hsla(220, 80%, 75%, 0.9)";
        ctx.beginPath();
        for (let j = 0; j < NY - 1; j++) {
          for (let i = 0; i < NX - 1; i++) {
            const a = Vgrid[j * NX + i];
            const b = Vgrid[j * NX + (i + 1)];
            const c = Vgrid[(j + 1) * NX + (i + 1)];
            const d = Vgrid[(j + 1) * NX + i];
            const idx = (a > L ? 1 : 0) | (b > L ? 2 : 0) | (c > L ? 4 : 0) | (d > L ? 8 : 0);
            if (idx === 0 || idx === 15) continue;
            const x0 = i * stepX, y0 = j * stepY;
            const x1 = (i + 1) * stepX, y1 = (j + 1) * stepY;
            const it = (va: number, vb: number) => (L - va) / (vb - va);
            const top = () => ({ x: x0 + (x1 - x0) * it(a, b), y: y0 });
            const right = () => ({ x: x1, y: y0 + (y1 - y0) * it(b, c) });
            const bot = () => ({ x: x0 + (x1 - x0) * it(d, c), y: y1 });
            const left = () => ({ x: x0, y: y0 + (y1 - y0) * it(a, d) });
            const segs: Array<[{ x: number; y: number }, { x: number; y: number }]> = [];
            switch (idx) {
              case 1: case 14: segs.push([left(), top()]); break;
              case 2: case 13: segs.push([top(), right()]); break;
              case 4: case 11: segs.push([right(), bot()]); break;
              case 8: case 7: segs.push([bot(), left()]); break;
              case 3: case 12: segs.push([left(), right()]); break;
              case 6: case 9: segs.push([top(), bot()]); break;
              case 5: segs.push([left(), top()]); segs.push([right(), bot()]); break;
              case 10: segs.push([top(), right()]); segs.push([bot(), left()]); break;
            }
            for (const s of segs) { ctx.moveTo(s[0].x, s[0].y); ctx.lineTo(s[1].x, s[1].y); }
          }
        }
        ctx.stroke();
      }
    }

    // Setas de campo
    if (params.showField) {
      const cols = 18, rows = 12;
      ctx.strokeStyle = "hsla(0, 0%, 95%, 0.55)";
      ctx.fillStyle = "hsla(0, 0%, 95%, 0.55)";
      ctx.lineWidth = 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const px = (i + 0.5) / cols * W;
          const py = (j + 0.5) / rows * H;
          const { Ex, Ey } = fieldAt(charges, fromX(px), fromY(py));
          const mag = Math.hypot(Ex, Ey);
          if (mag < 1) continue;
          const len = Math.min(14, 4 + Math.log10(mag) * 2);
          const ang = Math.atan2(-Ey, Ex);
          arrow(ctx, px - Math.cos(ang) * len / 2, py - Math.sin(ang) * len / 2,
                  px + Math.cos(ang) * len / 2, py + Math.sin(ang) * len / 2, 4);
        }
      }
    }

    // Cargas
    for (const c of charges) {
      drawCharge(ctx, toX(c.x), toY(c.y), c.q >= 0 ? "+" : "−", c.q >= 0 ? "hsl(0 75% 55%)" : "hsl(220 80% 55%)");
    }

    // Ponto de prova
    const px = toX(params.probeXcm * 1e-2);
    const py = toY(params.probeYcm * 1e-2);
    ctx.strokeStyle = css("--primary");
    ctx.fillStyle = css("--primary");
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillStyle = `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim()})`;
    ctx.fillText(`P(${params.probeXcm.toFixed(1)}, ${params.probeYcm.toFixed(1)}) cm`, px + 8, py - 8);
  }, [params, charges]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[460px] block" />
    </div>
  );
};

function drawCharge(ctx: CanvasRenderingContext2D, x: number, y: number, sign: string, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "bold 14px ui-sans-serif, system-ui";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(sign, x, y + 1);
  ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
}

function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, head: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.stroke();
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(ang - 0.4), y2 - head * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - head * Math.cos(ang + 0.4), y2 - head * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
}