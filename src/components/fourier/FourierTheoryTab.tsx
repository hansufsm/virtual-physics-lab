import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### Lei de Fourier da condução

Em regime permanente, a taxa de calor $q$ é constante ao longo de uma parede plana 1D.

$$q = -k A \\frac{dT}{dx} \\quad (\\text{lei de Fourier})$$

$$R_i = \\frac{L_i}{k_i A} \\quad (\\text{resistência térmica})$$

$$\\text{Camadas em série:} \\quad R_{\\text{total}} = \\sum_i R_i, \\qquad q = \\frac{\\Delta T}{R_{\\text{total}}}$$

$T(x)$ é linear em cada camada; quedas $\\Delta T_i = q \\cdot R_i$.

Materiais com $k$ baixo (isolantes) concentram a queda de temperatura — útil em paredes e janelas duplas.`;

export const FourierTheoryTab = () => <MarkdownMath source={SOURCE} />;
