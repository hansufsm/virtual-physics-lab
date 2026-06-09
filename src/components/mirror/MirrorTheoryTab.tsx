import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Espelhos esféricos

$f = R/2$. Côncavo: $f>0$. Convexo: $f<0$.

$$\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{p'}, \\qquad A = -\\frac{p'}{p}$$

#### Sinais

- $p'>0$: imagem real (frente). $p'<0$: virtual (atrás).
- $A<0$: invertida; $A>0$: direita.

#### Côncavo

- $p>2f$: real, invertida, reduzida.
- $p=2f$: real, invertida, mesmo tamanho.
- $f<p<2f$: real, invertida, ampliada.
- $p=f$: imagem no infinito.
- $p<f$: virtual, direita, ampliada.

#### Convexo

Sempre virtual, direita, menor — amplo campo visual.`;

export const MirrorTheoryTab = () => <MarkdownMath source={SOURCE} />;
