import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FLUIDS, type ArchimedesParams } from "@/lib/physics";

interface Props { params: ArchimedesParams; onChange: (p: ArchimedesParams) => void }
const MATERIALS = [
  { name: "Cortiça", rho: 240 },
  { name: "Madeira", rho: 700 },
  { name: "Gelo", rho: 917 },
  { name: "Plástico (PVC)", rho: 1380 },
  { name: "Alumínio", rho: 2700 },
  { name: "Ferro", rho: 7870 },
  { name: "Chumbo", rho: 11340 },
  { name: "Ouro", rho: 19300 },
];
export const ArchimedesControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<ArchimedesParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Objeto e fluido.</p>
      </div>
      <Section title="Material do objeto">
        <div className="grid grid-cols-2 gap-1.5">
          {MATERIALS.map((m) => (
            <Button key={m.name} size="sm" variant={Math.abs(params.rho_obj_kg_m3 - m.rho) < 5 ? "default" : "outline"} onClick={() => u({ rho_obj_kg_m3: m.rho })}>{m.name}</Button>
          ))}
        </div>
      </Section>
      <Section title="Densidade do objeto ρ_obj">
        <Row label="ρ_obj" value={`${params.rho_obj_kg_m3.toFixed(0)} kg/m³`}>
          <Slider value={[params.rho_obj_kg_m3]} min={50} max={22000} step={10} onValueChange={([v]) => u({ rho_obj_kg_m3: v })} />
        </Row>
      </Section>
      <Section title="Volume do objeto">
        <Row label="V" value={`${params.volume_obj_L.toFixed(3)} L`}>
          <Slider value={[params.volume_obj_L]} min={0.01} max={10} step={0.01} onValueChange={([v]) => u({ volume_obj_L: v })} />
        </Row>
      </Section>
      <Section title="Fluido">
        <div className="grid grid-cols-1 gap-1.5">
          {FLUIDS.map((f) => (
            <Button key={f.name} size="sm" variant={Math.abs(params.rho_fluid_kg_m3 - f.rho) < 5 ? "default" : "outline"} onClick={() => u({ rho_fluid_kg_m3: f.rho })}>
              <span className="flex-1 text-left">{f.name}</span>
              <span className="text-[10px] text-muted-foreground ml-2">{f.rho} kg/m³</span>
            </Button>
          ))}
        </div>
        <Row label="ρ_fluido" value={`${params.rho_fluid_kg_m3.toFixed(0)} kg/m³`}>
          <Slider value={[params.rho_fluid_kg_m3]} min={100} max={14000} step={10} onValueChange={([v]) => u({ rho_fluid_kg_m3: v })} />
        </Row>
      </Section>
      <Section title="Gravidade">
        <Row label="g" value={`${params.g.toFixed(2)} m/s²`}>
          <Slider value={[params.g]} min={0.5} max={25} step={0.01} onValueChange={([v]) => u({ g: v })} />
        </Row>
      </Section>
    </div>
  );
};
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3 pb-3 border-b border-border last:border-0">
    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
    {children}
  </div>
);
const Row = ({ label, value, children }: { label: string; value: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <span className="font-mono text-xs text-primary tabular-nums">{value}</span>
    </div>
    {children}
  </div>
);