import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Motor DC

$$F = BIL, \\qquad \\tau = NBIA\\cos\\theta$$

**Torque médio (com comutador):**

$$\\bar\\tau = \\frac{2}{\\pi} N B I A = k_T I$$

**FCEM:** $\\varepsilon = k_E \\omega$, com $k_E = k_T$ em SI.

**Elétrica:** $V = R I + k_E \\omega \\Rightarrow I = (V - k_E\\omega)/R$.

**Mecânica:** $J\\,d\\omega/dt = k_T I - T_{\\text{carga}} - b\\omega$.

**Velocidade a vazio:** $\\omega_0 \\approx V/k_E$.

#### Curva $T(\\omega)$

$$T(\\omega) = k_T \\frac{V - k_E\\omega}{R}$$

Reta decrescente: torque máximo na partida, $T=0$ em $\\omega_0$.`;

export const MotorTheoryTab = () => <MarkdownMath source={SOURCE} />;
