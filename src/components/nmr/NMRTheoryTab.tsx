export const NMRTheoryTab = () => (
  <div className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display font-semibold text-lg">Ressonância Magnética Nuclear</h3>
    <p className="text-muted-foreground">
      Núcleos com spin não-nulo (¹H, ¹³C, …) têm momento magnético μ = γħI. Em B₀ ẑ, a magnetização macroscópica
      precessa com frequência de Larmor <strong>ω₀ = γB₀</strong>. Um campo RF B₁ oscilando exatamente em ω₀ inclina
      a magnetização — um pulso de 90° leva M para o plano xy.
    </p>
    <p className="text-muted-foreground">
      As equações de Bloch descrevem a evolução: <strong>Mz(t) = M₀(1 − e^(−t/T₁))</strong> (recuperação spin-rede)
      e <strong>Mxy(t) = M₀ e^(−t/T₂)</strong> (decaimento spin-spin). O sinal induzido na bobina é a FID; sua
      transformada de Fourier dá um pico de largura 1/(πT₂).
    </p>
    <ul className="text-sm text-muted-foreground">
      <li>γ/2π ≈ 42,577 MHz/T para o próton — base da MRI clínica (1,5 T → 63,87 MHz).</li>
      <li>Gradientes espaciais de B₀ codificam a posição (Lauterbur, Mansfield — Nobel 2003).</li>
      <li>T₁ depende da mobilidade molecular; T₂ depende de interações dipolares.</li>
      <li>Deslocamento químico distingue ambientes moleculares (espectroscopia).</li>
    </ul>
  </div>
);