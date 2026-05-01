import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Play, Square, RotateCcw, Move, ArrowDown } from "lucide-react";
import type { FaradayParams, FaradayMode } from "@/lib/physics";

interface Props {
  params: FaradayParams;
  onChange: (p: FaradayParams) => void;
  running: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
}

export const FaradayControls = ({ params, onChange, running, onToggleRun, onReset, speed, onSpeedChange }: Props) => {
  const update = (patch: Partial<FaradayParams>) => onChange({ ...params, ...patch });

  const modes: { id: FaradayMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "loop", label: "Espira em B", icon: Move },
    { id: "magnet", label: "Ímã + bobina", icon: ArrowDown },
  ];

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Parâmetros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure o cenário de indução.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <Button
              key={m.id}
              variant={params.mode === m.id ? "default" : "outline"}
              size="sm"
              onClick={() => update({ mode: m.id })}
              className="gap-1.5 flex-col h-auto py-2"
            >
              <Icon className="h-4 w-4" />
              <span className="text-[11px]">{m.label}</span>
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onToggleRun} size="sm" className="gap-1.5">
          {running ? <><Square className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Iniciar</>}
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
        </Button>
      </div>

      <Row label="Espiras N" value={`${Math.round(params.turns)}`}>
        <Slider value={[Math.log10(Math.max(1, params.turns))]} min={0} max={3.5} step={0.02}
          onValueChange={([v]) => update({ turns: Math.round(Math.pow(10, v)) })} />
      </Row>

      <Row label="Resistência R" value={`${params.resistanceOhm.toFixed(2)} Ω`}>
        <Slider value={[Math.log10(Math.max(0.01, params.resistanceOhm))]} min={-1} max={3} step={0.02}
          onValueChange={([v]) => update({ resistanceOhm: Math.pow(10, v) })} />
      </Row>

      {params.mode === "loop" && (
        <>
          <Row label="Campo B" value={`${params.bField.toFixed(3)} T`}>
            <Slider value={[params.bField]} min={-1} max={1} step={0.01}
              onValueChange={([v]) => update({ bField: v })} />
          </Row>
          <Row label="Velocidade da espira" value={`${params.velocityCmS.toFixed(1)} cm/s`}>
            <Slider value={[params.velocityCmS]} min={-50} max={50} step={0.5}
              onValueChange={([v]) => update({ velocityCmS: v })} />
          </Row>
          <Row label="Largura da espira" value={`${params.loopWidthCm.toFixed(1)} cm`}>
            <Slider value={[params.loopWidthCm]} min={2} max={30} step={0.5}
              onValueChange={([v]) => update({ loopWidthCm: v })} />
          </Row>
          <Row label="Altura da espira" value={`${params.loopHeightCm.toFixed(1)} cm`}>
            <Slider value={[params.loopHeightCm]} min={2} max={30} step={0.5}
              onValueChange={([v]) => update({ loopHeightCm: v })} />
          </Row>
          <Row label="Largura da região B" value={`${params.regionWidthCm.toFixed(1)} cm`}>
            <Slider value={[params.regionWidthCm]} min={5} max={60} step={0.5}
              onValueChange={([v]) => update({ regionWidthCm: v })} />
          </Row>
        </>
      )}

      {params.mode === "magnet" && (
        <>
          <Row label="Raio da bobina" value={`${params.coilRadiusCm.toFixed(1)} cm`}>
            <Slider value={[params.coilRadiusCm]} min={0.5} max={10} step={0.1}
              onValueChange={([v]) => update({ coilRadiusCm: v })} />
          </Row>
          <Row label="Comprimento da bobina" value={`${params.coilLengthCm.toFixed(1)} cm`}>
            <Slider value={[params.coilLengthCm]} min={0.5} max={20} step={0.1}
              onValueChange={([v]) => update({ coilLengthCm: v })} />
          </Row>
          <Row label="Momento do ímã m" value={`${params.magnetMoment.toFixed(2)} A·m²`}>
            <Slider value={[Math.log10(Math.max(0.001, params.magnetMoment))]} min={-3} max={1} step={0.02}
              onValueChange={([v]) => update({ magnetMoment: Math.pow(10, v) })} />
          </Row>
          <Row label="Altura inicial do ímã" value={`${params.dropHeightCm.toFixed(1)} cm`}>
            <Slider value={[params.dropHeightCm]} min={2} max={40} step={0.5}
              onValueChange={([v]) => update({ dropHeightCm: v })} />
          </Row>
          <div className="flex items-center justify-between gap-3">
            <Label className="text-sm">Queda livre (gravidade)</Label>
            <Switch checked={params.withGravity} onCheckedChange={(v) => update({ withGravity: v })} />
          </div>
          {!params.withGravity && (
            <Row label="Velocidade do ímã" value={`${params.magnetSpeedCmS.toFixed(1)} cm/s`}>
              <Slider value={[params.magnetSpeedCmS]} min={1} max={200} step={1}
                onValueChange={([v]) => update({ magnetSpeedCmS: v })} />
            </Row>
          )}
        </>
      )}

      <Row label="Velocidade da simulação" value={`${speed.toFixed(2)}×`}>
        <Slider value={[Math.log10(speed)]} min={-1} max={1} step={0.05}
          onValueChange={([v]) => onSpeedChange(Math.pow(10, v))} />
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