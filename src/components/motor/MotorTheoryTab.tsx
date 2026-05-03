export const MotorTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Motor DC e força de Laplace</h3>
    <p className="text-muted-foreground">
      Um condutor de comprimento L percorrido por corrente I imerso em campo B sofre a
      força de Laplace F = I·L × B. Em uma espira retangular num campo uniforme, o
      conjugado de forças nos dois lados ativos produz um torque que faz o rotor girar.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações principais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Força de Laplace:</span> F = B·I·L (perpendicular a B e I)</li>
      <li><span className="text-primary font-semibold">Torque na espira:</span> τ = N·B·I·A·cos θ &nbsp; (A = a·b)</li>
      <li><span className="text-primary font-semibold">Torque médio (com comutador):</span> τ̄ = (2/π)·N·B·I·A = kT·I</li>
      <li><span className="text-primary font-semibold">F.c.e.m.:</span> ε = kE·ω &nbsp; (em SI, kE = kT)</li>
      <li><span className="text-primary font-semibold">Equação elétrica:</span> V = R·I + kE·ω &nbsp;⇒&nbsp; I = (V − kE·ω)/R</li>
      <li><span className="text-primary font-semibold">Equação mecânica:</span> J·dω/dt = kT·I − T_carga − b·ω</li>
      <li><span className="text-primary font-semibold">Velocidade a vazio:</span> ω₀ ≈ V/kE</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Curva característica T × ω</h4>
    <p className="text-sm">
      Substituindo I na expressão do torque: <span className="font-mono">T(ω) = kT(V − kE·ω)/R</span>.
      É uma reta decrescente: o torque máximo ocorre na partida (ω = 0, T = T_partida = kT·V/R) e
      o motor atinge a velocidade a vazio quando T = 0.
    </p>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Mantenha V e B fixos e varie o torque de carga: observe a redução de RPM e o aumento da corrente.</li>
      <li>Dobre B e veja como kT muda — o motor fica mais "forte" porém mais lento a vazio.</li>
      <li>Calcule a corrente de partida e compare com a de regime: por que a f.c.e.m. protege o motor?</li>
      <li>Identifique o ponto de eficiência máxima na curva T × ω.</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      Aplicações: motores de brinquedos, drones, ventiladores, vidros elétricos, servomecanismos.
    </p>
  </article>
);