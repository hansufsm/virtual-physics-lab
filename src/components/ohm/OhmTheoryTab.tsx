import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Lei de Ohm

$$V = R I, \\qquad R = \\rho \\frac{L}{A}, \\qquad A = \\pi(\\varnothing/2)^2$$

$$I = \\frac{V}{R + r}, \\qquad P = V I = R I^2 = \\frac{V^2}{R}$$

#### Objetivos

1. Verificar linearidade $V \\times I$.
2. Obter $R$ pelo coeficiente angular.
3. Verificar $R \\propto L$ e $R \\propto 1/A$.
4. Estimar $\\rho$ do material.

Resistividades a 20°C: Cu $\\approx 1{,}68\\times10^{-8}$, Al $\\approx 2{,}65\\times10^{-8}$, Ni-Cr $\\approx 1{,}1\\times10^{-6}\\,\\Omega\\cdot\\text{m}$.`;

export const OhmTheoryTab = () => <MarkdownMath source={SOURCE} />;
