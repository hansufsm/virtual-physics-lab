export const GaussTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-3">
    <h3 className="font-display text-lg font-semibold">Lei de Gauss</h3>
    <p className="text-sm text-muted-foreground">
      O fluxo de E através de qualquer superfície fechada depende apenas da carga interna:
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`Φ_E = ∮ E · dA = Q_enc / ε₀`}</pre>

    <h4 className="font-display font-semibold">Carga pontual / esfera (gaussiana esférica)</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`E(r) = (1/4πε₀) · Q / r²    (r > R)
E(r) = (1/4πε₀) · Q · r / R³ (r < R, esfera uniforme)`}</pre>

    <h4 className="font-display font-semibold">Fio infinito (gaussiana cilíndrica)</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`E(r) = λ / (2π ε₀ r)`}</pre>

    <h4 className="font-display font-semibold">Plano infinito (pillbox)</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`E = σ / (2 ε₀)   (independe da distância)`}</pre>

    <h4 className="font-display font-semibold mt-3">Roteiro sugerido</h4>
    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
      <li>Em "Carga pontual", confirme E ∝ 1/r² e Φ independente do raio da gaussiana.</li>
      <li>Em "Esfera", veja Q_enc crescer com r³ enquanto r &lt; R, depois saturar em Q.</li>
      <li>Em "Fio infinito", verifique E ∝ 1/r e Φ ∝ L (comprimento da gaussiana).</li>
      <li>Em "Plano", note que E é uniforme — Φ depende só da área das tampas.</li>
    </ul>
  </div>
);