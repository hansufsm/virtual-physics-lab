export const ArchimedesTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Princípio de Arquimedes</h3>
    <p className="text-muted-foreground">Todo corpo imerso (total ou parcialmente) num fluido sofre uma força vertical para cima (empuxo) igual ao peso do fluido deslocado.</p>
    <h4 className="font-display mt-4">Equação</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>E = ρ_fluido · V_submerso · g</code></pre>
    <h4 className="font-display mt-4">Condição de flutuação</h4>
    <ul className="text-muted-foreground">
      <li><strong>ρ_obj &lt; ρ_fluido</strong>: flutua. Fração submersa = ρ_obj/ρ_fluido.</li>
      <li><strong>ρ_obj = ρ_fluido</strong>: equilíbrio neutro (em qualquer profundidade).</li>
      <li><strong>ρ_obj &gt; ρ_fluido</strong>: afunda. Peso aparente = P − E_máx.</li>
    </ul>
    <h4 className="font-display mt-4">Iceberg</h4>
    <p className="text-muted-foreground">ρ_gelo ≈ 917 kg/m³ e ρ_água-mar ≈ 1025 kg/m³ → fração submersa ≈ 89,5% (apenas ~10% aparece acima).</p>
    <h4 className="font-display mt-4">Como medir densidade</h4>
    <p className="text-muted-foreground">Pese o objeto no ar (P) e na água (P_ap). Então ρ_obj = ρ_água · P/(P − P_ap). É o método atribuído a Arquimedes para a coroa de Hieron.</p>
  </div>
);