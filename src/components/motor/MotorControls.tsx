import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { DCMotorParams } from "@/lib/physics";

interface Props { params: DCMotorParams; onChange: (p: DCMotorParams) => void }

export const MotorControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<DCMotorParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Parâmetros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure a fonte, o ímã e a bobina do rotor.</p>
      </div>

      <Row label="Tensão V" value={`${params.voltage.toFixed(1)} V`}>
        <Slider value={[params.voltage]} min={0} max={24} step={0.1}
          onValueChange={([v]) => u({ voltage: v })} />
      </Row>
      <Row label="Resistência R" value={`${params.resistanceOhm.toFixed(2)} Ω`}>
        <Slider value={[params.resistanceOhm]} min={0.1} max={20} step={0.1}
          onValueChange={([v]) => u({ resistanceOhm: v })} />
      </Row>
      <Row label="Campo magnético B" value={`${params.bField.toFixed(2)} T`}>
        <Slider value={[params.bField]} min={0.05} max={1.5} step={0.01}
          onValueChange={([v]) => u({ bField: v })} />
      </Row>
      <Row label="Largura da espira a" value={`${params.loopWidthCm.toFixed(1)} cm`}>
        <Slider value={[params.loopWidthCm]} min={1} max={10} step={0.1}
          onValueChange={([v]) => u({ loopWidthCm: v })} />
      </Row>
      <Row label="Altura da espira b" value={`${params.loopHeightCm.toFixed(1)} cm`}>
        <Slider value={[params.loopHeightCm]} min={1} max={10} step={0.1}
          onValueChange={([v]) => u({ loopHeightCm: v })} />
      </Row>
      <Row label="Espiras N" value={`${params.turns}`}>
        <Slider value={[params.turns]} min={1} max={500} step={1}
          onValueChange={([v]) => u({ turns: v })} />
      </Row>
      <Row label="Torque de carga" value={`${params.loadTorqueMnm.toFixed(2)} mN·m`}>
        <Slider value={[params.loadTorqueMnm]} min={0} max={50} step={0.1}
          onValueChange={([v]) => u({ loadTorqueMnm: v })} />
      </Row>
      <Row label="Atrito viscoso b" value={`${params.frictionCoef.toExponential(2)} N·m·s`}>
        <Slider value={[Math.log10(Math.max(1e-8, params.frictionCoef))]} min={-8} max={-2} step={0.05}
          onValueChange={([v]) => u({ frictionCoef: +Math.pow(10, v).toPrecision(3) })} />
      </Row>
      <Row label="Inércia J" value={`${params.inertiaGcm2.toFixed(1)} g·cm²`}>
        <Slider value={[params.inertiaGcm2]} min={1} max={500} step={1}
          onValueChange={([v]) => u({ inertiaGcm2: v })} />
      </Row>
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