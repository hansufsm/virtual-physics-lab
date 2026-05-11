export const DoubleSlitTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-3">
    <h3 className="font-display text-lg font-semibold">Difração e interferência (fenda dupla)</h3>
    <p className="text-sm text-muted-foreground">
      Para N fendas idênticas de largura a separadas por d, iluminadas por luz coerente de
      comprimento de onda λ, a intensidade na tela distante L (regime de Fraunhofer) é o produto
      do fator de fenda única (envelope) pelo fator de interferência de N fontes.
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`α = π a sinθ / λ
φ = π d sinθ / λ
I(θ) / I₀ = [sin(α)/α]² · [sin(Nφ)/(N sinφ)]²`}</pre>

    <h4 className="font-display font-semibold">Casos limites</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`Fenda única (N=1):  I = sinc²(α)             — mínimos em a sinθ = mλ
Young (N=2):        I = sinc²(α) · cos²(φ)   — máximos em d sinθ = mλ
Rede (N grande):    picos finos em mesmas posições; largura ~ λ/(Nd cosθ)`}</pre>

    <h4 className="font-display font-semibold">Padrão na tela (pequeno ângulo)</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`Δy = λ L / d           (espaçamento entre franjas brilhantes)
Largura central = 2 λ L / a   (envelope da fenda única)
#franjas dentro do envelope ≈ 2 d/a − 1`}</pre>

    <h4 className="font-display font-semibold mt-3">Roteiro sugerido</h4>
    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
      <li>Mantenha a e varie d: confirme Δy ∝ 1/d.</li>
      <li>Mantenha d e varie a: confirme que apenas o envelope muda (largura central ∝ 1/a).</li>
      <li>Varie λ (cor): franjas se afastam para o vermelho.</li>
      <li>Aumente N: a rede gera picos cada vez mais finos nas mesmas posições.</li>
      <li>No painel "Dados", varie y, λ ou d e exporte CSV para o relatório.</li>
    </ul>
  </div>
);