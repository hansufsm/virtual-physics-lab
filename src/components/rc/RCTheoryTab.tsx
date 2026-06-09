import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Circuito RC

$$\\tau = R C$$

**Carga:** $V_C(t) = \\mathcal{E}(1 - e^{-t/\\tau})$

**Descarga:** $V_C(t) = V_0 e^{-t/\\tau}$

**Corrente:** $i(t) = (V_\\infty - V_0)/R \\cdot e^{-t/\\tau}$

**Energia:** $U = \\tfrac{1}{2} C V_C^2$

Em $t=\\tau$: $V_C \\approx 63{,}2\\%$ (carga) ou $36{,}8\\%$ (descarga). Em $5\\tau$: $>99\\%$ do regime.`;

export const RCTheoryTab = () => <MarkdownMath source={SOURCE} />;
