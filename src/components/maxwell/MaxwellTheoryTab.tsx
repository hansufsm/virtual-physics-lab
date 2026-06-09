import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Distribuição de Maxwell–Boltzmann

$$f(v) = 4\\pi\\left(\\frac{M}{2\\pi RT}\\right)^{3/2} v^2 \\exp\\!\\left(-\\frac{Mv^2}{2RT}\\right)$$

#### Velocidades características

$$v_{\\text{mp}} = \\sqrt{\\frac{2RT}{M}}, \\quad \\bar v = \\sqrt{\\frac{8RT}{\\pi M}}, \\quad v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}$$

$$v_{\\text{mp}} : \\bar v : v_{\\text{rms}} \\approx 1 : 1{,}128 : 1{,}225$$

Aumentar $T$ desloca o pico para $v$ maiores e alarga a distribuição.`;

export const MaxwellTheoryTab = () => <MarkdownMath source={SOURCE} />;
