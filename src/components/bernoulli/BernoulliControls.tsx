import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { BernoulliParams } from "@/lib/physics";
export const BernoulliControls = ({ params, onChange }: { params: BernoulliParams; onChange: (p: BernoulliParams) => void }) => {
  const u = (patch: Partial<BernoulliParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Tubo de Venturi: A₁ → A₂.</p>
      </div>
      <Row label="Pressão P₁" value={`${(params.P1_Pa / 1000).toFixed(1)} kPa`}>
        <Slider value={[params.P1_Pa]} min={50000} max={500000} step={1000} onValueChange={([v]) => u({ P1_Pa: v })} />
      </Row>
      <Row label="Velocidade v₁" value={`${params.v1_ms.toFixed(2)} m/s`}>
        <Slider value={[params.v1_ms]} min={0.1} max={20} step={0.1} onValueChange={([v]) => u({ v1_ms: v })} />
      </Row>
      <Row label="Área A₁" value={`${(params.A1_m2 * 1e4).toFixed(2)} cm²`}>
        <Slider value={[params.A1_m2]} min={1e-4} max={5e-2} step={1e-4} onValueChange={([v]) => u({ A1_m2: v })} />
      </Row>
      <Row label="Área A₂ (garganta)" value={`${(params.A2_m2 * 1e4).toFixed(2)} cm²`}>
        <Slider value={[params.A2_m2]} min={1e-5} max={5e-2} step={1e-5} onValueChange={([v]) => u({ A2_m2: v })} />
      </Row>
      <Row label="Densidade ρ" value={`${params.rho_kg_m3.toFixed(0)} kg/m³`}>
        <Slider value={[params.rho_kg_m3]} min={1} max={13600} step={1} onValueChange={([v]) => u({ rho_kg_m3: v })} />
      </Row>
      <Row label="Altura h₁" value={`${params.h1_m.toFixed(2)} m`}>
        <Slider value={[params.h1_m]} min={0} max={10} step={0.05} onValueChange={([v]) => u({ h1_m: v })} />
      </Row>
      <Row label="Altura h₂" value={`${params.h2_m.toFixed(2)} m`}>
        <Slider value={[params.h2_m]} min={0} max={10} step={0.05} onValueChange={([v]) => u({ h2_m: v })} />
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