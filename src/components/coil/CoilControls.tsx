import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Magnet, Circle, Layers } from "lucide-react";
import type { CoilParams, CoilType } from "@/lib/physics";

interface Props {
  params: CoilParams;
  onChange: (p: CoilParams) => void;
}

export const CoilControls = ({ params, onChange }: Props) => {
  const update = (patch: Partial<CoilParams>) => onChange({ ...params, ...patch });

  const types: { id: CoilType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "solenoid", label: "Solenoide", icon: Layers },
    { id: "helmholtz", label: "Helmholtz", icon: Magnet },
    { id: "single", label: "Espira", icon: Circle },
  ];

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Parâmetros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Geometria e corrente da bobina.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {types.map((t) => {
          const Icon = t.icon;
          return (
            <Button
              key={t.id}
              variant={params.type === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => update({ type: t.id })}
              className="gap-1.5 flex-col h-auto py-2"
            >
              <Icon className="h-4 w-4" />
              <span className="text-[11px]">{t.label}</span>
            </Button>
          );
        })}
      </div>

      <Row label="Corrente I" value={`${params.current.toFixed(2)} A`}>
        <Slider value={[params.current]} min={-10} max={10} step={0.1}
          onValueChange={([v]) => update({ current: v })} />
      </Row>

      <Row label={params.type === "solenoid" ? "Espiras totais N" : "Espiras por bobina N"} value={`${Math.round(params.turns)}`}>
        <Slider value={[Math.log10(Math.max(1, params.turns))]} min={0} max={4} step={0.02}
          onValueChange={([v]) => update({ turns: Math.round(Math.pow(10, v)) })} />
      </Row>

      <Row label="Raio R" value={`${params.radiusCm.toFixed(2)} cm`}>
        <Slider value={[params.radiusCm]} min={0.5} max={30} step={0.1}
          onValueChange={([v]) => update({ radiusCm: v })} />
      </Row>

      {params.type === "solenoid" && (
        <Row label="Comprimento L" value={`${params.lengthCm.toFixed(2)} cm`}>
          <Slider value={[params.lengthCm]} min={1} max={100} step={0.5}
            onValueChange={([v]) => update({ lengthCm: v })} />
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