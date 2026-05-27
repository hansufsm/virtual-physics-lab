import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { RelativityParams, RelativityScenario } from "@/lib/physics";

interface Props { params: RelativityParams; onChange: (p: RelativityParams) => void }

const SCENARIOS: { id: RelativityScenario; label: string }[] = [
  { id: "dilation", label: "Dilatação do tempo" },
  { id: "contraction", label: "Contração de Lorentz" },
  { id: "addition", label: "Soma de velocidades" },
  { id: "twin", label: "Gêmeos" },
];

export const RelativityControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<RelativityParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Escolha o cenário e ajuste β = v/c.</p>
      </div>

      <Section title="Cenário">
        <div className="grid grid-cols-2 gap-1.5">
          {SCENARIOS.map((s) => (
            <Button key={s.id} size="sm" variant={params.scenario === s.id ? "default" : "outline"}
              onClick={() => u({ scenario: s.id })}>{s.label}</Button>
          ))}
        </div>
      </Section>

      <Section title="Velocidade do referencial">
        <Row label="β = v/c" value={params.beta.toFixed(4)}>
          <Slider value={[params.beta]} min={0} max={0.999} step={0.001}
            onValueChange={([v]) => u({ beta: v })} />
        </Row>
        <div className="grid grid-cols-4 gap-1.5">
          {[0.1, 0.5, 0.9, 0.99].map((b) => (
            <Button key={b} size="sm" variant="outline" onClick={() => u({ beta: b })}>β={b}</Button>
          ))}
        </div>
      </Section>

      {params.scenario === "dilation" && (
        <Section title="Intervalo próprio Δt₀">
          <Row label="Δt₀" value={`${params.dt0_s.toFixed(3)} s`}>
            <Slider value={[params.dt0_s]} min={0.001} max={10} step={0.001}
              onValueChange={([v]) => u({ dt0_s: v })} />
          </Row>
        </Section>
      )}

      {params.scenario === "contraction" && (
        <Section title="Comprimento próprio L₀">
          <Row label="L₀" value={`${params.L0_m.toFixed(2)} m`}>
            <Slider value={[params.L0_m]} min={1} max={300} step={1}
              onValueChange={([v]) => u({ L0_m: v })} />
          </Row>
        </Section>
      )}

      {params.scenario === "addition" && (
        <Section title="Velocidade no referencial S′">
          <Row label="u/c" value={params.u_over_c.toFixed(3)}>
            <Slider value={[params.u_over_c]} min={-0.999} max={0.999} step={0.001}
              onValueChange={([v]) => u({ u_over_c: v })} />
          </Row>
        </Section>
      )}

      {params.scenario === "twin" && (
        <Section title="Distância de ida (anos-luz)">
          <Row label="D" value={`${params.travelDistanceLy.toFixed(2)} ly`}>
            <Slider value={[params.travelDistanceLy]} min={0.1} max={100} step={0.1}
              onValueChange={([v]) => u({ travelDistanceLy: v })} />
          </Row>
          <div className="grid grid-cols-2 gap-1.5">
            <Button size="sm" variant="outline" onClick={() => u({ travelDistanceLy: 4.37 })}>Proxima 4.37</Button>
            <Button size="sm" variant="outline" onClick={() => u({ travelDistanceLy: 25.04 })}>Vega 25 ly</Button>
          </div>
        </Section>
      )}
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