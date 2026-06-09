import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Efeito Hall Quântico (von Klitzing, 1980)

Níveis de Landau, degenerescência $n_L = eB/h$ por área.

$$\\nu = \\frac{n_s h}{e B}$$

Para $\\nu$ inteiro:

$$R_{xy} = \\frac{h}{\\nu e^2} = \\frac{R_K}{\\nu}, \\quad R_{xx} = 0$$

$$R_K = h/e^2 \\approx 25812{,}807\\,\\Omega$$

Precisão $> 1$ em $10^9$ — padrão metrológico do ohm. Invariante topológico (número de Chern). Efeito fracionário (Tsui/Störmer/Laughlin): quasipartículas de carga $e/3$.`;

export const QHallTheoryTab = () => <MarkdownMath source={SOURCE} />;
