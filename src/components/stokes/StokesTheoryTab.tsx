import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Lei de Stokes

Esfera de raio $r$ em movimento lento ($\\mathrm{Re}\\ll 1$) em fluido de viscosidade $\\eta$:

$$F_d = 6\\pi\\eta r v$$

#### Equilíbrio

$$m_s g = m_f g + F_d$$

#### Velocidade terminal

$$v_t = \\frac{2(\\rho_s - \\rho_f) g r^2}{9\\eta}$$

#### Aproximação

$\\tau = m/(6\\pi\\eta r)$:

$$v(t) = v_t(1 - e^{-t/\\tau})$$

#### Validade

$$\\mathrm{Re} = \\frac{2\\rho_f v r}{\\eta} < 1$$

Base do viscosímetro de queda de esfera e da gota de Millikan.`;

export const StokesTheoryTab = () => <MarkdownMath source={SOURCE} />;
