export const CoilTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Campo magnético de bobinas</h3>
    <p className="text-muted-foreground">
      A lei de Biot–Savart fornece o campo magnético produzido por um elemento de corrente.
      Para geometrias com simetria (espira circular, solenoide, par de Helmholtz) o campo no eixo
      pode ser obtido analiticamente integrando a contribuição de cada espira.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações principais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">Espira:</span> Bz(z) = µ₀ I R² / [2 (R² + z²)^(3/2)]</li>
      <li><span className="text-primary font-semibold">Solenoide finito:</span> Bz(z) = ½ µ₀ n I [cos θ₁ + cos θ₂]</li>
      <li><span className="text-primary font-semibold">Solenoide ideal (L≫R):</span> B ≈ µ₀ n I</li>
      <li><span className="text-primary font-semibold">Helmholtz (d = R):</span> B(0) = (4/5)^(3/2) · µ₀ N I / R</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Pontos a observar</h4>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li>O par de Helmholtz produz uma região de campo notavelmente uniforme próxima ao centro (variação &lt; 1% em distâncias da ordem de R/4).</li>
      <li>Em um solenoide finito, B é máximo no centro e cai para metade nas extremidades quando L ≫ R.</li>
      <li>Inverter a corrente inverte o sentido de B (regra da mão direita).</li>
      <li>Para R = 5 cm, N = 100, I = 1 A em par de Helmholtz: B(0) ≈ 1,80 mT.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Selecione <em>Espira</em>, varie z (no gráfico de Dados) e confirme o decaimento ∝ 1/z³ longe da espira.</li>
      <li>Mude para <em>Solenoide</em>: aumente L mantendo n constante e observe B(0) → µ₀nI.</li>
      <li>Compare a uniformidade (% de variação em ±R/2) entre solenoide curto, longo e Helmholtz.</li>
      <li>Reproduza o experimento de bancada: meça B no centro com bússola/sonda Hall virtual e ajuste N e I.</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      µ₀ = 4π × 10⁻⁷ T·m/A. Campo terrestre típico ≈ 50 µT como referência de magnitude.
    </p>
  </article>
);