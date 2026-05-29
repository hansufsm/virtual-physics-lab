export const RutherfordTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display font-semibold text-lg">Espalhamento de Rutherford (1909–1911)</h3>
    <p className="text-muted-foreground">
      Para o potencial de Coulomb V(r) = k/r com k = Zz·e²/(4πε₀), a partícula descreve uma <strong>hipérbole</strong>.
      O ângulo de espalhamento depende apenas do parâmetro de impacto b e da energia E:
      <br/><strong>cot(θ/2) = 2 E b / k</strong>.
    </p>
    <p className="text-muted-foreground">
      A maior aproximação (distância mínima) é
      <strong> r_min = (k/2E)·(1 + 1/sen(θ/2))</strong>. Em colisão frontal (b = 0): r_min = k/E.
      A seção de choque diferencial vale
      <br/><strong>dσ/dΩ = (k/4E)² / sen⁴(θ/2)</strong> — a famosa fórmula de Rutherford.
    </p>
    <ul className="text-sm text-muted-foreground">
      <li>1909: Geiger e Marsden veem partículas alfa voltarem da folha de ouro.</li>
      <li>Conclusão de Rutherford (1911): a carga + massa concentram-se em um <strong>núcleo</strong> ≲ 10 fm.</li>
      <li>Para E muito alta, r_min &lt; raio nuclear e a fórmula falha (força nuclear forte entra).</li>
      <li>Base da espectroscopia por retroespalhamento (RBS) usada em análise de materiais.</li>
    </ul>
  </div>
);