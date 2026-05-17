import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CollisionParams } from "@/lib/physics";

interface Props { params: CollisionParams; onChange: (p: CollisionParams) => void }

const PRESETS: { name: string; patch: Partial<CollisionParams> }[] = [
  { name: "Elástica", patch: { e: 1.0 } },
  { name: "Parcial", patch: { e: 0.5 } },
  { name: "Inelástica", patch: { e: 0.0 } },
];

export const CollisionControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<CollisionParams>) => onChange({ ...params, ...patch });

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Colisões 1D</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Massas, velocidades e tipo de colisão.</p>
      </div>

      <Row label="Massa m₁" value={`${params.m1.toFixed(2)} kg`}>
        <Slider value={[params.m1]} min={0.1} max={10} step={0.1} onValueChange={([v]) => u({ m1: v })} />
      </Row>
      <Row label="Massa m₂" value={`${params.m2.toFixed(2)} kg`}>
        <Slider value={[params.m2]} min={0.1} max={10} step={0.1} onValueChange={([v]) => u({ m2: v })} />
      </Row>
      <Row label="Velocidade inicial u₁" value={`${params.u1.toFixed(2)} m/s`}>
        <Slider value={[params.u1]} min={-10} max={10} step={0.1} onValueChange={([v]) => u({ u1: v })} />
      </Row>
      <Row label="Velocidade inicial u₂" value={`${params.u2.toFixed(2)} m/s`}>
        <Slider value={[params.u2]} min={-10} max={10} step={0.1} onValueChange={([v]) => u({ u2: v })} />
      </Row>
      <Row label="Coef. de restituição e" value={params.e.toFixed(2)}>
        <Slider value={[params.e]} min={0} max={1} step={0.01} onValueChange={([v]) => u({ e: v })} />
      </Row>
      <Row label="Duração" value={`${params.duration.toFixed(0)} s`}>
        <Slider value={[params.duration]} min={2} max={20} step={1} onValueChange={([v]) => u({ duration: v })} />
      </Row>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de colisão</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((pr) => (
            <Button key={pr.name} size="sm"
              variant={Math.abs(params.e - (pr.patch.e ?? 0)) < 1e-3 ? "default" : "outline"}
              onClick={() => u(pr.patch)}>
              {pr.name}
            </Button>
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