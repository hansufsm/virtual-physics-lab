export const StokesTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Lei de Stokes</h3>
    <p className="text-muted-foreground">Para uma esfera de raio r em movimento lento (Re ≪ 1) num fluido de viscosidade η, a força de arrasto é:</p>
    <ul className="space-y-2 font-mono text-sm mt-3">
      <li>F_d = 6π η r v</li>
      <li>Equilíbrio: m_s g = m_f g + F_d  (peso = empuxo + arrasto)</li>
      <li>v_t = 2(ρ_s − ρ_f) g r² / (9η)</li>
      <li>τ = m / (6π η r) ;  v(t) = v_t (1 − e^(−t/τ))</li>
      <li>Re = 2 ρ_f v r / η  &lt; 1 para Stokes ser válida</li>
    </ul>
    <p className="text-sm text-muted-foreground mt-3">É a base do viscosímetro de queda de esfera e do princípio do experimento da gota de óleo de Millikan.</p>
  </article>
);