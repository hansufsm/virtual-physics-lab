import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GRAVITY, type PendulumParams } from "@/lib/physics";

interface Props { params: PendulumParams; onChange: (p: PendulumParams) => void }

export const PendulumControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<PendulumParams>) => onChange({ ...params, ...patch });

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Pêndulo simples</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Comprimento, massa, gravidade e amortecimento.</p>
      </div>

      <Row label="Comprimento L" value={`${params.length.toFixed(2)} m`}>
        <Slider value={[params.length]} min={0.1} max={5} step={0.05} onValueChange={([v]) => u({ length: v })} />
      </Row>
      <Row label="Massa m" value={`${params.mass.toFixed(2)} kg`}>
        <Slider value={[params.mass]} min={0.05} max={10} step={0.05} onValueChange={([v]) => u({ mass: v })} />
      </Row>
      <Row label="Ângulo inicial θ₀" value={`${params.angle0Deg.toFixed(0)}°`}>
        <Slider value={[params.angle0Deg]} min={-170} max={170} step={1} onValueChange={([v]) => u({ angle0Deg: v })} />
      </Row>
      <Row label="Velocidade angular inicial θ̇₀" value={`${params.omega0.toFixed(2)} rad/s`}>
        <Slider value={[params.omega0]} min={-10} max={10} step={0.1} onValueChange={([v]) => u({ omega0: v })} />
      </Row>
      <Row label="Amortecimento b" value={`${params.damping.toFixed(3)} kg/s`}>
        <Slider value={[params.damping]} min={0} max={2} step={0.01} onValueChange={([v]) => u({ damping: v })} />
      </Row>
      <Row label="Duração" value={`${params.duration.toFixed(0)} s`}>
        <Slider value={[params.duration]} min={2} max={60} step={1} onValueChange={([v]) => u({ duration: v })} />
      </Row>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Gravidade</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(GRAVITY).slice(0, 3).map(([k, g]) => (
            <Button key={k} size="sm"
              variant={Math.abs(params.gravity - g) < 1e-3 ? "default" : "outline"}
              onClick={() => u({ gravity: g })}>
              {k}
            </Button>
          ))}
        </div>
        <div className="flex items-baseline justify-between gap-3 pt-1">
          <Label className="text-xs text-muted-foreground">g</Label>
          <span className="font-mono text-xs text-primary tabular-nums">{params.gravity.toFixed(3)} m/s²</span>
        </div>
        <Slider value={[params.gravity]} min={0.5} max={25} step={0.01} onValueChange={([v]) => u({ gravity: v })} />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <Label className="text-sm font-medium">Modelo não-linear (sin θ)</Label>
          <p className="text-[11px] text-muted-foreground">Desligue para usar a aproximação de pequenos ângulos.</p>
        </div>
        <Switch checked={params.nonlinear} onCheckedChange={(v) => u({ nonlinear: v })} />
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