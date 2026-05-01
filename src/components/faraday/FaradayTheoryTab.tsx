export const FaradayTheoryTab = () => (
  <article className="prose prose-sm max-w-none text-foreground">
    <h3 className="font-display text-xl font-semibold">Indução eletromagnética — lei de Faraday</h3>
    <p className="text-muted-foreground">
      A lei de Faraday afirma que toda variação temporal do fluxo magnético através de um circuito induz uma f.e.m.
      proporcional à taxa de variação. A lei de Lenz fornece o sinal: a corrente induzida se opõe à variação do fluxo.
    </p>

    <h4 className="font-display font-semibold mt-6">Equações principais</h4>
    <ul className="space-y-2 font-mono text-sm">
      <li><span className="text-primary font-semibold">ε =</span> −dΦ/dt</li>
      <li><span className="text-primary font-semibold">Φ =</span> ∫ B · dA &nbsp; (Wb)</li>
      <li><span className="text-primary font-semibold">Bobina N espiras:</span> ε = −N · dΦ₁/dt</li>
      <li><span className="text-primary font-semibold">i =</span> ε / R</li>
      <li><span className="text-primary font-semibold">P =</span> i² · R = ε² / R</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Cenários</h4>
    <ul className="list-disc pl-5 space-y-1 text-sm">
      <li><strong>Espira em campo uniforme:</strong> enquanto a espira está totalmente dentro ou fora da região,
        o fluxo é constante e ε = 0. A f.e.m. só aparece nas bordas, com módulo |ε| = N·B·h·v.</li>
      <li><strong>Ímã + bobina:</strong> usamos a aproximação dipolar Φ ≈ N·µ₀/2 · m·R²/(R²+z²)^(3/2). A f.e.m.
        é máxima quando o ímã passa pelas bordas da bobina e zero exatamente no centro (Φ é máximo, dΦ/dt = 0).</li>
      <li><strong>Lei de Lenz:</strong> ao se aproximar um polo norte, a corrente induzida cria um polo norte
        no lado da bobina voltado ao ímã, repelindo-o.</li>
    </ul>

    <h4 className="font-display font-semibold mt-6">Roteiro sugerido</h4>
    <ol className="list-decimal pl-5 space-y-1 text-sm">
      <li>No modo <em>Espira em B</em>, fixe v = 10 cm/s, B = 0,5 T, h = 10 cm e verifique |ε| = N·B·h·v nas bordas.</li>
      <li>Mude a velocidade pela metade e confirme que ε também cai pela metade.</li>
      <li>No modo <em>Ímã + bobina</em>, observe que ε(t) tem dois lóbulos com sinais opostos.</li>
      <li>Compare a área sob cada lóbulo: ∫ε dt = ΔΦ — deve fechar em zero ao longo de toda a passagem.</li>
      <li>Aumente N e veja a f.e.m. crescer linearmente; aumente R e veja a corrente cair.</li>
    </ol>

    <p className="text-xs text-muted-foreground mt-6">
      Aproximação: a frenagem do ímã pela corrente induzida (back-EMF mecânica) é desprezada para clareza didática.
    </p>
  </article>
);