import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Lei de Gauss

$$\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}$$

#### Carga pontual / esfera

$$E(r) = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Q}{r^2} \\;(r>R), \\quad E(r) = \\frac{1}{4\\pi\\varepsilon_0}\\frac{Qr}{R^3} \\;(r<R)$$

#### Fio infinito

$$E(r) = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}$$

#### Plano infinito

$$E = \\frac{\\sigma}{2\\varepsilon_0} \\quad (\\text{independe da distância})$$

#### Roteiro

- Em carga pontual, verifique $E\\propto 1/r^2$.
- Em esfera, $Q_{\\text{enc}}\\propto r^3$ até $r=R$.
- Em fio infinito, $E\\propto 1/r$.
- Em plano, $E$ uniforme.`;

export const GaussTheoryTab = () => <MarkdownMath source={SOURCE} />;
