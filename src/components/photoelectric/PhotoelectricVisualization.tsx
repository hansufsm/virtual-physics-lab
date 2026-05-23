import { useEffect, useRef } from "react";
import { wavelengthToRgb, PHOTO_MATERIALS, type PhotoelectricParams, type PhotoelectricResults } from "@/lib/physics";

interface Props { params: PhotoelectricParams; results: PhotoelectricResults }

interface Photon { x: number; y: number; vx: number }
interface Electron { x: number; y: number; vx: number; vy: number; alive: boolean }

export const PhotoelectricVisualization = ({ params, results }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photonsRef = useRef<Photon[]>([]);
  const electronsRef = useRef<Electron[]>([]);
  const lastRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

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

    const material = PHOTO_MATERIALS.find((m) => m.name === params.materialName);
    const matColor = material?.color ?? "hsl(0,0%,75%)";
    const photonColor = wavelengthToRgb(params.wavelengthNm);

    // Layout
    const cathodeX = 110;
    const anodeX = W - 110;
    const top = 60, bot = H - 60;

    const draw = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;

      // bg
      ctx.fillStyle = css("--card");
      ctx.fillRect(0, 0, W, H);

      // cátodo (placa esquerda)
      ctx.fillStyle = matColor;
      ctx.fillRect(cathodeX - 12, top, 12, bot - top);
      ctx.strokeStyle = css("--foreground");
      ctx.lineWidth = 1;
      ctx.strokeRect(cathodeX - 12, top, 12, bot - top);
      // ânodo (placa direita)
      ctx.fillStyle = "hsl(0,0%,60%)";
      ctx.fillRect(anodeX, top, 12, bot - top);
      ctx.strokeRect(anodeX, top, 12, bot - top);

      // labels
      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText(`Cátodo (${params.materialName})`, cathodeX - 60, top - 10);
      ctx.fillText("Ânodo", anodeX - 5, top - 10);
      ctx.fillText(`V = ${params.voltage.toFixed(2)} V`, (cathodeX + anodeX) / 2 - 30, top - 10);

      // fonte de luz à esquerda
      ctx.strokeStyle = photonColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(40, H / 2, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = photonColor;
      ctx.globalAlpha = 0.25;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Emit fótons proporcional à intensidade
      const photonRate = Math.min(200, 8 + params.intensity * 2);
      const nNew = Math.floor(photonRate * dt + Math.random());
      for (let i = 0; i < nNew; i++) {
        photonsRef.current.push({
          x: 60,
          y: top + 20 + Math.random() * (bot - top - 40),
          vx: 220,
        });
      }

      // update fótons
      const newPhotons: Photon[] = [];
      for (const p of photonsRef.current) {
        p.x += p.vx * dt;
        if (p.x >= cathodeX - 12) {
          // colidiu com cátodo: possivelmente ejeta elétron
          if (results.emits && Math.random() < params.quantumEfficiency * 50) {
            // velocidade visual proporcional a v_max (limitada)
            const vScale = Math.min(280, 80 + results.vMaxMs / 4e3);
            // direção: para a direita, leve dispersão
            const ang = (Math.random() - 0.5) * 0.8;
            electronsRef.current.push({
              x: cathodeX, y: p.y,
              vx: vScale * Math.cos(ang),
              vy: vScale * Math.sin(ang),
              alive: true,
            });
          }
          continue;
        }
        newPhotons.push(p);
      }
      photonsRef.current = newPhotons.slice(-300);

      // update elétrons; aceleração depende de V (sinal)
      // Campo entre placas (modelo qualitativo): a_x ∝ V (>0 acelera para direita)
      const aField = params.voltage * 150; // px/s²/V
      const survivors: Electron[] = [];
      for (const e of electronsRef.current) {
        e.vx += aField * dt;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        // Se elétron é freado e perde toda velocidade horizontal: vira (retorna ao cátodo)
        if (e.x >= anodeX) continue; // coletado
        if (e.x <= cathodeX - 2) continue; // reabsorvido pelo cátodo
        if (e.y < top + 4 || e.y > bot - 4) continue;
        survivors.push(e);
      }
      electronsRef.current = survivors.slice(-400);

      // desenha fótons (linhas tracejadas curtas)
      ctx.strokeStyle = photonColor;
      ctx.lineWidth = 1.5;
      for (const p of photonsRef.current) {
        ctx.beginPath();
        ctx.moveTo(p.x - 6, p.y);
        ctx.lineTo(p.x + 6, p.y);
        ctx.stroke();
      }

      // desenha elétrons
      ctx.fillStyle = "hsl(200, 90%, 65%)";
      for (const e of electronsRef.current) {
        ctx.beginPath();
        ctx.arc(e.x, e.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // diagrama de energia (canto inferior)
      const dx = 20, dy = H - 36, dw = 220;
      ctx.fillStyle = css("--muted-foreground");
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(`E_fóton = ${results.photonEnergyEv.toFixed(2)} eV`, dx, dy - 8);
      // barras
      const maxE = Math.max(results.photonEnergyEv, params.phiEv) * 1.1;
      const bar = (label: string, val: number, color: string, idx: number) => {
        const x = dx + idx * 80;
        const h = 22;
        ctx.fillStyle = "hsl(0,0%,30%)"; ctx.fillRect(x, dy, 60, h);
        ctx.fillStyle = color;
        ctx.fillRect(x, dy, 60 * (val / maxE), h);
        ctx.fillStyle = css("--foreground");
        ctx.fillText(label, x, dy + h + 11);
      };
      bar(`hf=${results.photonEnergyEv.toFixed(2)}`, results.photonEnergyEv, photonColor, 0);
      bar(`φ=${params.phiEv.toFixed(2)}`, params.phiEv, "hsl(20,80%,55%)", 1);
      bar(`K=${results.kMaxEv.toFixed(2)}`, Math.max(0, results.kMaxEv), "hsl(200,80%,55%)", 2);

      // status
      ctx.fillStyle = results.emits ? "hsl(140, 70%, 55%)" : "hsl(0, 70%, 60%)";
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText(results.emits ? "Emissão ativa" : "Abaixo do limiar (f < f₀)", W - 200, H - 14);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, [params, results]);

  // limpa elétrons/fótons quando o setup muda drasticamente
  useEffect(() => {
    photonsRef.current = [];
    electronsRef.current = [];
  }, [params.materialName, params.wavelengthNm]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-[460px] block" />
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-t border-border bg-gradient-subtle">
        <span className="text-[11px] text-muted-foreground">
          Fótons (linhas coloridas) incidem no cátodo; elétrons (pontos azuis) são acelerados/freados pelo campo entre placas.
        </span>
        <span className="text-[11px] text-muted-foreground font-mono">V_s = {results.stoppingVoltage.toFixed(3)} V</span>
      </div>
    </div>
  );
};