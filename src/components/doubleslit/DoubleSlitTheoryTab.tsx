import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### Difração e interferência (fenda dupla)

Para $N$ fendas idênticas de largura $a$ separadas por $d$, iluminadas por luz coerente de comprimento de onda $\\lambda$, a intensidade na tela distante $L$ (regime de Fraunhofer) é o produto do fator de fenda única (envelope) pelo fator de interferência de $N$ fontes:

$$\\alpha = \\frac{\\pi a \\sin\\theta}{\\lambda}, \\qquad \\varphi = \\frac{\\pi d \\sin\\theta}{\\lambda}$$

$$\\frac{I(\\theta)}{I_0} = \\left[\\frac{\\sin\\alpha}{\\alpha}\\right]^2 \\cdot \\left[\\frac{\\sin(N\\varphi)}{N\\sin\\varphi}\\right]^2$$

#### Casos limites

- **Fenda única** ($N=1$): $I = \\text{sinc}^2(\\alpha)$ — mínimos em $a\\sin\\theta = m\\lambda$.
- **Young** ($N=2$): $I = \\text{sinc}^2(\\alpha)\\cdot\\cos^2(\\varphi)$ — máximos em $d\\sin\\theta = m\\lambda$.
- **Rede** ($N$ grande): picos finos nas mesmas posições; largura $\\sim \\lambda/(Nd\\cos\\theta)$.

#### Padrão na tela (pequeno ângulo)

$$\\Delta y = \\frac{\\lambda L}{d} \\quad (\\text{espaçamento entre franjas brilhantes})$$

$$\\text{Largura central} = \\frac{2\\lambda L}{a} \\quad (\\text{envelope da fenda única})$$

$$\\text{N}^\\circ\\text{ de franjas dentro do envelope} \\approx \\frac{2d}{a} - 1$$

#### Roteiro sugerido

- Mantenha $a$ e varie $d$: confirme $\\Delta y \\propto 1/d$.
- Mantenha $d$ e varie $a$: confirme que apenas o envelope muda (largura central $\\propto 1/a$).
- Varie $\\lambda$ (cor): franjas se afastam para o vermelho.
- Aumente $N$: a rede gera picos cada vez mais finos nas mesmas posições.
- No painel "Dados", varie $y$, $\\lambda$ ou $d$ e exporte CSV para o relatório.`;

export const DoubleSlitTheoryTab = () => <MarkdownMath source={SOURCE} />;
