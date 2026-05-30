import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FH_GASES, type FranckHertzParams } from "@/lib/physics";

interface Props { params: FranckHertzParams; onChange: (p: FranckHertzParams) => void }

export const FranckHertzControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<FranckHertzParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Gás, tensões e temperatura do tubo.</p>
      </div>
      <Section title="Gás no tubo">
        <div className="grid grid-cols-1 gap-1.5">
          {FH_GASES.map((g) => (
            <Button key={g.name} size="sm" variant={params.gasName === g.name ? "default" : "outline"}
              onClick={() => u({ gasName: g.name, excitation_eV: g.excitation_eV })}>
              {g.name} · {g.excitation_eV} eV
            </Button>
          ))}
        </div>
      </Section>
      <Section title="Energia de excitação">
        <Row label="E_exc" value={`${params.excitation_eV.toFixed(2)} eV`}>
          <Slider value={[params.excitation_eV]} min={1} max={25} step={0.1}
            onValueChange={([v]) => u({ excitation_eV: v })} />
        </Row>
      </Section>
      <Section title="Tensão de aceleração (máx.)">
        <Row label="V_max" value={`${params.V_acc_max.toFixed(1)} V`}>
          <Slider value={[params.V_acc_max]} min={10} max={80} step={0.5}
            onValueChange={([v]) => u({ V_acc_max: v })} />
        </Row>
      </Section>
      <Section title="Potencial retardador">
        <Row label="V_r" value={`${params.V_retard.toFixed(2)} V`}>
          <Slider value={[params.V_retard]} min={0} max={5} step={0.05}
            onValueChange={([v]) => u({ V_retard: v })} />
        </Row>
      </Section>
      <Section title="Temperatura do tubo">
        <Row label="T" value={`${params.T_C.toFixed(0)} °C`}>
          <Slider value={[params.T_C]} min={20} max={250} step={1}
            onValueChange={([v]) => u({ T_C: v })} />
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