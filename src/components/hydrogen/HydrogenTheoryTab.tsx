import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Átomo de hidrogênio

Bohr (1913) propôs órbitas estacionárias com $L = n\\hbar$:

$$E_n = -\\frac{13{,}606\\,\\text{eV}}{n^2}$$

#### Fórmula de Rydberg

$$\\frac{1}{\\lambda} = R_\\infty\\left(\\frac{1}{n_l^2} - \\frac{1}{n_u^2}\\right), \\quad R_\\infty = 1{,}0974\\times10^7\\,\\text{m}^{-1}$$

#### Séries

- **Lyman** ($n_l=1$) — UV
- **Balmer** ($n_l=2$) — visível (H$\\alpha$ 656 nm, H$\\beta$ 486 nm, H$\\gamma$ 434 nm)
- **Paschen** ($n_l=3$) — IR próximo
- **Brackett** ($n_l=4$), **Pfund** ($n_l=5$) — IR

Balmer (1885) → Rydberg (1888) → Bohr (1913) → Schrödinger (estrutura fina).`;

export const HydrogenTheoryTab = () => <MarkdownMath source={SOURCE} />;
