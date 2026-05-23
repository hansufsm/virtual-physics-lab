import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PHOTO_MATERIALS, type PhotoelectricParams } from "@/lib/physics";

interface Props { params: PhotoelectricParams; onChange: (p: PhotoelectricParams) => void }

const SOURCES: { name: string; nm: number }[] = [
  { name: "UV-C", nm: 250 },
  { name: "UV-A", nm: 365 },
  { name: "Violeta", nm: 405 },
  { name: "Azul", nm: 470 },
  { name: "Verde", nm: 532 },
  { name: "Vermelho", nm: 650 },
];

export const PhotoelectricControls = ({ params, onChange }: Props) => {
  const u = (patch: Partial<PhotoelectricParams>) => onChange({ ...params, ...patch });
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-5 shadow-card">
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">Fonte e cátodo</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Ajuste λ, intensidade e tensão.</p>
      </div>

      <Section title="Luz incidente">
        <Row label="Comprimento de onda λ" value={`${params.wavelengthNm.toFixed(0)} nm`}>
          <Slider value={[params.wavelengthNm]} min={150} max={750} step={5}
            onValueChange={([v]) => u({ wavelengthNm: v })} />
        </Row>
        <div className="grid grid-cols-3 gap-1.5">
          {SOURCES.map((s) => (
            <Button key={s.name} size="sm" variant={Math.abs(params.wavelengthNm - s.nm) < 3 ? "default" : "outline"}
              onClick={() => u({ wavelengthNm: s.nm })}>{s.name}</Button>
          ))}
        </div>
        <Row label="Intensidade I" value={`${params.intensity.toFixed(1)} W/m²`}>
          <Slider value={[params.intensity]} min={0.1} max={50} step={0.1}
            onValueChange={([v]) => u({ intensity: v })} />
        </Row>
      </Section>

      <Section title="Material do cátodo">
        <div className="grid grid-cols-2 gap-1.5">
          {PHOTO_MATERIALS.map((m) => (
            <Button key={m.name} size="sm" variant={params.materialName === m.name ? "default" : "outline"}
              onClick={() => u({ materialName: m.name, phiEv: m.phiEv })}>
              {m.name}<span className="ml-1 text-[10px] opacity-70">{m.phiEv}</span>
            </Button>
          ))}
        </div>
        <Row label="Função trabalho φ" value={`${params.phiEv.toFixed(2)} eV`}>
          <Slider value={[params.phiEv]} min={1.5} max={6.0} step={0.05}
            onValueChange={([v]) => u({ phiEv: v })} />
        </Row>
        <Row label="Eficiência quântica η" value={`${(params.quantumEfficiency * 100).toFixed(1)} %`}>
          <Slider value={[params.quantumEfficiency]} min={0.001} max={0.5} step={0.001}
            onValueChange={([v]) => u({ quantumEfficiency: v })} />
        </Row>
        <Row label="Área iluminada" value={`${params.areaCm2.toFixed(2)} cm²`}>
          <Slider value={[params.areaCm2]} min={0.1} max={10} step={0.1}
            onValueChange={([v]) => u({ areaCm2: v })} />
        </Row>
      </Section>

      <Section title="Tensão aplicada (ânodo)">
        <Row label="V" value={`${params.voltage.toFixed(2)} V`}>
          <Slider value={[params.voltage]} min={-5} max={5} step={0.05}
            onValueChange={([v]) => u({ voltage: v })} />
        </Row>
        <p className="text-[11px] text-muted-foreground">V &gt; 0 acelera os elétrons; V &lt; 0 freia. Em V = −V_s a corrente cessa.</p>
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