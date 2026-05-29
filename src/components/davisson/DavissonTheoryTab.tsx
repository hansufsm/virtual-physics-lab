export const DavissonTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display font-semibold text-lg">Difração de elétrons (Davisson–Germer, 1927)</h3>
    <p className="text-muted-foreground">
      A hipótese de de Broglie associa a toda partícula um comprimento de onda λ = h/p. Para elétrons acelerados por
      uma diferença de potencial V, K = eV ⇒ p = √(2mₑeV) e portanto
      <strong> λ(nm) ≈ 1,226/√V(V)</strong>.
    </p>
    <p className="text-muted-foreground">
      Quando o feixe incide normal a uma superfície cristalina com espaçamento atômico d, os elétrons espalhados
      sofrem interferência construtiva nos ângulos φ que satisfazem <strong>d · sen φ = n λ</strong>. Davisson e
      Germer observaram um pico claro em φ ≈ 50° para V = 54 V em Ni(111), em ótimo acordo com a previsão de de Broglie.
    </p>
    <ul className="text-sm text-muted-foreground">
      <li>Ondulatório: padrão senoidal sucessivo em ordens n = 1, 2, ...</li>
      <li>Existe ordem máxima n_max = ⌊d/λ⌋: para λ &gt; d só há n = 0.</li>
      <li>Aumentar V reduz λ → picos vão para ângulos menores (mais frontais).</li>
      <li>Validou a mecânica ondulatória aplicada à matéria, fundamento da microscopia eletrônica.</li>
    </ul>
  </div>
);