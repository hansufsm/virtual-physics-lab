import { formatSI } from "@/lib/physics";
import type { DCMotorResults } from "@/lib/physics";

interface Props { results: DCMotorResults; rpmLive: number; iLive: number; torqueLive: number }

export const MotorMeasurements = ({ results, rpmLive, iLive, torqueLive }: Props) => {
  const items = [
    { label: "Velocidade (ao vivo)", value: `${rpmLive.toFixed(0)} RPM`, accent: true },
    { label: "Corrente (ao vivo)", value: formatSI(iLive, "A", 3), accent: true },
    { label: "Torque (ao vivo)", value: `${(torqueLive * 1000).toFixed(2)} mN·m` },
    { label: "Velocidade em regime", value: `${results.rpmSteady.toFixed(1)} RPM` },
    { label: "Velocidade sem carga", value: `${results.rpmNoLoad.toFixed(1)} RPM` },
    { label: "Corrente em regime", value: formatSI(results.iSteady, "A", 3) },
    { label: "F.c.e.m. em regime", value: `${results.bemfSteady.toFixed(2)} V` },
    { label: "Constante kT", value: formatSI(results.kT, "N·m/A", 3) },
    { label: "Constante kE", value: formatSI(results.kE, "V·s/rad", 3) },
    { label: "Corrente de partida", value: formatSI(results.iStall, "A", 3) },
    { label: "Torque de partida", value: `${(results.tStall * 1000).toFixed(2)} mN·m` },
    { label: "Potência elétrica", value: formatSI(results.pIn, "W", 3) },
    { label: "Potência mecânica", value: formatSI(results.pMech, "W", 3), accent: true },
    { label: "Perda Joule R·I²", value: formatSI(results.pLoss, "W", 3) },
    { label: "Eficiência η", value: `${(results.efficiency * 100).toFixed(1)} %`, accent: true },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="font-display text-base font-semibold mb-4">Medições</h3>
      <dl className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">{it.label}</dt>
            <dd className={`font-mono tabular-nums ${it.accent ? "text-primary font-semibold" : "text-foreground"}`}>
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};