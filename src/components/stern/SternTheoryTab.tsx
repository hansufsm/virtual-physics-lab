export const SternTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display font-semibold text-lg">Stern–Gerlach (1922)</h3>
    <p className="text-muted-foreground">
      Um átomo neutro com momento magnético <strong>μ</strong> em um campo não-uniforme experimenta uma força
      F = ∇(μ · B). Com B principalmente ao longo de z e ∂B/∂z fixo, F_z = μ_z · (∂B/∂z). Para o elétron de valência
      do prata (L = 0), o momento devido ao spin é μ_z = -g_s m_s μ_B com m_s = ±1/2.
    </p>
    <p className="text-muted-foreground">
      A previsão clássica seria uma distribuição contínua de orientações. O experimento mostrou apenas dois pontos —
      a primeira evidência direta da quantização espacial. Mais tarde, isso foi interpretado como manifestação do
      <strong> spin do elétron</strong>.
    </p>
    <ul className="text-sm text-muted-foreground">
      <li>Distribuição de velocidades de Maxwell–Boltzmann: v̄ = √(2k_B T/m).</li>
      <li>Deflexão Δz = (1/2) a (L/v)² + a L D / v² com a = F_z/m.</li>
      <li>Spin 1/2 → 2 picos; spin 1 → 3 picos; em geral 2J + 1.</li>
      <li>SG sequenciais (z → x → z) restauram componentes: base para a noção de medida em MQ.</li>
    </ul>
  </div>
);