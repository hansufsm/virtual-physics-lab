import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { StandingWaveParams } from "@/lib/physics";

interface Props { params: StandingWaveParams; onChange: (p: StandingWaveParams) => void }

const PRESETS: { name: string; patch: Partial<StandingWaveParams> }[] = [
  { name: "Violão (Mi₂)", patch: { L: 0.65, T: 80, mu: 0.005, mode: 1 } },
  { name: "Piano grave", patch: { L: 1.2, T: 150, mu: 0.02, mode: 1 } },
  { name: "Tubo aberto-fechado", patch: { boundary: "fixed-free", L: 1.0, T: 50, mu: 0.004 } },
];

export const StandingWaveControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<StandingWaveParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Onda estacionária</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Tração, densidade linear e modo normal.</p>
      </div>

      <Row label="Comprimento L" value={`${params.L.toFixed(2)} m`}>
        <Slider value={[params.L]} min={0.2} max={3} step={0.05} onValueChange={([v]) => u({ L: v })} />
      </Row>
      <Row label="Tração T" value={`${params.T.toFixed(1)} N`}>
        <Slider value={[params.T]} min={1} max={300} step={1} onValueChange={([v]) => u({ T: v })} />
      </Row>
      <Row label="Densidade linear μ" value={`${(params.mu * 1000).toFixed(2)} g/m`}>
        <Slider value={[params.mu]} min={0.0005} max={0.05} step={0.0005} onValueChange={([v]) => u({ mu: v })} />
      </Row>
      <Row label="Modo n" value={`${params.mode}`}>
        <Slider value={[params.mode]} min={1} max={8} step={1} onValueChange={([v]) => u({ mode: Math.round(v) })} />
      </Row>
      <Row label="Amplitude" value={`${(params.amplitude * 100).toFixed(1)} cm`}>
        <Slider value={[params.amplitude]} min={0.005} max={0.15} step={0.005} onValueChange={([v]) => u({ amplitude: v })} />
      </Row>
      <Row label="Amortecimento" value={params.damping.toFixed(2)}>
        <Slider value={[params.damping]} min={0} max={0.9} step={0.01} onValueChange={([v]) => u({ damping: v })} />
      </Row>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Condições de contorno</Label>
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant={params.boundary === "fixed-fixed" ? "default" : "outline"}
            onClick={() => u({ boundary: "fixed-fixed" })}>Fixa–fixa</Button>
          <Button size="sm" variant={params.boundary === "fixed-free" ? "default" : "outline"}
            onClick={() => u({ boundary: "fixed-free" })}>Fixa–livre</Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Presets</Label>
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((pr) => (
            <Button key={pr.name} size="sm" variant="outline" onClick={() => u(pr.patch)}>{pr.name}</Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, children }: { label: string; value: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <span className="font-mono text-xs text-primary tabular-nums">{value}</span>
    </div>
    {children}
  </div>
);