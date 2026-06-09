import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Lentes finas

#### Equações fundamentais

$$\\frac{1}{f} = \\frac{1}{d_0} + \\frac{1}{d_i}, \\qquad m = -\\frac{d_i}{d_0} = \\frac{h_i}{h_0}$$

**Fabricantes:** $\\frac{1}{f} = (n_l/n_m - 1)(1/R_1 - 1/R_2)$

**Newton:** $(d_0 - f)(d_i - f) = f^2$

**Potência:** $P = 1/f$ (dioptrias).

#### Sinais

- $f>0$ convergente; $f<0$ divergente.
- $d_i>0$ real; $d_i<0$ virtual.
- $m<0$ invertida; $|m|>1$ ampliada.

#### Casos (convergente)

- $d_0 > 2f$: real, invertida, reduzida.
- $d_0 = 2f$: real, invertida, mesmo tamanho.
- $f < d_0 < 2f$: real, invertida, ampliada.
- $d_0 = f$: imagem no infinito.
- $d_0 < f$: virtual, ereta, ampliada (lupa).`;

export const LensTheoryTab = () => <MarkdownMath source={SOURCE} />;
