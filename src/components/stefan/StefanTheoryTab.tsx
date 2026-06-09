import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Radiação térmica

#### Stefan–Boltzmann

$$P = \\varepsilon \\sigma A T^4, \\quad \\sigma = 5{,}6704\\times10^{-8}\\,\\text{W/(m}^2\\text{K}^4\\text{)}$$

Troca líquida: $P_{\\text{net}} = \\varepsilon\\sigma A(T_1^4 - T_2^4)$.

#### Wien

$$\\lambda_{\\max} T = b = 2{,}898\\times10^{-3}\\,\\text{m·K}$$

#### Planck

$$B(\\lambda,T) = \\frac{2hc^2}{\\lambda^5}\\frac{1}{\\exp(hc/\\lambda k_B T) - 1}$$

Sol ($\\sim 5800\\,\\text{K}$): $\\lambda_{\\max}\\approx 500\\,\\text{nm}$. Corpo humano ($\\sim 310\\,\\text{K}$): $\\lambda_{\\max}\\approx 9\\,\\mu\\text{m}$ (IR).`;

export const StefanTheoryTab = () => <MarkdownMath source={SOURCE} />;
