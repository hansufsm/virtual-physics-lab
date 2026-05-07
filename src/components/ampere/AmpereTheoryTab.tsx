export const AmpereTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-3">
    <h3 className="font-display text-lg font-semibold">Lei de Ampère</h3>
    <p className="text-sm text-muted-foreground">
      A lei de Ampère relaciona a circulação do campo magnético em uma curva fechada à corrente
      total enlaçada por essa curva:
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`∮ B · dl = µ₀ · I_enlaçada`}</pre>

    <h4 className="font-display font-semibold mt-3">Fio retilíneo infinito</h4>
    <p className="text-sm text-muted-foreground">
      Por simetria, B forma circunferências em torno do fio. Em uma curva circular de raio d:
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`B(d) = µ₀ I / (2π d)`}</pre>

    <h4 className="font-display font-semibold">Dois fios paralelos</h4>
    <p className="text-sm text-muted-foreground">
      Cada fio sente o campo do outro e sofre força de Lorentz por unidade de comprimento:
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`F/L = µ₀ I₁ I₂ / (2π d)`}</pre>
    <p className="text-sm text-muted-foreground">
      Correntes de mesmo sentido se atraem; de sentidos opostos se repelem.
    </p>

    <h4 className="font-display font-semibold">Toroide</h4>
    <p className="text-sm text-muted-foreground">
      Uma curva amperiana circular de raio r dentro do toroide enlaça N·I, dando:
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`B(r) = µ₀ N I / (2π r)     (R_min < r < R_max)
B ≈ 0  fora do toroide`}</pre>

    <h4 className="font-display font-semibold mt-3">Roteiro sugerido</h4>
    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
      <li>Verifique B ∝ 1/d em "Fio único" variando o ponto de prova.</li>
      <li>Em "Dois fios", inverta o sentido de I₂ e observe a transição atração ↔ repulsão.</li>
      <li>Mostre que F/L é linear em I₁ e I₂ e cai com 1/d.</li>
      <li>No toroide, confirme que B independe de R quando você fixa N·I/r constante.</li>
    </ul>
  </div>
);