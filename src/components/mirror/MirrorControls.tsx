import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MirrorParams, MirrorKind } from "@/lib/physics";

interface Props { params: MirrorParams; onChange: (p: MirrorParams) => void }
export const MirrorControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<MirrorParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Configuração</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Tipo de espelho e posicionamento.</p>
      </div>
      <Section title="Tipo de espelho">
        <div className="grid grid-cols-2 gap-1.5">
          {(["concave","convex"] as MirrorKind[]).map((k) => (
            <Button key={k} size="sm" variant={params.kind === k ? "default" : "outline"} onClick={() => u({ kind: k })}>
              {k === "concave" ? "Côncavo" : "Convexo"}
            </Button>
          ))}
        </div>
      </Section>
      <Section title="Raio de curvatura R">
        <Row label="R" value={`${params.R_cm.toFixed(1)} cm`}>
          <Slider value={[params.R_cm]} min={5} max={200} step={0.5} onValueChange={([v]) => u({ R_cm: v })} />
        </Row>
        <p className="text-[11px] text-muted-foreground">Foco f = R/2 = {(params.R_cm/2).toFixed(2)} cm {params.kind === "convex" ? "(virtual, negativo)" : ""}</p>
      </Section>
      <Section title="Distância do objeto p">
        <Row label="p" value={`${params.p_cm.toFixed(1)} cm`}>
          <Slider value={[params.p_cm]} min={1} max={300} step={0.5} onValueChange={([v]) => u({ p_cm: v })} />
        </Row>
      </Section>
      <Section title="Altura do objeto h">
        <Row label="h" value={`${params.h_obj_cm.toFixed(1)} cm`}>
          <Slider value={[params.h_obj_cm]} min={0.5} max={20} step={0.1} onValueChange={([v]) => u({ h_obj_cm: v })} />
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