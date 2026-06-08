export const CarnotTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Ciclo de Carnot</h3>
    <p className="text-muted-foreground">Ciclo reversível composto por duas isotermas e duas adiabáticas, operando entre os reservatórios Th &gt; Tc.</p>
    <h4 className="font-display font-semibold mt-4">Fórmulas</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>Q_h = nR·Th·ln(V₂/V₁)</li>
      <li>Q_c = nR·Tc·ln(V₃/V₄)</li>
      <li>Adiabáticas: T·V^(γ−1) = const ⇒ V₃/V₂ = V₄/V₁ = (Th/Tc)^(1/(γ−1))</li>
      <li>η_Carnot = 1 − Tc/Th = W/Q_h</li>
      <li>η_Otto = 1 − r^(1−γ), r = V_max/V_min</li>
    </ul>
    <h4 className="font-display font-semibold mt-4">Observações</h4>
    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
      <li>Carnot é o limite superior de eficiência entre Th e Tc (2ª lei).</li>
      <li>Otto sempre tem η inferior a Carnot para os mesmos extremos.</li>
      <li>Variar Tc → 0 aproxima η → 100%, mas é inatingível (3ª lei).</li>
    </ul>
  </article>
);