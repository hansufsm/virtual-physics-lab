import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### Oscilador forçado e ressonância

Uma massa presa a uma mola com amortecimento viscoso e força externa harmônica obedece à equação:

$$m\\ddot{x} + b\\dot{x} + kx = F_0 \\cos(\\omega t)$$

#### Solução estacionária

$$x(t) = A(\\omega)\\cos(\\omega t - \\varphi)$$

$$A(\\omega) = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\gamma\\omega)^2}}$$

$$\\varphi(\\omega) = \\arctan\\!\\left(\\frac{2\\gamma\\omega}{\\omega_0^2 - \\omega^2}\\right)$$

$$\\omega_0 = \\sqrt{\\frac{k}{m}}, \\qquad \\gamma = \\frac{b}{2m}$$

#### Pico de amplitude

$$\\omega_r = \\sqrt{\\omega_0^2 - 2\\gamma^2} \\quad (\\text{existe se } \\gamma < \\omega_0/\\sqrt{2})$$

$$Q = \\frac{\\omega_0}{2\\gamma}: \\text{ quanto maior, mais estreita e alta a ressonância.}$$

$$\\text{Largura a meia-potência:} \\quad \\Delta\\omega \\approx 2\\gamma = \\frac{\\omega_0}{Q}$$

#### Roteiro

1. Comece com $b$ pequeno e varra $\\omega$ entre $0$ e $3\\omega_0$: identifique o pico em $\\omega_r$.
2. Aumente $b$: o pico achata e desloca-se levemente para a esquerda.
3. Em $\\omega = \\omega_0$, a defasagem é exatamente $\\pi/2$.
4. Meça a largura entre $A_{\\max}/\\sqrt{2}$ e confirme $\\Delta\\omega \\approx \\omega_0/Q$.`;

export const ForcedTheoryTab = () => <MarkdownMath source={SOURCE} />;
