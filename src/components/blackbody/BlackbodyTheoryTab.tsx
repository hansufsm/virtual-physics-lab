export const BlackbodyTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Radiação de corpo negro</h3>
    <p className="text-muted-foreground">
      Um corpo negro absorve toda radiação incidente e re-emite com espectro dependente apenas de sua temperatura.
      A explicação clássica (Rayleigh–Jeans) previa intensidade infinita para λ pequeno — a <strong>catástrofe do ultravioleta</strong>.
    </p>
    <h4 className="font-display mt-4">Lei de Planck (1900)</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>B(λ,T) = (2hc²/λ⁵) · 1 / (exp(hc/λkT) − 1)</code></pre>
    <p className="text-muted-foreground">A hipótese de Planck — energia trocada em pacotes E = hf — iniciou a mecânica quântica.</p>
    <h4 className="font-display mt-4">Limites</h4>
    <ul className="text-muted-foreground">
      <li><strong>Rayleigh–Jeans</strong> (λ grande): B ≈ 2ckT/λ⁴ (clássico, diverge para UV)</li>
      <li><strong>Wien</strong> (λ pequeno): B ≈ (2hc²/λ⁵) exp(−hc/λkT)</li>
    </ul>
    <h4 className="font-display mt-4">Leis derivadas</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>Wien:    λ_max · T = 2.898 × 10⁻³ m·K
Stefan-Boltzmann:  M = σT⁴,  σ = 5.670 × 10⁻⁸ W/m²K⁴</code></pre>
    <p className="text-muted-foreground">
      Aplicações: temperatura estelar (Sol ≈ 5778 K ⇒ λ_max ≈ 502 nm, verde), CMB (2.725 K), pirometria,
      eficiência de filamentos e LEDs, e a interpretação do espectro térmico de objetos a 300 K (IV).
    </p>
  </div>
);
