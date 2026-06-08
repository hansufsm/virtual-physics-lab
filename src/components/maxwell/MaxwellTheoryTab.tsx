export const MaxwellTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Distribuição de Maxwell-Boltzmann</h3>
    <p className="text-muted-foreground">f(v) dá a densidade de probabilidade do módulo da velocidade das moléculas em um gás em equilíbrio térmico a T.</p>
    <ul className="space-y-2 font-mono text-sm mt-3">
      <li>f(v) = 4π·(M/(2πRT))^(3/2)·v²·exp(−Mv²/(2RT))</li>
      <li>v_mp = √(2RT/M)  (moda)</li>
      <li>v̄ = √(8RT/(πM))  (média)</li>
      <li>v_rms = √(3RT/M)  (raiz quadrática média)</li>
      <li>Razão: v_mp : v̄ : v_rms ≈ 1 : 1.128 : 1.225</li>
    </ul>
    <p className="text-sm text-muted-foreground mt-3">Aumentar T desloca o pico para v maiores e alarga a distribuição. Gases mais leves (M menor) também têm picos em v mais altas.</p>
  </article>
);