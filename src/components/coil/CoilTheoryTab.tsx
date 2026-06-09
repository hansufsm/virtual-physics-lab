import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `A lei de Biot–Savart fornece o campo magnético produzido por um elemento de corrente. Para geometrias com simetria (espira circular, solenoide, par de Helmholtz) o campo no eixo pode ser obtido analiticamente integrando a contribuição de cada espira.

#### Equações principais

**Espira circular:**
$$B_z(z) = \\frac{\\mu_0 I R^2}{2\\,(R^2 + z^2)^{3/2}}$$

**Solenoide finito:**
$$B_z(z) = \\tfrac{1}{2}\\,\\mu_0 n I\\,(\\cos\\theta_1 + \\cos\\theta_2)$$

**Solenoide ideal** ($L \\gg R$):
$$B \\approx \\mu_0 n I$$

**Par de Helmholtz** ($d = R$):
$$B(0) = \\left(\\frac{4}{5}\\right)^{\\!3/2} \\frac{\\mu_0 N I}{R}$$

#### Pontos a observar

- O par de Helmholtz produz uma região de campo notavelmente uniforme próxima ao centro (variação $< 1\\%$ em distâncias da ordem de $R/4$).
- Em um solenoide finito, $B$ é máximo no centro e cai para metade nas extremidades quando $L \\gg R$.
- Inverter a corrente inverte o sentido de $\\vec{B}$ (regra da mão direita).
- Para $R = 5\\,\\text{cm}$, $N = 100$, $I = 1\\,\\text{A}$ em par de Helmholtz: $B(0) \\approx 1{,}80\\,\\text{mT}$.

#### Roteiro sugerido

1. Selecione *Espira*, varie $z$ e confirme o decaimento $\\propto 1/z^3$ longe da espira.
2. Mude para *Solenoide*: aumente $L$ mantendo $n$ constante e observe $B(0) \\to \\mu_0 n I$.
3. Compare a uniformidade (% de variação em $\\pm R/2$) entre solenoide curto, longo e Helmholtz.
4. Reproduza o experimento de bancada: meça $B$ no centro com bússola/sonda Hall virtual e ajuste $N$ e $I$.

$\\mu_0 = 4\\pi \\times 10^{-7}\\,\\text{T·m/A}$. Campo terrestre típico $\\approx 50\\,\\mu\\text{T}$ como referência de magnitude.`;

export const CoilTheoryTab = () => <MarkdownMath source={SOURCE} />;
