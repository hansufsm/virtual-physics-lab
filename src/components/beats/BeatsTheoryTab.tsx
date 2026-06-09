import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `A soma de dois sinais harmônicos de amplitudes iguais e frequências próximas produz um sinal modulado em amplitude — o fenômeno dos batimentos, perceptível como pulsações de intensidade.

#### Identidade fundamental

$$x(t) = A\\cos(2\\pi f_1 t) + A\\cos(2\\pi f_2 t)$$

$$x(t) = 2A \\cos\\!\\left(\\pi(f_1 - f_2)\\,t\\right) \\cdot \\cos\\!\\left(2\\pi \\bar{f}\\,t\\right), \\qquad \\bar{f} = \\frac{f_1 + f_2}{2}$$

$$f_{\\text{batimento}} = |f_1 - f_2| \\quad \\text{(frequência das pulsações de intensidade)}$$

O envelope é $|2A\\cos(\\pi \\Delta f\\, t)|$: anula-se 2 vezes por período de $\\Delta f$.

#### Aplicações

- Afinação de instrumentos: ajusta-se a corda até $f_{\\text{batimento}} \\to 0$.
- Heterodinagem em rádio: mistura de duas portadoras para gerar nova frequência.
- Velocimetria Doppler.

#### Roteiro

1. Mantenha $f_1 \\approx f_2$ (ex.: $10$ e $11\\,\\text{Hz}$) — observe batimento de $1\\,\\text{Hz}$.
2. Aumente $\\Delta f$: a envoltória pulsa mais rápido e a "carregadora" some.
3. Conte os máximos do envelope em $1\\,\\text{s}$ — confirme $f_b = |f_1 - f_2|$.`;

export const BeatsTheoryTab = () => <MarkdownMath source={SOURCE} />;
