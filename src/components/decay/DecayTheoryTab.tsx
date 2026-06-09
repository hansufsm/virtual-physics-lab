import { MarkdownMath } from "@/components/shared/MarkdownMath";

const SOURCE = `#### Decaimento radioativo

Um núcleo instável decai com uma probabilidade por unidade de tempo $\\lambda$, independente de sua história. Para um grande número $N$ de núcleos idênticos, vale a equação diferencial $dN/dt = -\\lambda N$, cuja solução é a lei exponencial.

#### Lei do decaimento

$$N(t) = N_0\\, e^{-\\lambda t}$$

$$A(t) = \\lambda\\, N(t), \\qquad T_{1/2} = \\frac{\\ln 2}{\\lambda}, \\qquad \\tau = \\frac{1}{\\lambda}$$

- $\\lambda$ — constante de decaimento (s$^{-1}$), característica do isótopo.
- $T_{1/2}$ — meia-vida: tempo para metade dos núcleos decaírem.
- $\\tau$ — vida média: tempo característico $\\langle t \\rangle = 1/\\lambda \\approx 1{,}443 \\cdot T_{1/2}$.
- $A$ — atividade (Bq = desintegrações/s).

#### Modelo estocástico

A simulação trata cada núcleo individualmente: a cada passo $\\Delta t$, cada núcleo sobrevivente decai com probabilidade $p = 1 - e^{-\\lambda \\Delta t}$. Para $N$ grande, a média $\\langle N(t) \\rangle$ converge para a curva exponencial; flutuações são da ordem de $\\sqrt{N}$ (estatística de Poisson).

#### Aplicações

- Datação por C-14 ($T_{1/2} = 5730$ anos) em arqueologia.
- Medicina nuclear: Tc-99m ($T_{1/2} = 6$ h) para diagnóstico, I-131 para tireoide.
- Datação geológica com U-238 $\\rightarrow$ Pb-206.
- Detectores de fumaça (Am-241), gerador termoelétrico (Pu-238).

#### Roteiro sugerido

1. Selecione I-131, $N_0 = 1000$, $t = T_{1/2}$: confirme $N(t) \\approx 500$ e atividade $\\approx A_0/2$.
2. Mude para Tc-99m e observe como a janela temporal muda (horas vs. dias).
3. Varie $t$ entre $0$ e $5 T_{1/2}$ e tabule $N(t)$; no gráfico $\\ln N \\times t$, ache $\\lambda$ pelo coeficiente angular.
4. Compare a curva analítica com a simulação estocástica para $N_0$ pequeno ($\\sim 100$) e grande ($\\sim 10^6$).
5. Para C-14, calcule a idade de uma amostra com fração restante $= 0{,}25$.`;

export const DecayTheoryTab = () => <MarkdownMath source={SOURCE} />;
