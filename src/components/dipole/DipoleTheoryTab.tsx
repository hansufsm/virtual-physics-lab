export const DipoleTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-3">
    <h3 className="font-display text-lg font-semibold">Dipolo elétrico em campo externo</h3>
    <p className="text-sm text-muted-foreground">
      Um dipolo é um par de cargas iguais e opostas (+q, −q) separadas por uma distância d. O
      momento de dipolo aponta de −q para +q:
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`p = q · d   (vetor)`}</pre>

    <h4 className="font-display font-semibold">Em campo externo uniforme E</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`τ = p × E    →    |τ| = p E sinθ
U = −p · E   →    U(θ) = −p E cosθ
F_resultante = 0   (em E uniforme)`}</pre>

    <h4 className="font-display font-semibold">Pequenas oscilações</h4>
    <p className="text-sm text-muted-foreground">
      Em torno de θ = 0 (mínimo de U), τ ≈ −pE·θ. Com I = m·d²/2 (duas massas iguais a d/2 do
      centro):
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`ω = √(pE / I)     T = 2π √(I / pE)`}</pre>

    <h4 className="font-display font-semibold">Campo do próprio dipolo</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`E_r = (1/4πε₀) · 2p cosθ / r³
E_θ = (1/4πε₀) ·   p sinθ / r³
|E| ∝ 1/r³`}</pre>

    <h4 className="font-display font-semibold mt-3">Roteiro sugerido</h4>
    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
      <li>Em "Torque em E", varie θ e confirme τ ∝ sinθ e U ∝ −cosθ.</li>
      <li>Verifique τ linear em E (varredura de E) e que F_resultante = 0.</li>
      <li>Meça o período e compare com T = 2π√(I/pE).</li>
      <li>Em "Campo do dipolo", deslize o ponto P e confirme |E| ∝ 1/r³.</li>
    </ul>
  </div>
);