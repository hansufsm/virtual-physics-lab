export const FoucaultTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Pêndulo de Foucault</h3>
    <p className="text-muted-foreground">
      Em 1851, Léon Foucault pendurou um fio de 67 m no Panthéon de Paris para demonstrar visualmente a rotação
      da Terra. No referencial não-inercial da Terra, surge a <strong>força de Coriolis</strong>, que faz o plano
      de oscilação do pêndulo girar lentamente.
    </p>
    <h4 className="font-display mt-4">Taxa de precessão</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>Ω(φ) = Ω_⊕ sin φ
Ω_⊕ = 2π / T_sideral ≈ 7,292 × 10⁻⁵ rad/s
T_precessão = 2π / Ω(φ) = 23h56' / sin φ</code></pre>
    <ul className="text-muted-foreground">
      <li><strong>Polo (φ = 90°)</strong>: rotação completa em ~23,93 h</li>
      <li><strong>Paris (48,85°)</strong>: ~31,8 h (≈ 11,3°/h)</li>
      <li><strong>Equador (0°)</strong>: sem precessão</li>
    </ul>
    <h4 className="font-display mt-4">Período do pêndulo</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>T = 2π √(L/g)</code></pre>
    <p className="text-muted-foreground">
      O efeito é puramente cinemático: o pêndulo conserva seu plano no referencial inercial; quem gira sob ele é
      a Terra. É uma das demonstrações mais elegantes da rotação terrestre, ainda exibida em diversos museus.
    </p>
  </div>
);
