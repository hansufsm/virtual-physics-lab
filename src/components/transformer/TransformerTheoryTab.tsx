export const TransformerTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Transformador</h3>
    <p className="text-muted-foreground">
      Um transformador é constituído por dois enrolamentos acoplados magneticamente por um núcleo de alta
      permeabilidade. A variação do fluxo comum induz f.e.m. nos dois enrolamentos, em proporção ao número de espiras.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações principais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Razão de transformação:</span> a = N₁ / N₂</li>
      <li><span className="text-primary font-semibold">Ideal:</span> V₂ / V₁ = N₂ / N₁ &nbsp;&nbsp; I₂ / I₁ = N₁ / N₂</li>
      <li><span className="text-primary font-semibold">Conservação de potência (ideal):</span> V₁ I₁ = V₂ I₂</li>
      <li><span className="text-primary font-semibold">Carga refletida:</span> R₁(eq) = a² · R_L</li>
      <li><span className="text-primary font-semibold">Acoplamento:</span> M = k · √(L₁ L₂), &nbsp; 0 ≤ k ≤ 1</li>
      <li><span className="text-primary font-semibold">Rendimento:</span> η = P_saída / P_entrada</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Tipos de transformador</h4>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li><strong>Abaixador (step-down):</strong> a = N₁/N₂ &gt; 1 → V₂ &lt; V₁ e I₂ &gt; I₁ (tomadas, eletrônicos).</li>
      <li><strong>Elevador (step-up):</strong> a &lt; 1 → V₂ &gt; V₁ (transmissão de energia em alta tensão).</li>
      <li><strong>Isolador:</strong> a = 1, separa galvanicamente dois circuitos.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Fixe V₁ = 127 V, k = 1, R₁ = R₂ = 0,01 Ω. Varie N₂ e confirme V₂ = V₁ · N₂/N₁.</li>
      <li>Ative perdas (R₁, R₂ &gt; 0) e veja η cair conforme a corrente cresce.</li>
      <li>Reduza k e observe que a tensão no secundário diminui mesmo com perdas resistivas pequenas.</li>
      <li>Para uma carga R_L fixa, mostre que P_saída segue η · V₁²/R_eq.</li>
      <li>Compare a forma de onda V₁(t) × V₂(t) — em fase para carga resistiva.</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      Observação: este modelo despreza histerese, correntes de Foucault e dispersão de fluxo individuais
      — todas essas perdas ficam englobadas pelos parâmetros R₁, R₂ e fator de acoplamento k.
    </p>
  </article>
);