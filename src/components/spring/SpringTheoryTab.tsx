import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Lei de Hooke e MHS

$$F = -k x, \\quad m\\ddot x = -k x \\Rightarrow \\ddot x + \\omega^2 x = 0$$

$$\\omega = \\sqrt{k/m}, \\quad T = 2\\pi\\sqrt{m/k}, \\quad f = 1/T$$

$$x(t) = A\\cos(\\omega t + \\varphi)$$

$$U = \\tfrac{1}{2} k x^2, \\quad E_{\\text{total}} = \\tfrac{1}{2} k A^2$$

#### Associação

**Série:** $1/k_{\\text{eq}} = 1/k_1 + 1/k_2$ ($k$ menor)

**Paralelo:** $k_{\\text{eq}} = k_1 + k_2$ ($k$ maior)

#### Mola vertical

$x_{\\text{eq}} = mg/k$. $T$ não depende de $g$.`;

export const SpringTheoryTab = () => <MarkdownMath source={SOURCE} />;
