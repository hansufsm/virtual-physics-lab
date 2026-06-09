import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `Em uma colisão entre dois corpos sem forças externas relevantes durante o impacto, o momento linear total é sempre conservado. A energia cinética só se conserva em colisões perfeitamente elásticas ($e = 1$); para $0 \\le e < 1$ parte da energia é convertida em calor, som ou deformação.

#### Leis de conservação

**Momento linear:**
$$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$$

**Coeficiente de restituição:**
$$e = -\\frac{v_1 - v_2}{u_1 - u_2}$$

**Velocidade do centro de massa:**
$$v_{\\text{cm}} = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}$$

#### Velocidades pós-colisão

$$v_1 = \\frac{(m_1 - e\\,m_2)\\,u_1 + (1 + e)\\,m_2\\,u_2}{m_1 + m_2}$$

$$v_2 = \\frac{(m_2 - e\\,m_1)\\,u_2 + (1 + e)\\,m_1\\,u_1}{m_1 + m_2}$$

#### Energia dissipada

Definindo a massa reduzida $\\mu = \\dfrac{m_1 m_2}{m_1 + m_2}$ e a velocidade relativa $u_{\\text{rel}} = u_1 - u_2$, a energia perdida em calor/deformação é:

$$\\Delta K = K_{\\text{antes}} - K_{\\text{depois}} = \\tfrac{1}{2}\\,\\mu\\,(1 - e^2)\\,u_{\\text{rel}}^2$$

- **Elástica ($e = 1$):** $\\Delta K = 0$; $K$ e $p$ conservados.
- **Parcialmente inelástica ($0 < e < 1$):** $p$ conservado, $K$ diminui.
- **Perfeitamente inelástica ($e = 0$):** corpos seguem juntos com $v = v_{\\text{cm}}$; perda máxima de $K$.

#### Impulso e teorema do impulso

$$J_1 = \\int F\\,dt = \\Delta p_1 = m_1(v_1 - u_1) = -J_2$$

#### Roteiro sugerido

1. Configure $m_1 = m_2$ e colisão elástica ($e = 1$): as velocidades se trocam.
2. Mantenha $e = 1$ mas faça $m_2 \\gg m_1$: o corpo leve "ricocheteia" e o pesado quase não muda.
3. Use $e = 0$ (perfeitamente inelástica): confirme que $v_1 = v_2 = v_{\\text{cm}}$ após o impacto.
4. Varie $e$ na aba "vs. e" e observe como $\\Delta K$ cresce de $0$ (em $e = 1$) até o máximo (em $e = 0$).
5. Verifique numericamente que $\\Delta p \\approx 0$ em todas as configurações (aba "Medições").
6. Compare o impulso em $m_1$ e $m_2$: $J_1 = -J_2$ pela 3ª lei de Newton.`;

export const CollisionTheoryTab = () => <MarkdownMath source={SOURCE} />;
