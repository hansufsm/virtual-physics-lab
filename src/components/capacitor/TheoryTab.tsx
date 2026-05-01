export const TheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Capacitor de placas paralelas</h3>
    <p className="text-muted-foreground">
      Um capacitor de placas paralelas é formado por duas placas condutoras de área <em>A</em>, separadas por uma
      distância <em>d</em>, com um meio dielétrico de permissividade relativa εᵣ entre elas.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações principais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">C =</span> εᵣ · ε₀ · A / d</li>
      <li><span className="text-primary font-semibold">Q =</span> C · V</li>
      <li><span className="text-primary font-semibold">E =</span> V / d  =  σ / (εᵣε₀)</li>
      <li><span className="text-primary font-semibold">U =</span> ½ · C · V²</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Objetivos do experimento</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Verificar a dependência <em>C ∝ 1/d</em> para A e εᵣ fixos.</li>
      <li>Verificar a dependência linear <em>Q = C·V</em>.</li>
      <li>Estudar o efeito de inserir um dielétrico no aumento da capacitância.</li>
      <li>Calcular a energia armazenada e o campo elétrico interno.</li>
    </ol>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Fixe V = 10 V, A = 100 cm² e εᵣ = 1. Varie d e registre C.</li>
      <li>Plote C × 1/d e ajuste a reta. Compare o coeficiente angular com εᵣε₀A.</li>
      <li>Insira um dielétrico (ex.: vidro, εᵣ ≈ 5.6) e refaça a varredura.</li>
      <li>Discuta como a energia U muda quando d aumenta com Q constante (capacitor isolado) vs. V constante (ligado à fonte).</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      ε₀ = 8,854 × 10⁻¹² F/m (permissividade do vácuo).
    </p>
  </article>
);