import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Millikan (1909)

No equilíbrio com $E = V/d$:

$$qE = (m - m_{\\text{ar}})g \\Rightarrow q = \\frac{4\\pi r^3}{3}(\\rho_{\\text{oil}} - \\rho_{\\text{ar}})\\frac{g d}{V}$$

Raio via Stokes (queda livre sem campo):

$$v = \\frac{2r^2(\\rho_{\\text{oil}} - \\rho_{\\text{ar}}) g}{9\\eta}$$

$q$ é sempre múltiplo inteiro de $e = 1{,}602\\times10^{-19}\\,\\text{C}$.

- Quantização da carga elétrica.
- Combina com $e/m$ de Thomson para obter $m_e$.
- Correção de Cunningham refina Stokes.
- Nobel de Física, 1923.`;

export const MillikanTheoryTab = () => <MarkdownMath source={SOURCE} />;
