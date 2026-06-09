import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Ressonância Magnética Nuclear

Frequência de Larmor:

$$\\omega_0 = \\gamma B_0$$

Pulso RF de 90° leva $M$ para o plano $xy$.

#### Equações de Bloch

$$M_z(t) = M_0(1 - e^{-t/T_1})$$

$$M_{xy}(t) = M_0 e^{-t/T_2}$$

FID e seu espectro: pico de largura $1/(\\pi T_2)$.

- $\\gamma/2\\pi \\approx 42{,}577\\,\\text{MHz/T}$ (próton). MRI a 1,5 T $\\to$ 63,87 MHz.
- Gradientes codificam posição (Lauterbur/Mansfield, Nobel 2003).
- Deslocamento químico distingue ambientes moleculares.`;

export const NMRTheoryTab = () => <MarkdownMath source={SOURCE} />;
