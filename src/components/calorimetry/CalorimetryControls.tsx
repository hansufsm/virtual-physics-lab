import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CalorimetryParams } from "@/lib/physics";

interface Props { params: CalorimetryParams; onChange: (p: CalorimetryParams) => void }

const SOLIDS: { name: string; c: number }[] = [
  { name: "Alumínio", c: 897 },
  { name: "Cobre", c: 385 },
  { name: "Ferro", c: 449 },
  { name: "Chumbo", c: 128 },
  { name: "Vidro", c: 840 },
];

const PRESETS: { name: string; patch: Partial<CalorimetryParams> }[] = [
  { name: "Cobre quente em água", patch: { mWater: 0.2, TWater: 20, mSolid: 0.1, TSolid: 100, cSolid: 385, solidName: "Cobre", mIce: 0 } },
  { name: "Gelo + água morna", patch: { mWater: 0.3, TWater: 60, mSolid: 0.0, cSolid: 385, mIce: 0.05, solidName: "—" } },
  { name: "Resfriamento parcial", patch: { mWater: 0.1, TWater: 10, mSolid: 0.05, TSolid: 50, mIce: 0.04, cSolid: 897, solidName: "Alumínio" } },
];

export const CalorimetryControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<CalorimetryParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Calorímetro</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Sistema isolado: ΣQ = 0.</p>
      </div>

      <Section title="Água (líquida)">
        <Row label="Massa mₐ" value={`${(params.mWater * 1000).toFixed(0)} g`}>
          <Slider value={[params.mWater]} min={0.05} max={1.0} step={0.01} onValueChange={([v]) => u({ mWater: v })} />
        </Row>
        <Row label="Temperatura Tₐ" value={`${params.TWater.toFixed(1)} °C`}>
          <Slider value={[params.TWater]} min={1} max={95} step={1} onValueChange={([v]) => u({ TWater: v, TCal: v })} />
        </Row>
      </Section>

      <Section title="Sólido quente">
        <Row label="Massa mₛ" value={`${(params.mSolid * 1000).toFixed(0)} g`}>
          <Slider value={[params.mSolid]} min={0} max={0.5} step={0.005} onValueChange={([v]) => u({ mSolid: v })} />
        </Row>
        <Row label="Temperatura Tₛ" value={`${params.TSolid.toFixed(0)} °C`}>
          <Slider value={[params.TSolid]} min={5} max={400} step={5} onValueChange={([v]) => u({ TSolid: v })} />
        </Row>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Material</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {SOLIDS.map((s) => (
              <Button key={s.name} size="sm" variant={params.solidName === s.name ? "default" : "outline"}
                onClick={() => u({ solidName: s.name, cSolid: s.c })}>
                {s.name}<span className="ml-1 text-[10px] opacity-70">{s.c}</span>
              </Button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">c = {params.cSolid} J/(kg·K)</p>
        </div>
      </Section>

      <Section title="Gelo a 0 °C">
        <Row label="Massa de gelo m_g" value={`${(params.mIce * 1000).toFixed(0)} g`}>
          <Slider value={[params.mIce]} min={0} max={0.3} step={0.005} onValueChange={([v]) => u({ mIce: v })} />
        </Row>
      </Section>

      <Section title="Calorímetro">
        <Row label="Capacidade C_cal" value={`${params.CCal.toFixed(0)} J/K`}>
          <Slider value={[params.CCal]} min={0} max={200} step={5} onValueChange={([v]) => u({ CCal: v })} />
        </Row>
        <Row label="τ (animação)" value={`${params.tauSeconds.toFixed(1)} s`}>
          <Slider value={[params.tauSeconds]} min={1} max={60} step={1} onValueChange={([v]) => u({ tauSeconds: v })} />
        </Row>
      </Section>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Presets</Label>
        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((pr) => (
            <Button key={pr.name} size="sm" variant="outline" onClick={() => u(pr.patch)}>{pr.name}</Button>
          ))}
        </div>
      </div>
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