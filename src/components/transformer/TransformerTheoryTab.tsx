import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Transformador

$a = N_1/N_2$

**Ideal:** $V_2/V_1 = N_2/N_1$, $I_2/I_1 = N_1/N_2$, $V_1 I_1 = V_2 I_2$.

**Carga refletida:** $R_{1,\\text{eq}} = a^2 R_L$.

**Acoplamento:** $M = k\\sqrt{L_1 L_2}$, $0\\le k\\le 1$.

**Rendimento:** $\\eta = P_{\\text{saída}}/P_{\\text{entrada}}$.

- **Abaixador:** $a>1$, $V_2 < V_1$.
- **Elevador:** $a<1$, $V_2 > V_1$ (transmissão em alta tensão).
- **Isolador:** $a=1$, separação galvânica.`;

export const TransformerTheoryTab = () => <MarkdownMath source={SOURCE} />;
