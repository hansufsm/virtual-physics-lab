import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { DipoleMode, DipoleParams } from "@/lib/physics";

interface Props { params: DipoleParams; onChange: (p: DipoleParams) => void }

export const DipoleControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<DipoleParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Dipolo p = q·d em campo externo E.</p>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {([
          ["torque", "Torque em E"],
          ["field", "Campo do dipolo"],
        ] as [DipoleMode, string][]).map(([m, label]) => (
          <Button key={m} size="sm" variant={params.mode === m ? "default" : "outline"} onClick={() => u({ mode: m })}>
            {label}
          </Button>
        ))}
      </div>

      <Row label="Carga q" value={`${params.qNc.toFixed(2)} nC`}>
        <Slider value={[params.qNc]} min={0.1} max={100} step={0.1} onValueChange={([v]) => u({ qNc: v })} />
      </Row>
      <Row label="Separação d" value={`${params.dCm.toFixed(2)} cm`}>
        <Slider value={[params.dCm]} min={0.2} max={20} step={0.1} onValueChange={([v]) => u({ dCm: v })} />
      </Row>

      {params.mode === "torque" && (
        <>
          <Row label="Campo externo E" value={`${(params.Eext / 1000).toFixed(2)} kV/m`}>
            <Slider value={[params.Eext]} min={0} max={500000} step={1000} onValueChange={([v]) => u({ Eext: v })} />
          </Row>
          <Row label="Ângulo θ (p, E)" value={`${params.thetaDeg.toFixed(1)}°`}>
            <Slider value={[params.thetaDeg]} min={-180} max={180} step={1} onValueChange={([v]) => u({ thetaDeg: v })} />
          </Row>
          <Row label="Massa por carga" value={`${params.massMg.toFixed(2)} mg`}>
            <Slider value={[params.massMg]} min={0.01} max={50} step={0.01} onValueChange={([v]) => u({ massMg: v })} />
          </Row>
        </>
      )}

      {params.mode === "field" && (
        <>
          <Row label="Ângulo do dipolo" value={`${params.thetaDeg.toFixed(1)}°`}>
            <Slider value={[params.thetaDeg]} min={-180} max={180} step={1} onValueChange={([v]) => u({ thetaDeg: v })} />
          </Row>
          <Row label="Ponto de prova x" value={`${params.probeXcm.toFixed(2)} cm`}>
            <Slider value={[params.probeXcm]} min={-30} max={30} step={0.2} onValueChange={([v]) => u({ probeXcm: v })} />
          </Row>
          <Row label="Ponto de prova y" value={`${params.probeYcm.toFixed(2)} cm`}>
            <Slider value={[params.probeYcm]} min={-30} max={30} step={0.2} onValueChange={([v]) => u({ probeYcm: v })} />
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