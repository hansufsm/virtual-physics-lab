import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Plano inclinado com atrito

#### Forças

$$F_\\parallel = mg\\sin\\theta, \\quad N = mg\\cos\\theta$$

$$f_{\\max} = \\mu_s N, \\quad f_k = \\mu_k N$$

#### Condição de movimento

Bloco desliza quando $\\tan\\theta > \\mu_s$. Ângulo crítico: $\\theta_c = \\arctan(\\mu_s)$.

#### Aceleração (descendo)

$$a = g(\\sin\\theta - \\mu_k \\cos\\theta)$$

#### Medir $\\mu$

- $\\mu_s$: aumente $\\theta$ até o bloco deslizar.
- $\\mu_k$: meça tempo $t$ e use $\\mu_k = (\\sin\\theta - 2L/(g t^2 \\cos\\theta))/\\cos\\theta$.`;

export const InclineTheoryTab = () => <MarkdownMath source={SOURCE} />;
