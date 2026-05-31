import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { GratingParams } from "@/lib/physics";

interface Props { params: GratingParams; onChange: (p: GratingParams) => void }
const PRESETS = [
  { name: "Rede comum (300 l/mm)", N: 300 },
  { name: "Holográfica (1200 l/mm)", N: 1200 },
  { name: "Alta resolução (2400 l/mm)", N: 2400 },
];
const LAMBDAS = [
  { name: "HeNe 633 nm", l: 632.8 },
  { name: "Verde 532 nm", l: 532 },
  { name: "Azul 405 nm", l: 405 },
  { name: "Hα 656 nm", l: 656.3 },
  { name: "Na D 589 nm", l: 589.0 },
];
export const GratingControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<GratingParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Rede de difração e fonte luminosa.</p>
      </div>
      <Section title="Densidade da rede">
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((p) => (
            <Button key={p.name} size="sm" variant={Math.abs(params.N_per_mm - p.N) < 1 ? "default" : "outline"}
              onClick={() => u({ N_per_mm: p.N })}>{p.name}</Button>
          ))}
        </div>
        <Row label="linhas/mm" value={`${params.N_per_mm.toFixed(0)}`}>
          <Slider value={[params.N_per_mm]} min={50} max={3600} step={10}
            onValueChange={([v]) => u({ N_per_mm: v })} />
        </Row>
      </Section>
      <Section title="Comprimento de onda λ">
        <div className="grid grid-cols-1 gap-1.5">
          {LAMBDAS.map((p) => (
            <Button key={p.name} size="sm" variant={Math.abs(params.lambda_nm - p.l) < 0.5 ? "default" : "outline"}
              onClick={() => u({ lambda_nm: p.l })}>{p.name}</Button>
          ))}
        </div>
        <Row label="λ" value={`${params.lambda_nm.toFixed(1)} nm`}>
          <Slider value={[params.lambda_nm]} min={200} max={1500} step={1}
            onValueChange={([v]) => u({ lambda_nm: v })} />
        </Row>
      </Section>
      <Section title="Fendas iluminadas N">
        <Row label="N" value={`${params.N_total}`}>
          <Slider value={[Math.log10(params.N_total)]} min={1} max={5} step={0.01}
            onValueChange={([v]) => u({ N_total: Math.round(Math.pow(10, v)) })} />
        </Row>
        <p className="text-[11px] text-muted-foreground">Mais fendas ⇒ picos mais estreitos (maior resolução).</p>
      </Section>
      <Section title="Janela angular ±θ">
        <Row label="θ_max" value={`${params.angleMax_deg.toFixed(0)}°`}>
          <Slider value={[params.angleMax_deg]} min={10} max={89} step={1}
            onValueChange={([v]) => u({ angleMax_deg: v })} />
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
