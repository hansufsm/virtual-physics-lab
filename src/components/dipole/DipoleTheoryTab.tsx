import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### Dipolo elétrico em campo externo

Um dipolo é um par de cargas iguais e opostas ($+q$, $-q$) separadas por uma distância $d$. O momento de dipolo aponta de $-q$ para $+q$:

$$\\vec{p} = q \\cdot d \\quad (\\text{vetor})$$

#### Em campo externo uniforme $\\vec{E}$

$$\\vec{\\tau} = \\vec{p} \\times \\vec{E} \\quad \\Rightarrow \\quad |\\tau| = p E \\sin\\theta$$

$$U = -\\vec{p} \\cdot \\vec{E} \\quad \\Rightarrow \\quad U(\\theta) = -p E \\cos\\theta$$

$$F_{\\text{resultante}} = 0 \\quad (\\text{em } \\vec{E} \\text{ uniforme})$$

#### Pequenas oscilações

Em torno de $\\theta = 0$ (mínimo de $U$), $\\tau \\approx -pE\\cdot\\theta$. Com $I = m d^2/2$ (duas massas iguais a $d/2$ do centro):

$$\\omega = \\sqrt{\\frac{pE}{I}}, \\qquad T = 2\\pi\\sqrt{\\frac{I}{pE}}$$

#### Campo do próprio dipolo

$$E_r = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2p\\cos\\theta}{r^3}$$

$$E_\\theta = \\frac{1}{4\\pi\\varepsilon_0}\\frac{p\\sin\\theta}{r^3}$$

$$|\\vec{E}| \\propto \\frac{1}{r^3}$$

#### Roteiro sugerido

- Em "Torque em E", varie $\\theta$ e confirme $\\tau \\propto \\sin\\theta$ e $U \\propto -\\cos\\theta$.
- Verifique $\\tau$ linear em $E$ (varredura de $E$) e que $F_{\\text{resultante}} = 0$.
- Meça o período e compare com $T = 2\\pi\\sqrt{I/(pE)}$.
- Em "Campo do dipolo", deslize o ponto $P$ e confirme $|\\vec{E}| \\propto 1/r^3$.`;

export const DipoleTheoryTab = () => <MarkdownMath source={SOURCE} />;
