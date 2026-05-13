export const PendulumTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Pêndulo simples e MHS</h3>
    <p className="text-muted-foreground">
      Um pêndulo simples consiste em uma massa puntiforme m presa por um fio inextensível de comprimento L em um campo
      gravitacional uniforme. O torque restaurador em torno do pivô leva à equação de movimento angular.
    </p>

    <h4 className="font-display font-semibold mt-6">Equação de movimento</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Não-linear:</span> θ̈ + (b/m) θ̇ + (g/L) sin θ = 0</li>
      <li><span className="text-primary font-semibold">Pequenos ângulos (sin θ ≈ θ):</span> θ̈ + 2γ θ̇ + ω₀² θ = 0, &nbsp; ω₀ = √(g/L)</li>
      <li><span className="text-primary font-semibold">Período (linear):</span> T₀ = 2π √(L/g)</li>
      <li><span className="text-primary font-semibold">Correção de amplitude:</span> T ≈ T₀ (1 + θ₀²/16 + 11 θ₀⁴/3072 + …)</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Energia</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>E_cin = ½ m L² θ̇²</li>
      <li>E_pot = m g L (1 − cos θ)  &nbsp;≈ ½ m g L θ²</li>
      <li>Sem amortecimento: E_total = const.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Amortecimento</h4>
    <p className="text-sm text-muted-foreground">
      Para amortecimento viscoso linear (γ = b/(2m) por convenção crítica), as soluções são:
    </p>
    <ul className="list-disc pl-5 text-sm space-y-1">
      <li><strong>Subamortecido</strong> (γ &lt; ω₀): oscilação com envelope exponencial e ω' = √(ω₀² − γ²).</li>
      <li><strong>Crítico</strong> (γ = ω₀): retorno ao equilíbrio sem oscilar, no menor tempo possível.</li>
      <li><strong>Superamortecido</strong> (γ &gt; ω₀): retorno lento ao equilíbrio sem oscilar.</li>
      <li>Fator de qualidade: <span className="font-mono">Q = ω₀ m / b</span> (quanto maior, mais lentamente a amplitude decai).</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Use ângulo pequeno (θ₀ ≤ 10°) e b = 0. Compare T medido com T₀ = 2π√(L/g).</li>
      <li>Aumente θ₀ até 60°–120° e observe o desvio crescente em relação ao período linear.</li>
      <li>Alterne entre modelo linear e não-linear: a divergência em grandes ângulos é evidente.</li>
      <li>Aumente b: o envelope da amplitude decai exponencialmente; meça Q a partir do tempo característico.</li>
      <li>Varie g (Lua/Marte) e veja T ∝ 1/√g; varie L e confirme T ∝ √L na aba "T(L)".</li>
      <li>Use o espaço de fase (θ × θ̇) para visualizar órbitas fechadas (sem amortecimento) ou espirais (com amortecimento).</li>
    </ol>
  </article>
);