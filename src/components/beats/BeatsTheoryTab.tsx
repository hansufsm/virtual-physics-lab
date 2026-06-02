export const BeatsTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Batimentos: superposição de dois MHS</h3>
    <p className="text-muted-foreground">
      A soma de dois sinais harmônicos de amplitudes iguais e frequências próximas produz um sinal modulado em amplitude — o fenômeno
      dos batimentos, perceptível como pulsações de intensidade.
    </p>
    <h4 className="font-display font-semibold mt-6">Identidade fundamental</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>x(t) = A·cos(2π f₁ t) + A·cos(2π f₂ t)</li>
      <li>x(t) = 2A · cos(π(f₁−f₂)t) · cos(2π·f̄·t),  &nbsp; f̄ = (f₁+f₂)/2</li>
      <li>f_batimento = |f₁ − f₂|  (frequência das pulsações de intensidade)</li>
      <li>O envelope é |2A·cos(π Δf t)|: se anula 2 vezes por período de Δf.</li>
    </ul>
    <h4 className="font-display font-semibold mt-6">Aplicações</h4>
    <ul className="list-disc pl-5 text-sm space-y-1">
      <li>Afinação de instrumentos: ajusta-se a corda até f_batimento → 0.</li>
      <li>Heterodinagem em rádio: mistura de duas portadoras para gerar nova frequência.</li>
      <li>Velocimetria Doppler.</li>
    </ul>
    <h4 className="font-display font-semibold mt-6">Roteiro</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Mantenha f₁ ≈ f₂ (ex.: 10 e 11 Hz) — observe batimento de 1 Hz.</li>
      <li>Aumente Δf: a envoltória pulsa mais rápido e a "carregadora" some.</li>
      <li>Conte os máximos do envelope em 1 s — confirme f_b = |f₁−f₂|.</li>
    </ol>
  </article>
);