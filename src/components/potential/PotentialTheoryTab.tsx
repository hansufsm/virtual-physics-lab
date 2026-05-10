export const PotentialTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-3">
    <h3 className="font-display text-lg font-semibold">Potencial elétrico e equipotenciais</h3>
    <p className="text-sm text-muted-foreground">
      O potencial elétrico V(r) é uma função escalar cuja variação espacial determina o campo
      elétrico: E = −∇V. Para cargas pontuais, vale a superposição.
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`V(r) = (1/4πε₀) Σᵢ qᵢ / |r − rᵢ|
E(r) = −∇V(r) = (1/4πε₀) Σᵢ qᵢ (r − rᵢ) / |r − rᵢ|³`}</pre>

    <h4 className="font-display font-semibold">Superfícies equipotenciais</h4>
    <p className="text-sm text-muted-foreground">
      São lugares geométricos onde V = const. Como o trabalho ao longo de uma equipotencial é nulo,
      o campo E é sempre perpendicular a elas e aponta de V maior para V menor.
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`W = q (V_A − V_B)
E ⊥ equipotencial
ΔV pequeno entre linhas próximas ⇒ |E| grande`}</pre>

    <h4 className="font-display font-semibold">Casos canônicos (no plano)</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`Carga única +q : equipotenciais = círculos centrados em q
Dipolo (+,−)   : "lóbulos" simétricos; V=0 no plano mediador
Duas iguais (+,+): mínimo entre as cargas, ponto de sela em E
Quadrupolo     : V decai mais rápido (~1/r³) longe`}</pre>

    <h4 className="font-display font-semibold mt-3">Roteiro sugerido</h4>
    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
      <li>Compare carga única e dipolo: confirme V = 0 no plano mediador do dipolo.</li>
      <li>Para "duas iguais", localize o ponto onde E = 0 (entre as cargas) — V tem mínimo local.</li>
      <li>Mova o ponto P sobre uma mesma linha equipotencial e veja V constante.</li>
      <li>Em "Dados", verifique que |E| é grande onde V varia rapidamente.</li>
    </ul>
  </div>
);