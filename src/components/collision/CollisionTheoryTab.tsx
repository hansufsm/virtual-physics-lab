export const CollisionTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Colisões 1D — momento linear e energia</h3>
    <p className="text-muted-foreground">
      Em uma colisão entre dois corpos sem forças externas relevantes durante o impacto, o momento
      linear total é sempre conservado. A energia cinética só se conserva em colisões perfeitamente
      elásticas (e = 1); para 0 ≤ e &lt; 1 parte da energia é convertida em calor, som ou deformação.
    </p>

    <h4 className="font-display font-semibold mt-6">Leis de conservação</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Momento:</span> m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂</li>
      <li><span className="text-primary font-semibold">Coef. de restituição:</span> e = −(v₁ − v₂)/(u₁ − u₂)</li>
      <li><span className="text-primary font-semibold">Centro de massa:</span> v_cm = (m₁u₁ + m₂u₂)/(m₁ + m₂)</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Velocidades pós-colisão</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li>v₁ = [(m₁ − e·m₂) u₁ + (1 + e) m₂ u₂] / (m₁ + m₂)</li>
      <li>v₂ = [(m₂ − e·m₁) u₂ + (1 + e) m₁ u₁] / (m₁ + m₂)</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Energia dissipada</h4>
    <p className="text-sm text-muted-foreground">
      Definindo a massa reduzida μ = m₁ m₂/(m₁ + m₂) e a velocidade relativa u_rel = u₁ − u₂, a
      energia perdida em calor/deformação é:
    </p>
    <p className="font-mono text-sm">ΔK = K_antes − K_depois = ½ μ (1 − e²) u_rel²</p>
    <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
      <li><strong>Elástica (e = 1):</strong> ΔK = 0; K e p conservados.</li>
      <li><strong>Parcialmente inelástica (0 &lt; e &lt; 1):</strong> p conservado, K diminui.</li>
      <li><strong>Perfeitamente inelástica (e = 0):</strong> corpos seguem juntos com v = v_cm; perda máxima de K.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Impulso e teorema do impulso</h4>
    <p className="text-sm font-mono">J₁ = ∫F dt = Δp₁ = m₁(v₁ − u₁) = −J₂</p>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Configure m₁ = m₂ e colisão elástica (e = 1): as velocidades se trocam.</li>
      <li>Mantenha e = 1 mas faça m₂ ≫ m₁: o corpo leve "ricocheteia" e o pesado quase não muda.</li>
      <li>Use e = 0 (perfeitamente inelástica): confirme que v₁ = v₂ = v_cm após o impacto.</li>
      <li>Varie e na aba "vs. e" e observe como ΔK cresce de 0 (em e = 1) até o máximo (em e = 0).</li>
      <li>Verifique numericamente que Δp ≈ 0 em todas as configurações (aba "Medições").</li>
      <li>Compare o impulso em m₁ e m₂: J₁ = −J₂ pela 3ª lei de Newton.</li>
    </ol>
  </article>
);