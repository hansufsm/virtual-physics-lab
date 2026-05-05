import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Zap, Magnet, Filter, RotateCw } from "lucide-react";
import type { ChargeMode, ChargeParams } from "@/lib/physics";

interface Props {
  params: ChargeParams;
  onChange: (p: ChargeParams) => void;
}

const MODES: { id: ChargeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "eOnly", label: "Campo E", icon: Zap },
  { id: "bOnly", label: "Campo B", icon: Magnet },
  { id: "selector", label: "Seletor", icon: Filter },
  { id: "cyclotron", label: "Ciclotron", icon: RotateCw },
];

export const ChargeControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<ChargeParams>) => onChange({ ...params, ...patch });

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Modo, partícula e campos.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = params.mode === m.id;
          return (
            <Button key={m.id} variant={active ? "default" : "outline"} size="sm"
              onClick={() => u({ mode: m.id })}
              className="gap-1.5 flex-col h-auto py-2">
              <Icon className="h-4 w-4" />
              <span className="text-[11px]">{m.label}</span>
            </Button>
          );
        })}
      </div>

      <Row label="Carga q" value={`${params.chargeE.toFixed(2)} e`}>
        <Slider value={[params.chargeE]} min={-3} max={3} step={0.1}
          onValueChange={([v]) => u({ chargeE: v })} />
      </Row>

      <Row label="Massa m" value={`${params.massP.toFixed(2)} mₚ`}>
        <Slider value={[Math.log10(Math.max(0.001, params.massP))]} min={-3} max={2} step={0.05}
          onValueChange={([v]) => u({ massP: Math.pow(10, v) })} />
      </Row>

      <Row label="Velocidade v₀" value={`${(params.v0 / 1e5).toFixed(2)} ×10⁵ m/s`}>
        <Slider value={[params.v0 / 1e5]} min={0} max={50} step={0.1}
          onValueChange={([v]) => u({ v0: v * 1e5 })} />
      </Row>

      {(params.mode === "eOnly" || params.mode === "selector") && (
        <Row label="Campo E (ŷ)" value={`${params.E.toFixed(0)} V/m`}>
          <Slider value={[params.E]} min={-5e5} max={5e5} step={1000}
            onValueChange={([v]) => u({ E: v })} />
        </Row>
      )}

      {params.mode !== "eOnly" && (
        <Row label="Campo B (ẑ)" value={`${params.B.toFixed(3)} T`}>
          <Slider value={[params.B]} min={-1} max={1} step={0.005}
            onValueChange={([v]) => u({ B: v })} />
        </Row>
      )}

      {params.mode === "cyclotron" && (
        <Row label="Tensão Dees Vd" value={`${params.vDee.toFixed(0)} V`}>
          <Slider value={[params.vDee]} min={100} max={50000} step={100}
            onValueChange={([v]) => u({ vDee: v })} />
        </Row>
      )}
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