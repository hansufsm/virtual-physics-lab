import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Potencial elétrico

$$V(\\vec r) = \\frac{1}{4\\pi\\varepsilon_0}\\sum_i \\frac{q_i}{|\\vec r - \\vec r_i|}$$

$$\\vec E = -\\nabla V$$

#### Equipotenciais

$\\vec E \\perp$ equipotencial; aponta de $V$ maior para menor. $W = q(V_A - V_B)$.

#### Casos

- **Carga única $+q$:** círculos.
- **Dipolo $(+,-)$:** $V=0$ no plano mediador.
- **Duas iguais $(+,+)$:** ponto de sela $\\vec E = 0$ entre as cargas.
- **Quadrupolo:** $V \\sim 1/r^3$ longe.`;

export const PotentialTheoryTab = () => <MarkdownMath source={SOURCE} />;
