export const MirrorTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Espelhos esféricos</h3>
    <p className="text-muted-foreground">Espelhos côncavos têm foco real (f = R/2 &gt; 0); convexos têm foco virtual (f = −R/2 &lt; 0).</p>
    <h4 className="font-display mt-4">Equação de Gauss</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>1/f = 1/p + 1/p'
A = h'/h = −p'/p</code></pre>
    <h4 className="font-display mt-4">Convenções de sinal</h4>
    <ul className="text-muted-foreground">
      <li><strong>p &gt; 0</strong> sempre (objeto real).</li>
      <li><strong>p' &gt; 0</strong>: imagem real (à frente). <strong>p' &lt; 0</strong>: imagem virtual (atrás).</li>
      <li><strong>f &gt; 0</strong> côncavo · <strong>f &lt; 0</strong> convexo.</li>
      <li><strong>m &lt; 0</strong>: imagem invertida · <strong>m &gt; 0</strong>: direita.</li>
    </ul>
    <h4 className="font-display mt-4">Casos no espelho côncavo</h4>
    <ul className="text-muted-foreground">
      <li>p &gt; 2f: imagem real, invertida, reduzida (atrás de C).</li>
      <li>p = 2f (centro): real, invertida, mesmo tamanho.</li>
      <li>f &lt; p &lt; 2f: real, invertida, ampliada.</li>
      <li>p = f: imagem no infinito.</li>
      <li>p &lt; f: virtual, direita, ampliada (espelho de maquiagem).</li>
    </ul>
    <h4 className="font-display mt-4">Espelho convexo</h4>
    <p className="text-muted-foreground">Sempre forma imagem virtual, direita e menor — campo de visão amplo (espelhos retrovisores, segurança).</p>
  </div>
);