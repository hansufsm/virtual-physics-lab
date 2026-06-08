import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { MaxwellParams } from "@/lib/physics";

const GASES: { name: string; M: number }[] = [
  { name: "H₂ (2)", M: 2 }, { name: "He (4)", M: 4 }, { name: "N₂ (28)", M: 28 },
  { name: "O₂ (32)", M: 32 }, { name: "Ar (40)", M: 40 }, { name: "CO₂ (44)", M: 44 },
];
export const MaxwellControls = ({ params, onChange }: { params: MaxwellParams; onChange: (p: MaxwellParams) => void }) => {
  const u = (patch: Partial<MaxwellParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Distribuição f(v) de Maxwell-Boltzmann.</p>
      </div>
      <Row label="Temperatura" value={`${params.T_K.toFixed(0)} K`}>
        <Slider value={[params.T_K]} min={50} max={2000} step={10} onValueChange={([v]) => u({ T_K: v })} />
      </Row>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Gás (massa molar)</Label>
        <select className="w-full text-sm bg-background border border-border rounded px-2 py-1.5"
          value={params.M_g_per_mol}
          onChange={(e) => u({ M_g_per_mol: Number(e.target.value) })}>
          {GASES.map(g => <option key={g.name} value={g.M}>{g.name}</option>)}
        </select>
      </div>
      <Row label="v máx (gráfico)" value={`${params.vMax_m_s.toFixed(0)} m/s`}>
        <Slider value={[params.vMax_m_s]} min={500} max={6000} step={50} onValueChange={([v]) => u({ vMax_m_s: v })} />
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