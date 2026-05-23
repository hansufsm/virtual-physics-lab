export const PhotoelectricTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Efeito fotoelétrico</h3>
    <p className="text-muted-foreground">
      Quando luz incide sobre uma superfície metálica, elétrons podem ser ejetados — mas apenas
      acima de uma frequência de limiar f₀, independentemente da intensidade. Einstein (1905)
      explicou o efeito tratando a luz como pacotes (fótons) de energia E = hf.
    </p>

    <h4 className="font-display font-semibold mt-6">Equação de Einstein</h4>
    <p className="font-mono text-sm">hf = φ + K_máx</p>
    <p className="text-sm">
      φ é a função trabalho do material (energia mínima para extrair um elétron). K_máx é a
      energia cinética máxima dos elétrons emitidos.
    </p>

    <h4 className="font-display font-semibold mt-6">Limiar e tensão de frenagem</h4>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li>Frequência de limiar: f₀ = φ/h. Para f &lt; f₀, nenhum elétron é emitido — qualquer que seja a intensidade.</li>
      <li>Tensão de frenagem: V_s = K_máx/e = (hf − φ)/e. É o potencial reverso que zera a fotocorrente.</li>
      <li>Gráfico V_s × f → reta de inclinação h/e e intercepto −φ/e (método clássico para medir h).</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Intensidade × frequência</h4>
    <p className="text-sm">
      Aumentar a intensidade aumenta o número de fótons (e portanto a corrente de saturação),
      mas <em>não</em> aumenta K_máx. Aumentar a frequência (diminuir λ) aumenta K_máx, mas
      não muda a corrente de saturação para a mesma intensidade.
    </p>

    <h4 className="font-display font-semibold mt-6">Constantes</h4>
    <p className="font-mono text-sm">h = 6.626 ×10⁻³⁴ J·s · e = 1.602 ×10⁻¹⁹ C · c = 2.998 ×10⁸ m/s</p>
    <p className="font-mono text-sm">1 eV = 1.602 ×10⁻¹⁹ J · E[eV] = 1240 / λ[nm]</p>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>Escolha Sódio (φ = 2.36 eV) e λ = 532 nm: verifique se há emissão e calcule V_s.</li>
      <li>Fixe λ; varie a intensidade I — confira que V_s não muda e I_sat cresce linearmente.</li>
      <li>Fixe a intensidade; varie λ entre 250–650 nm e tabule V_s. No gráfico V_s(f),
        meça a inclinação e estime h.</li>
      <li>Troque para Zinco (φ ≈ 4.30 eV) e procure o novo limiar λ₀.</li>
      <li>Use V &gt; 0 para coletar todos elétrons (I = I_sat); use V &lt; −V_s para zerar a corrente.</li>
    </ol>
  </article>
);