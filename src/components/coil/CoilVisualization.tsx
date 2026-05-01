import { useEffect, useRef } from "react";
import { MU_0, bAxisLoop, type CoilParams } from "@/lib/physics";

interface Props {
  params: CoilParams;
}

/** Componentes (Br, Bz) de uma única espira no plano (r, z). Forma elíptica completa,
 *  porém aproximada por integração numérica para evitar dependências externas. */
function loopField(R: number, I: number, r: number, z: number): [number, number] {
  // Integração ao longo do anel: dB = µ0 I / (4π) · dl × r̂ / r²
  const N = 64;
  let Br = 0, Bz = 0;
  for (let k = 0; k < N; k++) {
    const phi = (2 * Math.PI * k) / N;
    const dphi = (2 * Math.PI) / N;
    const xs = R * Math.cos(phi);
    const ys = R * Math.sin(phi);
    // ponto de campo em (r, 0, z)
    const dx = r - xs;
    const dy = -ys;
    const dz = z;
    const dist2 = dx * dx + dy * dy + dz * dz;
    const dist = Math.sqrt(dist2);
    if (dist < 1e-6) continue;
    // dl = R dphi · (-sin phi, cos phi, 0)
    const dlx = -R * Math.sin(phi) * dphi;
    const dly = R * Math.cos(phi) * dphi;
    // dl × r
    const cx = dly * dz - 0 * dy;
    const cy = 0 * dx - dlx * dz;
    const cz = dlx * dy - dly * dx;
    const f = (MU_0 * I) / (4 * Math.PI * dist2 * dist);
    // Em r > 0 só temos componente radial (cx, cy projetado em r̂=(1,0,0))
    Br += f * cx;
    Bz += f * cz;
  }
  return [Br, Bz];
}

function totalField(params: CoilParams, r: number, z: number): [number, number] {
  const R = Math.max(1e-4, params.radiusCm * 1e-2);
  const L = Math.max(1e-4, params.lengthCm * 1e-2);
  if (params.type === "single") {
    const [Br, Bz] = loopField(R, params.current, r, z);
    return [params.turns * Br, params.turns * Bz];
  }
  if (params.type === "helmholtz") {
    const d = R;
    const [b1r, b1z] = loopField(R, params.current, r, z - d / 2);
    const [b2r, b2z] = loopField(R, params.current, r, z + d / 2);
    return [params.turns * (b1r + b2r), params.turns * (b1z + b2z)];
  }
  // solenoide: discretizar em K espiras ao longo de L
  const K = Math.min(40, Math.max(4, Math.round(params.turns / 5)));
  const Iper = (params.turns * params.current) / K;
  let Br = 0, Bz = 0;
  for (let k = 0; k < K; k++) {
    const zk = -L / 2 + (L * (k + 0.5)) / K;
    const [br, bz] = loopField(R, Iper, r, z - zk);
    Br += br; Bz += bz;
  }
  return [Br, Bz];
}

export const CoilVisualization = ({ params }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fundo
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--card").trim();
    ctx.fillStyle = `hsl(${bg})`;
    ctx.fillRect(0, 0, W, H);

    // Mundo: r ∈ [-extent, extent], z ∈ [-extent, extent]
    const R = params.radiusCm * 1e-2;
    const L = params.type === "solenoid" ? params.lengthCm * 1e-2 : R * 2;
    const extent = Math.max(R * 2.5, L * 0.7, 0.05);
    const scale = Math.min(W, H) / (2 * extent);
    const cx = W / 2;
    const cy = H / 2;
    const toPx = (zr: number, rr: number): [number, number] => [cx + zr * scale, cy - rr * scale];

    // Eixo
    const muted = getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim();
    ctx.strokeStyle = `hsl(${muted} / 0.3)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(W, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, H);
    ctx.stroke();

    // Grid de campo: vetores
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

    const grid = 14;
    const samples: { z: number; r: number; bz: number; br: number; mag: number }[] = [];
    let maxMag = 0;
    for (let i = 0; i < grid; i++) {
      for (let j = 0; j < grid; j++) {
        const z = -extent + ((i + 0.5) / grid) * 2 * extent;
        const r = -extent + ((j + 0.5) / grid) * 2 * extent;
        const [Br, Bz] = totalField(params, Math.abs(r), z);
        const Brsigned = r >= 0 ? Br : -Br;
        const mag = Math.sqrt(Bz * Bz + Brsigned * Brsigned);
        if (mag > maxMag) maxMag = mag;
        samples.push({ z, r, bz: Bz, br: Brsigned, mag });
      }
    }

    if (maxMag > 0) {
      const arrowLen = (Math.min(W, H) / grid) * 0.45;
      for (const s of samples) {
        const [px, py] = toPx(s.z, s.r);
        const norm = Math.min(1, Math.log10(1 + 9 * s.mag / maxMag));
        if (norm < 0.05) continue;
        const len = arrowLen * norm;
        const ang = Math.atan2(-s.br, s.bz); // -br porque y do canvas inverte
        const x2 = px + len * Math.cos(ang);
        const y2 = py + len * Math.sin(ang);
        ctx.strokeStyle = `hsl(${accent} / ${0.25 + 0.65 * norm})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(px, py); ctx.lineTo(x2, y2);
        ctx.stroke();
        // ponta
        const ah = 3;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - ah * Math.cos(ang - 0.5), y2 - ah * Math.sin(ang - 0.5));
        ctx.lineTo(x2 - ah * Math.cos(ang + 0.5), y2 - ah * Math.sin(ang + 0.5));
        ctx.closePath();
        ctx.fillStyle = `hsl(${accent} / ${0.4 + 0.6 * norm})`;
        ctx.fill();
      }
    }

    // Desenho da bobina
    ctx.strokeStyle = `hsl(${primary})`;
    ctx.fillStyle = `hsl(${primary} / 0.85)`;
    ctx.lineWidth = 2;
    const drawLoop = (zPos: number) => {
      const [px1, py1] = toPx(zPos, R);
      const [px2, py2] = toPx(zPos, -R);
      ctx.beginPath();
      ctx.arc(px1, py1, 4, 0, Math.PI * 2);
      ctx.arc(px2, py2, 4, 0, Math.PI * 2);
      ctx.fill();
      // símbolo de corrente: ⊙ (saindo) topo se I>0, ⊗ (entrando) embaixo
      ctx.strokeStyle = `hsl(${primary})`;
      const sym = (px: number, py: number, out: boolean) => {
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.stroke();
        if (out) {
          ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(px - 4, py - 4); ctx.lineTo(px + 4, py + 4);
          ctx.moveTo(px + 4, py - 4); ctx.lineTo(px - 4, py + 4);
          ctx.stroke();
        }
      };
      const out = params.current >= 0;
      sym(px1, py1, out);
      sym(px2, py2, !out);
    };

    if (params.type === "single") {
      drawLoop(0);
    } else if (params.type === "helmholtz") {
      drawLoop(-R / 2);
      drawLoop(R / 2);
    } else {
      // Solenoide: caixa retangular com várias espiras estilizadas
      const [pxA, pyA] = toPx(-L / 2, R);
      const [pxB, pyB] = toPx(L / 2, -R);
      ctx.strokeStyle = `hsl(${primary} / 0.5)`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pxA, pyA, pxB - pxA, pyB - pyA);
      const K = Math.min(20, Math.max(4, Math.round(params.turns / 10)));
      for (let k = 0; k < K; k++) {
        const zk = -L / 2 + (L * (k + 0.5)) / K;
        drawLoop(zk);
      }
    }

    // Legendas
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
    ctx.fillStyle = `hsl(${fg} / 0.7)`;
    ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("z", W - 14, cy - 6);
    ctx.fillText("r", cx + 6, 12);
    ctx.fillText(`|B|max ≈ ${(maxMag * 1e3).toFixed(2)} mT`, 10, H - 10);
  }, [params]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[420px] block" />
    </div>
  );
};

// keep import used
void bAxisLoop;