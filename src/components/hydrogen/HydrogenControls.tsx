import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { H_SERIES, type HydrogenParams } from "@/lib/physics";

interface Props { params: HydrogenParams; onChange: (p: HydrogenParams) => void }
export const HydrogenControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<HydrogenParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Série espectral e nível superior máximo.</p>
      </div>
      <Section title="Série espectral">
        <div className="grid grid-cols-1 gap-1.5">
          {H_SERIES.map((s, i) => (
            <Button key={s.name} size="sm" variant={params.seriesIndex === i ? "default" : "outline"}
              onClick={() => u({ seriesIndex: i })}>
              <span className="flex-1 text-left">{s.name}</span>
              <span className="text-[10px] text-muted-foreground ml-2">n={s.n_low} · {s.region}</span>
            </Button>
          ))}
        </div>
      </Section>
      <Section title="n máximo (transições)">
        <Row label="n_max" value={`${params.nMax}`}>
          <Slider value={[params.nMax]} min={3} max={20} step={1}
            onValueChange={([v]) => u({ nMax: v })} />
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
