export const HallTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground space-y-3">
    <h3 className="font-display text-lg font-semibold">Efeito Hall</h3>
    <p className="text-sm text-muted-foreground">
      Em um condutor que conduz corrente <strong>I</strong> imerso em um campo magnético <strong>B</strong>
      perpendicular, os portadores sofrem força de Lorentz e se acumulam em uma das faces, criando um campo
      transversal <strong>E_H</strong> e uma diferença de potencial <strong>V_H</strong> medida entre as faces
      opostas.
    </p>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`V_H = R_H · I · B / t        R_H = 1 / (n q)`}</pre>

    <h4 className="font-display font-semibold mt-3">Sinal e tipo de portador</h4>
    <p className="text-sm text-muted-foreground">
      O sinal de <strong>V_H</strong> identifica o tipo de portador majoritário: para semicondutores tipo n
      (elétrons) e tipo p (buracos) com mesma I e B, V_H tem sinais opostos.
    </p>

    <h4 className="font-display font-semibold">Velocidade de deriva</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`v_d = J / (n |q|) = I / (n |q| w t)`}</pre>

    <h4 className="font-display font-semibold">Resistividade e ângulo de Hall</h4>
    <pre className="bg-secondary rounded-md p-3 text-sm font-mono">{`ρ_xx = 1 / (n |q| μ)         ρ_xy = R_H · B
tan θ_H = μ B`}</pre>

    <h4 className="font-display font-semibold mt-3">Roteiro sugerido</h4>
    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
      <li>Compare V_H entre Cu (metal) e Si tipo n: a baixa densidade do semicondutor amplia V_H em ordens de grandeza.</li>
      <li>Inverta o tipo de portador (n ↔ p) e observe a inversão do sinal de V_H.</li>
      <li>Varie B com I fixo: V_H deve ser linear em B, e a inclinação dá R_H/t.</li>
      <li>Conhecido R_H, calcule n = 1/(R_H q) e compare com o valor tabelado.</li>
    </ul>
  </div>
);