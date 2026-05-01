import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CapacitorParams } from "@/lib/physics";

const DIELECTRICS: Record<string, number> = {
  "Vácuo / Ar": 1.0,
  "Papel": 3.7,
  "Vidro": 5.6,
  "Mica": 6.0,
  "Cerâmica": 80,
  "Água destilada": 80,
};

interface Props {
  params: CapacitorParams;
  onChange: (p: CapacitorParams) => void;
  showDielectric: boolean;
  onToggleDielectric: (v: boolean) => void;
}

export const ParameterControls = ({ params, onChange, showDielectric, onToggleDielectric }: Props) => {
  const update = (patch: Partial<CapacitorParams>) => onChange({ ...params, ...patch });

  const materialKey = Object.entries(DIELECTRICS).find(([, v]) => Math.abs(v - params.epsilonR) < 0.01)?.[0] ?? "Personalizado";

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Parâmetros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Ajuste os controles e veja a resposta em tempo real.</p>
      </div>

      <ControlRow
        label="Tensão aplicada"
        value={`${params.voltage.toFixed(1)} V`}
      >
        <Slider
          value={[params.voltage]}
          min={-50} max={50} step={0.5}
          onValueChange={([v]) => update({ voltage: v })}
        />
      </ControlRow>

      <ControlRow
        label="Distância entre placas"
        value={`${params.distanceMm.toFixed(2)} mm`}
      >
        <Slider
          value={[params.distanceMm]}
          min={0.5} max={20} step={0.1}
          onValueChange={([v]) => update({ distanceMm: v })}
        />
      </ControlRow>

      <ControlRow
        label="Área das placas"
        value={`${params.areaCm2.toFixed(0)} cm²`}
      >
        <Slider
          value={[params.areaCm2]}
          min={10} max={500} step={5}
          onValueChange={([v]) => update({ areaCm2: v })}
        />
      </ControlRow>

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
        <Label htmlFor="dielectric-switch" className="text-sm">Inserir dielétrico</Label>
        <Switch
          id="dielectric-switch"
          checked={showDielectric}
          onCheckedChange={onToggleDielectric}
        />
      </div>

      {showDielectric && (
        <div className="space-y-3 animate-fade-in">
          <div>
            <Label className="text-xs text-muted-foreground">Material</Label>
            <Select
              value={materialKey === "Personalizado" ? undefined : materialKey}
              onValueChange={(k) => update({ epsilonR: DIELECTRICS[k] })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={materialKey} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DIELECTRICS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {k} <span className="text-muted-foreground ml-1">(εᵣ ≈ {v})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ControlRow
            label="Permissividade relativa εᵣ"
            value={params.epsilonR.toFixed(2)}
          >
            <Slider
              value={[params.epsilonR]}
              min={1} max={100} step={0.1}
              onValueChange={([v]) => update({ epsilonR: v })}
            />
          </ControlRow>
        </div>
      )}
    </div>
  );
};

const ControlRow = ({ label, value, children }: { label: string; value: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <span className="font-mono text-xs text-primary tabular-nums">{value}</span>
    </div>
    {children}
  </div>
);