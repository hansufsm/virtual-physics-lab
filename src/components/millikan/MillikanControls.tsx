import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MillikanParams } from "@/lib/physics";

interface Props { params: MillikanParams; onChange: (p: MillikanParams) => void }

export const MillikanControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<MillikanParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Geometria da gota, cargas e tensão entre placas.</p>
      </div>
      <Section title="Raio da gota">
        <Row label="r" value={`${params.radius_um.toFixed(2)} μm`}>
          <Slider value={[params.radius_um]} min={0.2} max={3} step={0.01}
            onValueChange={([v]) => u({ radius_um: v })} />
        </Row>
      </Section>
      <Section title="Cargas elementares">
        <Row label="n" value={`${params.charges_n} e`}>
          <Slider value={[params.charges_n]} min={1} max={8} step={1}
            onValueChange={([v]) => u({ charges_n: v })} />
        </Row>
        <div className="grid grid-cols-4 gap-1.5">
          {[1,2,3,5].map((n) => (
            <Button key={n} size="sm" variant={params.charges_n === n ? "default" : "outline"}
              onClick={() => u({ charges_n: n })}>{n}e</Button>
          ))}
        </div>
      </Section>
      <Section title="Tensão entre placas">
        <Row label="V" value={`${params.voltage_V.toFixed(0)} V`}>
          <Slider value={[params.voltage_V]} min={0} max={2000} step={5}
            onValueChange={([v]) => u({ voltage_V: v })} />
        </Row>
      </Section>
      <Section title="Distância entre placas">
        <Row label="d" value={`${params.plateGap_mm.toFixed(2)} mm`}>
          <Slider value={[params.plateGap_mm]} min={1} max={20} step={0.1}
            onValueChange={([v]) => u({ plateGap_mm: v })} />
        </Row>
      </Section>
      <Section title="Densidade do óleo">
        <Row label="ρ_oil" value={`${params.rho_oil.toFixed(0)} kg/m³`}>
          <Slider value={[params.rho_oil]} min={700} max={1100} step={5}
            onValueChange={([v]) => u({ rho_oil: v })} />
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