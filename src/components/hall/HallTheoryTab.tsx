import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Efeito Hall

$$V_H = \\frac{R_H I B}{t}, \\qquad R_H = \\frac{1}{n q}$$

O sinal de $V_H$ identifica o portador (elétron vs. buraco).

#### Velocidade de deriva

$$v_d = \\frac{J}{n|q|} = \\frac{I}{n|q|\\,w\\,t}$$

#### Resistividade e ângulo Hall

$$\\rho_{xx} = \\frac{1}{n|q|\\mu}, \\quad \\rho_{xy} = R_H B, \\quad \\tan\\theta_H = \\mu B$$

#### Roteiro

- Compare $V_H$ em Cu vs. Si tipo $n$.
- Inverta tipo de portador e veja sinal de $V_H$ inverter.
- $V_H$ linear em $B$ — extraia $R_H/t$ pela inclinação.
- Calcule $n = 1/(R_H q)$.`;

export const HallTheoryTab = () => <MarkdownMath source={SOURCE} />;
