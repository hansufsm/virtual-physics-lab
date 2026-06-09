import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { StokesParams } from "@/lib/physics";
export const StokesControls = ({ params, onChange }: { params: StokesParams; onChange: (p: StokesParams) => void }) => {
  const u = (patch: Partial<StokesParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Esfera caindo em fluido viscoso.</p>
      </div>
      <Row label="Raio da esfera" value={`${params.radius_mm.toFixed(2)} mm`}>
        <Slider value={[params.radius_mm]} min={0.05} max={10} step={0.05} onValueChange={([v]) => u({ radius_mm: v })} />
      </Row>
      <Row label="ρ da esfera" value={`${params.rho_sphere.toFixed(0)} kg/m³`}>
        <Slider value={[params.rho_sphere]} min={100} max={20000} step={10} onValueChange={([v]) => u({ rho_sphere: v })} />
      </Row>
      <Row label="ρ do fluido" value={`${params.rho_fluid.toFixed(0)} kg/m³`}>
        <Slider value={[params.rho_fluid]} min={1} max={2000} step={1} onValueChange={([v]) => u({ rho_fluid: v })} />
      </Row>
      <Row label="Viscosidade η" value={`${params.eta_Pas.toExponential(2)} Pa·s`}>
        <Slider value={[Math.log10(params.eta_Pas)]} min={-5} max={2} step={0.01} onValueChange={([v]) => u({ eta_Pas: Math.pow(10, v) })} />
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