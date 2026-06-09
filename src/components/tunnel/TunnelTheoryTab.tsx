import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Tunelamento

#### $E < V_0$

$$T = \\frac{1}{1 + \\dfrac{V_0^2 \\sinh^2(\\kappa a)}{4 E(V_0 - E)}}, \\quad \\kappa = \\frac{\\sqrt{2m(V_0-E)}}{\\hbar}$$

Barreira grossa: $T \\approx 16 E (V_0-E)/V_0^2 \\cdot e^{-2\\kappa a}$.

#### $E > V_0$

$$T = \\frac{1}{1 + \\dfrac{V_0^2 \\sin^2(k' a)}{4 E (E - V_0)}}, \\quad k' = \\frac{\\sqrt{2m(E-V_0)}}{\\hbar}$$

Ressonâncias quando $k' a = n\\pi$.

**Aplicações:** STM, decaimento $\\alpha$ (Gamow), diodo túnel, fusão estelar.`;

export const TunnelTheoryTab = () => <MarkdownMath source={SOURCE} />;
