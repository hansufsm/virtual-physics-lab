export const MichelsonTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-4">
    <h2 className="font-display text-xl font-bold mt-0">Interferômetro de Michelson</h2>

    <h3 className="font-display font-semibold">1. Geometria e princípio</h3>
    <p>
      Um divisor de feixe (BS) 50/50 reparte a luz da fonte em dois braços ortogonais terminados nos
      espelhos M₁ (referência) e M₂ (móvel). Os feixes refletidos voltam ao BS e são superpostos no
      anteparo. Como percorrem ida-e-volta, a diferença de caminho óptico vale:
    </p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
Δ = 2 (L₂ − L₁)
I(Δ) = I_max · ½ [1 + V · cos(2π Δ / λ)]
    </pre>
    <p>
      V ∈ [0,1] é a visibilidade (depende da coerência da fonte e do balanceamento do BS).
      Cada deslocamento de M₂ por λ/2 muda Δ em λ ⇒ uma franja “passa” pelo centro.
    </p>

    <h3 className="font-display font-semibold">2. Franjas de igual inclinação (anéis)</h3>
    <p>
      Com fonte extensa monocromática e espelhos perpendiculares, raios paralelos vindos com inclinação θ
      em relação ao eixo encontram caminho efetivo Δ·cos θ. Anéis concêntricos aparecem onde:
    </p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
2 Δ cos θ_m = m λ      ⇒   raio do n-ésimo mínimo: r_n ≈ f · √(n λ / |Δ|)
    </pre>
    <p>
      Ao aproximar M₂ de M₁ (|Δ| → 0), os anéis “colapsam” para o centro e desaparecem.
    </p>

    <h3 className="font-display font-semibold">3. Franjas de igual espessura (retilíneas)</h3>
    <p>
      Inclinando levemente um espelho de ângulo α (mrad), aparece uma cunha de ar entre as imagens dos
      espelhos. Franjas retilíneas paralelas surgem com espaçamento:
    </p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
Λ = λ / (2 α)
    </pre>

    <h3 className="font-display font-semibold">4. Metrologia e aplicações</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Comprimento por contagem de franjas</strong>: ΔL = N · λ/2.</li>
      <li><strong>Índice de refração</strong>: insira uma lâmina de espessura d e índice n no braço — Δ muda em 2d(n−1).</li>
      <li><strong>Espectroscopia por Fourier (FTIR)</strong>: o interferograma I(Δ) é a transformada de Fourier do espectro S(ν).</li>
      <li><strong>Detecção de ondas gravitacionais (LIGO)</strong>: versão de braços de km e cavidades Fabry–Pérot.</li>
      <li><strong>Experimento Michelson–Morley</strong>: ausência de deriva do éter, prelúdio da Relatividade.</li>
    </ul>

    <h3 className="font-display font-semibold">5. Roteiro sugerido</h3>
    <ol className="list-decimal pl-5 space-y-1">
      <li>Em modo Circular, varie L₂ − L₁ entre 0 e ±5 μm e conte anéis aparecendo/desaparecendo.</li>
      <li>Use os botões ±λ/2 e observe a inversão da franja central (claro ↔ escuro).</li>
      <li>Alterne para modo Retilíneo e meça Λ em função do tilt — verifique Λ·α = λ/2.</li>
      <li>Reduza V para simular fonte pouco coerente e veja o contraste cair.</li>
    </ol>
  </div>
);