import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### Difração de elétrons (Davisson–Germer, 1927)

A hipótese de de Broglie associa a toda partícula um comprimento de onda $\\lambda = h/p$. Para elétrons acelerados por uma diferença de potencial $V$, tem-se $K = eV \\Rightarrow p = \\sqrt{2m_e eV}$ e portanto:

$$\\lambda\\,(\\text{nm}) \\approx \\frac{1{,}226}{\\sqrt{V\\,(\\text{V})}}$$

Quando o feixe incide normal a uma superfície cristalina com espaçamento atômico $d$, os elétrons espalhados sofrem interferência construtiva nos ângulos $\\varphi$ que satisfazem:

$$d \\cdot \\sin\\varphi = n\\lambda$$

Davisson e Germer observaram um pico claro em $\\varphi \\approx 50^\\circ$ para $V = 54\\text{ V}$ em Ni(111), em ótimo acordo com a previsão de de Broglie.

- Ondulatório: padrão senoidal sucessivo em ordens $n = 1, 2, \\ldots$
- Existe ordem máxima $n_{\\max} = \\lfloor d/\\lambda \\rfloor$: para $\\lambda > d$ só há $n = 0$.
- Aumentar $V$ reduz $\\lambda$ — picos vão para ângulos menores (mais frontais).
- Validou a mecânica ondulatória aplicada à matéria, fundamento da microscopia eletrônica.`;

export const DavissonTheoryTab = () => <MarkdownMath source={SOURCE} />;
