import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { CarnotParams } from "@/lib/physics";

interface Props { params: CarnotParams; onChange: (p: CarnotParams) => void }
export const CarnotControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<CarnotParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Ciclo reversível entre Th e Tc.</p>
      </div>
      <Row label="n (mol)" value={`${params.moles.toFixed(2)}`}>
        <Slider value={[params.moles]} min={0.1} max={5} step={0.1} onValueChange={([v]) => u({ moles: v })} />
      </Row>
      <Row label="γ = Cp/Cv" value={params.gamma.toFixed(2)}>
        <Slider value={[params.gamma]} min={1.1} max={1.67} step={0.01} onValueChange={([v]) => u({ gamma: v })} />
      </Row>
      <Row label="T quente" value={`${params.Th_K.toFixed(0)} K`}>
        <Slider value={[params.Th_K]} min={300} max={1500} step={10} onValueChange={([v]) => u({ Th_K: v })} />
      </Row>
      <Row label="T fria" value={`${params.Tc_K.toFixed(0)} K`}>
        <Slider value={[params.Tc_K]} min={100} max={Math.max(100, params.Th_K - 10)} step={5} onValueChange={([v]) => u({ Tc_K: v })} />
      </Row>
      <Row label="V₁ (L)" value={`${params.V1_L.toFixed(2)} L`}>
        <Slider value={[params.V1_L]} min={1} max={50} step={0.5} onValueChange={([v]) => u({ V1_L: v })} />
      </Row>
      <Row label="V₂ (L)" value={`${params.V2_L.toFixed(2)} L`}>
        <Slider value={[params.V2_L]} min={params.V1_L + 0.5} max={200} step={1} onValueChange={([v]) => u({ V2_L: v })} />
      </Row>
    </div>
  );
};
const Row = ({ label, value, children }: { label: string; value: string; children: React.ReactNode }) => (
  <div className="space-y-2 pb-3 border-b border-border last:border-0">
    <div className="flex items-baseline justify-between gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <span className="font-mono text-xs text-primary tabular-nums">{value}</span>
    </div>
    {children}
  </div>
);