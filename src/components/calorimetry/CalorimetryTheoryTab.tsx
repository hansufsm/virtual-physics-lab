import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `Em um sistema termicamente isolado, a soma das trocas de calor é nula. Misturando corpos a temperaturas diferentes — e eventualmente com mudanças de fase — usamos esse balanço para determinar a temperatura de equilíbrio.

#### Calor sensível

$$Q = m \\cdot c \\cdot \\Delta T$$

$c_{\\text{água}} \\approx 4186\\,\\text{J/(kg·K)}$, $\\quad c_{\\text{gelo}} \\approx 2090\\,\\text{J/(kg·K)}$.

#### Calor latente de fusão

$$Q_{\\text{fusão}} = m \\cdot L_f, \\qquad L_f(\\text{água}) = 334\\,\\text{kJ/kg}$$

Durante a mudança de fase a temperatura permanece constante ($0\\,°\\text{C}$ para a água).

#### Equação de equilíbrio (sem mudança de fase)

$$(m_a c_{\\text{água}} + C_{\\text{cal}})(T_{\\text{eq}} - T_a) + m_s c_s (T_{\\text{eq}} - T_s) = 0$$

Isolando $T_{\\text{eq}}$: média ponderada pelas capacidades térmicas.

#### Algoritmo com gelo

1. Calcule a energia disponível baixando o sistema (água + sólido) até $0\\,°\\text{C}$: $Q_0$.
2. Se $Q_0 < m_{\\text{gelo}} \\cdot L_f$ $\\Rightarrow$ $T_{\\text{eq}} = 0\\,°\\text{C}$ e apenas $m = Q_0/L_f$ de gelo derrete.
3. Caso contrário, todo o gelo derrete e a água adicional entra no balanço final.

#### Capacidade térmica do calorímetro

$$C_{\\text{cal}} = \\text{equivalente em massa de água do recipiente}$$

Calorímetros reais nunca são perfeitos: parte do calor aquece o vaso. Ajuste $C_{\\text{cal}}$ para corrigir.

#### Roteiro sugerido

1. Preset "Cobre quente em água": calcule $T_{\\text{eq}}$ à mão e compare.
2. Aumente a massa do sólido em $T_f(m_s)$ — perto da assíntota.
3. Ative gelo gradualmente e observe a transição entre os cenários "parcial" e "total".
4. Aumente $C_{\\text{cal}}$ para $200\\,\\text{J/K}$ e observe a queda em $T_{\\text{eq}}$ (calorímetro absorve calor).
5. Confirme que $\\sum Q \\approx 0$ em todas as configurações.`;

export const CalorimetryTheoryTab = () => <MarkdownMath source={SOURCE} />;
