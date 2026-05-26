import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MichelsonParams } from "@/lib/physics";

interface Props { params: MichelsonParams; onChange: (p: MichelsonParams) => void }

const PRESETS: { name: string; lambda: number }[] = [
  { name: "HeNe 632.8 nm", lambda: 632.8 },
  { name: "Verde 532 nm",  lambda: 532 },
  { name: "Azul 450 nm",   lambda: 450 },
  { name: "Vermelho 700",  lambda: 700 },
];

export const MichelsonControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<MichelsonParams>) => onChange({ ...params, ...patch });

  // L2 ajustável em torno de L1 com resolução nanométrica (em mm)
  const dL_um = (params.L2mm - params.L1mm) * 1000; // diferença em μm

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração óptica</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Escolha modo de franja, λ e a posição do espelho móvel.</p>
      </div>

      <Section title="Modo de franjas">
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant={params.mode === "circular" ? "default" : "outline"} onClick={() => u({ mode: "circular" })}>Circulares</Button>
          <Button size="sm" variant={params.mode === "linear" ? "default" : "outline"} onClick={() => u({ mode: "linear" })}>Retilíneas</Button>
        </div>
      </Section>

      <Section title="Comprimento de onda">
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((p) => (
            <Button key={p.name} size="sm" variant={Math.abs(params.wavelengthNm - p.lambda) < 0.5 ? "default" : "outline"}
              onClick={() => u({ wavelengthNm: p.lambda })}>{p.name}</Button>
          ))}
        </div>
        <Row label="λ" value={`${params.wavelengthNm.toFixed(1)} nm`}>
          <Slider value={[params.wavelengthNm]} min={380} max={780} step={0.1}
            onValueChange={([v]) => u({ wavelengthNm: v })} />
        </Row>
      </Section>

      <Section title="Braços do interferômetro">
        <Row label="L₁ (fixo)" value={`${params.L1mm.toFixed(3)} mm`}>
          <Slider value={[params.L1mm]} min={50} max={150} step={0.001}
            onValueChange={([v]) => u({ L1mm: v })} />
        </Row>
        <Row label="L₂ − L₁" value={`${dL_um.toFixed(3)} μm`}>
          <Slider value={[dL_um]} min={-5} max={5} step={0.001}
            onValueChange={([v]) => u({ L2mm: params.L1mm + v / 1000 })} />
        </Row>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" className="flex-1"
            onClick={() => u({ L2mm: params.L2mm - params.wavelengthNm * 1e-9 * 1e3 / 2 })}>−λ/2</Button>
          <Button size="sm" variant="outline" className="flex-1"
            onClick={() => u({ L2mm: params.L1mm })}>L₂ = L₁</Button>
          <Button size="sm" variant="outline" className="flex-1"
            onClick={() => u({ L2mm: params.L2mm + params.wavelengthNm * 1e-9 * 1e3 / 2 })}>+λ/2</Button>
        </div>
      </Section>

      {params.mode === "linear" && (
        <Section title="Inclinação do espelho">
          <Row label="Tilt" value={`${params.tiltMrad.toFixed(3)} mrad`}>
            <Slider value={[params.tiltMrad]} min={0.05} max={5} step={0.01}
              onValueChange={([v]) => u({ tiltMrad: v })} />
          </Row>
        </Section>
      )}

      <Section title="Feixe e contraste">
        <Row label="Abertura" value={`${params.apertureMm.toFixed(1)} mm`}>
          <Slider value={[params.apertureMm]} min={2} max={params.screenSizeMm} step={0.1}
            onValueChange={([v]) => u({ apertureMm: v })} />
        </Row>
        <Row label="Visibilidade V" value={params.visibility.toFixed(2)}>
          <Slider value={[params.visibility]} min={0} max={1} step={0.01}
            onValueChange={([v]) => u({ visibility: v })} />
        </Row>
      </Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3 pb-3 border-b border-border last:border-0">
    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
    {children}
  </div>
);
const Row = ({ label, value, children }: { label: string; value: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <span className="font-mono text-xs text-primary tabular-nums">{value}</span>
    </div>
    {children}
  </div>
);