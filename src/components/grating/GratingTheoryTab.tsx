export const GratingTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Rede de difração</h3>
    <p className="text-muted-foreground">
      Uma rede de difração consiste em milhares de fendas estreitas equidistantes. A interferência construtiva
      entre todas elas produz máximos extremamente nítidos apenas nas direções θ_m que satisfazem:
    </p>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>d sin θ_m = m λ,  m = 0, ±1, ±2, …</code></pre>
    <h4 className="font-display mt-4">Intensidade</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>I(θ) ∝ [sin(N δ/2) / (N sin(δ/2))]²
δ = (2π d / λ) sin θ</code></pre>
    <p className="text-muted-foreground">Para N grande, os picos têm largura ~ λ/(Nd cos θ) — muito mais estreitos que na fenda dupla.</p>
    <h4 className="font-display mt-4">Dispersão angular e poder resolvente</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>D = dθ/dλ = m / (d cos θ)         (dispersão)
R = λ/Δλ = m · N                  (poder resolvente)</code></pre>
    <ul className="text-muted-foreground">
      <li>Uma rede de 1200 l/mm com 25 mm iluminados: N = 30 000, R = 30 000 em m=1 ⇒ resolve as linhas do sódio (Δλ ≈ 0,6 nm).</li>
      <li>A ordem máxima visível é m_max = ⌊d/λ⌋.</li>
      <li>Espectrômetros modernos usam redes em vez de prismas — dispersão linear em λ e maior resolução.</li>
    </ul>
  </div>
);
