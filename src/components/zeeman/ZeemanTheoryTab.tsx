export const ZeemanTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Efeito Zeeman</h3>
    <p className="text-muted-foreground">
      Em um campo magnético externo B, cada nível atômico com momento angular total J se desdobra em <em>2J+1</em>
      subníveis igualmente espaçados, com energia adicional <strong>ΔE = g_J μ_B B m_J</strong>.
    </p>

    <h4 className="font-display mt-4">Fator de Landé g_J</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>g_J = 1 + [J(J+1) + S(S+1) − L(L+1)] / [2 J(J+1)]</code></pre>
    <p className="text-muted-foreground">
      Magnéton de Bohr: μ_B = eħ/2m_e ≈ 9.274 × 10⁻²⁴ J/T  ≈ 5.788 × 10⁻⁵ eV/T.
    </p>

    <h4 className="font-display mt-4">Regras de seleção (transições dipolares)</h4>
    <ul className="text-muted-foreground">
      <li><strong>π</strong>: Δm = 0 — linear polarizada ∥ B (visível apenas na transversal)</li>
      <li><strong>σ⁺</strong>: Δm = +1 — circular dextrógira (longitudinal) / linear ⊥ B (transversal)</li>
      <li><strong>σ⁻</strong>: Δm = −1 — circular levógira (longitudinal) / linear ⊥ B (transversal)</li>
    </ul>

    <h4 className="font-display mt-4">Efeito normal vs anômalo</h4>
    <p className="text-muted-foreground">
      <strong>Normal</strong> (S=0, singletos): g_J = 1 nos dois níveis → sempre tripleto com Δν = ±μ_B B/h ≈ 14 GHz/T.
      <strong>Anômalo</strong> (S≠0): g_u ≠ g_l → múltiplas componentes, padrão diagnóstico para identificar termos espectrais.
    </p>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>Δλ = − λ² · ΔE / (h c)
Δν =  ΔE / h
ΔE = μ_B B (g_u m_u − g_l m_l)</code></pre>

    <h4 className="font-display mt-4">Historicamente</h4>
    <p className="text-muted-foreground">
      Descoberto por Pieter Zeeman em 1896 (Nobel 1902 com Lorentz). A explicação completa do efeito anômalo
      exigiu a hipótese do spin do elétron (Uhlenbeck & Goudsmit, 1925) — uma das evidências decisivas para a mecânica quântica.
    </p>
  </div>
);