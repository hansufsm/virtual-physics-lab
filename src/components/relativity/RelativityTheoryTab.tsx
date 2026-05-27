export const RelativityTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-4">
    <h2 className="font-display text-xl font-bold mt-0">Relatividade especial</h2>

    <h3 className="font-display font-semibold">1. Postulados de Einstein (1905)</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>As leis da física têm a mesma forma em todos os referenciais inerciais.</li>
      <li>A velocidade da luz no vácuo c é a mesma em qualquer referencial inercial.</li>
    </ul>

    <h3 className="font-display font-semibold">2. Transformações de Lorentz</h3>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
x' = γ(x − vt),   t' = γ(t − vx/c²),   γ = 1 / √(1 − β²),   β = v/c
    </pre>

    <h3 className="font-display font-semibold">3. Dilatação do tempo e contração de Lorentz</h3>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
Δt = γ · Δt₀     (tempo próprio Δt₀ é medido no referencial do relógio)
L  = L₀ / γ      (comprimento próprio L₀ é medido no referencial do objeto)
    </pre>

    <h3 className="font-display font-semibold">4. Composição relativística de velocidades</h3>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
u = (u' + v) / (1 + u'v/c²)
    </pre>
    <p>
      Garante que nunca somamos velocidades acima de c: se u' = c, então u = c também.
    </p>

    <h3 className="font-display font-semibold">5. Paradoxo dos gêmeos</h3>
    <p>
      Para uma viagem de distância própria D (anos-luz) ida e volta a velocidade β·c:
    </p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
t_Terra  = 2D / β     (anos)
t_viajante = t_Terra / γ = 2D √(1 − β²) / β
    </pre>
    <p>
      Não há paradoxo real: o viajante sofre aceleração para inverter sua rota — sua linha de mundo não é inercial.
    </p>

    <h3 className="font-display font-semibold">6. Energia e momento</h3>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
E = γ m c²,    p = γ m v,    E² = (pc)² + (mc²)²
    </pre>

    <h3 className="font-display font-semibold">7. Evidências experimentais</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Decaimento de múons cósmicos (γ ≈ 30): chegam ao solo apesar de τ ≈ 2.2 μs.</li>
      <li>Experimentos Ives–Stilwell (efeito Doppler relativístico transverso).</li>
      <li>Hafele–Keating (1971): relógios atômicos em aviões comerciais.</li>
      <li>GPS exige correções relativísticas (especial + geral).</li>
    </ul>
  </div>
);