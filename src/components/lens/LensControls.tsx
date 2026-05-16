import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ThinLensParams, LensShape } from "@/lib/physics";

interface Props { params: ThinLensParams; onChange: (p: ThinLensParams) => void }

const SHAPES: { id: LensShape; label: string; R1: number; R2: number }[] = [
  { id: "biconvex", label: "Biconvexa", R1: 20, R2: -20 },
  { id: "planoconvex", label: "Plano-convexa", R1: 20, R2: 0 },
  { id: "biconcave", label: "Bicôncava", R1: -20, R2: 20 },
  { id: "planoconcave", label: "Plano-côncava", R1: -20, R2: 0 },
];

const PRESETS: { label: string; f: number }[] = [
  { label: "f = +5 cm", f: 5 },
  { label: "f = +10 cm", f: 10 },
  { label: "f = +20 cm", f: 20 },
  { label: "f = −15 cm", f: -15 },
];

export const LensControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<ThinLensParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Lentes finas</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure a lente e a posição do objeto.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Definição da distância focal</Label>
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant={params.mode === "focal" ? "default" : "outline"} onClick={() => u({ mode: "focal" })}>
            <span className="text-xs">f direto</span>
          </Button>
          <Button size="sm" variant={params.mode === "lensmaker" ? "default" : "outline"} onClick={() => u({ mode: "lensmaker" })}>
            <span className="text-xs">Fabricantes</span>
          </Button>
        </div>
      </div>

      {params.mode === "focal" ? (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Predefinições</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((p) => (
                <Button key={p.label} size="sm" variant={Math.abs(params.focalCm - p.f) < 1e-3 ? "default" : "outline"}
                  onClick={() => u({ focalCm: p.f })}>
                  <span className="text-xs">{p.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Row label="f (distância focal)" value={`${params.focalCm.toFixed(2)} cm`}>
            <Slider value={[params.focalCm]} min={-40} max={40} step={0.5} onValueChange={([v]) => u({ focalCm: v })} />
          </Row>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Formato da lente</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {SHAPES.map((s) => (
                <Button key={s.id} size="sm" variant={params.shape === s.id ? "default" : "outline"}
                  onClick={() => u({ shape: s.id, R1cm: s.R1, R2cm: s.R2 })}
                  className="h-auto py-2">
                  <span className="text-xs">{s.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Row label="R₁ (raio face 1)" value={`${params.R1cm.toFixed(1)} cm`}>
            <Slider value={[params.R1cm]} min={-60} max={60} step={1} onValueChange={([v]) => u({ R1cm: v, shape: "custom" })} />
          </Row>
          <Row label="R₂ (raio face 2)" value={`${params.R2cm.toFixed(1)} cm`}>
            <Slider value={[params.R2cm]} min={-60} max={60} step={1} onValueChange={([v]) => u({ R2cm: v, shape: "custom" })} />
          </Row>
          <Row label="n (vidro)" value={params.nLens.toFixed(3)}>
            <Slider value={[params.nLens]} min={1.3} max={2} step={0.01} onValueChange={([v]) => u({ nLens: v })} />
          </Row>
          <Row label="n (meio)" value={params.nMedium.toFixed(3)}>
            <Slider value={[params.nMedium]} min={1.0} max={1.7} step={0.01} onValueChange={([v]) => u({ nMedium: v })} />
          </Row>
        </>
      )}

      <Row label="d₀ (distância do objeto)" value={`${params.objectDistanceCm.toFixed(2)} cm`}>
        <Slider value={[params.objectDistanceCm]} min={1} max={80} step={0.5} onValueChange={([v]) => u({ objectDistanceCm: v })} />
      </Row>

      <Row label="h₀ (altura do objeto)" value={`${params.objectHeightCm.toFixed(2)} cm`}>
        <Slider value={[params.objectHeightCm]} min={0.5} max={8} step={0.1} onValueChange={([v]) => u({ objectHeightCm: v })} />
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