import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `Todo corpo imerso (total ou parcialmente) num fluido sofre uma força vertical para cima (empuxo) igual ao peso do fluido deslocado.

#### Equação

$$E = \\rho_{\\text{fluido}} \\cdot V_{\\text{submerso}} \\cdot g$$

#### Condição de flutuação

- $\\rho_{\\text{obj}} < \\rho_{\\text{fluido}}$: flutua. Fração submersa $= \\rho_{\\text{obj}} / \\rho_{\\text{fluido}}$.
- $\\rho_{\\text{obj}} = \\rho_{\\text{fluido}}$: equilíbrio neutro (em qualquer profundidade).
- $\\rho_{\\text{obj}} > \\rho_{\\text{fluido}}$: afunda. Peso aparente $= P - E_{\\max}$.

#### Iceberg

$\\rho_{\\text{gelo}} \\approx 917\\,\\text{kg/m}^3$ e $\\rho_{\\text{água-mar}} \\approx 1025\\,\\text{kg/m}^3$ $\\Rightarrow$ fração submersa $\\approx 89{,}5\\%$ (apenas $\\sim 10\\%$ aparece acima).

#### Como medir densidade

Pese o objeto no ar ($P$) e na água ($P_{\\text{ap}}$). Então:

$$\\rho_{\\text{obj}} = \\rho_{\\text{água}} \\cdot \\frac{P}{P - P_{\\text{ap}}}$$

É o método atribuído a Arquimedes para a coroa de Hieron.`;

export const ArchimedesTheoryTab = () => <MarkdownMath source={SOURCE} />;
