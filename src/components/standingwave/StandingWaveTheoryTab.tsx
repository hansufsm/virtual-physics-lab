import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Ondas estacionárias em corda

$$v = \\sqrt{T/\\mu}$$

#### Fixa-fixa

$$\\lambda_n = 2L/n, \\quad f_n = \\frac{n v}{2L} = \\frac{n}{2L}\\sqrt{T/\\mu}$$

#### Fixa-livre

$$\\lambda_n = \\frac{4L}{2n-1}, \\quad f_n = \\frac{(2n-1)v}{4L}$$

Apenas harmônicos ímpares.

#### Função de onda

$$y(x,t) = A\\sin(k_n x)\\cos(\\omega_n t), \\; k_n = \\frac{n\\pi}{L}$$

#### Nós e ventres (fixa-fixa)

- Nós: $n+1$; ventres: $n$. Distância entre nós: $\\lambda/2$.

$$\\langle E\\rangle = \\tfrac{1}{4}\\mu L \\omega^2 A^2$$`;

export const StandingWaveTheoryTab = () => <MarkdownMath source={SOURCE} />;
