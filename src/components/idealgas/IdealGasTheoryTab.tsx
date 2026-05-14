export const IdealGasTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Gás ideal — equação de estado e processos</h3>
    <p className="text-muted-foreground">
      Um gás ideal é descrito pela equação de estado PV = nRT, onde n é o número de mols e R = 8,314 J/(mol·K).
      A energia interna depende apenas de T: ΔU = n Cv ΔT. Os calores específicos satisfazem Cp − Cv = R e γ = Cp/Cv.
    </p>

    <h4 className="font-display font-semibold mt-6">Processos quase-estáticos</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Isotérmico (T const):</span> P₁V₁ = P₂V₂; W = nRT ln(V₂/V₁); Q = W; ΔU = 0</li>
      <li><span className="text-primary font-semibold">Isobárico (P const):</span> V₁/T₁ = V₂/T₂; W = P ΔV; Q = n Cp ΔT; ΔU = n Cv ΔT</li>
      <li><span className="text-primary font-semibold">Isocórico (V const):</span> P₁/T₁ = P₂/T₂; W = 0; Q = ΔU = n Cv ΔT</li>
      <li><span className="text-primary font-semibold">Adiabático (Q = 0):</span> PV^γ = const; TV^(γ−1) = const; W = (P₁V₁ − P₂V₂)/(γ−1); ΔU = −W</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Primeira lei e entropia</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>1ª lei: ΔU = Q − W (W é o trabalho realizado pelo gás)</li>
      <li>Cv (monoatômico) = 3R/2; Cv (diatômico) = 5R/2</li>
      <li>ΔS isotérmico = nR ln(V₂/V₁)</li>
      <li>ΔS isobárico = n Cp ln(T₂/T₁)</li>
      <li>ΔS isocórico = n Cv ln(T₂/T₁)</li>
      <li>ΔS adiabático reversível = 0</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Inicie com 1 mol a T₁ = 300 K e V₁ = 24,5 L (≈ CNTP). Verifique P₁ ≈ 101 kPa.</li>
      <li>Faça uma compressão isotérmica para V₂ = 12 L. Confirme P₂ = 2P₁ e Q = W &lt; 0.</li>
      <li>Compare uma compressão isotérmica e uma adiabática até o mesmo V₂. Observe que a adiabática gera maior P₂ e maior T₂.</li>
      <li>No processo isobárico, varie V₂ e confirme que T cresce linearmente com V (Charles).</li>
      <li>No isocórico, varie T₂ e veja P crescer linearmente (Gay-Lussac).</li>
      <li>Use a aba "Isotermas" para visualizar a família PV = nRT em diferentes T.</li>
    </ol>
  </article>
);