export const ProjectileTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Movimento de projéteis</h3>
    <p className="text-muted-foreground">
      Um projétil lançado com velocidade inicial v₀ e ângulo θ sob gravidade g constante (sem arrasto)
      descreve uma trajetória parabólica. Os movimentos horizontal e vertical são independentes:
      o horizontal é uniforme e o vertical é uniformemente variado.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações no vácuo</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Componentes:</span> v₀ₓ = v₀·cosθ, &nbsp; v₀ᵧ = v₀·sinθ</li>
      <li><span className="text-primary font-semibold">Posição:</span> x(t) = v₀ₓ·t, &nbsp; y(t) = h₀ + v₀ᵧ·t − ½ g t²</li>
      <li><span className="text-primary font-semibold">Tempo de voo (h₀=0):</span> T = 2 v₀ sinθ / g</li>
      <li><span className="text-primary font-semibold">Alcance (h₀=0):</span> R = v₀² sin(2θ) / g &nbsp; → máx em θ = 45°</li>
      <li><span className="text-primary font-semibold">Altura máxima:</span> H = h₀ + (v₀ sinθ)² / (2g)</li>
      <li><span className="text-primary font-semibold">Trajetória:</span> y(x) = h₀ + tanθ · x − g x² / (2 v₀² cos²θ)</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Com arrasto do ar</h4>
    <p className="text-sm">
      Quando incluímos o arrasto, as componentes <em>não</em> são mais independentes. Em geral, integra-se
      numericamente F = m·a com:
    </p>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Linear:</span> F_arr = −b·v &nbsp; (válido para baixas velocidades, regime de Stokes)</li>
      <li><span className="text-primary font-semibold">Quadrático:</span> F_arr = −c·|v|·v &nbsp; (regime turbulento, esferas e bolas reais)</li>
    </ul>
    <p className="text-sm">
      Efeitos típicos: alcance e altura menores, trajetória assimétrica (descida mais íngreme que subida)
      e o ângulo ótimo cai abaixo de 45°.
    </p>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>No vácuo, varie θ de 0° a 90° e confirme o máximo de alcance em 45° (com h₀ = 0).</li>
      <li>Aumente h₀ e veja como o ângulo ótimo cai abaixo de 45°.</li>
      <li>Compare Lua × Terra mantendo v₀ fixo: o alcance escala como 1/g.</li>
      <li>Ative arrasto quadrático e observe a assimetria e a queda de R em relação ao vácuo.</li>
      <li>Em "Dados", faça a varredura R(θ) com e sem arrasto e meça o novo θ ótimo.</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      Aplicações: balística, esportes (futebol, basquete, golfe), engenharia aeroespacial, hidráulica de jatos.
    </p>
  </article>
);