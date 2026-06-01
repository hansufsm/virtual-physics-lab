import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { SpringParams, SpringAssoc } from "@/lib/physics";

interface Props { params: SpringParams; onChange: (p: SpringParams) => void }
export const SpringControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<SpringParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Mola, massa e MHS.</p>
      </div>
      <Section title="Associação de molas">
        <div className="grid grid-cols-3 gap-1.5">
          {(["single","series","parallel"] as SpringAssoc[]).map((a) => (
            <Button key={a} size="sm" variant={params.assoc === a ? "default" : "outline"} onClick={() => u({ assoc: a })}>
              {a === "single" ? "Única" : a === "series" ? "Série" : "Paralelo"}
            </Button>
          ))}
        </div>
      </Section>
      <Section title="Constante k₁">
        <Row label="k₁" value={`${params.k_N_per_m.toFixed(1)} N/m`}>
          <Slider value={[params.k_N_per_m]} min={1} max={500} step={1} onValueChange={([v]) => u({ k_N_per_m: v })} />
        </Row>
      </Section>
      {params.assoc !== "single" && (
        <Section title="Constante k₂">
          <Row label="k₂" value={`${params.k2_N_per_m.toFixed(1)} N/m`}>
            <Slider value={[params.k2_N_per_m]} min={1} max={500} step={1} onValueChange={([v]) => u({ k2_N_per_m: v })} />
          </Row>
        </Section>
      )}
      <Section title="Massa">
        <Row label="m" value={`${params.mass_kg.toFixed(3)} kg`}>
          <Slider value={[params.mass_kg]} min={0.01} max={10} step={0.01} onValueChange={([v]) => u({ mass_kg: v })} />
        </Row>
      </Section>
      <Section title="Amplitude A">
        <Row label="A" value={`${(params.amplitude_m*100).toFixed(2)} cm`}>
          <Slider value={[params.amplitude_m]} min={0.005} max={0.30} step={0.005} onValueChange={([v]) => u({ amplitude_m: v })} />
        </Row>
      </Section>
      <Section title="Tempo t">
        <Row label="t" value={`${params.time_s.toFixed(2)} s`}>
          <Slider value={[params.time_s]} min={0} max={5} step={0.01} onValueChange={([v]) => u({ time_s: v })} />
        </Row>
      </Section>
      <Section title="Gravidade">
        <Row label="g" value={`${params.g.toFixed(2)} m/s²`}>
          <Slider value={[params.g]} min={0} max={25} step={0.01} onValueChange={([v]) => u({ g: v })} />
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