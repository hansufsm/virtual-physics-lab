import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Escoamento de Hagen–Poiseuille

#### Perfil parabólico

$$v(r) = \\frac{\\Delta P}{4\\eta L}(R^2 - r^2)$$

$$v_{\\max} = \\frac{\\Delta P R^2}{4\\eta L}, \\quad \\bar v = \\frac{v_{\\max}}{2}$$

#### Lei de Poiseuille

$$Q = \\frac{\\pi R^4 \\Delta P}{8\\eta L}$$

$$R_h = \\frac{8\\eta L}{\\pi R^4}, \\quad \\tau_{\\text{parede}} = \\frac{\\Delta P R}{2L}$$

$$Re = \\frac{2\\rho \\bar v R}{\\eta} < 2300 \\;(\\text{laminar})$$

$Q\\propto R^4$ — vasoconstrição altera muito o fluxo.`;

export const PoiseuilleTheoryTab = () => <MarkdownMath source={SOURCE} />;
