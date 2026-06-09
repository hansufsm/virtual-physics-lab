import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Stern–Gerlach (1922)

$$\\vec F = \\nabla(\\vec\\mu\\cdot\\vec B), \\quad F_z = \\mu_z\\,\\frac{\\partial B}{\\partial z}$$

Para a prata ($L=0$): $\\mu_z = -g_s m_s \\mu_B$, $m_s = \\pm 1/2$ — apenas dois pontos no detector.

Primeira evidência da quantização espacial — manifestação do **spin** do elétron.

- Maxwell–Boltzmann: $\\bar v = \\sqrt{2 k_B T/m}$.
- Deflexão: $\\Delta z = \\tfrac{1}{2} a (L/v)^2 + a L D/v^2$, $a = F_z/m$.
- Spin $J$: $2J+1$ picos.
- SG sequenciais ($z\\to x\\to z$) restauram componentes.`;

export const SternTheoryTab = () => <MarkdownMath source={SOURCE} />;
