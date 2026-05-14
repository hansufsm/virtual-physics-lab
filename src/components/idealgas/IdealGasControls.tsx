import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { IdealGasParams, GasProcess } from "@/lib/physics";

interface Props { params: IdealGasParams; onChange: (p: IdealGasParams) => void }

const PROCESSES: { id: GasProcess; label: string; hint: string }[] = [
  { id: "isothermal", label: "Isotérmico", hint: "T = const" },
  { id: "isobaric", label: "Isobárico", hint: "P = const" },
  { id: "isochoric", label: "Isocórico", hint: "V = const" },
  { id: "adiabatic", label: "Adiabático", hint: "Q = 0" },
];

const GAMMAS: { label: string; v: number }[] = [
  { label: "Monoat. (5/3)", v: 5 / 3 },
  { label: "Diat. (7/5)", v: 7 / 5 },
  { label: "Poliat. (4/3)", v: 4 / 3 },
];

export const IdealGasControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<IdealGasParams>) => onChange({ ...params, ...patch });
  const finalIsTemp = params.process === "isochoric";

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Gás ideal — PVT</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Escolha o processo e ajuste o estado inicial e final.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Processo termodinâmico</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {PROCESSES.map((p) => (
            <Button key={p.id} size="sm"
              variant={params.process === p.id ? "default" : "outline"}
              onClick={() => u({ process: p.id })}
              className="flex-col h-auto py-2">
              <span className="text-xs font-medium">{p.label}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{p.hint}</span>
            </Button>
          ))}
        </div>
      </div>

      <Row label="n (mols)" value={`${params.moles.toFixed(3)} mol`}>
        <Slider value={[params.moles]} min={0.01} max={5} step={0.01} onValueChange={([v]) => u({ moles: v })} />
      </Row>

      <Row label="T₁ (temperatura inicial)" value={`${params.T1.toFixed(0)} K`}>
        <Slider value={[params.T1]} min={50} max={1500} step={5} onValueChange={([v]) => u({ T1: v })} />
      </Row>

      <Row label="V₁ (volume inicial)" value={`${params.V1.toFixed(2)} L`}>
        <Slider value={[params.V1]} min={0.1} max={50} step={0.1} onValueChange={([v]) => u({ V1: v })} />
      </Row>

      {!finalIsTemp ? (
        <Row label="V₂ (volume final)" value={`${params.V2.toFixed(2)} L`}>
          <Slider value={[params.V2]} min={0.1} max={100} step={0.1} onValueChange={([v]) => u({ V2: v })} />
        </Row>
      ) : (
        <Row label="T₂ (temperatura final)" value={`${params.T2.toFixed(0)} K`}>
          <Slider value={[params.T2]} min={50} max={2000} step={5} onValueChange={([v]) => u({ T2: v })} />
        </Row>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-medium">Razão γ = Cp/Cv</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {GAMMAS.map((g) => (
            <Button key={g.label} size="sm"
              variant={Math.abs(params.gamma - g.v) < 1e-3 ? "default" : "outline"}
              onClick={() => u({ gamma: g.v })}>
              {g.label}
            </Button>
          ))}
        </div>
        <div className="flex items-baseline justify-between gap-3 pt-1">
          <Label className="text-xs text-muted-foreground">γ</Label>
          <span className="font-mono text-xs text-primary tabular-nums">{params.gamma.toFixed(3)}</span>
        </div>
        <Slider value={[params.gamma]} min={1.05} max={2} step={0.01} onValueChange={([v]) => u({ gamma: v })} />
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