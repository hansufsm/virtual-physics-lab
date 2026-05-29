import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DAVISSON_PRESETS, type DavissonParams } from "@/lib/physics";

interface Props { params: DavissonParams; onChange: (p: DavissonParams) => void }

export const DavissonControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<DavissonParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Cristal alvo, tensão de aceleração e ordens visíveis.</p>
      </div>

      <Section title="Cristal alvo">
        <div className="grid grid-cols-1 gap-1.5">
          {DAVISSON_PRESETS.map((s, i) => (
            <Button key={s.name} size="sm" variant={params.presetIndex === i ? "default" : "outline"}
              onClick={() => u({ presetIndex: i })}>{s.name} · d = {s.d_nm.toFixed(3)} nm</Button>
          ))}
        </div>
      </Section>

      <Section title="Tensão de aceleração V">
        <Row label="V" value={`${params.voltage_V.toFixed(1)} V`}>
          <Slider value={[params.voltage_V]} min={5} max={500} step={0.5}
            onValueChange={([v]) => u({ voltage_V: v })} />
        </Row>
        <div className="grid grid-cols-4 gap-1.5">
          {[20, 54, 100, 250].map((v) => (
            <Button key={v} size="sm" variant="outline" onClick={() => u({ voltage_V: v })}>{v} V</Button>
          ))}
        </div>
      </Section>

      <Section title="Ordens consideradas">
        <Row label="n_max" value={`${params.maxOrder}`}>
          <Slider value={[params.maxOrder]} min={1} max={6} step={1}
            onValueChange={([v]) => u({ maxOrder: v })} />
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