import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Efeito Zeeman

$$\\Delta E = g_J \\mu_B B m_J$$

#### Fator de Landé

$$g_J = 1 + \\frac{J(J+1) + S(S+1) - L(L+1)}{2 J(J+1)}$$

$\\mu_B = e\\hbar/(2 m_e) \\approx 9{,}274\\times10^{-24}\\,\\text{J/T} \\approx 5{,}788\\times10^{-5}\\,\\text{eV/T}$.

#### Regras de seleção

- $\\pi$ ($\\Delta m = 0$): linear $\\parallel B$.
- $\\sigma^+$ ($\\Delta m = +1$): circular dextrógira.
- $\\sigma^-$ ($\\Delta m = -1$): circular levógira.

#### Normal vs. anômalo

**Normal** ($S=0$): tripleto com $\\Delta\\nu = \\pm \\mu_B B/h \\approx 14\\,\\text{GHz/T}$.

**Anômalo** ($S\\neq 0$): múltiplas componentes.

$$\\Delta E = \\mu_B B(g_u m_u - g_l m_l)$$

Descoberto por Zeeman em 1896 (Nobel 1902).`;

export const ZeemanTheoryTab = () => <MarkdownMath source={SOURCE} />;
