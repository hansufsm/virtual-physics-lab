import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `Um corpo negro absorve toda radiação incidente e re-emite com espectro dependente apenas de sua temperatura. A explicação clássica (Rayleigh–Jeans) previa intensidade infinita para $\\lambda$ pequeno — a **catástrofe do ultravioleta**.

#### Lei de Planck (1900)

$$B(\\lambda, T) = \\frac{2hc^2}{\\lambda^5} \\cdot \\frac{1}{\\exp\\!\\left(\\dfrac{hc}{\\lambda k T}\\right) - 1}$$

A hipótese de Planck — energia trocada em pacotes $E = hf$ — iniciou a mecânica quântica.

#### Limites

- **Rayleigh–Jeans** ($\\lambda$ grande): $B \\approx \\dfrac{2ckT}{\\lambda^4}$ (clássico, diverge para UV)
- **Wien** ($\\lambda$ pequeno): $B \\approx \\dfrac{2hc^2}{\\lambda^5}\\exp\\!\\left(-\\dfrac{hc}{\\lambda kT}\\right)$

#### Leis derivadas

**Deslocamento de Wien:**

$$\\lambda_{\\max} \\cdot T = 2{,}898 \\times 10^{-3}\\,\\text{m}\\cdot\\text{K}$$

**Stefan-Boltzmann:**

$$M = \\sigma T^4, \\qquad \\sigma = 5{,}670 \\times 10^{-8}\\,\\text{W/m}^2\\text{K}^4$$

Aplicações: temperatura estelar (Sol $\\approx 5778\\,\\text{K}$ $\\Rightarrow$ $\\lambda_{\\max} \\approx 502\\,\\text{nm}$, verde), CMB ($2{,}725\\,\\text{K}$), pirometria, eficiência de filamentos e LEDs, e a interpretação do espectro térmico de objetos a $300\\,\\text{K}$ (infravermelho).`;

export const BlackbodyTheoryTab = () => <MarkdownMath source={SOURCE} />;
