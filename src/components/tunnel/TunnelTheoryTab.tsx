export const TunnelTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Tunelamento por barreira retangular</h3>
    <p className="text-muted-foreground">
      Mesmo com E &lt; V₀ a função de onda penetra a barreira e existe probabilidade T &gt; 0 da partícula
      atravessá-la — fenômeno proibido na mecânica clássica.
    </p>
    <h4 className="font-display mt-4">Coeficiente de transmissão (E &lt; V₀)</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>T = 1 / [1 + V₀² sinh²(κa) / (4 E (V₀ − E))]
κ = √(2m(V₀ − E)) / ħ
Aproximação grossa:  T ≈ 16 E(V₀−E)/V₀² · exp(−2κa)</code></pre>
    <h4 className="font-display mt-4">Acima da barreira (E &gt; V₀)</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>T = 1 / [1 + V₀² sin²(k'a) / (4 E (E − V₀))]
k' = √(2m(E − V₀)) / ħ  → ressonâncias para k'a = nπ</code></pre>
    <h4 className="font-display mt-4">Aplicações</h4>
    <ul className="text-muted-foreground">
      <li><strong>STM</strong>: corrente túnel ~ exp(−2κa) — sonda topografia atômica.</li>
      <li><strong>Decaimento α</strong>: Gamow explicou a vida média ~ exp(2 ∫ κ dx) sobre barreira coulombiana.</li>
      <li><strong>Diodo túnel</strong>: junção p-n degenerada com região de resistência negativa.</li>
      <li><strong>Fusão estelar</strong>: prótons tunelam a barreira coulombiana — sem isso, o Sol não brilharia.</li>
    </ul>
  </div>
);
