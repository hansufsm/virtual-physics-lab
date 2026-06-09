import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### 1. Cinemática relativística

Um fóton de energia $E_0 = hc/\\lambda_0$ colide com um elétron livre em repouso. Conservação de energia e momento (com $E_e^2 = (pc)^2 + (m_e c^2)^2$) leva à fórmula descoberta por Compton em 1923:

$$\\Delta\\lambda = \\lambda' - \\lambda_0 = \\frac{h}{m_e c}(1 - \\cos\\theta) = \\lambda_C (1 - \\cos\\theta)$$

$$\\lambda_C = 2{,}42631 \\times 10^{-12}\\text{ m} \\quad (\\text{comprimento de onda Compton})$$

#### 2. Energias e ângulo do elétron

$$E' = \\frac{E_0}{1 + \\alpha(1 - \\cos\\theta)}, \\qquad \\alpha = \\frac{E_0}{m_e c^2} = \\frac{E_0}{511\\text{ keV}}$$

$$K_e = E_0 - E'$$

$$\\cot\\varphi = (1 + \\alpha)\\tan\\!\\left(\\frac{\\theta}{2}\\right)$$

#### 3. Seção de choque de Klein–Nishina

O cálculo de QED para o espalhamento $\\gamma + e^- \\rightarrow \\gamma + e^-$ fornece:

$$\\frac{d\\sigma}{d\\Omega} = \\frac{r_0^2}{2}\\left(\\frac{E'}{E_0}\\right)^2 \\left[\\frac{E_0}{E'} + \\frac{E'}{E_0} - \\sin^2\\theta\\right]$$

No limite $\\alpha \\rightarrow 0$ reduz-se ao espalhamento Thomson (independente de $\\theta$).

#### 4. Importância histórica

- Confirmou que o fóton carrega momento $p = h/\\lambda$ — natureza corpuscular da luz.
- Nobel de Física em 1927 (A. H. Compton).
- Aplicações: radioterapia, telescópios de raios gama, datação por densitometria.

#### 5. Roteiro sugerido

1. Fixe $E_0 = 662\\text{ keV}$ (Cs-137) e meça $\\Delta\\lambda$ para $\\theta = 0^\\circ, 45^\\circ, 90^\\circ, 180^\\circ$. Compare com $\\lambda_C(1 - \\cos\\theta)$.
2. Mantenha $\\theta = 90^\\circ$ e varie $E_0$: confirme que $\\Delta\\lambda$ não depende de $E_0$, mas $E'/E_0$ sim.
3. Calcule a fração de energia entregue ao elétron $K/E_0$ em $\\theta = 180^\\circ$ e compare com $2\\alpha/(1+2\\alpha)$.
4. Compare a curva $d\\sigma/d\\Omega$ em altas e baixas energias para ver o *forward peaking*.`;

export const ComptonTheoryTab = () => <MarkdownMath source={SOURCE} />;
