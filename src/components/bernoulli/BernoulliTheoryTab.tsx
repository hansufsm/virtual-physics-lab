export const BernoulliTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Equação de Bernoulli</h3>
    <p className="text-muted-foreground">Para escoamento incompressível, estacionário e sem viscosidade, a soma de pressão estática, dinâmica e gravitacional é constante ao longo de uma linha de corrente:</p>
    <ul className="space-y-2 font-mono text-sm mt-3">
      <li>P + ½ρv² + ρgh = constante</li>
      <li>Continuidade: A₁v₁ = A₂v₂  ⇒  v₂ = v₁ A₁/A₂</li>
      <li>ΔP = ½ρ(v₂² − v₁²) + ρg(h₂ − h₁)</li>
      <li>Vazão: Q = Av  [m³/s]</li>
    </ul>
    <p className="text-sm text-muted-foreground mt-3">No tubo de Venturi, a queda de pressão na garganta permite medir a vazão. A sustentação aerodinâmica de uma asa também segue Bernoulli.</p>
  </article>
);