import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Queda livre e gravidade

No vácuo, todo corpo cai com a mesma aceleração $g$, independente da massa (princípio da equivalência).

#### Cinemática (sem resistência)

$$y(t) = h_0 - v_0 t - \\tfrac{1}{2} g t^2, \\qquad v(t) = v_0 + g t$$

$$t_{\\text{queda}} = \\sqrt{\\frac{2h}{g}}, \\qquad v_{\\text{impacto}} = \\sqrt{2gh} \\quad (v_0=0)$$

#### Com arrasto linear ($F_d = -bv$)

$$m a = m g - b v, \\qquad v_{\\text{terminal}} = \\frac{mg}{b}$$

#### Como medir $g$

- Cronometre a queda de várias alturas e ajuste $h = \\tfrac{1}{2} g t^2$.
- Sensor fotoelétrico ou vídeo a 240 fps reduz erro.
- Terra $9{,}81$ · Lua $1{,}62$ · Marte $3{,}71$ · Júpiter $24{,}8\\,\\text{m/s}^2$.`;

export const FreefallTheoryTab = () => <MarkdownMath source={SOURCE} />;
