export const FreefallTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Queda livre e gravidade</h3>
    <p className="text-muted-foreground">No vácuo, todo corpo cai com a mesma aceleração g, independente da massa (princípio da equivalência).</p>
    <h4 className="font-display mt-4">Cinemática (sem resistência)</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>y(t) = h₀ − v₀·t − ½·g·t²
v(t) = v₀ + g·t
t_queda = √(2h/g)      (v₀ = 0)
v_impacto = √(2gh)     (v₀ = 0)</code></pre>
    <h4 className="font-display mt-4">Com arrasto linear (F_d = −b·v)</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>m·a = m·g − b·v
v_terminal = m·g/b   (atinge quando a = 0)</code></pre>
    <h4 className="font-display mt-4">Como medir g</h4>
    <ul className="text-muted-foreground">
      <li>Cronometre a queda de uma esfera de várias alturas e ajuste h = ½g t².</li>
      <li>Use sensor fotoelétrico ou vídeo a 240 fps para reduzir erro de reação.</li>
      <li>Valores: Terra 9,81 · Lua 1,62 · Marte 3,71 · Júpiter 24,8 m/s².</li>
    </ul>
  </div>
);