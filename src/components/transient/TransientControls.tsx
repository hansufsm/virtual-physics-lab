import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatSI, type TransientParams } from "@/lib/physics";

interface Props { params: TransientParams; onChange: (p: TransientParams) => void }

export const TransientControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<TransientParams>) => onChange({ ...params, ...patch });
  const isRLC = params.mode === "RLC";

  // tMax sugerido: ~10·τ_LR ou ~6/α (RLC), atualizado nos presets
  const presetLR = () => u({
    mode: "LR", phase: "step", V0: 12, R: 100, L: 0.1, I_init: 0, Vc_init: 0, tMax: 0.01,
  });
  const presetUnder = () => u({
    mode: "RLC", phase: "step", V0: 5, R: 20, L: 0.01, C: 1e-6, I_init: 0, Vc_init: 0, tMax: 0.002,
  });
  const presetCrit = () => u({
    mode: "RLC", phase: "step", V0: 5, R: 200, L: 0.01, C: 1e-6, I_init: 0, Vc_init: 0, tMax: 0.002,
  });
  const presetOver = () => u({
    mode: "RLC", phase: "step", V0: 5, R: 2000, L: 0.01, C: 1e-6, I_init: 0, Vc_init: 0, tMax: 0.01,
  });

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Circuito e estímulo</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Escolha o modo, o regime e os componentes.</p>
      </div>

      <Section title="Modo">
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant={!isRLC ? "default" : "outline"} onClick={() => u({ mode: "LR" })}>LR</Button>
          <Button size="sm" variant={isRLC ? "default" : "outline"} onClick={() => u({ mode: "RLC" })}>RLC série</Button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant={params.phase === "step" ? "default" : "outline"} onClick={() => u({ phase: "step" })}>Degrau (chave fecha)</Button>
          <Button size="sm" variant={params.phase === "discharge" ? "default" : "outline"}
            onClick={() => u({
              phase: "discharge",
              I_init: isRLC ? 0 : params.V0 / params.R,
              Vc_init: isRLC ? params.V0 : 0,
            })}>
            Descarga
          </Button>
        </div>
      </Section>

      <Section title="Presets">
        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant="outline" onClick={presetLR}>LR padrão</Button>
          <Button size="sm" variant="outline" onClick={presetUnder}>RLC sub-am.</Button>
          <Button size="sm" variant="outline" onClick={presetCrit}>RLC crítico</Button>
          <Button size="sm" variant="outline" onClick={presetOver}>RLC super-am.</Button>
        </div>
      </Section>

      <Section title="Fonte e componentes">
        <Row label="V₀ (fonte)" value={`${params.V0.toFixed(1)} V`}>
          <Slider value={[params.V0]} min={0} max={50} step={0.5}
            onValueChange={([v]) => u({ V0: v })} />
        </Row>
        <Row label="R" value={formatSI(params.R, "Ω", 3)}>
          <Slider value={[Math.log10(params.R)]} min={0} max={4} step={0.02}
            onValueChange={([v]) => u({ R: Math.pow(10, v) })} />
        </Row>
        <Row label="L" value={formatSI(params.L, "H", 3)}>
          <Slider value={[Math.log10(params.L)]} min={-5} max={1} step={0.02}
            onValueChange={([v]) => u({ L: Math.pow(10, v) })} />
        </Row>
        {isRLC && (
          <Row label="C" value={formatSI(params.C, "F", 3)}>
            <Slider value={[Math.log10(params.C)]} min={-9} max={-3} step={0.02}
              onValueChange={([v]) => u({ C: Math.pow(10, v) })} />
          </Row>
        )}
      </Section>

      <Section title="Condições iniciais">
        <Row label="I(0)" value={`${params.I_init.toFixed(3)} A`}>
          <Slider value={[params.I_init]} min={-1} max={1} step={0.005}
            onValueChange={([v]) => u({ I_init: v })} />
        </Row>
        {isRLC && (
          <Row label="Vc(0)" value={`${params.Vc_init.toFixed(2)} V`}>
            <Slider value={[params.Vc_init]} min={-20} max={20} step={0.1}
              onValueChange={([v]) => u({ Vc_init: v })} />
          </Row>
        )}
      </Section>

      <Section title="Janela temporal">
        <Row label="tMax" value={formatSI(params.tMax, "s", 3)}>
          <Slider value={[Math.log10(params.tMax)]} min={-6} max={1} step={0.02}
            onValueChange={([v]) => u({ tMax: Math.pow(10, v) })} />
        </Row>
      </Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3 pb-3 border-b border-border last:border-0">
    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
    {children}
  </div>
);
const Row = ({ label, value, children }: { label: string; value: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <span className="font-mono text-xs text-primary tabular-nums">{value}</span>
    </div>
    {children}
  </div>
);