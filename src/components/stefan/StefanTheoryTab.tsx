export const StefanTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Radiação térmica</h3>
    <p className="text-muted-foreground">Todo corpo emite radiação eletromagnética. Para um corpo cinza com emissividade ε:</p>
    <ul className="space-y-2 font-mono text-sm mt-3">
      <li>P = εσA T⁴   (Stefan-Boltzmann)</li>
      <li>σ = 5.6704 × 10⁻⁸ W/(m²·K⁴)</li>
      <li>Troca líquida: P_net = εσA (T₁⁴ − T₂⁴)</li>
      <li>λ_máx · T = b = 2.898 × 10⁻³ m·K  (lei de Wien)</li>
      <li>B(λ,T) = (2hc²/λ⁵) · 1/(exp(hc/λkT) − 1)  (Planck)</li>
    </ul>
    <p className="text-sm text-muted-foreground mt-3">Sol (~5800 K) → λ_máx ≈ 500 nm (verde). Corpo humano (~310 K) → λ_máx ≈ 9 μm (IR).</p>
  </article>
);