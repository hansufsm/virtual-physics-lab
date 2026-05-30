export const LaserTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display font-semibold text-lg">Laser e cavidade Fabry–Perot</h3>
    <p className="text-muted-foreground">
      Numa cavidade de comprimento L com espelhos de refletividade R₁ e R₂, a condição de ressonância impõe modos
      longitudinais <strong>ν_m = m·c/2L</strong>, espaçados pelo <strong>FSR = c/2L</strong>. A finesse da cavidade
      é <strong>F = π√R/(1−R)</strong> com R = √(R₁R₂), e cada modo tem largura ≈ FSR/F.
    </p>
    <p className="text-muted-foreground">
      O meio ativo (átomos, íons, semicondutor) fornece ganho por emissão estimulada. Acima do limiar
      (ganho = perdas), os modos longitudinais que caem sob a curva de ganho passam a oscilar. A potência cresce
      linearmente com P − P_th. O comprimento de coerência ≈ c/Δν define até onde os fótons mantêm fase.
    </p>
    <ul className="text-sm text-muted-foreground">
      <li>HeNe: cavidade ~30 cm, FSR ~500 MHz, largura do ganho ~1,5 GHz → poucos modos.</li>
      <li>Diodo laser: cavidade muito curta (µm), FSR enorme, normalmente monomodo.</li>
      <li>Ti:Sa femtosegundo: ganho muito largo → centenas de modos travados em fase.</li>
      <li>Fabry–Perot é também um filtro óptico (analisadores de espectro de alta resolução).</li>
    </ul>
  </div>
);