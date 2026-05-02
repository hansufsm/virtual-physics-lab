export const RLCTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Circuito RLC série e ressonância</h3>
    <p className="text-muted-foreground">
      Em um circuito RLC série excitado por uma fonte senoidal, a impedância complexa é
      Z = R + j(ωL − 1/ωC). A corrente é máxima quando a parte imaginária se anula —
      condição de ressonância.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações principais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Reatâncias:</span> X_L = ωL, &nbsp; X_C = 1/(ωC)</li>
      <li><span className="text-primary font-semibold">Impedância:</span> |Z| = √(R² + (X_L − X_C)²)</li>
      <li><span className="text-primary font-semibold">Defasagem:</span> tan φ = (X_L − X_C)/R</li>
      <li><span className="text-primary font-semibold">Ressonância:</span> ω₀ = 1/√(LC), &nbsp; f₀ = 1/(2π√(LC))</li>
      <li><span className="text-primary font-semibold">Fator de qualidade:</span> Q = (1/R)·√(L/C) = ω₀L/R</li>
      <li><span className="text-primary font-semibold">Largura de banda:</span> Δω = ω₀/Q &nbsp;⇒&nbsp; Δf = f₀/Q</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Comportamento por região</h4>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li><strong>f &lt; f₀:</strong> X_C domina ⇒ circuito capacitivo, φ &lt; 0 (corrente adianta a tensão).</li>
      <li><strong>f = f₀:</strong> X_L = X_C ⇒ |Z| = R, corrente máxima, φ = 0.</li>
      <li><strong>f &gt; f₀:</strong> X_L domina ⇒ circuito indutivo, φ &gt; 0 (corrente atrasa).</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Calcule f₀ teórico para os valores de L e C, depois sintonize a fonte usando o botão.</li>
      <li>Observe que V_L e V_C podem ser muito maiores que a fonte (sobretensão de ressonância).</li>
      <li>Reduza R e veja Q crescer: pico mais estreito e seletivo.</li>
      <li>Faça uma varredura, identifique os pontos onde I = I_máx/√2 e meça Δf experimental.</li>
      <li>Compare Δf medido com f₀/Q teórico.</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      Aplicações: filtros passa-faixa, sintonia de rádio (LC tank), correção de fator de potência, ressonadores.
    </p>
  </article>
);