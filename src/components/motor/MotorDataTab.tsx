import { useMemo } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { computeDCMotor, dcMotorTorqueAtAngle, type DCMotorParams } from "@/lib/physics";

interface Props { params: DCMotorParams }

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