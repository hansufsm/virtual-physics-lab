import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Zap, ZapOff } from "lucide-react";
import type { RCParams } from "@/lib/physics";

interface Props {
  params: RCParams;
  onChange: (p: RCParams) => void;
  running: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
}

export const RCControls = ({ params, onChange, running, onToggleRun, onReset, speed, onSpeedChange }: Props) => {
  const update = (patch: Partial<RCParams>) => onChange({ ...params, ...patch });

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Parâmetros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Ajuste o circuito e controle a chave.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={params.mode === "charge" ? "default" : "outline"}
          size="sm"
          onClick={() => update({ mode: "charge" })}
          className="gap-1.5"
        >
          <Zap className="h-3.5 w-3.5" /> Carga
        </Button>
        <Button
          variant={params.mode === "discharge" ? "default" : "outline"}
          size="sm"
          onClick={() => update({ mode: "discharge", v0: params.v0 || params.emf })}
          className="gap-1.5"
        >
          <ZapOff className="h-3.5 w-3.5" /> Descarga
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onToggleRun} size="sm" className="gap-1.5">
          {running ? <><Square className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Iniciar</>}
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
        </Button>
      </div>

      <Row label="Tensão da fonte E" value={`${params.emf.toFixed(2)} V`}>
        <Slider
          value={[params.emf]} min={1} max={24} step={0.1}
          onValueChange={([v]) => update({ emf: v })}
        />
      </Row>

      <Row label="Resistência R" value={`${params.resistanceK.toFixed(2)} kΩ`}>
        <Slider
          value={[Math.log10(Math.max(0.01, params.resistanceK))]}
          min={-1} max={3} step={0.02}
          onValueChange={([v]) => update({ resistanceK: Math.pow(10, v) })}
        />
      </Row>

      <Row label="Capacitância C" value={`${params.capacitanceUf.toFixed(2)} µF`}>
        <Slider
          value={[Math.log10(Math.max(0.01, params.capacitanceUf))]}
          min={-2} max={3} step={0.02}
          onValueChange={([v]) => update({ capacitanceUf: Math.pow(10, v) })}
        />
      </Row>

      <Row label="V₀ inicial no capacitor" value={`${params.v0.toFixed(2)} V`}>
        <Slider
          value={[params.v0]} min={0} max={Math.max(params.emf, 24)} step={0.1}
          onValueChange={([v]) => update({ v0: v })}
        />
      </Row>

      <Row label="Velocidade da simulação" value={`${speed.toFixed(2)}×`}>
        <Slider
          value={[Math.log10(speed)]} min={-1} max={2} step={0.05}
          onValueChange={([v]) => onSpeedChange(Math.pow(10, v))}
        />
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