export const PoiseuilleTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Escoamento de Hagen–Poiseuille</h3>
    <p className="text-muted-foreground">Para fluido newtoniano em regime laminar e estacionário num tubo cilíndrico de raio R:</p>
    <ul className="space-y-2 font-mono text-sm mt-3">
      <li>v(r) = ΔP/(4ηL) · (R² − r²)   (perfil parabólico)</li>
      <li>v_max = ΔP R² / (4ηL) ;  v̄ = v_max / 2</li>
      <li>Q = π R⁴ ΔP / (8ηL)   (lei de Poiseuille)</li>
      <li>R_h = 8ηL / (πR⁴)   (resistência hidráulica)</li>
      <li>τ_parede = ΔP R / (2L)</li>
      <li>Re = 2 ρ v̄ R / η  &lt; 2300 (laminar)</li>
    </ul>
    <p className="text-sm text-muted-foreground mt-3">Q ∝ R⁴ explica por que a vasoconstrição altera dramaticamente o fluxo sanguíneo, e por que tubos finos exigem altas pressões.</p>
  </article>
);