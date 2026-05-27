import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ComptonParams } from "@/lib/physics";

interface Props { params: ComptonParams; onChange: (p: ComptonParams) => void }

const SOURCES: { name: string; E: number }[] = [
  { name: "Cs-137 (662 keV)", E: 661.7 },
  { name: "Co-60 (1173 keV)", E: 1173 },
  { name: "Am-241 (59.5 keV)", E: 59.5 },
  { name: "Mo Kα (17.5 keV)", E: 17.5 },
  { name: "Aniquilação (511 keV)", E: 511 },
];

export const ComptonControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<ComptonParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Selecione a fonte, energia E₀ e o ângulo de espalhamento θ.</p>
      </div>

      <Section title="Fonte / energia incidente">
        <div className="grid grid-cols-1 gap-1.5">
          {SOURCES.map((s) => (
            <Button key={s.name} size="sm"
              variant={Math.abs(params.E0_keV - s.E) < 0.5 ? "default" : "outline"}
              onClick={() => u({ E0_keV: s.E })}>{s.name}</Button>
          ))}
        </div>
        <Row label="E₀" value={`${params.E0_keV.toFixed(1)} keV`}>
          <Slider value={[params.E0_keV]} min={1} max={2000} step={0.1}
            onValueChange={([v]) => u({ E0_keV: v })} />
        </Row>
      </Section>

      <Section title="Ângulo de espalhamento">
        <Row label="θ" value={`${params.thetaDeg.toFixed(1)}°`}>
          <Slider value={[params.thetaDeg]} min={0} max={180} step={0.5}
            onValueChange={([v]) => u({ thetaDeg: v })} />
        </Row>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 45, 90, 180].map((a) => (
            <Button key={a} size="sm" variant="outline" onClick={() => u({ thetaDeg: a })}>{a}°</Button>
          ))}
        </div>
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