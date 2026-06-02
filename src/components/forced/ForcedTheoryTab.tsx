export const ForcedTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Oscilador forçado e ressonância</h3>
    <p className="text-muted-foreground">
      Uma massa presa a uma mola com amortecimento viscoso e força externa harmônica obedece à equação
      m·ẍ + b·ẋ + k·x = F₀ cos(ωt).
    </p>
    <h4 className="font-display font-semibold mt-6">Solução estacionária</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>x(t) = A(ω) · cos(ωt − φ)</li>
      <li>A(ω) = (F₀/m) / √((ω₀² − ω²)² + (2γω)²)</li>
      <li>φ(ω) = arctan( 2γω / (ω₀² − ω²) )</li>
      <li>ω₀ = √(k/m), &nbsp; γ = b/(2m)</li>
    </ul>
    <h4 className="font-display font-semibold mt-6">Pico de amplitude</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>ω_r = √(ω₀² − 2γ²)  (existe se γ &lt; ω₀/√2)</li>
      <li>Q = ω₀/(2γ): quanto maior, mais estreita e alta a ressonância.</li>
      <li>Largura a meia-potência: Δω ≈ 2γ = ω₀/Q.</li>
    </ul>
    <h4 className="font-display font-semibold mt-6">Roteiro</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Comece com b pequeno e varra ω entre 0 e 3ω₀: identifique o pico em ω_r.</li>
      <li>Aumente b: o pico achata e desloca-se levemente para a esquerda.</li>
      <li>Em ω = ω₀, a defasagem é exatamente π/2.</li>
      <li>Meça a largura entre A_max/√2 e confirme Δω ≈ ω₀/Q.</li>
    </ol>
  </article>
);