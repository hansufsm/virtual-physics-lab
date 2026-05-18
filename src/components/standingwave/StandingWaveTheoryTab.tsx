export const StandingWaveTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Ondas estacionárias em corda</h3>
    <p className="text-muted-foreground">
      Uma onda transversal em uma corda esticada propaga-se com velocidade que depende apenas da
      tração e da densidade linear de massa do meio. Quando a corda é vinculada nas extremidades,
      apenas certas frequências discretas (modos normais) resultam em ondas estacionárias estáveis.
    </p>

    <h4 className="font-display font-semibold mt-6">Velocidade da onda</h4>
    <p className="font-mono text-sm">v = √(T/μ)</p>

    <h4 className="font-display font-semibold mt-6">Modos normais — corda fixa nas duas pontas</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>λₙ = 2L/n</li>
      <li>fₙ = n · v/(2L) = (n/2L)·√(T/μ)</li>
      <li>n = 1, 2, 3, … (fundamental e harmônicos)</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Modos — uma ponta fixa e outra livre</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>λₙ = 4L/(2n − 1)</li>
      <li>fₙ = (2n − 1)·v/(4L)</li>
      <li>Apenas harmônicos ímpares aparecem.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Função de onda</h4>
    <p className="text-sm text-muted-foreground">Para corda fixa-fixa, sobrepondo duas ondas progressivas opostas:</p>
    <p className="font-mono text-sm">y(x, t) = A sin(kₙ x) cos(ωₙ t),  kₙ = nπ/L,  ωₙ = 2π fₙ</p>

    <h4 className="font-display font-semibold mt-6">Nós e ventres</h4>
    <ul className="list-disc pl-5 text-sm space-y-1">
      <li><strong>Nós:</strong> pontos imóveis, sin(kx) = 0. Número de nós = n + 1 (fixa-fixa).</li>
      <li><strong>Ventres:</strong> amplitude máxima, |sin(kx)| = 1. Número de ventres = n.</li>
      <li>A distância entre nós consecutivos é λ/2.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Energia média</h4>
    <p className="font-mono text-sm">⟨E⟩ = (1/4) μ L ω² A²</p>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Comece com n = 1 fixa-fixa: identifique a frequência fundamental.</li>
      <li>Aumente n e confirme que fₙ = n·f₁ (série harmônica).</li>
      <li>Dobre a tração T: a frequência deve multiplicar por √2.</li>
      <li>Quadruplique μ: a frequência deve cair pela metade.</li>
      <li>Mude para fixa-livre: observe que só aparecem harmônicos ímpares (f₁, 3f₁, 5f₁, …).</li>
      <li>Use a aba de Dados para verificar a dependência f₁ ∝ √T e f₁ ∝ 1/√μ.</li>
    </ol>
  </article>
);