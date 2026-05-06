import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HALL_MATERIALS, type HallMaterial, type HallParams } from "@/lib/physics";

interface Props {
  params: HallParams;
  onChange: (p: HallParams) => void;
}

export const HallControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<HallParams>) => onChange({ ...params, ...patch });

  const setMaterial = (mat: HallMaterial) => {
    if (mat === "custom") {
      u({ material: "custom" });
      return;
    }
    const m = HALL_MATERIALS[mat];
    onChange({ ...params, material: mat, n: m.n, carrier: m.carrier, mobility: m.mobility });
  };

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Material, geometria, corrente e campo.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Material</Label>
        <Select value={params.material} onValueChange={(v) => setMaterial(v as HallMaterial)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(HALL_MATERIALS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant={params.carrier === "electron" ? "default" : "outline"}
          onClick={() => u({ carrier: "electron" })}>Elétrons (n)</Button>
        <Button size="sm" variant={params.carrier === "hole" ? "default" : "outline"}
          onClick={() => u({ carrier: "hole" })}>Buracos (p)</Button>
      </div>

      <Row label="Densidade n" value={`${params.n.toExponential(2)} m⁻³`}>
        <Slider value={[Math.log10(params.n)]} min={18} max={30} step={0.05}
          onValueChange={([v]) => u({ n: Math.pow(10, v), material: "custom" })} />
      </Row>

      <Row label="Mobilidade μ" value={`${params.mobility.toExponential(2)} m²/V·s`}>
        <Slider value={[Math.log10(Math.max(1e-5, params.mobility))]} min={-5} max={1} step={0.05}
          onValueChange={([v]) => u({ mobility: Math.pow(10, v), material: "custom" })} />
      </Row>

      <Row label="Corrente I" value={`${params.I.toFixed(2)} A`}>
        <Slider value={[params.I]} min={-5} max={5} step={0.05}
          onValueChange={([v]) => u({ I: v })} />
      </Row>

      <Row label="Campo B" value={`${params.B.toFixed(3)} T`}>
        <Slider value={[params.B]} min={-2} max={2} step={0.01}
          onValueChange={([v]) => u({ B: v })} />
      </Row>

      <Row label="Espessura t" value={`${(params.t * 1e6).toFixed(1)} µm`}>
        <Slider value={[Math.log10(params.t)]} min={-6} max={-3} step={0.05}
          onValueChange={([v]) => u({ t: Math.pow(10, v) })} />
      </Row>

      <Row label="Largura w" value={`${(params.w * 1000).toFixed(2)} mm`}>
        <Slider value={[params.w * 1000]} min={0.5} max={20} step={0.1}
          onValueChange={([v]) => u({ w: v / 1000 })} />
      </Row>

      <Row label="Comprimento L" value={`${(params.L * 1000).toFixed(2)} mm`}>
        <Slider value={[params.L * 1000]} min={1} max={50} step={0.5}
          onValueChange={([v]) => u({ L: v / 1000 })} />
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