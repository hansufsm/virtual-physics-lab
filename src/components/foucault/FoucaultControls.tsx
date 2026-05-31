import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FoucaultParams } from "@/lib/physics";

interface Props { params: FoucaultParams; onChange: (p: FoucaultParams) => void }
const CITIES = [
  { name: "Equador (0°)", lat: 0 },
  { name: "São Paulo (−23.5°)", lat: -23.5 },
  { name: "Paris (48.85°)", lat: 48.85 },
  { name: "Panthéon original (48.85°)", lat: 48.85 },
  { name: "Polo Norte (90°)", lat: 90 },
];
export const FoucaultControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<FoucaultParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Pêndulo e localização geográfica.</p>
      </div>
      <Section title="Localização">
        <div className="grid grid-cols-1 gap-1.5">
          {CITIES.map((c) => (
            <Button key={c.name} size="sm" variant={Math.abs(params.latitude_deg - c.lat) < 0.5 ? "default" : "outline"}
              onClick={() => u({ latitude_deg: c.lat })}>{c.name}</Button>
          ))}
        </div>
      </Section>
      <Section title="Latitude φ">
        <Row label="φ" value={`${params.latitude_deg.toFixed(2)}°`}>
          <Slider value={[params.latitude_deg]} min={-90} max={90} step={0.1}
            onValueChange={([v]) => u({ latitude_deg: v })} />
        </Row>
      </Section>
      <Section title="Comprimento L">
        <Row label="L" value={`${params.L_m.toFixed(2)} m`}>
          <Slider value={[params.L_m]} min={0.5} max={70} step={0.1}
            onValueChange={([v]) => u({ L_m: v })} />
        </Row>
        <p className="text-[11px] text-muted-foreground">Foucault original: 67 m no Panthéon.</p>
      </Section>
      <Section title="Amplitude inicial">
        <Row label="θ₀" value={`${params.amplitude_deg.toFixed(2)}°`}>
          <Slider value={[params.amplitude_deg]} min={0.5} max={15} step={0.1}
            onValueChange={([v]) => u({ amplitude_deg: v })} />
        </Row>
      </Section>
      <Section title="Tempo decorrido">
        <Row label="t" value={`${(params.time_s/60).toFixed(1)} min`}>
          <Slider value={[params.time_s]} min={0} max={24*3600} step={60}
            onValueChange={([v]) => u({ time_s: v })} />
        </Row>
      </Section>
      <Section title="Gravidade g">
        <Row label="g" value={`${params.g.toFixed(3)} m/s²`}>
          <Slider value={[params.g]} min={1.62} max={24.8} step={0.01}
            onValueChange={([v]) => u({ g: v })} />
        </Row>
        <div className="grid grid-cols-3 gap-1.5">
          <Button size="sm" variant="outline" onClick={() => u({ g: 9.81 })}>Terra</Button>
          <Button size="sm" variant="outline" onClick={() => u({ g: 1.62 })}>Lua</Button>
          <Button size="sm" variant="outline" onClick={() => u({ g: 3.71 })}>Marte</Button>
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
