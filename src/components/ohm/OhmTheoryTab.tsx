export const OhmTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Lei de Ohm e resistividade</h3>
    <p className="text-muted-foreground">
      A Lei de Ohm relaciona a tensão <em>V</em> aplicada a um condutor ôhmico e a corrente <em>I</em> que o
      atravessa por meio da resistência <em>R</em>. A resistência depende da geometria do condutor e de uma
      propriedade intrínseca do material chamada resistividade <em>ρ</em>.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações principais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">V =</span> R · I</li>
      <li><span className="text-primary font-semibold">R =</span> ρ · L / A</li>
      <li><span className="text-primary font-semibold">A =</span> π · (⌀ / 2)²</li>
      <li><span className="text-primary font-semibold">I =</span> V / (R + r)  &nbsp; (com resistência interna r da fonte)</li>
      <li><span className="text-primary font-semibold">P =</span> V · I = R · I² = V² / R</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Objetivos do experimento</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Verificar a linearidade entre <em>V</em> e <em>I</em> em um condutor ôhmico.</li>
      <li>Determinar a resistência <em>R</em> a partir do coeficiente angular do ajuste linear V×I.</li>
      <li>Verificar a dependência <em>R ∝ L</em> e <em>R ∝ 1/A</em>.</li>
      <li>Estimar a resistividade <em>ρ</em> de um material desconhecido.</li>
    </ol>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Escolha um material (por exemplo, Níquel-cromo) e fixe ⌀ = 0,3 mm e L = 100 cm.</li>
      <li>Varie a tensão de −12 V a +12 V e registre I. Faça o gráfico V×I e ajuste uma reta.</li>
      <li>Compare 1/coef. angular com o R esperado pela fórmula R = ρL/A.</li>
      <li>Aumente o ruído de medição e observe como R² do ajuste cai. Discuta incertezas.</li>
      <li>Mantendo V fixo, varie L e plote R(L). Verifique a relação linear.</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      Resistividades de referência (a 20 °C): Cobre ≈ 1,68 × 10⁻⁸ Ω·m · Alumínio ≈ 2,65 × 10⁻⁸ Ω·m ·
      Níquel-cromo ≈ 1,1 × 10⁻⁶ Ω·m.
    </p>
  </article>
);