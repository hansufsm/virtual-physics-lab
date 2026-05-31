export const HydrogenTheoryTab = () => (
  <div className="prose prose-sm dark:prose-invert max-w-none">
    <h3 className="font-display text-lg font-semibold mt-0">Átomo de hidrogênio</h3>
    <p className="text-muted-foreground">
      Bohr (1913) propôs órbitas estacionárias com momento angular quantizado L = nħ. Os níveis de energia são:
    </p>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>E_n = −13,606 eV / n²</code></pre>
    <h4 className="font-display mt-4">Fórmula de Rydberg</h4>
    <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto"><code>1/λ = R_∞ (1/n_l² − 1/n_u²)
R_∞ = 1,0974 × 10⁷ m⁻¹</code></pre>
    <h4 className="font-display mt-4">Séries espectrais</h4>
    <ul className="text-muted-foreground">
      <li><strong>Lyman</strong> (n_l = 1) — UV</li>
      <li><strong>Balmer</strong> (n_l = 2) — visível e UV próximo (Hα 656 nm, Hβ 486 nm, Hγ 434 nm…)</li>
      <li><strong>Paschen</strong> (n_l = 3) — IV próximo</li>
      <li><strong>Brackett</strong> (n_l = 4), <strong>Pfund</strong> (n_l = 5) — IV</li>
    </ul>
    <p className="text-muted-foreground">
      Balmer observou empiricamente as linhas visíveis em 1885; Rydberg generalizou (1888); Bohr deu a primeira
      derivação quântica (1913). A mecânica quântica completa (Schrödinger) reproduz E_n e prevê estrutura fina.
    </p>
  </div>
);
