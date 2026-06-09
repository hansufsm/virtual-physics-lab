import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Pêndulo simples

**Não-linear:** $\\ddot\\theta + (b/m)\\dot\\theta + (g/L)\\sin\\theta = 0$

**Pequenos ângulos:** $\\ddot\\theta + 2\\gamma\\dot\\theta + \\omega_0^2 \\theta = 0$, $\\omega_0 = \\sqrt{g/L}$.

$$T_0 = 2\\pi\\sqrt{\\frac{L}{g}}$$

**Correção:** $T \\approx T_0(1 + \\theta_0^2/16 + 11\\theta_0^4/3072 + \\cdots)$

#### Energia

$$E_c = \\tfrac{1}{2} m L^2 \\dot\\theta^2, \\quad E_p = mgL(1-\\cos\\theta) \\approx \\tfrac{1}{2} m g L \\theta^2$$

#### Amortecimento ($\\gamma = b/(2m)$)

- **Sub:** $\\omega' = \\sqrt{\\omega_0^2 - \\gamma^2}$.
- **Crítico:** $\\gamma = \\omega_0$.
- **Super:** $\\gamma > \\omega_0$.
- $Q = \\omega_0 m / b$.`;

export const PendulumTheoryTab = () => <MarkdownMath source={SOURCE} />;
