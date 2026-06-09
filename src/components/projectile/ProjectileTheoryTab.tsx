import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `### Movimento de projéteis

#### Equações no vácuo

$$v_{0x} = v_0\\cos\\theta, \\quad v_{0y} = v_0\\sin\\theta$$

$$x(t) = v_{0x} t, \\quad y(t) = h_0 + v_{0y} t - \\tfrac{1}{2} g t^2$$

**Tempo de voo** ($h_0=0$): $T = 2 v_0 \\sin\\theta / g$.

**Alcance** ($h_0=0$): $R = v_0^2 \\sin 2\\theta / g$ — máximo em $\\theta = 45°$.

**Altura máxima:** $H = h_0 + (v_0\\sin\\theta)^2/(2g)$.

**Trajetória:** $y(x) = h_0 + \\tan\\theta\\,x - g x^2/(2 v_0^2 \\cos^2\\theta)$.

#### Com arrasto

Linear: $F = -bv$. Quadrático: $F = -c|v|v$. Ângulo ótimo cai abaixo de 45°, trajetória assimétrica.`;

export const ProjectileTheoryTab = () => <MarkdownMath source={SOURCE} />;
