import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RADIO_ISOTOPES, formatDuration, type DecayParams } from "@/lib/physics";

interface Props { params: DecayParams; onChange: (p: DecayParams) => void }

export const DecayControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<DecayParams>) => onChange({ ...params, ...patch });
  const Tlog = Math.log10(params.halfLifeS);
  const tlog = params.timeS > 0 ? Math.log10(params.timeS) : Tlog - 2;

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Amostra e tempo</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Escolha o isótopo e ajuste N₀ e t.</p>
      </div>

      <Section title="Isótopo">
        <div className="grid grid-cols-2 gap-1.5">
          {RADIO_ISOTOPES.map((iso) => (
            <Button key={iso.name} size="sm"
              variant={params.isotopeName === iso.name ? "default" : "outline"}
              onClick={() => u({ isotopeName: iso.name, halfLifeS: iso.halfLifeS, timeS: iso.halfLifeS })}>
              {iso.name}
            </Button>
          ))}
        </div>
        <Row label="Meia-vida T½" value={formatDuration(params.halfLifeS)}>
          <Slider value={[Tlog]} min={-3} max={17} step={0.05}
            onValueChange={([v]) => u({ halfLifeS: Math.pow(10, v) })} />
        </Row>
      </Section>

      <Section title="População inicial">
        <Row label="N₀ (núcleos)" value={params.N0.toLocaleString("pt-BR")}>
          <Slider value={[Math.log10(params.N0)]} min={2} max={9} step={0.05}
            onValueChange={([v]) => u({ N0: Math.round(Math.pow(10, v)) })} />
        </Row>
      </Section>

      <Section title="Instante de observação t">
        <Row label="t" value={formatDuration(params.timeS)}>
          <Slider value={[tlog]} min={Tlog - 3} max={Tlog + 2} step={0.02}
            onValueChange={([v]) => u({ timeS: Math.pow(10, v) })} />
        </Row>
        <div className="grid grid-cols-4 gap-1.5">
          {[0.5, 1, 2, 5].map((k) => (
            <Button key={k} size="sm" variant="outline" onClick={() => u({ timeS: k * params.halfLifeS })}>
              {k} T½
            </Button>
          ))}
        </div>
        <Row label="Janela do gráfico" value={`${params.tMaxMultiplier.toFixed(1)} × T½`}>
          <Slider value={[params.tMaxMultiplier]} min={1} max={10} step={0.5}
            onValueChange={([v]) => u({ tMaxMultiplier: v })} />
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