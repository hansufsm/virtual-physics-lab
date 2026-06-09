import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### Indução eletromagnética — lei de Faraday

A lei de Faraday afirma que toda variação temporal do fluxo magnético através de um circuito induz uma f.e.m. proporcional à taxa de variação. A lei de Lenz fornece o sinal: a corrente induzida se opõe à variação do fluxo.

#### Equações principais

$$\\varepsilon = -\\frac{d\\Phi}{dt}$$

$$\\Phi = \\int \\vec{B} \\cdot d\\vec{A} \\quad (\\text{Wb})$$

$$\\text{Bobina com } N \\text{ espiras:} \\quad \\varepsilon = -N\\frac{d\\Phi_1}{dt}$$

$$i = \\frac{\\varepsilon}{R}, \\qquad P = i^2 R = \\frac{\\varepsilon^2}{R}$$

#### Cenários

- **Espira em campo uniforme:** enquanto a espira está totalmente dentro ou fora da região, o fluxo é constante e $\\varepsilon = 0$. A f.e.m. só aparece nas bordas, com módulo $|\\varepsilon| = N B h v$.
- **Ímã + bobina:** usa-se a aproximação dipolar $\\Phi \\approx \\frac{N\\mu_0}{2}\\frac{m R^2}{(R^2+z^2)^{3/2}}$. A f.e.m. é máxima quando o ímã passa pelas bordas da bobina e zero exatamente no centro ($\\Phi$ é máximo, $d\\Phi/dt = 0$).
- **Lei de Lenz:** ao se aproximar um polo norte, a corrente induzida cria um polo norte no lado da bobina voltado ao ímã, repelindo-o.

#### Roteiro sugerido

1. No modo *Espira em B*, fixe $v = 10\\text{ cm/s}$, $B = 0{,}5\\text{ T}$, $h = 10\\text{ cm}$ e verifique $|\\varepsilon| = NBhv$ nas bordas.
2. Mude a velocidade pela metade e confirme que $\\varepsilon$ também cai pela metade.
3. No modo *Ímã + bobina*, observe que $\\varepsilon(t)$ tem dois lóbulos com sinais opostos.
4. Compare a área sob cada lóbulo: $\\int \\varepsilon\\, dt = \\Delta\\Phi$ — deve fechar em zero ao longo de toda a passagem.
5. Aumente $N$ e veja a f.e.m. crescer linearmente; aumente $R$ e veja a corrente cair.

> Aproximação: a frenagem do ímã pela corrente induzida (back-EMF mecânica) é desprezada para clareza didática.`;

export const FaradayTheoryTab = () => <MarkdownMath source={SOURCE} />;
