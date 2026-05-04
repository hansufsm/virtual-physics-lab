import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Save, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { computeDCMotor, dcMotorTorqueAtAngle, type DCMotorParams } from "@/lib/physics";

interface Props { params: DCMotorParams }

type SweepKey = "bField" | "resistanceOhm" | "voltage";
type Spacing = "linear" | "log";
type SweepRanges = Record<SweepKey, { min: number; max: number }>;
interface SweepPreset {
  name: string;
  sweepKey: SweepKey;
  spacing: Spacing;
  steps: number;
  ranges: SweepRanges;
  builtin?: boolean;
}

const SWEEP_META: Record<SweepKey, {
  label: string; unit: string;
  defMin: number; defMax: number;
  hardMin: number; hardMax: number;
  fmt: (v: number) => string;
}> = {
  bField:        { label: "Campo B",       unit: "T", defMin: 0.05, defMax: 1.5, hardMin: 1e-4, hardMax: 10,    fmt: (v) => `${v.toFixed(3)} T` },
  resistanceOhm: { label: "Resistência R", unit: "Ω", defMin: 0.5,  defMax: 20,  hardMin: 1e-3, hardMax: 1000,  fmt: (v) => `${v.toFixed(2)} Ω` },
  voltage:       { label: "Tensão V",      unit: "V", defMin: 1,    defMax: 24,  hardMin: 0,    hardMax: 240,   fmt: (v) => `${v.toFixed(2)} V` },
};

const SWEEP_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-1, var(--primary)))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
];

const DEFAULT_RANGES: SweepRanges = {
  bField:        { min: SWEEP_META.bField.defMin,        max: SWEEP_META.bField.defMax },
  resistanceOhm: { min: SWEEP_META.resistanceOhm.defMin, max: SWEEP_META.resistanceOhm.defMax },
  voltage:       { min: SWEEP_META.voltage.defMin,       max: SWEEP_META.voltage.defMax },
};

const BUILTIN_PRESETS: SweepPreset[] = [
  {
    name: "Faixa padrão", builtin: true, sweepKey: "bField", spacing: "linear", steps: 5,
    ranges: DEFAULT_RANGES,
  },
  {
    name: "Faixa intensa", builtin: true, sweepKey: "bField", spacing: "linear", steps: 10,
    ranges: {
      bField:        { min: 0.1, max: 3 },
      resistanceOhm: { min: 0.5, max: 50 },
      voltage:       { min: 1,   max: 48 },
    },
  },
  {
    name: "Log amplo (R)", builtin: true, sweepKey: "resistanceOhm", spacing: "log", steps: 8,
    ranges: {
      bField:        DEFAULT_RANGES.bField,
      resistanceOhm: { min: 0.1, max: 200 },
      voltage:       DEFAULT_RANGES.voltage,
    },
  },
];

const STORAGE_KEY = "motor.sweep.presets.v1";

export const MotorDataTab = ({ params }: Props) => {
  const r = useMemo(() => computeDCMotor(params), [params]);

  // Curva torque × velocidade (linear): T(ω) = kT·(V - kE·ω)/R
  const tvsOmega = useMemo(() => {
    const N = 60;
    const out: { rpm: number; T_mNm: number; I_mA: number }[] = [];
    const omegaMax = r.omegaNoLoad * 1.05;
    for (let k = 0; k <= N; k++) {
      const w = (k / N) * omegaMax;
      const i = (params.voltage - r.kE * w) / Math.max(1e-3, params.resistanceOhm);
      const T = r.kT * i;
      out.push({ rpm: +(w * 60 / (2 * Math.PI)).toFixed(2), T_mNm: +(T * 1000).toFixed(3), I_mA: +(i * 1000).toFixed(2) });
    }
    return out;
  }, [params, r]);

  // Torque instantâneo τ(θ) = N·B·I·A·|cos θ|
  const tvsTheta = useMemo(() => {
    const N = 180;
    const out: { theta_deg: number; T_mNm: number }[] = [];
    for (let k = 0; k <= N; k++) {
      const th = (k / N) * 2 * Math.PI;
      out.push({ theta_deg: +(th * 180 / Math.PI).toFixed(1), T_mNm: +(dcMotorTorqueAtAngle(params, r.iSteady, th) * 1000).toFixed(3) });
    }
    return out;
  }, [params, r]);

  // ───────── Varredura paramétrica (B, R ou V) ─────────
  const [sweepKey, setSweepKey] = useState<SweepKey>("bField");
  const [steps, setSteps] = useState(5);
  const [spacing, setSpacing] = useState<Spacing>("linear");
  const [ranges, setRanges] = useState<SweepRanges>(DEFAULT_RANGES);

  // Presets salvos do usuário (persistidos em localStorage)
  const [userPresets, setUserPresets] = useState<SweepPreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>("Faixa padrão");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUserPresets(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const persist = (next: SweepPreset[]) => {
    setUserPresets(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const applyPreset = (p: SweepPreset) => {
    setSweepKey(p.sweepKey);
    setSpacing(p.spacing);
    setSteps(p.steps);
    setRanges(p.ranges);
    setActivePreset(p.name);
    toast({ title: "Preset aplicado", description: p.name });
  };

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) {
      toast({ title: "Dê um nome ao preset", description: "Digite um nome antes de salvar." });
      return;
    }
    if (BUILTIN_PRESETS.some((b) => b.name === name)) {
      toast({ title: "Nome reservado", description: "Esse nome é usado por um preset embutido." });
      return;
    }
    const snapshot: SweepPreset = { name, sweepKey, spacing, steps, ranges };
    const next = [...userPresets.filter((p) => p.name !== name), snapshot];
    persist(next);
    setPresetName("");
    setActivePreset(name);
    toast({ title: "Preset salvo", description: name });
  };

  const deletePreset = (name: string) => {
    persist(userPresets.filter((p) => p.name !== name));
    if (activePreset === name) setActivePreset(null);
  };

  const range = ranges[sweepKey];
  const setRange = (patch: Partial<{ min: number; max: number }>) => {
    setRanges((r) => ({ ...r, [sweepKey]: { ...r[sweepKey], ...patch } }));
    setActivePreset(null);
  };

  const sweepData = useMemo(() => {
    const meta = SWEEP_META[sweepKey];
    const lo = Math.max(meta.hardMin, Math.min(range.min, range.max));
    const hi = Math.min(meta.hardMax, Math.max(range.min, range.max));
    const useLog = spacing === "log" && lo > 0 && hi > 0 && hi / Math.max(lo, 1e-12) > 1.0001;
    const values: number[] = [];
    const n = Math.max(2, steps);
    for (let k = 0; k < n; k++) {
      const t = k / (n - 1);
      const v = useLog ? lo * Math.pow(hi / lo, t) : lo + t * (hi - lo);
      values.push(+v.toPrecision(4));
    }

    // Domínio de ω comum: usa o maior ω sem carga entre as variantes
    let omegaMaxGlobal = 0;
    const variants = values.map((val) => {
      const p = { ...params, [sweepKey]: val } as DCMotorParams;
      const rr = computeDCMotor(p);
      omegaMaxGlobal = Math.max(omegaMaxGlobal, rr.omegaNoLoad);
      return { val, p, r: rr };
    });
    omegaMaxGlobal = omegaMaxGlobal * 1.05 || 1;

    const N = 80;
    // Pontos no eixo ω; cada ponto traz T_<val> e Eta_<val> para todas as variantes
    const torquePoints: Record<string, number>[] = [];
    const effPoints: Record<string, number>[] = [];
    for (let k = 0; k <= N; k++) {
      const omega = (k / N) * omegaMaxGlobal;
      const rpm = +(omega * 60 / (2 * Math.PI)).toFixed(2);
      const tRow: Record<string, number> = { rpm };
      const eRow: Record<string, number> = { rpm };
      for (const v of variants) {
        const R = Math.max(1e-3, v.p.resistanceOhm);
        const i = (v.p.voltage - v.r.kE * omega) / R;
        const tElec = v.r.kT * i;
        const tFric = Math.max(0, v.p.frictionCoef) * omega;
        const tShaft = tElec - tFric;
        const pIn = v.p.voltage * i;
        const pMech = tShaft * omega;
        const eta = pIn > 0 ? Math.max(0, Math.min(1, pMech / pIn)) : 0;
        const key = `v${v.val}`;
        tRow[key] = +(tElec * 1000).toFixed(3);
        eRow[key] = +(eta * 100).toFixed(2);
      }
      torquePoints.push(tRow);
      effPoints.push(eRow);
    }
    return { variants, torquePoints, effPoints };
  }, [params, sweepKey, steps, spacing, range.min, range.max]);

  const meta = SWEEP_META[sweepKey];

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["rpm", "T_mNm", "I_mA"],
      ...tvsOmega.map((p) => [p.rpm, p.T_mNm, p.I_mA]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "motor_torque_velocidade.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          A curva T(ω) é linear em motores DC: torque máximo na partida (ω=0) e zero a vazio (ω₀).
          A velocidade de operação é o ponto onde T_motor = T_carga + b·ω.
        </p>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-4 w-4 mr-2" /> Exportar T(ω)
        </Button>
      </div>

      <ChartCard title="Torque × velocidade angular" subtitle="T(ω) = kT(V − kE·ω)/R — característica do motor DC.">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={tvsOmega} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="rpm" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "n (RPM)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis yAxisId="L" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "T (mN·m)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <YAxis yAxisId="R" orientation="right" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "I (mA)", angle: 90, position: "insideRight", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(3)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine yAxisId="L" x={r.rpmSteady} stroke="hsl(var(--accent))" strokeDasharray="4 4"
              label={{ value: "regime", position: "top", fontSize: 11, fill: "hsl(var(--accent))" }} />
            <Line yAxisId="L" type="monotone" dataKey="T_mNm" name="T (mN·m)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line yAxisId="R" type="monotone" dataKey="I_mA" name="I (mA)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Torque instantâneo τ(θ)" subtitle="Em uma espira: τ = N·B·I·A·|cos θ|. Comutador retifica para manter sentido.">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={tvsTheta} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis dataKey="theta_deg" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "θ (°)", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
              label={{ value: "τ (mN·m)", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => v.toFixed(3)} />
            <Line type="monotone" dataKey="T_mNm" name="τ (mN·m)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-display font-semibold text-sm">Varredura paramétrica em tempo real</h4>
            <p className="text-xs text-muted-foreground">
              Selecione um parâmetro para varrer e compare as curvas T(ω) e η(ω) lado a lado.
              As demais variáveis seguem os controles à esquerda.
            </p>
          </div>
          <div className="flex items-center gap-1">
            {(Object.keys(SWEEP_META) as SweepKey[]).map((k) => (
              <Button
                key={k}
                size="sm"
                variant={sweepKey === k ? "default" : "outline"}
                onClick={() => { setSweepKey(k); setActivePreset(null); }}
                className="h-8"
              >
                {SWEEP_META[k].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Presets de varredura */}
        <div className="px-5 py-3 border-b border-border space-y-2">
          <div className="flex items-baseline justify-between">
            <Label className="text-xs font-medium text-foreground">Presets de varredura</Label>
            <span className="text-[11px] text-muted-foreground">
              {activePreset ? `Ativo: ${activePreset}` : "Configuração personalizada"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BUILTIN_PRESETS.map((p) => (
              <Button
                key={p.name}
                size="sm"
                variant={activePreset === p.name ? "default" : "outline"}
                onClick={() => applyPreset(p)}
                className="h-7 text-xs"
              >
                {p.name}
              </Button>
            ))}
            {userPresets.map((p) => (
              <span key={p.name} className="inline-flex items-center rounded-md border border-border overflow-hidden">
                <Button
                  size="sm"
                  variant={activePreset === p.name ? "default" : "ghost"}
                  onClick={() => applyPreset(p)}
                  className="h-7 rounded-none text-xs"
                >
                  {p.name}
                </Button>
                <button
                  type="button"
                  onClick={() => deletePreset(p.name)}
                  className="h-7 px-1.5 text-muted-foreground hover:text-destructive border-l border-border"
                  aria-label={`Excluir preset ${p.name}`}
                  title="Excluir preset"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Nome do preset (ex.: faixa de bancada)"
              className="h-8 text-xs"
              onKeyDown={(e) => { if (e.key === "Enter") savePreset(); }}
            />
            <Button size="sm" variant="outline" onClick={savePreset} className="h-8 shrink-0">
              <Save className="h-3.5 w-3.5 mr-1.5" /> Salvar atual
            </Button>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-border space-y-3">
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">
                Mínimo ({meta.unit})
              </Label>
              <Input
                type="number"
                value={range.min}
                min={meta.hardMin}
                max={meta.hardMax}
                step="any"
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!Number.isNaN(v)) setRange({ min: v });
                }}
                className="h-8 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">
                Máximo ({meta.unit})
              </Label>
              <Input
                type="number"
                value={range.max}
                min={meta.hardMin}
                max={meta.hardMax}
                step="any"
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!Number.isNaN(v)) setRange({ max: v });
                }}
                className="h-8 font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-foreground">Espaçamento</Label>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={spacing === "linear" ? "default" : "outline"}
                  className="h-8"
                  onClick={() => { setSpacing("linear"); setActivePreset(null); }}
                >
                  Linear
                </Button>
                <Button
                  size="sm"
                  variant={spacing === "log" ? "default" : "outline"}
                  className="h-8"
                  onClick={() => { setSpacing("log"); setActivePreset(null); }}
                  disabled={range.min <= 0 || range.max <= 0}
                >
                  Log
                </Button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label className="text-xs font-medium text-foreground">Número de variações</Label>
                <span className="font-mono text-xs text-primary tabular-nums">{steps}</span>
              </div>
              <Slider value={[steps]} min={2} max={20} step={1} onValueChange={([v]) => setSteps(v)} />
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs"
              onClick={() => {
                setRange({ min: meta.defMin, max: meta.defMax });
                setSpacing("linear");
                setSteps(5);
              }}
            >
              Resetar
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sweepData.variants.map((v, i) => (
              <span key={`${v.val}-${i}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[11px] font-mono">
                <span className="h-2 w-2 rounded-full" style={{ background: SWEEP_COLORS[i % SWEEP_COLORS.length] }} />
                {meta.fmt(v.val)}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-3 p-3">
          <div>
            <p className="px-2 pb-1 text-xs text-muted-foreground">Torque T(ω) — variando {meta.label}</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={sweepData.torquePoints} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="rpm" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
                  label={{ value: "n (RPM)", position: "insideBottom", offset: -2, fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
                  label={{ value: "T (mN·m)", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => v.toFixed(3)} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                {sweepData.variants.map((v, i) => (
                  <Line key={`t-${v.val}-${i}`} type="monotone" dataKey={`v${v.val}`}
                    name={meta.fmt(v.val)}
                    stroke={SWEEP_COLORS[i % SWEEP_COLORS.length]}
                    strokeWidth={1.8} dot={false} isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="px-2 pb-1 text-xs text-muted-foreground">Eficiência η(ω) — variando {meta.label}</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={sweepData.effPoints} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="rpm" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }}
                  label={{ value: "n (RPM)", position: "insideBottom", offset: -2, fontSize: 11 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} domain={[0, 100]}
                  label={{ value: "η (%)", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => `${(+v).toFixed(2)} %`} />
                {sweepData.variants.map((v, i) => (
                  <Line key={`e-${v.val}-${i}`} type="monotone" dataKey={`v${v.val}`}
                    name={meta.fmt(v.val)}
                    stroke={SWEEP_COLORS[i % SWEEP_COLORS.length]}
                    strokeWidth={1.8} dot={false} isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
    <div className="px-5 py-3 border-b border-border">
      <h4 className="font-display font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
    <div className="p-3">{children}</div>
  </div>
);