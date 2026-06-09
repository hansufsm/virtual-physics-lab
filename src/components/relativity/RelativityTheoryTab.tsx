import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Relatividade especial

#### Postulados (Einstein, 1905)

1. Leis da física iguais em todos os referenciais inerciais.
2. $c$ invariante.

#### Lorentz

$$x' = \\gamma(x - vt), \\quad t' = \\gamma(t - vx/c^2)$$

$$\\gamma = \\frac{1}{\\sqrt{1-\\beta^2}}, \\quad \\beta = v/c$$

#### Dilatação e contração

$$\\Delta t = \\gamma \\Delta t_0, \\quad L = L_0/\\gamma$$

#### Composição de velocidades

$$u = \\frac{u' + v}{1 + u'v/c^2}$$

#### Gêmeos

$$t_{\\text{Terra}} = 2D/\\beta, \\quad t_{\\text{viajante}} = 2D\\sqrt{1-\\beta^2}/\\beta$$

#### Energia e momento

$$E = \\gamma m c^2, \\; p = \\gamma m v, \\; E^2 = (pc)^2 + (mc^2)^2$$`;

export const RelativityTheoryTab = () => <MarkdownMath source={SOURCE} />;
