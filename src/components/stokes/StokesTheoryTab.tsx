import { M, MB } from "@/components/shared/Math";

export const StokesTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Lei de Stokes</h3>
    <p className="text-muted-foreground">
      Para uma esfera de raio <M>{String.raw`r`}</M> em movimento lento (<M>{String.raw`\mathrm{Re} \ll 1`}</M>) num fluido de viscosidade <M>{String.raw`\eta`}</M>, a força de arrasto é:
    </p>
    <MB>{String.raw`F_d = 6\pi\,\eta\, r\, v`}</MB>
    <p className="text-muted-foreground">Equilíbrio de forças (peso = empuxo + arrasto):</p>
    <MB>{String.raw`m_s\, g = m_f\, g + F_d`}</MB>
    <p className="text-muted-foreground">Velocidade terminal:</p>
    <MB>{String.raw`v_t = \frac{2(\rho_s - \rho_f)\, g\, r^2}{9\eta}`}</MB>
    <p className="text-muted-foreground">Aproximação ao regime estacionário com tempo característico <M>{String.raw`\tau = m/(6\pi\eta r)`}</M>:</p>
    <MB>{String.raw`v(t) = v_t\left(1 - e^{-t/\tau}\right)`}</MB>
    <p className="text-muted-foreground">Condição de validade (número de Reynolds):</p>
    <MB>{String.raw`\mathrm{Re} = \frac{2\rho_f\, v\, r}{\eta} < 1`}</MB>
    <p className="text-sm text-muted-foreground mt-3">
      É a base do viscosímetro de queda de esfera e do princípio do experimento da gota de óleo de Millikan.
    </p>
  </article>
);