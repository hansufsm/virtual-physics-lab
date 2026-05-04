import { useMemo, useState } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { computeDCMotor, dcMotorTorqueAtAngle, type DCMotorParams } from "@/lib/physics";

interface Props { params: DCMotorParams }

type SweepKey = "bField" | "resistanceOhm" | "voltage";

const SWEEP_META: Record<SweepKey, { label: string; unit: string; min: number; max: number; fmt: (v: number) => string }> = {
  bField:        { label: "Campo B",     unit: "T", min: 0.05, max: 1.5, fmt: (v) => `${v.toFixed(2)} T` },
  resistanceOhm: { label: "Resistência R", unit: "Ω", min: 0.5,  max: 20,  fmt: (v) => `${v.toFixed(2)} Ω` },
  voltage:       { label: "Tensão V",    unit: "V", min: 1,    max: 24,  fmt: (v) => `${v.toFixed(1)} V` },
};

const SWEEP_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-1, var(--primary)))",
  "hsl(var(--destructive))",
  "hsl(var(--muted-foreground))",
];

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

  const sweepData = useMemo(() => {
    const meta = SWEEP_META[sweepKey];
    const values: number[] = [];
    for (let k = 0; k < steps; k++) {
      values.push(+(meta.min + (k / Math.max(1, steps - 1)) * (meta.max - meta.min)).toPrecision(3));
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
  }, [params, sweepKey, steps]);

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
                onClick={() => setSweepKey(k)}
                className="h-8"
              >
                {SWEEP_META[k].label}
              </Button>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 border-b border-border grid sm:grid-cols-[1fr_auto] gap-4 items-center">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label className="text-xs font-medium text-foreground">Número de variações</Label>
              <span className="font-mono text-xs text-primary tabular-nums">{steps}</span>
            </div>
            <Slider value={[steps]} min={2} max={5} step={1} onValueChange={([v]) => setSteps(v)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sweepData.variants.map((v, i) => (
              <span key={v.val} className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[11px] font-mono">
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
                  <Line key={v.val} type="monotone" dataKey={`v${v.val}`}
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
                  <Line key={v.val} type="monotone" dataKey={`v${v.val}`}
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