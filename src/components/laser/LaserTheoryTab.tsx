import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Laser e cavidade Fabry–Pérot

Modos longitudinais e FSR:

$$\\nu_m = \\frac{m c}{2L}, \\qquad \\text{FSR} = \\frac{c}{2L}$$

Finesse:

$$\\mathcal{F} = \\frac{\\pi\\sqrt{R}}{1-R}, \\quad R=\\sqrt{R_1 R_2}$$

Largura de cada modo $\\approx \\text{FSR}/\\mathcal{F}$.

#### Limiar e coerência

Acima do limiar, $P \\propto (P - P_{\\text{th}})$. Comprimento de coerência $\\ell_c \\approx c/\\Delta\\nu$.

- **HeNe:** cavidade $\\sim 30\\,\\text{cm}$, FSR $\\sim 500\\,\\text{MHz}$.
- **Diodo:** cavidade $\\mu\\text{m}$, monomodo.
- **Ti:Sa fs:** centenas de modos travados em fase.
- **Fabry–Pérot** também usado como filtro óptico.`;

export const LaserTheoryTab = () => <MarkdownMath source={SOURCE} />;
