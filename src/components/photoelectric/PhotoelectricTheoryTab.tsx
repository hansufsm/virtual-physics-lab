import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Efeito fotoelétrico

Einstein (1905): luz como fótons de energia $E = hf$.

$$h f = \\phi + K_{\\max}$$

#### Limiar e tensão de frenagem

- $f_0 = \\phi/h$.
- $V_s = K_{\\max}/e = (hf - \\phi)/e$.
- $V_s \\times f$: reta de inclinação $h/e$ e intercepto $-\\phi/e$.

Intensidade altera apenas a corrente; só $f$ altera $K_{\\max}$.

#### Constantes

$h = 6{,}626\\times10^{-34}\\,\\text{J·s}$, $e = 1{,}602\\times10^{-19}\\,\\text{C}$, $c = 2{,}998\\times10^{8}\\,\\text{m/s}$.

$$E[\\text{eV}] = \\frac{1240}{\\lambda[\\text{nm}]}$$`;

export const PhotoelectricTheoryTab = () => <MarkdownMath source={SOURCE} />;
