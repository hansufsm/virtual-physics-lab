import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `Para escoamento incompressível, estacionário e sem viscosidade, a soma de pressão estática, dinâmica e gravitacional é constante ao longo de uma linha de corrente:

$$P + \\tfrac{1}{2}\\rho v^2 + \\rho g h = \\text{constante}$$

**Equação da continuidade:**

$$A_1 v_1 = A_2 v_2 \\quad \\Rightarrow \\quad v_2 = v_1 \\frac{A_1}{A_2}$$

**Diferença de pressão:**

$$\\Delta P = \\tfrac{1}{2}\\rho(v_2^2 - v_1^2) + \\rho g (h_2 - h_1)$$

**Vazão:**

$$Q = A v \\quad [\\text{m}^3/\\text{s}]$$

No tubo de Venturi, a queda de pressão na garganta permite medir a vazão. A sustentação aerodinâmica de uma asa também segue Bernoulli.`;

export const BernoulliTheoryTab = () => <MarkdownMath source={SOURCE} />;
