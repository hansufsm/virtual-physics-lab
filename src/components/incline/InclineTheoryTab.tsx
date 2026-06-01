export const InclineTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Plano inclinado com atrito</h3>
    <p className="text-muted-foreground">Decompõe-se o peso em componentes paralela (puxa o bloco para baixo do plano) e normal (comprime contra o plano).</p>
    <h4 className="font-display mt-4">Forças</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>F∥ = m·g·sin θ      (puxa para baixo do plano)
F⊥ = m·g·cos θ      (perpendicular ao plano)
N  = m·g·cos θ      (reação normal)
f_máx = μ_s · N     (atrito estático máximo)
f_k   = μ_k · N     (atrito cinético, oposto ao movimento)</code></pre>
    <h4 className="font-display mt-4">Condição de movimento</h4>
    <p className="text-muted-foreground">O bloco desliza quando F∥ &gt; f_máx, ou seja, tan θ &gt; μ_s. O ângulo crítico é θ_c = arctan(μ_s).</p>
    <h4 className="font-display mt-4">Aceleração (descendo)</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>a = g (sin θ − μ_k cos θ)</code></pre>
    <h4 className="font-display mt-4">Como medir μ</h4>
    <ul className="text-muted-foreground">
      <li><strong>μ_s</strong>: aumente θ até o bloco começar a deslizar — μ_s = tan θ_c.</li>
      <li><strong>μ_k</strong>: meça o tempo de descida t e calcule μ_k = (sin θ − 2L/(g t²·cos θ))/cos θ.</li>
    </ul>
  </div>
);