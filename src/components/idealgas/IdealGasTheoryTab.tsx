import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Gás ideal

$$PV = nRT, \\quad R = 8{,}314\\,\\text{J/(mol·K)}$$

$\\Delta U = nC_V \\Delta T$; $C_P - C_V = R$; $\\gamma = C_P/C_V$.

#### Processos quase-estáticos

**Isotérmico:** $P_1V_1 = P_2V_2$, $W = nRT\\ln(V_2/V_1)$, $Q = W$, $\\Delta U=0$.

**Isobárico:** $V_1/T_1 = V_2/T_2$, $W = P\\Delta V$, $Q = nC_P\\Delta T$.

**Isocórico:** $P_1/T_1 = P_2/T_2$, $W=0$, $Q = \\Delta U = nC_V\\Delta T$.

**Adiabático:** $PV^\\gamma=\\text{const}$, $TV^{\\gamma-1}=\\text{const}$, $W = (P_1V_1-P_2V_2)/(\\gamma-1)$.

#### Primeira lei e entropia

$$\\Delta U = Q - W$$

$C_V^{\\text{mono}} = 3R/2$, $C_V^{\\text{diat}} = 5R/2$.

$$\\Delta S_{\\text{isot}} = nR\\ln(V_2/V_1), \\quad \\Delta S_{\\text{isob}} = nC_P\\ln(T_2/T_1)$$`;

export const IdealGasTheoryTab = () => <MarkdownMath source={SOURCE} />;
