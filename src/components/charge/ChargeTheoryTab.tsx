import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `Uma partícula de carga $q$ em campos elétrico $\\vec{E}$ e magnético $\\vec{B}$ sofre a força de Lorentz:

$$\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})$$

#### Apenas campo $E$

A trajetória é parabólica (análoga ao lançamento oblíquo): aceleração constante na direção de $\\vec{E}$.

#### Apenas campo $B$

Movimento circular uniforme. O raio de Larmor e a frequência ciclotrônica são:

$$r = \\frac{mv}{|q|B}, \\qquad f_c = \\frac{|q|B}{2\\pi m}$$

#### Seletor de velocidades

Com $\\vec{E} \\perp \\vec{B}$, partículas com $v = E/B$ atravessam sem deflexão; as demais são desviadas.

#### Cíclotron

Em cada travessia do gap entre os "Dees" a partícula ganha energia $qV_a$; o raio cresce em espiral até atingir a velocidade máxima.

#### Roteiro sugerido

- No modo $B$ puro, varie $v_0$ e verifique $r \\propto v$.
- Compare $f_c$ ao mudar a massa: independente de $v$, mas inversamente proporcional a $m$.
- No seletor, ajuste $E$ e $B$ até $v = E/B$ coincidir com $v_0$.
- No cíclotron, observe espirais com $V_a$ maior produzindo maior aceleração por volta.`;

export const ChargeTheoryTab = () => <MarkdownMath source={SOURCE} />;
