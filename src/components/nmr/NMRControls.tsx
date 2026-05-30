import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NMR_NUCLEI, type NMRParams } from "@/lib/physics";

interface Props { params: NMRParams; onChange: (p: NMRParams) => void }

export const NMRControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<NMRParams>) => onChange({ ...params, ...patch });
  const sync = () => {
    const n = NMR_NUCLEI.find((x) => x.name === params.nucleusName) ?? NMR_NUCLEI[0];
    u({ freq_MHz: n.gamma_MHz_per_T * params.B0_T });
  };
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Núcleo, B₀, RF e tempos de relaxação.</p>
      </div>
      <Section title="Núcleo">
        <div className="grid grid-cols-2 gap-1.5">
          {NMR_NUCLEI.map((n) => (
            <Button key={n.name} size="sm" variant={params.nucleusName === n.name ? "default" : "outline"}
              onClick={() => u({ nucleusName: n.name, freq_MHz: n.gamma_MHz_per_T * params.B0_T })}>{n.label}</Button>
          ))}
        </div>
      </Section>
      <Section title="Campo estático B₀">
        <Row label="B₀" value={`${params.B0_T.toFixed(2)} T`}>
          <Slider value={[params.B0_T]} min={0.1} max={11.7} step={0.05}
            onValueChange={([v]) => u({ B0_T: v })} />
        </Row>
        <div className="grid grid-cols-4 gap-1.5">
          {[0.5,1.5,3,7].map((b) => (
            <Button key={b} size="sm" variant="outline" onClick={() => u({ B0_T: b })}>{b} T</Button>
          ))}
        </div>
      </Section>
      <Section title="Frequência RF">
        <Row label="ν" value={`${params.freq_MHz.toFixed(3)} MHz`}>
          <Slider value={[params.freq_MHz]} min={1} max={600} step={0.001}
            onValueChange={([v]) => u({ freq_MHz: v })} />
        </Row>
        <Button size="sm" variant="outline" className="w-full" onClick={sync}>Sintonizar na Larmor</Button>
      </Section>
      <Section title="Relaxação T₁ / T₂">
        <Row label="T₁" value={`${params.T1_ms.toFixed(0)} ms`}>
          <Slider value={[params.T1_ms]} min={10} max={3000} step={5}
            onValueChange={([v]) => u({ T1_ms: v })} />
        </Row>
        <Row label="T₂" value={`${params.T2_ms.toFixed(0)} ms`}>
          <Slider value={[params.T2_ms]} min={1} max={1000} step={1}
            onValueChange={([v]) => u({ T2_ms: v })} />
        </Row>
      </Section>
      <Section title="Tempo após pulso 90°">
        <Row label="t" value={`${params.time_ms.toFixed(0)} ms`}>
          <Slider value={[params.time_ms]} min={0} max={2000} step={1}
            onValueChange={([v]) => u({ time_ms: v })} />
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