export const SpringTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Lei de Hooke e MHS</h3>
    <p className="text-muted-foreground">Para pequenas deformações, a força restauradora é proporcional ao deslocamento: F = −kx. O movimento resultante é o oscilador harmônico simples.</p>
    <h4 className="font-display mt-4">Equações</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>F = −k·x          (Lei de Hooke)
m·ẍ = −k·x        → ẍ + ω²·x = 0
ω = √(k/m)        T = 2π√(m/k)     f = 1/T
x(t) = A cos(ωt + φ)
U = ½ k x²        E_total = ½ k A²</code></pre>
    <h4 className="font-display mt-4">Associação de molas</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>Série:    1/k_eq = 1/k₁ + 1/k₂   (k_eq menor)
Paralelo: k_eq   = k₁ + k₂        (k_eq maior)</code></pre>
    <h4 className="font-display mt-4">Mola vertical</h4>
    <p className="text-muted-foreground">A gravidade só desloca o ponto de equilíbrio: x_eq = mg/k. O período T = 2π√(m/k) <strong>não muda</strong> com g.</p>
  </div>
);