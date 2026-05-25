export const TransientTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-4">
    <h2 className="font-display text-xl font-bold mt-0">Resposta transitória de LR e RLC série</h2>

    <h3 className="font-display font-semibold">1. Circuito LR</h3>
    <p>
      Aplicando a LKT com a chave fechando sobre V₀ em t = 0:
    </p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
L di/dt + R i = V₀   ⇒   i(t) = (V₀/R)[1 − e^(−t/τ)],   τ = L/R
    </pre>
    <p>
      Na descarga (fonte substituída por curto, condição inicial I₀):
    </p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
i(t) = I₀ e^(−t/τ)     V_L = L di/dt = −R I₀ e^(−t/τ)
    </pre>
    <p>
      Em ≈ 5τ a corrente atinge 99 % do valor estacionário. A energia magnética armazenada é
      U_L = ½ L i².
    </p>

    <h3 className="font-display font-semibold">2. Circuito RLC série</h3>
    <p>Com q a carga no capacitor (i = dq/dt) e degrau V₀:</p>
    <pre className="bg-muted/40 rounded-md p-3 text-xs overflow-x-auto">
L q″ + R q′ + q/C = V₀
ω₀ = 1/√(LC)    α = R/(2L)    ζ = α/ω₀    Q = ω₀L/R = 1/(2ζ)
    </pre>
    <p>Equação característica: s² + 2α s + ω₀² = 0. Três regimes:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Subamortecido (ζ &lt; 1)</strong>: i(t) e v_C(t) oscilam em ω_d = √(ω₀² − α²) com envoltória e^(−αt).</li>
      <li><strong>Crítico (ζ = 1)</strong>: aproximação mais rápida do equilíbrio sem oscilar — (A + Bt) e^(−αt).</li>
      <li><strong>Superamortecido (ζ &gt; 1)</strong>: duas exponenciais reais com raízes s₁,₂ = −α ± √(α² − ω₀²).</li>
    </ul>

    <h3 className="font-display font-semibold">3. Fator de qualidade Q</h3>
    <p>
      Q mede quantos radianos de oscilação ocorrem antes da energia cair por um fator e: Q ≈ 2π · E_armazenada / E_dissipada por ciclo.
      Q alto ⇒ oscilação prolongada e seletividade em frequência (ressonância estreita, vista no experimento RLC AC).
    </p>

    <h3 className="font-display font-semibold">4. Conservação de energia</h3>
    <p>
      Em qualquer instante, a potência da fonte se reparte: V₀ i = i² R + d/dt(½ L i²) + d/dt(½ C v_C²).
      A aba de Energia mostra o "vai-e-volta" entre L e C, atenuado pela dissipação em R.
    </p>

    <h3 className="font-display font-semibold">5. Roteiro sugerido</h3>
    <ol className="list-decimal pl-5 space-y-1">
      <li>No modo LR, varie R e meça τ ajustando a curva i(t): verifique τ = L/R.</li>
      <li>Mude para RLC e use os presets (sub, crítico, super) para reconhecer os três regimes.</li>
      <li>Diminua R no caso subamortecido e observe Q crescer (mais ciclos antes de extinguir).</li>
      <li>Use a aba Energia para acompanhar a troca L↔C e a dissipação em R.</li>
    </ol>
  </div>
);