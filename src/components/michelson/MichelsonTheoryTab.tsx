import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Interferômetro de Michelson

#### Princípio

$$\\Delta = 2(L_2 - L_1)$$

$$I(\\Delta) = \\frac{I_{\\max}}{2}\\left[1 + V\\cos\\!\\left(\\frac{2\\pi\\Delta}{\\lambda}\\right)\\right]$$

Cada deslocamento de $\\lambda/2$ no espelho passa uma franja pelo centro.

#### Anéis (igual inclinação)

$$2\\Delta\\cos\\theta_m = m\\lambda, \\quad r_n \\approx f\\sqrt{\\frac{n\\lambda}{|\\Delta|}}$$

#### Franjas retilíneas (igual espessura)

Inclinando o espelho de $\\alpha$:

$$\\Lambda = \\frac{\\lambda}{2\\alpha}$$

#### Aplicações

- Metrologia: $\\Delta L = N\\lambda/2$.
- Índice de refração: lâmina muda $\\Delta$ em $2d(n-1)$.
- FTIR, LIGO, Michelson–Morley.`;

export const MichelsonTheoryTab = () => <MarkdownMath source={SOURCE} />;
