import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GRAVITY, type DragModel, type ProjectileParams } from "@/lib/physics";

interface Props { params: ProjectileParams; onChange: (p: ProjectileParams) => void }

const DRAGS: { key: DragModel; label: string }[] = [
  { key: "none", label: "Vácuo" },
  { key: "linear", label: "Linear (b·v)" },
  { key: "quadratic", label: "Quadrático (c·v²)" },
];

export const ProjectileControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<ProjectileParams>) => onChange({ ...params, ...patch });
  const dragMax = params.drag === "linear" ? 2 : params.drag === "quadratic" ? 0.5 : 0;
  const dragStep = params.drag === "linear" ? 0.01 : 0.001;
  const dragUnit = params.drag === "linear" ? "kg/s" : "kg/m";

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Lançamento</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Defina a velocidade inicial, ângulo, altura e gravidade.</p>
      </div>

      <Row label="Velocidade v₀" value={`${params.speed.toFixed(1)} m/s`}>
        <Slider value={[params.speed]} min={1} max={100} step={0.5} onValueChange={([v]) => u({ speed: v })} />
      </Row>
      <Row label="Ângulo θ" value={`${params.angleDeg.toFixed(0)}°`}>
        <Slider value={[params.angleDeg]} min={0} max={90} step={1} onValueChange={([v]) => u({ angleDeg: v })} />
      </Row>
      <Row label="Altura inicial h₀" value={`${params.height.toFixed(1)} m`}>
        <Slider value={[params.height]} min={0} max={100} step={0.5} onValueChange={([v]) => u({ height: v })} />
      </Row>
      <Row label="Massa m" value={`${params.mass.toFixed(2)} kg`}>
        <Slider value={[params.mass]} min={0.05} max={20} step={0.05} onValueChange={([v]) => u({ mass: v })} />
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
        <Slider value={[params.gravity]} min={0} max={25} step={0.01} onValueChange={([v]) => u({ gravity: v })} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Arrasto do ar</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {DRAGS.map((d) => (
            <Button key={d.key} size="sm"
              variant={params.drag === d.key ? "default" : "outline"}
              onClick={() => u({ drag: d.key })}>
              {d.label}
            </Button>
          ))}
        </div>
        {params.drag !== "none" && (
          <Row label={`Coef. de arrasto`} value={`${params.dragCoef.toFixed(3)} ${dragUnit}`}>
            <Slider value={[params.dragCoef]} min={0} max={dragMax} step={dragStep} onValueChange={([v]) => u({ dragCoef: v })} />
          </Row>
        )}
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