export const FourierTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Lei de Fourier da condução</h3>
    <p className="text-muted-foreground">Em regime permanente, a taxa de calor q é constante ao longo de uma parede plana 1D.</p>
    <ul className="space-y-2 font-mono text-sm mt-3">
      <li>q = −k·A·dT/dx (Fourier)</li>
      <li>R_i = L_i / (k_i · A)  (resistência térmica)</li>
      <li>Camadas em série: R_total = ΣR_i; q = ΔT / R_total</li>
      <li>T(x) é linear em cada camada; quedas ΔT_i = q · R_i</li>
    </ul>
    <p className="text-sm text-muted-foreground mt-3">Materiais com k baixo (isolantes) concentram a queda de temperatura — útil em paredes e janelas duplas.</p>
  </article>
);