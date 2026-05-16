export const LensTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Lentes finas — óptica geométrica</h3>
    <p className="text-muted-foreground">
      Uma lente fina é considerada de espessura desprezível em relação aos raios de curvatura. Adotamos a convenção
      de Gauss: distâncias medidas a partir da lente, positivas para o lado oposto ao objeto (lado da luz emergente).
    </p>

    <h4 className="font-display font-semibold mt-6">Equações fundamentais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Gauss:</span> 1/f = 1/d₀ + 1/dᵢ</li>
      <li><span className="text-primary font-semibold">Ampliação:</span> m = −dᵢ/d₀ = hᵢ/h₀</li>
      <li><span className="text-primary font-semibold">Fabricantes:</span> 1/f = (n_l/n_m − 1)(1/R₁ − 1/R₂)</li>
      <li><span className="text-primary font-semibold">Newton:</span> (d₀ − f)(dᵢ − f) = f²</li>
      <li><span className="text-primary font-semibold">Potência:</span> P = 1/f (em dioptrias, com f em metros)</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Convenções de sinal</h4>
    <ul className="space-y-1 text-sm list-disc pl-5">
      <li>f &gt; 0: lente convergente (convexa). f &lt; 0: divergente (côncava).</li>
      <li>d₀ &gt; 0 para objeto real (à esquerda da lente).</li>
      <li>dᵢ &gt; 0: imagem real (lado oposto ao objeto). dᵢ &lt; 0: imagem virtual (mesmo lado).</li>
      <li>m &lt; 0: imagem invertida. m &gt; 0: imagem ereta. |m| &gt; 1: ampliada.</li>
      <li>R &gt; 0 se a face é convexa vista pela luz incidente; R &lt; 0 se côncava.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Casos típicos (lente convergente)</h4>
    <ul className="space-y-1 text-sm list-disc pl-5">
      <li>d₀ &gt; 2f: imagem real, invertida e reduzida.</li>
      <li>d₀ = 2f: imagem real, invertida e do mesmo tamanho.</li>
      <li>f &lt; d₀ &lt; 2f: imagem real, invertida e ampliada.</li>
      <li>d₀ = f: imagem no infinito (raios paralelos).</li>
      <li>d₀ &lt; f: imagem virtual, ereta e ampliada (lupa).</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Fixe f = +10 cm e varie d₀ entre 5 e 60 cm. Identifique cada regime na aba "Dados".</li>
      <li>Confirme que para d₀ = 2f a ampliação é m = −1 (imagem invertida, mesmo tamanho).</li>
      <li>Reduza d₀ abaixo de f e observe a inversão de sinal de dᵢ (imagem virtual).</li>
      <li>No modo "Fabricantes", construa uma lente biconvexa (R₁ &gt; 0, R₂ &lt; 0) e verifique f calculado.</li>
      <li>Compare o gráfico de Newton: o produto (d₀−f)(dᵢ−f) deve ser constante e igual a f².</li>
      <li>Use n_meio &gt; 1 (lente imersa em água) e observe a redução de potência da lente.</li>
    </ol>
  </article>
);