export const QHallTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display font-semibold text-lg">Efeito Hall Quântico (von Klitzing, 1980)</h3>
    <p className="text-muted-foreground">
      Em um gás de elétrons bidimensional (2DEG) sujeito a um campo B perpendicular, os estados condensam-se em
      níveis de Landau, cada um com degenerescência n_L = eB/h por unidade de área. O <strong>fator de preenchimento</strong>
      é ν = nₛ h / (eB).
    </p>
    <p className="text-muted-foreground">
      Quando ν é inteiro, todos os níveis ocupados estão totalmente cheios e o transporte ocorre em estados de borda
      topologicamente protegidos. A resistência Hall mostra platôs precisos: <strong>R_xy = h/(νe²) = R_K/ν</strong>,
      enquanto a resistência longitudinal R_xx anula-se.
    </p>
    <ul className="text-sm text-muted-foreground">
      <li>R_K = h/e² ≈ 25812.807 Ω (constante de von Klitzing).</li>
      <li>Precisão melhor que 1 em 10⁹: usado como padrão metrológico do ohm.</li>
      <li>Manifestação macroscópica de um invariante topológico (número de Chern).</li>
      <li>Efeito Hall quântico fracionário (Tsui, Störmer, Laughlin) revela quasipartículas de carga e/3.</li>
    </ul>
  </div>
);