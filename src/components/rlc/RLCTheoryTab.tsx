import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### RLC série

$$\\underline Z = R + j(\\omega L - 1/\\omega C)$$

$$X_L = \\omega L, \\quad X_C = 1/(\\omega C)$$

$$|Z| = \\sqrt{R^2 + (X_L - X_C)^2}, \\quad \\tan\\varphi = (X_L - X_C)/R$$

#### Ressonância

$$\\omega_0 = \\frac{1}{\\sqrt{LC}}, \\quad f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$$

$$Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}} = \\frac{\\omega_0 L}{R}, \\quad \\Delta f = \\frac{f_0}{Q}$$

- $f < f_0$: capacitivo ($\\varphi<0$).
- $f = f_0$: $|Z|=R$, $I$ máximo, $\\varphi=0$.
- $f > f_0$: indutivo ($\\varphi>0$).`;

export const RLCTheoryTab = () => <MarkdownMath source={SOURCE} />;
