export const ComptonTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-4">
    <h2 className="font-display text-xl font-bold mt-0">Espalhamento Compton</h2>

    <h3 className="font-display font-semibold">1. Cinemática relativística</h3>
    <p>
      Um fóton de energia E₀ = hc/λ₀ colide com um elétron livre em repouso. Conservação de energia
      e momento (com E_e² = (pc)² + (m_e c²)²) leva à fórmula descoberta por Compton em 1923:
    </p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
Δλ = λ' − λ₀ = (h / m_e c) · (1 − cos θ) = λ_C (1 − cos θ)
λ_C = 2.42631 × 10⁻¹² m  (comprimento de onda Compton)
    </pre>

    <h3 className="font-display font-semibold">2. Energias e ângulo do elétron</h3>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
E' = E₀ / [1 + α (1 − cos θ)],   α = E₀ / (m_e c²) = E₀ / 511 keV
K_e = E₀ − E'
cot φ = (1 + α) · tan(θ/2)
    </pre>

    <h3 className="font-display font-semibold">3. Seção de choque de Klein–Nishina</h3>
    <p>
      O cálculo de QED para o espalhamento γ + e⁻ → γ + e⁻ fornece:
    </p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
dσ/dΩ = (r₀²/2)(E'/E₀)² [ E₀/E' + E'/E₀ − sin²θ ]
    </pre>
    <p>
      No limite α → 0 reduz-se ao espalhamento Thomson (independente de θ).
    </p>

    <h3 className="font-display font-semibold">4. Importância histórica</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Confirmou que o fóton carrega momento p = h/λ — natureza corpuscular da luz.</li>
      <li>Nobel de Física em 1927 (A. H. Compton).</li>
      <li>Aplicações: radioterapia, telescópios de raios gama, datação por densitometria.</li>
    </ul>

    <h3 className="font-display font-semibold">5. Roteiro sugerido</h3>
    <ol className="list-decimal pl-5 space-y-1">
      <li>Fixe E₀ = 662 keV (Cs-137) e meça Δλ para θ = 0°, 45°, 90°, 180°. Compare com λ_C(1−cos θ).</li>
      <li>Mantenha θ = 90° e varie E₀: confirme que Δλ não depende de E₀, mas E'/E₀ sim.</li>
      <li>Calcule a fração de energia entregue ao elétron K/E₀ em θ = 180° e compare com 2α/(1+2α).</li>
      <li>Compare a curva dσ/dΩ em altas e baixas energias para ver o forward peaking.</li>
    </ol>
  </div>
);