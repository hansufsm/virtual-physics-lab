import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { DoubleSlitParams } from "@/lib/physics";

interface Props { params: DoubleSlitParams; onChange: (p: DoubleSlitParams) => void }

const PRESETS: Array<{ key: string; label: string; N: number }> = [
  { key: "single", label: "Fenda única", N: 1 },
  { key: "double", label: "Fenda dupla", N: 2 },
  { key: "grating", label: "Rede (N=10)", N: 10 },
];

export const DoubleSlitControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<DoubleSlitParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Geometria das fendas e da fonte.</p>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {PRESETS.map((p) => (
          <Button key={p.key} size="sm"
            variant={params.numSlits === p.N ? "default" : "outline"}
            onClick={() => u({ numSlits: p.N })}>
            {p.label}
          </Button>
        ))}
      </div>

      <Row label="Comprimento de onda λ" value={`${params.wavelengthNm.toFixed(0)} nm`}>
        <Slider value={[params.wavelengthNm]} min={380} max={780} step={1} onValueChange={([v]) => u({ wavelengthNm: v })} />
      </Row>
      <Row label="Separação entre fendas d" value={`${params.slitSepUm.toFixed(2)} µm`}>
        <Slider value={[params.slitSepUm]} min={2} max={200} step={0.5} onValueChange={([v]) => u({ slitSepUm: v })} />
      </Row>
      <Row label="Largura da fenda a" value={`${params.slitWidthUm.toFixed(2)} µm`}>
        <Slider value={[params.slitWidthUm]} min={0.5} max={50} step={0.1} onValueChange={([v]) => u({ slitWidthUm: v })} />
      </Row>
      <Row label="Distância à tela L" value={`${params.screenDistanceM.toFixed(2)} m`}>
        <Slider value={[params.screenDistanceM]} min={0.2} max={5} step={0.05} onValueChange={([v]) => u({ screenDistanceM: v })} />
      </Row>
      <Row label="Nº de fendas N" value={`${params.numSlits}`}>
        <Slider value={[params.numSlits]} min={1} max={20} step={1} onValueChange={([v]) => u({ numSlits: v })} />
      </Row>
      <Row label="Posição na tela y" value={`${params.probeMm.toFixed(2)} mm`}>
        <Slider value={[params.probeMm]} min={-30} max={30} step={0.05} onValueChange={([v]) => u({ probeMm: v })} />
      </Row>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Mostrar envelope (sinc²)</Label>
        <Switch checked={params.showEnvelope} onCheckedChange={(v) => u({ showEnvelope: v })} />
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