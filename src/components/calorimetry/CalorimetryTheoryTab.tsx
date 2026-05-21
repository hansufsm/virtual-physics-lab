export const CalorimetryTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Calorimetria e mudanças de fase</h3>
    <p className="text-muted-foreground">
      Em um sistema termicamente isolado, a soma das trocas de calor é nula. Misturando corpos a
      temperaturas diferentes — e eventualmente com mudanças de fase — usamos esse balanço para
      determinar a temperatura de equilíbrio.
    </p>

    <h4 className="font-display font-semibold mt-6">Calor sensível</h4>
    <p className="font-mono text-sm">Q = m · c · ΔT</p>
    <p className="text-sm">c_água ≈ 4186 J/(kg·K), c_gelo ≈ 2090 J/(kg·K).</p>

    <h4 className="font-display font-semibold mt-6">Calor latente de fusão</h4>
    <p className="font-mono text-sm">Q_fusão = m · L_f,   L_f (água) = 334 kJ/kg</p>
    <p className="text-sm text-muted-foreground">Durante a mudança de fase a temperatura permanece constante (0 °C para a água).</p>

    <h4 className="font-display font-semibold mt-6">Equação de equilíbrio (sem mudança de fase)</h4>
    <p className="font-mono text-sm">(mₐ c_água + C_cal)(T_eq − Tₐ) + mₛ c_s (T_eq − Tₛ) = 0</p>
    <p className="text-sm">isolando T_eq → média ponderada pelas capacidades térmicas.</p>

    <h4 className="font-display font-semibold mt-6">Algoritmo com gelo</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Calcule a energia disponível baixando o sistema (água + sólido) até 0 °C: Q₀.</li>
      <li>Se Q₀ &lt; m_gelo · L_f → T_eq = 0 °C e apenas m = Q₀/L_f de gelo derrete.</li>
      <li>Caso contrário, todo gelo derrete e a água adicional entra no balanço final.</li>
    </ol>

    <h4 className="font-display font-semibold mt-6">Capacidade térmica do calorímetro</h4>
    <p className="font-mono text-sm">C_cal = equivalente em massa de água do recipiente.</p>
    <p className="text-sm text-muted-foreground">Calorímetros reais nunca são perfeitos: parte do calor aquece o vaso. Ajuste C_cal para corrigir.</p>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Preset “Cobre quente em água”: calcule T_eq à mão e compare.</li>
      <li>Aumente a massa do sólido em Tf(mₛ) — perto da assíntota.</li>
      <li>Ative gelo gradualmente e observe a transição entre os cenários “parcial” e “total”.</li>
      <li>Aumente C_cal para 200 J/K e observe a queda em T_eq (calorímetro absorve calor).</li>
      <li>Confira que Σ Q ≈ 0 em todas as configurações.</li>
    </ol>
  </article>
);