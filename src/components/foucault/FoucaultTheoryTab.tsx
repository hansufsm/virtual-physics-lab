import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### Pêndulo de Foucault

Em 1851, Léon Foucault pendurou um fio de 67 m no Panthéon de Paris para demonstrar visualmente a rotação da Terra. No referencial não-inercial da Terra, surge a **força de Coriolis**, que faz o plano de oscilação do pêndulo girar lentamente.

#### Taxa de precessão

$$\\Omega(\\varphi) = \\Omega_\\oplus \\sin\\varphi$$

$$\\Omega_\\oplus = \\frac{2\\pi}{T_{\\text{sideral}}} \\approx 7{,}292 \\times 10^{-5}\\text{ rad/s}$$

$$T_{\\text{precessão}} = \\frac{2\\pi}{\\Omega(\\varphi)} = \\frac{23\\text{h}56'}{\\sin\\varphi}$$

- **Polo** ($\\varphi = 90^\\circ$): rotação completa em $\\approx 23{,}93$ h.
- **Paris** ($\\varphi = 48{,}85^\\circ$): $\\approx 31{,}8$ h ($\\approx 11{,}3^\\circ$/h).
- **Equador** ($\\varphi = 0^\\circ$): sem precessão.

#### Período do pêndulo

$$T = 2\\pi\\sqrt{\\frac{L}{g}}$$

O efeito é puramente cinemático: o pêndulo conserva seu plano no referencial inercial; quem gira sob ele é a Terra. É uma das demonstrações mais elegantes da rotação terrestre, ainda exibida em diversos museus.`;

export const FoucaultTheoryTab = () => <MarkdownMath source={SOURCE} />;
