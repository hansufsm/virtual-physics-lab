import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { StefanParams } from "@/lib/physics";
export const StefanControls = ({ params, onChange }: { params: StefanParams; onChange: (p: StefanParams) => void }) => {
  const u = (patch: Partial<StefanParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Radiação térmica: P = εσA T⁴.</p>
      </div>
      <Row label="T do corpo" value={`${params.T1_K.toFixed(0)} K`}>
        <Slider value={[params.T1_K]} min={100} max={6000} step={10} onValueChange={([v]) => u({ T1_K: v })} />
      </Row>
      <Row label="T ambiente" value={`${params.T2_K.toFixed(0)} K`}>
        <Slider value={[params.T2_K]} min={3} max={1000} step={1} onValueChange={([v]) => u({ T2_K: v })} />
      </Row>
      <Row label="Emissividade ε" value={params.emissivity.toFixed(2)}>
        <Slider value={[params.emissivity]} min={0.01} max={1} step={0.01} onValueChange={([v]) => u({ emissivity: v })} />
      </Row>
      <Row label="Área A" value={`${params.area_m2.toFixed(3)} m²`}>
        <Slider value={[params.area_m2]} min={0.001} max={10} step={0.001} onValueChange={([v]) => u({ area_m2: v })} />
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