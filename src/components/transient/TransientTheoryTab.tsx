import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Transitórios LR e RLC

#### LR

$$L\\,di/dt + R i = V_0 \\Rightarrow i(t) = (V_0/R)(1 - e^{-t/\\tau}), \\; \\tau = L/R$$

Descarga: $i(t) = I_0 e^{-t/\\tau}$. Energia magnética $U_L = \\tfrac{1}{2} L i^2$.

#### RLC série

$$L q'' + R q' + q/C = V_0$$

$$\\omega_0 = 1/\\sqrt{LC}, \\quad \\alpha = R/(2L), \\quad \\zeta = \\alpha/\\omega_0, \\quad Q = \\omega_0 L/R = 1/(2\\zeta)$$

Regimes:

- **Sub** ($\\zeta<1$): oscila em $\\omega_d = \\sqrt{\\omega_0^2 - \\alpha^2}$.
- **Crítico** ($\\zeta=1$): $(A+Bt)e^{-\\alpha t}$.
- **Super** ($\\zeta>1$): duas exponenciais reais.

$$Q \\approx 2\\pi \\frac{E_{\\text{arm}}}{E_{\\text{dis/ciclo}}}$$`;

export const TransientTheoryTab = () => <MarkdownMath source={SOURCE} />;
