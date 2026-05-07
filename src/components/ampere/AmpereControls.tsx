import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AmpereGeometry, AmpereParams } from "@/lib/physics";

interface Props { params: AmpereParams; onChange: (p: AmpereParams) => void }

export const AmpereControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<AmpereParams>) => onChange({ ...params, ...patch });

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Geometria, correntes e ponto de prova.</p>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {(["single", "parallel", "toroid"] as AmpereGeometry[]).map((g) => (
          <Button key={g} size="sm" variant={params.geometry === g ? "default" : "outline"}
            onClick={() => u({ geometry: g })}>
            {g === "single" ? "Fio" : g === "parallel" ? "Dois fios" : "Toroide"}
          </Button>
        ))}
      </div>

      <Row label="Corrente I₁" value={`${params.I1.toFixed(2)} A`}>
        <Slider value={[params.I1]} min={-50} max={50} step={0.5} onValueChange={([v]) => u({ I1: v })} />
      </Row>

      {params.geometry === "parallel" && (
        <>
          <Row label="Corrente I₂" value={`${params.I2.toFixed(2)} A`}>
            <Slider value={[params.I2]} min={-50} max={50} step={0.5} onValueChange={([v]) => u({ I2: v })} />
          </Row>
          <Row label="Separação d" value={`${params.separationCm.toFixed(2)} cm`}>
            <Slider value={[params.separationCm]} min={0.5} max={20} step={0.1}
              onValueChange={([v]) => u({ separationCm: v })} />
          </Row>
          <Row label="Comprimento L" value={`${params.wireLengthM.toFixed(2)} m`}>
            <Slider value={[params.wireLengthM]} min={0.1} max={5} step={0.05}
              onValueChange={([v]) => u({ wireLengthM: v })} />
          </Row>
        </>
      )}

      {params.geometry !== "toroid" && (
        <>
          <Row label="Prova x" value={`${params.probeXcm.toFixed(2)} cm`}>
            <Slider value={[params.probeXcm]} min={-15} max={15} step={0.1}
              onValueChange={([v]) => u({ probeXcm: v })} />
          </Row>
          <Row label="Prova y" value={`${params.probeYcm.toFixed(2)} cm`}>
            <Slider value={[params.probeYcm]} min={-15} max={15} step={0.1}
              onValueChange={([v]) => u({ probeYcm: v })} />
          </Row>
        </>
      )}

      {params.geometry === "toroid" && (
        <>
          <Row label="Espiras N" value={`${params.N}`}>
            <Slider value={[params.N]} min={10} max={2000} step={10}
              onValueChange={([v]) => u({ N: Math.round(v) })} />
          </Row>
          <Row label="Raio médio R" value={`${params.rMeanCm.toFixed(2)} cm`}>
            <Slider value={[params.rMeanCm]} min={1} max={30} step={0.1}
              onValueChange={([v]) => u({ rMeanCm: v })} />
          </Row>
          <Row label="Raio menor a" value={`${params.aMinorCm.toFixed(2)} cm`}>
            <Slider value={[params.aMinorCm]} min={0.2} max={10} step={0.1}
              onValueChange={([v]) => u({ aMinorCm: v })} />
          </Row>
        </>
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