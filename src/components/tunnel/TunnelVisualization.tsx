import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea } from "recharts";
import type { TunnelParams, TunnelResults } from "@/lib/physics";

export const TunnelVisualization = ({ params, results }: { params: TunnelParams; results: TunnelResults }) => {
  // Schematic of barrier + wave
  const W = 600, H = 220;
  const xBar0 = 250, xBar1 = 350;
  const Vmax = Math.max(params.V0_eV, params.E_eV) * 1.2;
  const yV0 = H - (params.V0_eV / Vmax) * (H - 30) - 10;
  const yE  = H - (params.E_eV / Vmax) * (H - 30) - 10;
  // wavefunction sketch
  const pts: string[] = [];
  const k = results.k_invnm * Math.max(params.a_nm, 0.5) * 0.4;
  for (let i = 0; i < 60; i++) {
    const x = (i / 59) * xBar0;
    const y = yE - 20 * Math.sin(k * (i / 59) * 6);
    pts.push(`${x},${y}`);
  }
  for (let i = 0; i < 30; i++) {
    const x = xBar0 + ((i / 29) * (xBar1 - xBar0));
    const decay = params.E_eV < params.V0_eV ? Math.exp(-results.kappa_invnm * (i / 29) * params.a_nm) : 1;
    const y = yE - 20 * decay * (params.E_eV < params.V0_eV ? 1 : Math.cos(k * (i / 29) * 4));
    pts.push(`${x},${y}`);
  }
  for (let i = 0; i < 60; i++) {
    const x = xBar1 + ((i / 59) * (W - xBar1));
    const amp = 20 * Math.sqrt(Math.max(results.T, 1e-6));
    const y = yE - amp * Math.sin(k * (i / 59) * 6);
    pts.push(`${x},${y}`);
  }
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <h4 className="text-sm font-semibold mb-2">Barreira e função de onda</h4>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56 bg-background rounded-lg">
          <line x1="0" y1={H-10} x2={W} y2={H-10} stroke="hsl(var(--border))" />
          <rect x={xBar0} y={yV0} width={xBar1 - xBar0} height={H - 10 - yV0} fill="hsl(var(--primary))" opacity="0.25" stroke="hsl(var(--primary))" />
          <text x={(xBar0+xBar1)/2} y={yV0 - 6} fontSize="11" fill="hsl(var(--primary))" textAnchor="middle" fontFamily="monospace">V₀ = {params.V0_eV.toFixed(2)} eV</text>
          <line x1="10" y1={yE} x2={W-10} y2={yE} stroke="hsl(var(--accent))" strokeDasharray="4 3" />
          <text x="14" y={yE - 6} fontSize="11" fill="hsl(var(--accent))" fontFamily="monospace">E = {params.E_eV.toFixed(2)} eV</text>
          <polyline points={pts.join(" ")} fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
          <text x={W-100} y="20" fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="monospace">a = {params.a_nm.toFixed(2)} nm</text>
        </svg>
      </div>
      <div className="grid lg:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h4 className="text-sm font-semibold mb-2">T(E) — energia variável</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={results.T_curve_E}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="E_eV" type="number" stroke="hsl(var(--muted-foreground))" tickFormatter={(v)=>v.toFixed(1)}
                label={{ value: "E (eV)", position:"insideBottom", offset:-2, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis scale="log" domain={[1e-10, 1.05]} stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v)=>v.toExponential(0)} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                formatter={(v: number) => v.toExponential(2)} />
              <ReferenceLine x={params.V0_eV} stroke="hsl(var(--accent))" strokeDasharray="3 3" label={{ value: "V₀", fill: "hsl(var(--accent))", fontSize: 11 }} />
              <Line type="monotone" dataKey="T" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h4 className="text-sm font-semibold mb-2">T(a) — largura variável</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={results.T_curve_a}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="a_nm" type="number" stroke="hsl(var(--muted-foreground))" tickFormatter={(v)=>v.toFixed(2)}
                label={{ value: "a (nm)", position:"insideBottom", offset:-2, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis scale="log" domain={[1e-15, 1.05]} stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v)=>v.toExponential(0)} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                formatter={(v: number) => v.toExponential(2)} />
              <ReferenceLine x={params.a_nm} stroke="hsl(var(--accent))" strokeDasharray="3 3" label={{ value: "a", fill: "hsl(var(--accent))", fontSize: 11 }} />
              <Line type="monotone" dataKey="T" stroke="hsl(var(--accent))" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
