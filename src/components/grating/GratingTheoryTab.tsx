import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Rede de difração

Máximos principais em:

$$d \\sin\\theta_m = m\\lambda, \\qquad m = 0, \\pm 1, \\pm 2,\\ldots$$

#### Intensidade

$$I(\\theta) \\propto \\left[\\frac{\\sin(N\\delta/2)}{N\\sin(\\delta/2)}\\right]^2, \\quad \\delta = \\frac{2\\pi d}{\\lambda}\\sin\\theta$$

#### Dispersão e resolução

$$D = \\frac{d\\theta}{d\\lambda} = \\frac{m}{d\\cos\\theta}, \\qquad R = \\frac{\\lambda}{\\Delta\\lambda} = m N$$

- Rede de $1200\\,\\text{l/mm}$ com $25\\,\\text{mm}$ iluminados: $N=30\\,000$, resolve o dubleto do sódio.
- $m_{\\max} = \\lfloor d/\\lambda \\rfloor$.
- Espectrômetros modernos usam redes em vez de prismas.`;

export const GratingTheoryTab = () => <MarkdownMath source={SOURCE} />;
