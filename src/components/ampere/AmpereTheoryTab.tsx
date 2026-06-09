import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `A lei de Ampère relaciona a circulação do campo magnético em uma curva fechada à corrente total enlaçada por essa curva:

$$\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 \\, I_{\\text{enlaçada}}$$

#### Fio retilíneo infinito

Por simetria, $\\vec{B}$ forma circunferências em torno do fio. Em uma curva circular de raio $d$:

$$B(d) = \\frac{\\mu_0 I}{2\\pi d}$$

#### Dois fios paralelos

Cada fio sente o campo do outro e sofre força de Lorentz por unidade de comprimento:

$$\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}$$

Correntes de mesmo sentido se atraem; de sentidos opostos se repelem.

#### Toroide

Uma curva amperiana circular de raio $r$ dentro do toroide enlaça $N \\cdot I$, dando:

$$B(r) = \\frac{\\mu_0 N I}{2\\pi r} \\qquad (R_{\\min} < r < R_{\\max})$$

$$B \\approx 0 \\quad \\text{fora do toroide}$$

#### Roteiro sugerido

- Verifique $B \\propto 1/d$ em "Fio único" variando o ponto de prova.
- Em "Dois fios", inverta o sentido de $I_2$ e observe a transição atração $\\leftrightarrow$ repulsão.
- Mostre que $F/L$ é linear em $I_1$ e $I_2$ e cai com $1/d$.
- No toroide, confirme que $B$ independe de $R$ quando você fixa $N \\cdot I / r$ constante.`;

export const AmpereTheoryTab = () => <MarkdownMath source={SOURCE} />;
