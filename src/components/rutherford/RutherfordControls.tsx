import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { RutherfordParams } from "@/lib/physics";

interface Props { params: RutherfordParams; onChange: (p: RutherfordParams) => void }

const TARGETS = [
  { name: "Ouro (Au)", Z: 79 }, { name: "Prata (Ag)", Z: 47 },
  { name: "Cobre (Cu)", Z: 29 }, { name: "Alumínio (Al)", Z: 13 },
  { name: "Carbono (C)", Z: 6 },
];
const PROJ = [
  { name: "α (²He)", z: 2 }, { name: "Próton (¹H)", z: 1 }, { name: "²C⁶⁺", z: 6 },
];

export const RutherfordControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<RutherfordParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Energia, projétil, alvo e parâmetro de impacto b.</p>
      </div>
      <Section title="Projétil">
        <div className="grid grid-cols-3 gap-1.5">
          {PROJ.map((p) => (
            <Button key={p.name} size="sm" variant={params.z_projectile === p.z ? "default" : "outline"}
              onClick={() => u({ z_projectile: p.z })}>{p.name}</Button>
          ))}
        </div>
      </Section>
      <Section title="Alvo (núcleo)">
        <div className="grid grid-cols-1 gap-1.5">
          {TARGETS.map((t) => (
            <Button key={t.name} size="sm" variant={params.Z_target === t.Z ? "default" : "outline"}
              onClick={() => u({ Z_target: t.Z })}>{t.name} · Z={t.Z}</Button>
          ))}
        </div>
      </Section>
      <Section title="Energia cinética">
        <Row label="E" value={`${params.energy_MeV.toFixed(2)} MeV`}>
          <Slider value={[params.energy_MeV]} min={0.1} max={50} step={0.05}
            onValueChange={([v]) => u({ energy_MeV: v })} />
        </Row>
        <div className="grid grid-cols-3 gap-1.5">
          {[5, 10, 25].map((e) => (
            <Button key={e} size="sm" variant="outline" onClick={() => u({ energy_MeV: e })}>{e} MeV</Button>
          ))}
        </div>
      </Section>
      <Section title="Parâmetro de impacto b">
        <Row label="b" value={`${params.impactParameter_fm.toFixed(2)} fm`}>
          <Slider value={[params.impactParameter_fm]} min={0.1} max={200} step={0.1}
            onValueChange={([v]) => u({ impactParameter_fm: v })} />
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