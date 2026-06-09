import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `Ciclo reversível composto por duas isotermas e duas adiabáticas, operando entre os reservatórios $T_h > T_c$.

#### Fórmulas

$$Q_h = nR\\,T_h \\ln\\!\\left(\\frac{V_2}{V_1}\\right)$$

$$Q_c = nR\\,T_c \\ln\\!\\left(\\frac{V_3}{V_4}\\right)$$

**Adiabáticas:** $T V^{\\gamma-1} = \\text{const}$ $\\Rightarrow$ $\\dfrac{V_3}{V_2} = \\dfrac{V_4}{V_1} = \\left(\\dfrac{T_h}{T_c}\\right)^{\\!1/(\\gamma-1)}$

$$\\eta_{\\text{Carnot}} = 1 - \\frac{T_c}{T_h} = \\frac{W}{Q_h}$$

$$\\eta_{\\text{Otto}} = 1 - r^{1-\\gamma}, \\qquad r = \\frac{V_{\\max}}{V_{\\min}}$$

#### Observações

- Carnot é o limite superior de eficiência entre $T_h$ e $T_c$ (2ª lei).
- Otto sempre tem $\\eta$ inferior a Carnot para os mesmos extremos.
- Variar $T_c \\to 0$ aproxima $\\eta \\to 100\\%$, mas é inatingível (3ª lei).`;

export const CarnotTheoryTab = () => <MarkdownMath source={SOURCE} />;
