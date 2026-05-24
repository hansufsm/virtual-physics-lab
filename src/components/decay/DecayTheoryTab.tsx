export const DecayTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Decaimento radioativo</h3>
    <p className="text-muted-foreground">
      Um núcleo instável decai com uma probabilidade por unidade de tempo λ, independente de sua
      história. Para um grande número N de núcleos idênticos, vale a equação diferencial
      dN/dt = −λN, cuja solução é a lei exponencial.
    </p>

    <h4 className="font-display font-semibold mt-6">Lei do decaimento</h4>
    <p className="font-mono text-sm">N(t) = N₀ e^(−λt) · A(t) = λ N(t) · T½ = ln2 / λ · τ = 1/λ</p>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li>λ — constante de decaimento (s⁻¹), característica do isótopo.</li>
      <li>T½ — meia-vida: tempo para metade dos núcleos decaírem.</li>
      <li>τ — vida média: tempo característico ⟨t⟩ = 1/λ ≈ 1.443 · T½.</li>
      <li>A — atividade (Bq = desintegrações/s).</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Modelo estocástico</h4>
    <p className="text-sm">
      A simulação trata cada núcleo individualmente: a cada passo Δt, cada núcleo sobrevivente
      decai com probabilidade p = 1 − e^(−λΔt). Para N grande, a média ⟨N(t)⟩ converge para
      a curva exponencial; flutuações são da ordem de √N (estatística de Poisson).
    </p>

    <h4 className="font-display font-semibold mt-6">Aplicações</h4>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li>Datação por C-14 (T½ = 5730 anos) em arqueologia.</li>
      <li>Medicina nuclear: Tc-99m (T½ = 6 h) para diagnóstico, I-131 para tireoide.</li>
      <li>Datação geológica com U-238 → Pb-206.</li>
      <li>Detectores de fumaça (Am-241), gerador termoelétrico (Pu-238).</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Selecione I-131, N₀ = 1000, t = T½: confirme N(t) ≈ 500 e atividade ≈ A₀/2.</li>
      <li>Mude para Tc-99m e observe como a janela temporal muda (horas vs. dias).</li>
      <li>Varie t entre 0 e 5·T½ e tabule N(t); no gráfico log(N) × t, ache λ pelo coeficiente angular.</li>
      <li>Compare a curva analítica com a simulação estocástica para N₀ pequeno (~100) e grande (~10⁶).</li>
      <li>Para C-14, calcule a idade de uma amostra com fração restante = 0.25.</li>
    </ol>
  </article>
);