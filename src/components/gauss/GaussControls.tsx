import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { GaussGeometry, GaussParams, GaussSurface } from "@/lib/physics";

interface Props { params: GaussParams; onChange: (p: GaussParams) => void }

const surfaceFor: Record<GaussGeometry, GaussSurface> = {
  point: "sphere",
  sphere: "sphere",
  line: "cylinder",
  plane: "pillbox",
};

export const GaussControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<GaussParams>) => onChange({ ...params, ...patch });
  const setGeom = (g: GaussGeometry) => u({ geometry: g, surface: surfaceFor[g] });

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Distribuição de carga e superfície gaussiana.</p>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {([
          ["point", "Carga pontual"],
          ["sphere", "Esfera"],
          ["line", "Fio infinito"],
          ["plane", "Plano infinito"],
        ] as [GaussGeometry, string][]).map(([g, label]) => (
          <Button key={g} size="sm" variant={params.geometry === g ? "default" : "outline"} onClick={() => setGeom(g)}>
            {label}
          </Button>
        ))}
      </div>

      {(params.geometry === "point" || params.geometry === "sphere") && (
        <Row label="Carga Q" value={`${(params.Q * 1e9).toFixed(2)} nC`}>
          <Slider value={[params.Q * 1e9]} min={-100} max={100} step={0.5}
            onValueChange={([v]) => u({ Q: v * 1e-9 })} />
        </Row>
      )}

      {params.geometry === "sphere" && (
        <Row label="Raio da esfera R" value={`${params.sourceRadiusCm.toFixed(2)} cm`}>
          <Slider value={[params.sourceRadiusCm]} min={0.5} max={20} step={0.1}
            onValueChange={([v]) => u({ sourceRadiusCm: v })} />
        </Row>
      )}

      {params.geometry === "line" && (
        <Row label="Densidade λ" value={`${(params.lambda * 1e9).toFixed(2)} nC/m`}>
          <Slider value={[params.lambda * 1e9]} min={-500} max={500} step={1}
            onValueChange={([v]) => u({ lambda: v * 1e-9 })} />
        </Row>
      )}

      {params.geometry === "plane" && (
        <Row label="Densidade σ" value={`${(params.sigma * 1e9).toFixed(2)} nC/m²`}>
          <Slider value={[params.sigma * 1e9]} min={-1000} max={1000} step={1}
            onValueChange={([v]) => u({ sigma: v * 1e-9 })} />
        </Row>
      )}

      <div className="border-t border-border pt-4 space-y-4">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Superfície gaussiana ({params.surface === "sphere" ? "esfera" : params.surface === "cylinder" ? "cilindro" : "pillbox"})
        </div>
        <Row label="Raio da gaussiana" value={`${params.surfaceRadiusCm.toFixed(2)} cm`}>
          <Slider value={[params.surfaceRadiusCm]} min={0.2} max={30} step={0.1}
            onValueChange={([v]) => u({ surfaceRadiusCm: v })} />
        </Row>
        {(params.surface === "cylinder") && (
          <Row label="Comprimento L" value={`${params.surfaceLengthCm.toFixed(2)} cm`}>
            <Slider value={[params.surfaceLengthCm]} min={1} max={100} step={0.5}
              onValueChange={([v]) => u({ surfaceLengthCm: v })} />
          </Row>
        )}
        <Row label="Ponto de prova r" value={`${params.probeRcm.toFixed(2)} cm`}>
          <Slider value={[params.probeRcm]} min={0.2} max={40} step={0.1}
            onValueChange={([v]) => u({ probeRcm: v })} />
        </Row>
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