import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { PoiseuilleParams } from "@/lib/physics";
export const PoiseuilleControls = ({ params, onChange }: { params: PoiseuilleParams; onChange: (p: PoiseuilleParams) => void }) => {
  const u = (patch: Partial<PoiseuilleParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Escoamento laminar em tubo cilíndrico.</p>
      </div>
      <Row label="ΔP" value={`${(params.deltaP_Pa / 1000).toFixed(2)} kPa`}>
        <Slider value={[params.deltaP_Pa]} min={10} max={500000} step={10} onValueChange={([v]) => u({ deltaP_Pa: v })} />
      </Row>
      <Row label="Comprimento L" value={`${params.L_m.toFixed(2)} m`}>
        <Slider value={[params.L_m]} min={0.01} max={20} step={0.01} onValueChange={([v]) => u({ L_m: v })} />
      </Row>
      <Row label="Raio interno" value={`${params.radius_mm.toFixed(2)} mm`}>
        <Slider value={[params.radius_mm]} min={0.05} max={50} step={0.05} onValueChange={([v]) => u({ radius_mm: v })} />
      </Row>
      <Row label="Viscosidade η" value={`${params.eta_Pas.toExponential(2)} Pa·s`}>
        <Slider value={[Math.log10(params.eta_Pas)]} min={-5} max={2} step={0.01} onValueChange={([v]) => u({ eta_Pas: Math.pow(10, v) })} />
      </Row>
      <Row label="Densidade ρ" value={`${params.rho_kg_m3.toFixed(0)} kg/m³`}>
        <Slider value={[params.rho_kg_m3]} min={1} max={13600} step={1} onValueChange={([v]) => u({ rho_kg_m3: v })} />
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