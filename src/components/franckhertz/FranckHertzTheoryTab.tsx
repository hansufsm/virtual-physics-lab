export const FranckHertzTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display font-semibold text-lg">Franck–Hertz (1914) — Nobel 1925</h3>
    <p className="text-muted-foreground">
      Um tubo contém vapor (Hg típico). Elétrons termiônicos são acelerados por V entre cátodo e grade e atravessam
      um potencial retardador V_r até o ânodo. Enquanto eV &lt; E_exc as colisões são <strong>elásticas</strong> e
      a corrente cresce. Quando eV ≈ E_exc, ocorrem colisões <strong>inelásticas</strong>: o elétron transfere
      exatamente E_exc ao átomo e perde energia para vencer V_r, causando uma queda em I(V).
    </p>
    <p className="text-muted-foreground">
      O processo se repete a cada incremento E_exc, produzindo picos em <strong>V_n = n·E_exc/e + V_r</strong>. O
      átomo excitado decai emitindo um fóton de λ = hc/E_exc (para Hg: 4,9 eV → 253,7 nm, UV).
    </p>
    <ul className="text-sm text-muted-foreground">
      <li>Hg: E_exc = 4,9 eV (³P₁ ← ¹S₀), λ = 253,7 nm.</li>
      <li>Largura dos picos aumenta com a temperatura (mais densidade, mais colisões múltiplas).</li>
      <li>V_r seleciona apenas elétrons com energia suficiente: maximiza o contraste dos picos.</li>
      <li>Confirmação direta dos postulados de Bohr antes da Mecânica Quântica formal.</li>
    </ul>
  </div>
);