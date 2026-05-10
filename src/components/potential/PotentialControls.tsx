import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { PotentialParams, PotentialPreset } from "@/lib/physics";

interface Props { params: PotentialParams; onChange: (p: PotentialParams) => void }

const PRESETS: [PotentialPreset, string][] = [
  ["single", "Carga única"],
  ["dipole", "Dipolo (+/−)"],
  ["twoEqual", "Duas iguais (+/+)"],
  ["quadrupole", "Quadrupolo"],
];

export const PotentialControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<PotentialParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Distribuição de cargas pontuais.</p>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {PRESETS.map(([k, label]) => (
          <Button key={k} size="sm" variant={params.preset === k ? "default" : "outline"} onClick={() => u({ preset: k })}>
            {label}
          </Button>
        ))}
      </div>

      <Row label="Carga base |q|" value={`${params.qNc.toFixed(2)} nC`}>
        <Slider value={[params.qNc]} min={0.1} max={100} step={0.1} onValueChange={([v]) => u({ qNc: v })} />
      </Row>
      {params.preset !== "single" && (
        <Row label="Separação" value={`${params.sepCm.toFixed(2)} cm`}>
          <Slider value={[params.sepCm]} min={0.5} max={20} step={0.1} onValueChange={([v]) => u({ sepCm: v })} />
        </Row>
      )}

      <Row label="Ponto de prova x" value={`${params.probeXcm.toFixed(2)} cm`}>
        <Slider value={[params.probeXcm]} min={-25} max={25} step={0.2} onValueChange={([v]) => u({ probeXcm: v })} />
      </Row>
      <Row label="Ponto de prova y" value={`${params.probeYcm.toFixed(2)} cm`}>
        <Slider value={[params.probeYcm]} min={-25} max={25} step={0.2} onValueChange={([v]) => u({ probeYcm: v })} />
      </Row>

      <Row label="Nº de equipotenciais" value={`${params.numLevels}`}>
        <Slider value={[params.numLevels]} min={3} max={14} step={1} onValueChange={([v]) => u({ numLevels: v })} />
      </Row>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Mostrar equipotenciais</Label>
        <Switch checked={params.showEquip} onCheckedChange={(v) => u({ showEquip: v })} />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Mostrar campo E</Label>
        <Switch checked={params.showField} onCheckedChange={(v) => u({ showField: v })} />
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