export const MillikanTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display font-semibold text-lg">Millikan (1909) — Carga elementar</h3>
    <p className="text-muted-foreground">
      Pequenas gotas de óleo (carregadas por atrito ao serem pulverizadas) caem entre placas paralelas. No equilíbrio
      com o campo E = V/d aplicado:
      <br/><strong>q·E = (m − m_ar)·g</strong> ⇒ q = (4πr³/3)(ρ_oil − ρ_ar) g d / V.
    </p>
    <p className="text-muted-foreground">
      O raio r é obtido pela velocidade terminal sem campo via lei de Stokes:
      <strong> v = 2 r² (ρ_oil − ρ_ar) g / (9η)</strong>. Medindo várias gotas e cargas, Millikan mostrou que
      <strong> q é sempre um múltiplo inteiro de e = 1,602 ×10⁻¹⁹ C</strong>.
    </p>
    <ul className="text-sm text-muted-foreground">
      <li>Quantização da carga elétrica é verificada experimentalmente.</li>
      <li>Permite estimar a massa do elétron combinando e com a razão e/m de Thomson.</li>
      <li>Correções modernas (Cunningham) refinam Stokes para gotas com r ~ livre caminho médio.</li>
      <li>Nobel de Física, 1923.</li>
    </ul>
  </div>
);