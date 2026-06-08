import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FourierParams, FourierLayer } from "@/lib/physics";

interface Props { params: FourierParams; onChange: (p: FourierParams) => void }
const PRESETS: { name: string; k: number }[] = [
  { name: "Cobre", k: 401 },
  { name: "Alumínio", k: 237 },
  { name: "Aço", k: 50 },
  { name: "Vidro", k: 1.0 },
  { name: "Tijolo", k: 0.7 },
  { name: "Isopor", k: 0.033 },
];
export const FourierControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<FourierParams>) => onChange({ ...params, ...patch });
  const updateLayer = (i: number, patch: Partial<FourierLayer>) => {
    const layers = params.layers.map((l, j) => (i === j ? { ...l, ...patch } : l));
    onChange({ ...params, layers });
  };
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Parede composta em regime permanente.</p>
      </div>
      <Row label="T quente" value={`${params.T_hot_K.toFixed(0)} K`}>
        <Slider value={[params.T_hot_K]} min={250} max={1200} step={5} onValueChange={([v]) => u({ T_hot_K: v })} />
      </Row>
      <Row label="T fria" value={`${params.T_cold_K.toFixed(0)} K`}>
        <Slider value={[params.T_cold_K]} min={100} max={Math.max(100, params.T_hot_K - 5)} step={5} onValueChange={([v]) => u({ T_cold_K: v })} />
      </Row>
      <Row label="Área A" value={`${params.area_m2.toFixed(2)} m²`}>
        <Slider value={[params.area_m2]} min={0.01} max={5} step={0.01} onValueChange={([v]) => u({ area_m2: v })} />
      </Row>
      <div className="space-y-3">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Camadas</div>
        {params.layers.map((l, i) => (
          <div key={i} className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <select className="text-xs bg-background border border-border rounded px-2 py-1"
                value={l.name}
                onChange={(e) => { const p = PRESETS.find(x => x.name === e.target.value); if (p) updateLayer(i, { name: p.name, k_W_mK: p.k }); }}>
                {PRESETS.map(p => <option key={p.name}>{p.name}</option>)}
              </select>
              {params.layers.length > 1 && (
                <Button size="sm" variant="ghost" onClick={() => onChange({ ...params, layers: params.layers.filter((_, j) => j !== i) })}>×</Button>
              )}
            </div>
            <Row label="L (m)" value={l.L_m.toFixed(3)}>
              <Slider value={[l.L_m]} min={0.005} max={0.5} step={0.005} onValueChange={([v]) => updateLayer(i, { L_m: v })} />
            </Row>
            <div className="text-[10px] text-muted-foreground font-mono">k = {l.k_W_mK} W/(m·K)</div>
          </div>
        ))}
        <Button size="sm" variant="outline" className="w-full"
          onClick={() => onChange({ ...params, layers: [...params.layers, { name: "Tijolo", k_W_mK: 0.7, L_m: 0.05 }] })}>
          + Adicionar camada
        </Button>
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