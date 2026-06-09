import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Espalhamento de Rutherford

Potencial de Coulomb $V(r) = k/r$, $k = Zze^2/(4\\pi\\varepsilon_0)$:

$$\\cot\\frac{\\theta}{2} = \\frac{2 E b}{k}$$

#### Distância mínima

$$r_{\\min} = \\frac{k}{2E}\\left(1 + \\frac{1}{\\sin(\\theta/2)}\\right)$$

Colisão frontal ($b=0$): $r_{\\min} = k/E$.

#### Seção de choque

$$\\frac{d\\sigma}{d\\Omega} = \\left(\\frac{k}{4E}\\right)^2 \\frac{1}{\\sin^4(\\theta/2)}$$

- 1909: Geiger & Marsden.
- 1911: Rutherford propõe o **núcleo** $\\lesssim 10\\,\\text{fm}$.
- Base da espectroscopia RBS.`;

export const RutherfordTheoryTab = () => <MarkdownMath source={SOURCE} />;
