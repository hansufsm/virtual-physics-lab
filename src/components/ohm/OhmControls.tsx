import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MATERIALS, type OhmParams } from "@/lib/physics";

interface Props {
  params: OhmParams;
  onChange: (p: OhmParams) => void;
}

export const OhmControls = ({ params, onChange }: Props) => {
  const update = (patch: Partial<OhmParams>) => onChange({ ...params, ...patch });

  const materialKey =
    Object.entries(MATERIALS).find(([, v]) => Math.abs(v - params.resistivity) / v < 0.01)?.[0] ??
    "Personalizado";

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Parâmetros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Ajuste a fonte e o fio condutor.</p>
      </div>

      <Row label="Tensão da fonte" value={`${params.voltage.toFixed(2)} V`}>
        <Slider
          value={[params.voltage]}
          min={-12} max={12} step={0.1}
          onValueChange={([v]) => update({ voltage: v })}
        />
      </Row>

      <div>
        <Label className="text-xs text-muted-foreground">Material do fio</Label>
        <Select
          value={materialKey === "Personalizado" ? undefined : materialKey}
          onValueChange={(k) => update({ resistivity: MATERIALS[k] })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder={materialKey} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MATERIALS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {k} <span className="text-muted-foreground ml-1">(ρ ≈ {v.toExponential(1)} Ω·m)</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Row label="Resistividade ρ" value={`${params.resistivity.toExponential(2)} Ω·m`}>
        <Slider
          value={[Math.log10(params.resistivity)]}
          min={-9} max={-3} step={0.05}
          onValueChange={([v]) => update({ resistivity: Math.pow(10, v) })}
        />
      </Row>

      <Row label="Comprimento do fio L" value={`${params.lengthCm.toFixed(0)} cm`}>
        <Slider
          value={[params.lengthCm]}
          min={5} max={500} step={1}
          onValueChange={([v]) => update({ lengthCm: v })}
        />
      </Row>

      <Row label="Diâmetro ⌀" value={`${params.diameterMm.toFixed(2)} mm`}>
        <Slider
          value={[params.diameterMm]}
          min={0.05} max={3} step={0.01}
          onValueChange={([v]) => update({ diameterMm: v })}
        />
      </Row>

      <Row label="Resistência interna r" value={`${params.internalOhm.toFixed(2)} Ω`}>
        <Slider
          value={[params.internalOhm]}
          min={0} max={5} step={0.05}
          onValueChange={([v]) => update({ internalOhm: v })}
        />
      </Row>

      <Row label="Ruído de medição" value={`${(params.noisePct * 100).toFixed(1)} %`}>
        <Slider
          value={[params.noisePct]}
          min={0} max={0.1} step={0.005}
          onValueChange={([v]) => update({ noisePct: v })}
        />
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