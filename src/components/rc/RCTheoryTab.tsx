export const RCTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Circuito RC — carga e descarga</h3>
    <p className="text-muted-foreground">
      Um circuito RC série conecta uma fonte de f.e.m. <em>E</em>, um resistor <em>R</em> e um capacitor <em>C</em>.
      Ao fechar a chave, o capacitor carrega exponencialmente; ao curto-circuitar a fonte, ele descarrega no
      resistor seguindo a mesma forma exponencial governada pela <strong>constante de tempo</strong> τ = R·C.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações principais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">τ =</span> R · C &nbsp; (segundos)</li>
      <li><span className="text-primary font-semibold">Carga:</span> Vc(t) = E · (1 − e^(−t/τ))</li>
      <li><span className="text-primary font-semibold">Descarga:</span> Vc(t) = V₀ · e^(−t/τ)</li>
      <li><span className="text-primary font-semibold">i(t) =</span> (V∞ − V₀)/R · e^(−t/τ)</li>
      <li><span className="text-primary font-semibold">U(t) =</span> ½ · C · Vc(t)²</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Marcos importantes</h4>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li>Em t = τ, Vc atinge ≈ 63,2% de V∞ (carga) ou cai para ≈ 36,8% de V₀ (descarga).</li>
      <li>Em t ≈ 5τ o transitório é praticamente extinto (&gt; 99% do regime permanente).</li>
      <li>A potência dissipada no resistor é p(t) = i(t)² · R; a energia total dissipada na descarga é igual à energia inicial ½CV₀² armazenada.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Selecione o modo <em>Carga</em>, fixe E = 12 V, R = 10 kΩ e C = 100 µF (τ esperado = 1 s).</li>
      <li>Inicie a simulação, pause em t ≈ τ e verifique se Vc ≈ 0,632 · E.</li>
      <li>Na aba <em>Dados</em>, observe a curva exponencial e o ponto onde t = τ.</li>
      <li>Use o gráfico ln|Vc − V∞| × t para extrair τ pelo coeficiente angular (−1/τ).</li>
      <li>Mude para <em>Descarga</em> com V₀ = E e compare τ com o valor da carga.</li>
      <li>Varie R e C uma de cada vez e confirme τ ∝ R e τ ∝ C.</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      Dica numérica: para τ &lt; 1 ms aumente a velocidade de simulação; para τ &gt; 10 s reduza-a para acompanhar
      a evolução do capacitor sem esperar tempo real.
    </p>
  </article>
);