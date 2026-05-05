export const ChargeTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-3">
    <h3 className="font-display text-lg font-semibold">Força de Lorentz</h3>
    <p className="text-sm text-muted-foreground">
      Uma partícula de carga <strong>q</strong> em campos elétrico <strong>E</strong> e magnético
      <strong> B</strong> sofre a força:
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">F = q(E + v × B)</pre>

    <h4 className="font-display font-semibold mt-4">Apenas campo E</h4>
    <p className="text-sm text-muted-foreground">
      A trajetória é parabólica (análoga ao lançamento oblíquo): aceleração constante na direção de E.
    </p>

    <h4 className="font-display font-semibold">Apenas campo B</h4>
    <p className="text-sm text-muted-foreground">
      Movimento circular uniforme. O raio de Larmor e a frequência ciclotrônica são:
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">r = mv / |q|B    f𝒸 = |q|B / (2π m)</pre>

    <h4 className="font-display font-semibold">Seletor de velocidades</h4>
    <p className="text-sm text-muted-foreground">
      Com E ⊥ B, partículas com v = E/B atravessam sem deflexão; as demais são desviadas.
    </p>

    <h4 className="font-display font-semibold">Ciclotron</h4>
    <p className="text-sm text-muted-foreground">
      Em cada travessia do gap entre os “Dees” a partícula ganha energia <strong>qVₐ</strong>; o raio
      cresce em espiral até atingir a velocidade máxima.
    </p>

    <h4 className="font-display font-semibold mt-4">Roteiro sugerido</h4>
    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
      <li>No modo B puro, varie v₀ e verifique r ∝ v.</li>
      <li>Compare f𝒸 ao mudar a massa: independente de v, mas inversa em m.</li>
      <li>No seletor, ajuste E e B até v = E/B coincidir com v₀.</li>
      <li>No ciclotron, observe espirais com Vₐ maior produzindo maior aceleração por volta.</li>
    </ul>
  </div>
);