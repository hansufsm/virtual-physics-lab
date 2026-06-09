import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Franck–Hertz (1914) — Nobel 1925

Um tubo contém vapor (Hg típico). Elétrons termiônicos são acelerados por $V$ entre cátodo e grade e atravessam um potencial retardador $V_r$ até o ânodo. Enquanto $eV < E_{\\text{exc}}$ as colisões são **elásticas** e a corrente cresce. Quando $eV \\approx E_{\\text{exc}}$, ocorrem colisões **inelásticas**: o elétron transfere exatamente $E_{\\text{exc}}$ ao átomo e perde energia para vencer $V_r$, causando uma queda em $I(V)$.

O processo se repete a cada incremento $E_{\\text{exc}}$, produzindo picos em:

$$V_n = n \\cdot \\frac{E_{\\text{exc}}}{e} + V_r$$

O átomo excitado decai emitindo um fóton:

$$\\lambda = \\frac{hc}{E_{\\text{exc}}}$$

Para Hg: $E_{\\text{exc}} = 4{,}9\\,\\text{eV}$ $\\Rightarrow$ $\\lambda = 253{,}7\\,\\text{nm}$ (UV).

#### Observações

- Hg: $E_{\\text{exc}} = 4{,}9\\,\\text{eV}$ ($^3P_1 \\leftarrow {}^1S_0$).
- A largura dos picos aumenta com a temperatura.
- $V_r$ maximiza o contraste dos picos.
- Confirmação direta dos postulados de Bohr.`;

export const FranckHertzTheoryTab = () => <MarkdownMath source={SOURCE} />;
