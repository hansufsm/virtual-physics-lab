import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ZEEMAN_PRESETS, type ZeemanParams } from "@/lib/physics";

interface Props { params: ZeemanParams; onChange: (p: ZeemanParams) => void }

export const ZeemanControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<ZeemanParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Selecione a transição, o campo B e a direção de observação.</p>
      </div>

      <Section title="Transição atômica">
        <div className="grid grid-cols-1 gap-1.5">
          {ZEEMAN_PRESETS.map((s, i) => (
            <Button key={s.name} size="sm" variant={params.presetIndex === i ? "default" : "outline"}
              onClick={() => u({ presetIndex: i })}>{s.name}</Button>
          ))}
        </div>
      </Section>

      <Section title="Campo magnético B">
        <Row label="B" value={`${params.B_T.toFixed(3)} T`}>
          <Slider value={[params.B_T]} min={0} max={10} step={0.01}
            onValueChange={([v]) => u({ B_T: v })} />
        </Row>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 0.5, 2, 5].map((b) => (
            <Button key={b} size="sm" variant="outline" onClick={() => u({ B_T: b })}>{b} T</Button>
          ))}
        </div>
      </Section>

      <Section title="Direção de observação">
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant={params.observation === "transverse" ? "default" : "outline"}
            onClick={() => u({ observation: "transverse" })}>Transversal (⊥ B)</Button>
          <Button size="sm" variant={params.observation === "longitudinal" ? "default" : "outline"}
            onClick={() => u({ observation: "longitudinal" })}>Longitudinal (∥ B)</Button>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Transversal: π (linear ∥ B) + σ (linear ⊥ B). Longitudinal: apenas σ⁺/σ⁻ (circulares).
        </p>
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