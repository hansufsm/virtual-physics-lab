// Constantes e utilidades para o experimento de capacitor de placas paralelas
export const EPSILON_0 = 8.854e-12; // F/m

// ============================================================================
// EXP-24 · Decaimento radioativo
// ============================================================================
export const AVOGADRO = 6.02214076e23;

export interface RadioIsotope {
  name: string;       // ex.: "I-131"
  label: string;      // ex.: "Iodo-131"
  halfLifeS: number;  // meia-vida em segundos
  decay: "β−" | "β+" | "α" | "γ" | "CE";
  daughter: string;
}

// Meia-vidas em segundos
const day = 86400, year = 365.25 * day;
export const RADIO_ISOTOPES: RadioIsotope[] = [
  { name: "Tc-99m", label: "Tecnécio-99m",  halfLifeS: 6.0 * 3600,       decay: "γ",  daughter: "Tc-99" },
  { name: "I-131",  label: "Iodo-131",      halfLifeS: 8.02 * day,        decay: "β−", daughter: "Xe-131" },
  { name: "P-32",   label: "Fósforo-32",    halfLifeS: 14.28 * day,       decay: "β−", daughter: "S-32" },
  { name: "Co-60",  label: "Cobalto-60",    halfLifeS: 5.27 * year,       decay: "β−", daughter: "Ni-60" },
  { name: "Sr-90",  label: "Estrôncio-90",  halfLifeS: 28.79 * year,      decay: "β−", daughter: "Y-90"  },
  { name: "Cs-137", label: "Césio-137",     halfLifeS: 30.17 * year,      decay: "β−", daughter: "Ba-137m" },
  { name: "Ra-226", label: "Rádio-226",     halfLifeS: 1600 * year,       decay: "α",  daughter: "Rn-222" },
  { name: "C-14",   label: "Carbono-14",    halfLifeS: 5730 * year,       decay: "β−", daughter: "N-14"  },
  { name: "U-238",  label: "Urânio-238",    halfLifeS: 4.468e9 * year,    decay: "α",  daughter: "Th-234" },
];

export interface DecayParams {
  isotopeName: string;
  halfLifeS: number;       // editável (sobrescreve o do isótopo)
  N0: number;              // número inicial de núcleos
  timeS: number;           // instante de observação t
  tMaxMultiplier: number;  // janela em múltiplos de T½ para as curvas
}

export interface DecayResults {
  lambda: number;          // constante de decaimento (1/s)
  meanLifeS: number;       // τ = 1/λ
  N: number;               // núcleos restantes em t
  decayed: number;         // N0 − N
  activity: number;        // A(t) = λN (Bq)
  activity0: number;       // A(0) = λN0
  fractionRemaining: number; // N/N0
  halfLivesElapsed: number;  // t/T½
  curveN: { t: number; N: number; A: number }[]; // curvas N(t) e A(t)
}

export function computeRadioactiveDecay(p: DecayParams): DecayResults {
  const T = Math.max(1e-9, p.halfLifeS);
  const lambda = Math.LN2 / T;
  const meanLife = 1 / lambda;
  const N0 = Math.max(0, p.N0);
  const t = Math.max(0, p.timeS);
  const N = N0 * Math.exp(-lambda * t);
  const A = lambda * N;
  const A0 = lambda * N0;

  const tMax = T * Math.max(1, p.tMaxMultiplier);
  const M = 120;
  const curveN: { t: number; N: number; A: number }[] = [];
  for (let i = 0; i <= M; i++) {
    const tt = (i / M) * tMax;
    const Nt = N0 * Math.exp(-lambda * tt);
    curveN.push({ t: tt, N: Nt, A: lambda * Nt });
  }

  return {
    lambda, meanLifeS: meanLife,
    N, decayed: N0 - N, activity: A, activity0: A0,
    fractionRemaining: N0 > 0 ? N / N0 : 0,
    halfLivesElapsed: t / T,
    curveN,
  };
}

/** Converte um intervalo em segundos numa string legível (ns..anos). */
export function formatDuration(s: number): string {
  if (!isFinite(s) || s <= 0) return "0 s";
  const units: [number, string][] = [
    [365.25 * 86400, "anos"], [86400, "d"], [3600, "h"], [60, "min"],
    [1, "s"], [1e-3, "ms"], [1e-6, "µs"], [1e-9, "ns"],
  ];
  for (const [f, u] of units) {
    if (s >= f) return `${(s / f).toFixed(s / f >= 100 ? 0 : 2)} ${u}`;
  }
  return `${s.toExponential(2)} s`;
}

// ============================================================================
// EXP-23 · Efeito fotoelétrico
// ============================================================================
export const PLANCK_H = 6.62607015e-34;   // J·s
export const ELECTRON_E = 1.602176634e-19; // C
export const SPEED_C = 2.99792458e8;       // m/s

export interface PhotoMaterial { name: string; phiEv: number; color: string }
export const PHOTO_MATERIALS: PhotoMaterial[] = [
  { name: "Césio",   phiEv: 2.10, color: "hsl(45, 90%, 60%)" },
  { name: "Potássio",phiEv: 2.30, color: "hsl(35, 80%, 60%)" },
  { name: "Sódio",   phiEv: 2.36, color: "hsl(50, 85%, 65%)" },
  { name: "Cálcio",  phiEv: 2.87, color: "hsl(0, 0%, 80%)"  },
  { name: "Zinco",   phiEv: 4.30, color: "hsl(210, 15%, 70%)" },
  { name: "Cobre",   phiEv: 4.70, color: "hsl(20, 70%, 55%)" },
  { name: "Prata",   phiEv: 4.73, color: "hsl(0, 0%, 88%)"  },
  { name: "Ouro",    phiEv: 5.10, color: "hsl(48, 85%, 60%)" },
];

export interface PhotoelectricParams {
  wavelengthNm: number;   // λ em nm
  intensity: number;      // W/m² (intensidade do feixe)
  voltage: number;        // V (potencial do ânodo relativo ao cátodo; >0 acelera elétrons, <0 freia)
  materialName: string;
  phiEv: number;          // função trabalho em eV
  quantumEfficiency: number; // η ∈ [0,1] — fração de fótons que ejetam elétrons
  areaCm2: number;        // área iluminada do cátodo
}

export interface PhotoelectricResults {
  photonEnergyJ: number;
  photonEnergyEv: number;
  frequencyHz: number;
  thresholdFreqHz: number;
  thresholdWavelengthNm: number;
  kMaxJ: number;          // energia cinética máxima
  kMaxEv: number;
  vMaxMs: number;         // velocidade máxima
  stoppingVoltage: number; // V_s > 0 (tensão de frenagem)
  emits: boolean;
  photonFlux: number;      // fótons/s (sobre área)
  saturationCurrent: number; // A
  current: number;           // A na tensão atual
  // Curvas
  ivCurve: { V: number; I: number }[];
  vsVsFreq: { f: number; Vs: number }[]; // varredura para o material atual
}

export function computePhotoelectric(p: PhotoelectricParams): PhotoelectricResults {
  const lambda = Math.max(1e-12, p.wavelengthNm * 1e-9);
  const f = SPEED_C / lambda;
  const Eph = PLANCK_H * f;
  const EphEv = Eph / ELECTRON_E;
  const phiJ = p.phiEv * ELECTRON_E;
  const f0 = phiJ / PLANCK_H;
  const lambda0Nm = (SPEED_C / f0) * 1e9;

  const emits = f > f0;
  const Kmax = emits ? Eph - phiJ : 0;
  const KmaxEv = Kmax / ELECTRON_E;
  const vMax = emits ? Math.sqrt(2 * Kmax / 9.10938356e-31) : 0;
  const Vs = emits ? Kmax / ELECTRON_E : 0;

  // Fluxo de fótons: P = I · A; n_fot = P / Eph
  const A = p.areaCm2 * 1e-4;
  const power = p.intensity * A;
  const photonFlux = emits ? power / Eph : 0;
  const Isat = ELECTRON_E * photonFlux * p.quantumEfficiency;

  // Modelo de corrente I(V):
  //  - se V >= 0 (acelera ou neutro): I = Isat (todos elétrons coletados)
  //  - se -Vs < V < 0: fração com K > e|V| chega; modelo simples linear:
  //      I(V) = Isat * (1 - |V|/Vs)  (aproximação didática)
  //  - se V <= -Vs: I = 0
  const current = currentAt(p.voltage, Isat, Vs, emits);

  const ivCurve: { V: number; I: number }[] = [];
  const vMin = -(Vs + 1.5);
  const vMaxRange = Math.max(2, Vs + 2);
  const N = 80;
  for (let i = 0; i <= N; i++) {
    const V = vMin + (i / N) * (vMaxRange - vMin);
    ivCurve.push({ V: +V.toFixed(3), I: currentAt(V, Isat, Vs, emits) });
  }

  // Vs vs f: varredura entre f0 e ~3 f0 (mantendo material e intensidade)
  const vsVsFreq: { f: number; Vs: number }[] = [];
  const fMin = Math.max(f0 * 0.5, 1e14);
  const fMax = Math.max(f * 1.5, f0 * 3);
  const M = 40;
  for (let i = 0; i <= M; i++) {
    const ff = fMin + (i / M) * (fMax - fMin);
    const K = PLANCK_H * ff - phiJ;
    vsVsFreq.push({ f: +(ff / 1e14).toFixed(3), Vs: K > 0 ? K / ELECTRON_E : 0 });
  }

  return {
    photonEnergyJ: Eph, photonEnergyEv: EphEv, frequencyHz: f,
    thresholdFreqHz: f0, thresholdWavelengthNm: lambda0Nm,
    kMaxJ: Kmax, kMaxEv: KmaxEv, vMaxMs: vMax, stoppingVoltage: Vs,
    emits, photonFlux, saturationCurrent: Isat, current,
    ivCurve, vsVsFreq,
  };
}

function currentAt(V: number, Isat: number, Vs: number, emits: boolean): number {
  if (!emits || Isat <= 0) return 0;
  if (V >= 0) return Isat;
  if (Vs <= 0) return 0;
  const r = -V / Vs; // 0..∞
  if (r >= 1) return 0;
  return Isat * (1 - r);
}


export interface CapacitorParams {
  voltage: number;       // V
  distanceMm: number;    // mm
  areaCm2: number;       // cm²
  epsilonR: number;      // adimensional
}

export interface CapacitorResults {
  capacitance: number;     // F
  charge: number;          // C
  energy: number;          // J
  electricField: number;   // V/m
  surfaceCharge: number;   // C/m²
}

export function computeCapacitor(p: CapacitorParams): CapacitorResults {
  const A = p.areaCm2 * 1e-4;       // m²
  const d = p.distanceMm * 1e-3;    // m
  const C = (p.epsilonR * EPSILON_0 * A) / d;
  const Q = C * p.voltage;
  const U = 0.5 * C * p.voltage * p.voltage;
  const E = p.voltage / d;
  const sigma = Q / A;
  return { capacitance: C, charge: Q, energy: U, electricField: E, surfaceCharge: sigma };
}

export function formatSI(value: number, unit: string, digits = 3): string {
  if (value === 0) return `0 ${unit}`;
  const abs = Math.abs(value);
  const prefixes: [number, string][] = [
    [1e12, "T"], [1e9, "G"], [1e6, "M"], [1e3, "k"],
    [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"], [1e-12, "p"], [1e-15, "f"],
  ];
  for (const [factor, prefix] of prefixes) {
    if (abs >= factor) {
      const v = value / factor;
      return `${v.toFixed(digits)} ${prefix}${unit}`;
    }
  }
  return `${value.toExponential(digits)} ${unit}`;
}

// ===== Ohm's law / Resistivity experiment =====

export interface OhmParams {
  voltage: number;        // V (fonte)
  resistivity: number;    // Ω·m (resistividade do material do fio)
  lengthCm: number;       // cm (comprimento do fio)
  diameterMm: number;     // mm (diâmetro da seção transversal)
  internalOhm: number;    // Ω (resistência interna da fonte)
  noisePct: number;       // 0..1 (ruído relativo na medição)
}

export interface OhmResults {
  area: number;           // m² (seção transversal)
  resistance: number;     // Ω (R = ρL/A)
  current: number;        // A (I = V / (R + r))
  voltageDrop: number;    // V (U = R·I, sobre o resistor)
  power: number;          // W (P = U·I)
  conductance: number;    // S (G = 1/R)
}

export const MATERIALS: Record<string, number> = {
  // Resistividade a 20°C (Ω·m)
  "Cobre": 1.68e-8,
  "Alumínio": 2.65e-8,
  "Tungstênio": 5.6e-8,
  "Ferro": 9.71e-8,
  "Constantan": 4.9e-7,
  "Níquel-cromo": 1.1e-6,
  "Grafite": 3.5e-5,
};

export function computeOhm(p: OhmParams): OhmResults {
  const A = Math.PI * Math.pow((p.diameterMm * 1e-3) / 2, 2); // m²
  const L = p.lengthCm * 1e-2;                                 // m
  const R = (p.resistivity * L) / A;                           // Ω
  const Rtot = R + Math.max(0, p.internalOhm);
  const I = Rtot > 0 ? p.voltage / Rtot : 0;
  const U = R * I;
  const P = U * I;
  const G = R > 0 ? 1 / R : Infinity;
  return { area: A, resistance: R, current: I, voltageDrop: U, power: P, conductance: G };
}

/** Linear regression y = a·x + b. Returns slope a, intercept b and R². */
export function linearRegression(points: { x: number; y: number }[]) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };
  let sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0;
  for (const { x, y } of points) { sx += x; sy += y; sxy += x * y; sxx += x * x; syy += y * y; }
  const den = n * sxx - sx * sx;
  const slope = den === 0 ? 0 : (n * sxy - sx * sy) / den;
  const intercept = (sy - slope * sx) / n;
  const ssTot = syy - (sy * sy) / n;
  const ssRes = points.reduce((acc, { x, y }) => acc + Math.pow(y - (slope * x + intercept), 2), 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  return { slope, intercept, r2 };
}

// ===== RC circuit — charge/discharge =====

export type RCMode = "charge" | "discharge";

export interface RCParams {
  emf: number;            // V (tensão da fonte E)
  resistanceK: number;    // kΩ
  capacitanceUf: number;  // µF
  mode: RCMode;
  /** Tensão inicial no capacitor em t=0 (V). Útil para descarga começar carregado. */
  v0: number;
}

export interface RCResults {
  tau: number;            // s (constante de tempo τ = R·C)
  rOhm: number;           // Ω
  cFarad: number;         // F
  vFinal: number;         // V (regime permanente)
  i0: number;             // A (corrente em t=0+)
}

export function computeRC(p: RCParams): RCResults {
  const R = Math.max(0, p.resistanceK) * 1e3;
  const C = Math.max(0, p.capacitanceUf) * 1e-6;
  const tau = R * C;
  const vFinal = p.mode === "charge" ? p.emf : 0;
  const i0 = R > 0 ? (vFinal - p.v0) / R : 0;
  return { tau, rOhm: R, cFarad: C, vFinal, i0 };
}

/** Tensão no capacitor em função do tempo. */
export function rcVoltage(p: RCParams, t: number): number {
  const { tau, vFinal } = computeRC(p);
  if (tau <= 0) return vFinal;
  return vFinal + (p.v0 - vFinal) * Math.exp(-t / tau);
}

/** Corrente no resistor em função do tempo (sentido convencional, fonte→capacitor). */
export function rcCurrent(p: RCParams, t: number): number {
  const { tau, vFinal, rOhm } = computeRC(p);
  if (tau <= 0 || rOhm <= 0) return 0;
  return ((vFinal - p.v0) / rOhm) * Math.exp(-t / tau);
}

/** Energia armazenada no capacitor em função do tempo (J). */
export function rcEnergy(p: RCParams, t: number): number {
  const v = rcVoltage(p, t);
  const { cFarad } = computeRC(p);
  return 0.5 * cFarad * v * v;
}

// ===== Magnetic field of coils (Biot–Savart) =====

export const MU_0 = 4 * Math.PI * 1e-7; // T·m/A

export type CoilType = "solenoid" | "helmholtz" | "single";

export interface CoilParams {
  type: CoilType;
  current: number;       // A
  turns: number;         // N (total para solenoide; por bobina para Helmholtz/single)
  radiusCm: number;      // raio da bobina (cm)
  lengthCm: number;      // comprimento do solenoide (cm) — ignorado para Helmholtz/single
}

export interface CoilResults {
  bCenter: number;       // T (campo no centro geométrico)
  bIdealSolenoid: number;// T (aproximação infinita µ₀nI, só para solenoide)
  nPerMeter: number;     // espiras/m (solenoide)
  uniformityPct: number; // % variação de B no eixo entre ±r/2 do centro
}

/** Campo axial Bz de uma única espira de raio R, no ponto (z) sobre o eixo. */
export function bAxisLoop(R: number, I: number, z: number): number {
  const denom = Math.pow(R * R + z * z, 1.5);
  return (MU_0 * I * R * R) / (2 * denom);
}

/** Campo axial Bz de um solenoide finito de comprimento L, raio R, n espiras/m, centrado em z=0. */
export function bAxisSolenoid(R: number, L: number, n: number, I: number, z: number): number {
  const a = (L / 2 - z) / Math.sqrt(R * R + (L / 2 - z) ** 2);
  const b = (L / 2 + z) / Math.sqrt(R * R + (L / 2 + z) ** 2);
  return 0.5 * MU_0 * n * I * (a + b);
}

/** Helmholtz: duas bobinas idênticas separadas por d = R, cada uma com N espiras. */
export function bAxisHelmholtz(R: number, N: number, I: number, z: number): number {
  const d = R; // separação ideal de Helmholtz
  return N * (bAxisLoop(R, I, z - d / 2) + bAxisLoop(R, I, z + d / 2));
}

/** Avalia Bz(z) no eixo de acordo com a geometria escolhida. */
export function bAxis(p: CoilParams, z: number): number {
  const R = Math.max(1e-4, p.radiusCm * 1e-2);
  const L = Math.max(1e-4, p.lengthCm * 1e-2);
  if (p.type === "single") return p.turns * bAxisLoop(R, p.current, z);
  if (p.type === "helmholtz") return bAxisHelmholtz(R, p.turns, p.current, z);
  // solenoid
  const n = p.turns / L;
  return bAxisSolenoid(R, L, n, p.current, z);
}

export function computeCoil(p: CoilParams): CoilResults {
  const R = Math.max(1e-4, p.radiusCm * 1e-2);
  const L = Math.max(1e-4, p.lengthCm * 1e-2);
  const n = p.type === "solenoid" ? p.turns / L : 0;
  const bCenter = bAxis(p, 0);
  const bIdealSolenoid = MU_0 * n * p.current;
  const bMid = Math.abs(bAxis(p, R / 2));
  const bC = Math.abs(bCenter);
  const uniformityPct = bC > 0 ? Math.abs(bC - bMid) / bC * 100 : 0;
  return { bCenter, bIdealSolenoid, nPerMeter: n, uniformityPct };
}

// ===== Electromagnetic induction (Faraday) =====

export const G_EARTH = 9.81; // m/s²

export type FaradayMode = "loop" | "magnet";

/** Modo "loop": espira retangular entrando/saindo de uma região de campo B uniforme.
 *  Modo "magnet": dipolo magnético (ímã) deslocando-se ao longo do eixo de uma bobina. */
export interface FaradayParams {
  mode: FaradayMode;

  // — comuns —
  turns: number;             // N
  resistanceOhm: number;     // R do circuito (resistor + bobina)

  // — modo loop —
  bField: number;            // T (campo da região)
  loopWidthCm: number;       // largura horizontal da espira (cm)
  loopHeightCm: number;      // altura vertical da espira (cm)
  velocityCmS: number;       // velocidade horizontal da espira (cm/s)
  regionWidthCm: number;     // largura horizontal da região com campo (cm)

  // — modo magnet —
  coilRadiusCm: number;      // raio da bobina (cm)
  coilLengthCm: number;      // comprimento da bobina (cm)
  magnetMoment: number;      // m (A·m²) momento de dipolo do ímã
  dropHeightCm: number;      // altura inicial do ímã acima do centro da bobina (cm)
  withGravity: boolean;      // se true: queda livre; se false: velocidade constante
  magnetSpeedCmS: number;    // velocidade constante quando withGravity=false
}

export interface FaradayState {
  t: number;
  /** Posição característica: x da espira (m, modo loop) ou z do ímã (m, modo magnet) */
  pos: number;
  vel: number;
  flux: number;     // Wb (já multiplicado por N)
  emf: number;      // V (f.e.m. induzida)
  current: number;  // A
  power: number;    // W dissipada no resistor
}

/** Fluxo magnético total (Wb, já × N) em função da posição. */
export function faradayFlux(p: FaradayParams, pos: number): number {
  if (p.mode === "loop") {
    const w = p.loopWidthCm * 1e-2;
    const h = p.loopHeightCm * 1e-2;
    const W = p.regionWidthCm * 1e-2;
    // região centrada em x=0, de -W/2 a +W/2; espira centrada em x=pos, largura w
    const xL = pos - w / 2;
    const xR = pos + w / 2;
    const overlapL = Math.max(xL, -W / 2);
    const overlapR = Math.min(xR, +W / 2);
    const overlap = Math.max(0, overlapR - overlapL);
    return p.turns * p.bField * overlap * h;
  }
  // magnet: aproximação dipolar — fluxo enlaçado por bobina ≈ N · µ0/2 · m · R²/(R²+z²)^(3/2)
  const R = Math.max(1e-4, p.coilRadiusCm * 1e-2);
  const L = Math.max(1e-4, p.coilLengthCm * 1e-2);
  // Soma sobre K espiras distribuídas ao longo de L, centradas em z=0
  const K = Math.min(40, Math.max(2, Math.round(p.turns / 5)));
  const Nper = p.turns / K;
  let phi = 0;
  for (let k = 0; k < K; k++) {
    const zk = -L / 2 + (L * (k + 0.5)) / K;
    const dz = pos - zk;
    const denom = Math.pow(R * R + dz * dz, 1.5);
    phi += Nper * (MU_0 / 2) * p.magnetMoment * (R * R) / denom;
  }
  return phi;
}

/** Avalia f.e.m. = -dΦ/dt usando derivada centrada em pos. */
export function faradayEmf(p: FaradayParams, pos: number, vel: number): number {
  const eps = 1e-4;
  const dPhi = faradayFlux(p, pos + eps) - faradayFlux(p, pos - eps);
  const dPhidx = dPhi / (2 * eps);
  return -dPhidx * vel;
}

/** Estado completo num dado instante, dada a posição e a velocidade. */
export function faradayState(p: FaradayParams, t: number, pos: number, vel: number): FaradayState {
  const flux = faradayFlux(p, pos);
  const emf = faradayEmf(p, pos, vel);
  const R = Math.max(1e-6, p.resistanceOhm);
  const current = emf / R;
  const power = current * current * R;
  return { t, pos, vel, flux, emf, current, power };
}

/** Posição inicial coerente com o modo. */
export function faradayInitialPos(p: FaradayParams): number {
  if (p.mode === "loop") {
    const w = p.loopWidthCm * 1e-2;
    const W = p.regionWidthCm * 1e-2;
    return -(W / 2 + w / 2 + 0.02); // começa fora, à esquerda
  }
  return p.dropHeightCm * 1e-2; // ímã acima da bobina
}

export function faradayInitialVel(p: FaradayParams): number {
  if (p.mode === "loop") return p.velocityCmS * 1e-2;
  return p.withGravity ? 0 : -Math.abs(p.magnetSpeedCmS) * 1e-2;
}

/** Avança um passo de simulação (RK1 simples). */
export function faradayStep(
  p: FaradayParams,
  pos: number,
  vel: number,
  dt: number,
): { pos: number; vel: number } {
  if (p.mode === "loop") {
    return { pos: pos + vel * dt, vel };
  }
  // magnet caindo: aceleração = -g se gravidade ligada (desprezamos força de freio magnético para didática)
  const a = p.withGravity ? -G_EARTH : 0;
  return { pos: pos + vel * dt, vel: vel + a * dt };
}

// ===== Transformer =====

export interface TransformerParams {
  vPrimaryRms: number;   // V (tensão eficaz da rede)
  freqHz: number;        // Hz
  n1: number;            // espiras primário
  n2: number;            // espiras secundário
  loadOhm: number;       // Ω (carga resistiva no secundário)
  coupling: number;      // k ∈ [0,1]
  r1Ohm: number;         // resistência do enrolamento primário
  r2Ohm: number;         // resistência do enrolamento secundário
}

export interface TransformerResults {
  ratio: number;         // a = N1/N2
  vSecondaryIdeal: number; // V (eficaz, ideal)
  vSecondary: number;    // V (eficaz, com perdas e k)
  iSecondary: number;    // A (eficaz)
  iPrimary: number;      // A (eficaz)
  pIn: number;           // W (potência aparente de entrada ≈ ativa, fp≈1)
  pOut: number;          // W (na carga)
  pLoss: number;         // W (dissipada nos enrolamentos)
  efficiency: number;    // η ∈ [0,1]
  type: "step-up" | "step-down" | "isolation";
}

export function computeTransformer(p: TransformerParams): TransformerResults {
  const a = p.n1 / Math.max(1, p.n2);
  const k = Math.max(0, Math.min(1, p.coupling));
  const RL = Math.max(1e-6, p.loadOhm);

  // Carga refletida ao primário ≈ a² · RL
  const Rload_ref = a * a * RL;
  // Modelo simplificado: tensão eficaz no secundário considera divisor pelas resistências
  // de enrolamento e fator de acoplamento k.
  const Rtot = p.r1Ohm + Rload_ref + a * a * p.r2Ohm;
  const iPrim = p.vPrimaryRms / Math.max(1e-6, Rtot);
  const vSecIdeal = p.vPrimaryRms / a; // ideal: V2 = V1 · N2/N1
  // f.e.m. eficaz no secundário considerando perdas no primário + acoplamento
  const eSec = k * (p.vPrimaryRms - iPrim * p.r1Ohm) / a;
  // Divisor entre R2 do enrolamento e RL
  const iSec = eSec / Math.max(1e-6, p.r2Ohm + RL);
  const vSec = iSec * RL;

  const pIn = p.vPrimaryRms * iPrim;
  const pOut = vSec * iSec;
  const pLoss = Math.max(0, pIn - pOut);
  const efficiency = pIn > 0 ? Math.max(0, Math.min(1, pOut / pIn)) : 0;

  let type: TransformerResults["type"] = "isolation";
  if (a > 1.001) type = "step-down";
  else if (a < 0.999) type = "step-up";

  return {
    ratio: a,
    vSecondaryIdeal: vSecIdeal,
    vSecondary: vSec,
    iSecondary: iSec,
    iPrimary: iPrim,
    pIn, pOut, pLoss, efficiency, type,
  };
}

/** Forma de onda instantânea de V1 e V2 (k corrige amplitude). */
export function transformerWaveform(p: TransformerParams, t: number): { v1: number; v2: number } {
  const omega = 2 * Math.PI * p.freqHz;
  const v1 = p.vPrimaryRms * Math.SQRT2 * Math.sin(omega * t);
  const r = computeTransformer(p);
  // V2 instantâneo proporcional, em fase para carga puramente resistiva
  const ratioInst = r.vSecondary / Math.max(1e-9, p.vPrimaryRms);
  const v2 = v1 * ratioInst;
  return { v1, v2 };
}

// ===== RLC series circuit — frequency response & resonance =====

export interface RLCParams {
  vSourceRms: number;     // V (amplitude eficaz da fonte AC)
  freqHz: number;         // Hz (frequência de operação para grandezas instantâneas)
  resistanceOhm: number;  // Ω
  inductanceMh: number;   // mH
  capacitanceUf: number;  // µF
}

export interface RLCResults {
  rOhm: number;
  lH: number;
  cF: number;
  omega: number;          // rad/s na freqHz
  omega0: number;         // rad/s ressonância
  f0: number;             // Hz ressonância
  xL: number;             // Ω reatância indutiva na freqHz
  xC: number;             // Ω reatância capacitiva na freqHz
  reactance: number;      // X = XL - XC
  impedance: number;      // |Z|
  phaseDeg: number;       // φ = atan2(X, R) em graus (V em relação a I)
  currentRms: number;     // A
  vR: number; vL: number; vC: number; // V eficazes nos componentes
  pAvg: number;           // W
  Q: number;              // fator de qualidade
  bandwidthHz: number;    // Δf
}

export function computeRLC(p: RLCParams): RLCResults {
  const R = Math.max(1e-6, p.resistanceOhm);
  const L = Math.max(1e-9, p.inductanceMh) * 1e-3;
  const C = Math.max(1e-15, p.capacitanceUf) * 1e-6;
  const omega = 2 * Math.PI * p.freqHz;
  const omega0 = 1 / Math.sqrt(L * C);
  const f0 = omega0 / (2 * Math.PI);
  const xL = omega * L;
  const xC = 1 / (omega * C);
  const X = xL - xC;
  const Z = Math.sqrt(R * R + X * X);
  const phaseDeg = (Math.atan2(X, R) * 180) / Math.PI;
  const I = p.vSourceRms / Z;
  const vR = I * R;
  const vL = I * xL;
  const vC = I * xC;
  const pAvg = I * I * R;
  const Q = (1 / R) * Math.sqrt(L / C);
  const bandwidthHz = f0 / Math.max(1e-9, Q);
  return {
    rOhm: R, lH: L, cF: C, omega, omega0, f0,
    xL, xC, reactance: X, impedance: Z, phaseDeg,
    currentRms: I, vR, vL, vC, pAvg, Q, bandwidthHz,
  };
}

/** Resposta em frequência: amplitude da corrente |I(f)| para varredura. */
export function rlcCurrentAtFreq(p: RLCParams, f: number): number {
  const omega = 2 * Math.PI * f;
  const L = Math.max(1e-9, p.inductanceMh) * 1e-3;
  const C = Math.max(1e-15, p.capacitanceUf) * 1e-6;
  const R = Math.max(1e-6, p.resistanceOhm);
  const X = omega * L - 1 / (omega * C);
  const Z = Math.sqrt(R * R + X * X);
  return p.vSourceRms / Z;
}

/** Forma de onda v(t) e i(t) com defasagem φ. */
export function rlcWaveform(p: RLCParams, t: number): { v: number; i: number } {
  const r = computeRLC(p);
  const omega = r.omega;
  const v = p.vSourceRms * Math.SQRT2 * Math.sin(omega * t);
  const phi = (r.phaseDeg * Math.PI) / 180;
  const i = r.currentRms * Math.SQRT2 * Math.sin(omega * t - phi);
  return { v, i };
}

// ===== DC Motor — Laplace force on a current-carrying loop =====

export interface DCMotorParams {
  voltage: number;        // V (tensão da fonte)
  resistanceOhm: number;  // Ω (resistência da armadura)
  bField: number;         // T (campo magnético)
  loopWidthCm: number;    // a (largura, lados que cortam B)
  loopHeightCm: number;   // b (altura, lados ativos onde F = BIL atua)
  turns: number;          // N (espiras da bobina)
  loadTorqueMnm: number;  // mN·m (torque resistente externo)
  frictionCoef: number;   // N·m·s (atrito viscoso b)
  inertiaGcm2: number;    // g·cm² (momento de inércia do rotor)
  kE: number;             // V·s/rad (constante de f.c.e.m.) — derivada se 0
}

export interface DCMotorResults {
  area: number;           // m² (área da espira)
  kT: number;             // N·m/A (constante de torque)
  kE: number;             // V·s/rad (constante de f.c.e.m.)
  inertia: number;        // kg·m²
  iStall: number;         // A (corrente de partida, ω=0)
  tStall: number;         // N·m (torque de partida)
  omegaNoLoad: number;    // rad/s (velocidade sem carga)
  rpmNoLoad: number;      // RPM sem carga
  omegaSteady: number;    // rad/s (regime com carga)
  rpmSteady: number;      // RPM em regime
  iSteady: number;        // A em regime
  bemfSteady: number;     // V em regime
  pIn: number;            // W (V·I)
  pMech: number;          // W (T·ω)
  pLoss: number;          // W (R·I²)
  efficiency: number;     // η ∈ [0,1]
}

export function computeDCMotor(p: DCMotorParams): DCMotorResults {
  const a = Math.max(1e-4, p.loopWidthCm * 1e-2);   // m
  const b = Math.max(1e-4, p.loopHeightCm * 1e-2);  // m
  const A = a * b;
  // Torque máximo em uma espira plana num campo uniforme: τ = N·B·I·A·cos(θ)
  // Aproximação com comutador: torque médio ≈ (2/π)·N·B·I·A. Para didática, usamos τ ≈ kT·I com
  // kT = (2/π)·N·B·A, que dá uma curva torque×ω suave e fisicamente coerente.
  const kT = (2 / Math.PI) * p.turns * p.bField * A;
  const kE = p.kE > 0 ? p.kE : kT; // unidades SI: kT (N·m/A) = kE (V·s/rad)
  const R = Math.max(1e-3, p.resistanceOhm);
  const J = Math.max(1e-9, p.inertiaGcm2 * 1e-7); // g·cm² → kg·m²  (1 g·cm² = 1e-7 kg·m²)

  const iStall = p.voltage / R;
  const tStall = kT * iStall;

  // Sem carga (Tload=0, atrito b·ω): ω = (kT·V) / (R·b + kE·kT)
  const bf = Math.max(0, p.frictionCoef);
  const Tload = Math.max(0, p.loadTorqueMnm) * 1e-3; // N·m
  const denomNL = R * bf + kE * kT;
  const omegaNoLoad = denomNL > 0 ? (kT * p.voltage) / denomNL : (kE > 0 ? p.voltage / kE : 0);

  // Com carga: kT·(V - kE·ω)/R = b·ω + Tload
  // ⇒ ω·(kE·kT/R + b) = kT·V/R - Tload
  const omegaSteady = Math.max(0, (kT * p.voltage / R - Tload) / Math.max(1e-9, kE * kT / R + bf));
  const iSteady = (p.voltage - kE * omegaSteady) / R;
  const bemfSteady = kE * omegaSteady;
  const pIn = p.voltage * iSteady;
  const pMech = (kT * iSteady - bf * omegaSteady) * omegaSteady;
  const pLoss = R * iSteady * iSteady;
  const efficiency = pIn > 0 ? Math.max(0, Math.min(1, pMech / pIn)) : 0;

  return {
    area: A, kT, kE, inertia: J,
    iStall, tStall,
    omegaNoLoad, rpmNoLoad: (omegaNoLoad * 60) / (2 * Math.PI),
    omegaSteady, rpmSteady: (omegaSteady * 60) / (2 * Math.PI),
    iSteady, bemfSteady,
    pIn, pMech, pLoss, efficiency,
  };
}

/** Torque instantâneo τ(θ) = N·B·I·A·|cos θ| (com comutador idealizado). */
export function dcMotorTorqueAtAngle(p: DCMotorParams, currentA: number, thetaRad: number): number {
  const A = (p.loopWidthCm * 1e-2) * (p.loopHeightCm * 1e-2);
  return p.turns * p.bField * currentA * A * Math.abs(Math.cos(thetaRad));
}

/** Avança o estado do rotor (θ, ω) por um passo dt. */
export function dcMotorStep(
  p: DCMotorParams,
  theta: number,
  omega: number,
  dt: number,
): { theta: number; omega: number; current: number; torque: number } {
  const r = computeDCMotor(p);
  const R = Math.max(1e-3, p.resistanceOhm);
  const i = (p.voltage - r.kE * omega) / R;
  // Torque eletromagnético médio (com comutador) — usamos kT·i para estabilidade
  const tElec = r.kT * i;
  const tLoad = Math.max(0, p.loadTorqueMnm) * 1e-3;
  const tFric = Math.max(0, p.frictionCoef) * omega;
  const net = tElec - tLoad - tFric;
  const alpha = net / Math.max(1e-9, r.inertia);
  const newOmega = Math.max(0, omega + alpha * dt);
  const newTheta = (theta + newOmega * dt) % (2 * Math.PI);
  return { theta: newTheta, omega: newOmega, current: i, torque: tElec };
}

// ============================================================================
// EXP-09 — Movimento de carga em campos E e B
// ============================================================================

export type ChargeMode = "eOnly" | "bOnly" | "selector" | "cyclotron";

export interface ChargeParams {
  mode: ChargeMode;
  /** Carga em múltiplos da carga elementar (e = 1.602e-19 C). Pode ser negativo. */
  chargeE: number;
  /** Massa em múltiplos da massa do próton (mp = 1.6726e-27 kg). */
  massP: number;
  /** Velocidade inicial (m/s). Direção depende do modo. */
  v0: number;
  /** Campo elétrico (V/m), aplicado em ŷ (modo eOnly e selector). */
  E: number;
  /** Campo magnético (T), aplicado em ẑ (saindo do plano). */
  B: number;
  /** Para cyclotron: tensão pico entre os “Dees” (V). */
  vDee: number;
}

export interface ChargeDerived {
  q: number;       // C
  m: number;       // kg
  qOverM: number;  // C/kg
  rGyro: number;   // m  (raio de Larmor)
  fCyc: number;    // Hz (frequência ciclotrônica)
  tCyc: number;    // s
  vSelector: number; // m/s (E/B – velocidade que passa o seletor sem deflexão)
  energyEv: number; // eV (energia cinética inicial)
}

const E_CHARGE = 1.602176634e-19;
const M_PROTON = 1.67262192369e-27;

export function computeChargeDerived(p: ChargeParams): ChargeDerived {
  const q = p.chargeE * E_CHARGE;
  const m = Math.max(1e-9, p.massP) * M_PROTON;
  const absQ = Math.abs(q);
  const B = Math.max(1e-12, Math.abs(p.B));
  const rGyro = (m * Math.abs(p.v0)) / (absQ * B);
  const fCyc = (absQ * B) / (2 * Math.PI * m);
  const tCyc = 1 / Math.max(1e-30, fCyc);
  const vSelector = p.B !== 0 ? p.E / p.B : 0;
  const energyJ = 0.5 * m * p.v0 * p.v0;
  const energyEv = energyJ / E_CHARGE;
  return { q, m, qOverM: q / m, rGyro, fCyc, tCyc, vSelector, energyEv };
}

/**
 * Integra a trajetória 2D (plano xy, B em ẑ) por RK4. Usa unidades SI.
 * Para cyclotron, simula um "gap" central onde a partícula é acelerada em ±x
 * com sinal acompanhando v_x (idealização do oscilador RF síncrono).
 */
export function integrateChargeTrajectory(
  p: ChargeParams,
  steps = 1500,
  dtScale = 1,
): { x: number[]; y: number[]; vx: number[]; vy: number[]; t: number[]; dt: number } {
  const d = computeChargeDerived(p);
  const q = d.q;
  const m = d.m;

  // dt baseado em ~1/200 de período ciclotrônico (ou tempo de travessia se B ≈ 0)
  let dt: number;
  if (Math.abs(p.B) > 1e-9) {
    dt = (d.tCyc / 200) * dtScale;
  } else {
    // tempo para travessia de ~5x raio (ou 1 m se v0=0)
    const v = Math.max(1, Math.abs(p.v0));
    dt = (1 / v) * dtScale;
  }

  const x = new Float64Array(steps);
  const y = new Float64Array(steps);
  const vx = new Float64Array(steps);
  const vy = new Float64Array(steps);
  const t = new Float64Array(steps);

  // Estado inicial conforme modo
  let X = 0, Y = 0, VX = 0, VY = 0;
  if (p.mode === "eOnly") {
    VX = p.v0;        // v0 em x, E em y
  } else if (p.mode === "bOnly") {
    VX = p.v0;        // v0 em x, B em z → faz círculo
    Y = -d.rGyro;     // centra trajetória na origem
  } else if (p.mode === "selector") {
    VX = p.v0;        // partícula entra em x, E e B perpendiculares
  } else if (p.mode === "cyclotron") {
    VX = p.v0;        // velocidade de injeção
  }

  const Bz = p.B;
  const Ey = (p.mode === "eOnly" || p.mode === "selector") ? p.E : 0;
  // Aceleração: a = (q/m)·(E + v × B);  com B = (0,0,Bz):  v×B = (vy·Bz, -vx·Bz, 0)
  const accel = (vx_: number, vy_: number, atTime: number): [number, number] => {
    let ax = (q / m) * (vy_ * Bz);
    let ay = (q / m) * (Ey - vx_ * Bz);
    if (p.mode === "cyclotron") {
      // Gap em x ∈ [-gap, gap]; força impulsiva substituída por campo E_x sincronizado
      const gap = 5e-3; // 5 mm
      if (X > -gap && X < gap) {
        const sign = vx_ >= 0 ? 1 : -1;
        const Ex = (p.vDee / (2 * gap)) * sign; // V/m efetivo no gap
        ax += (q / m) * Ex;
      }
    }
    return [ax, ay];
  };

  for (let i = 0; i < steps; i++) {
    x[i] = X; y[i] = Y; vx[i] = VX; vy[i] = VY; t[i] = i * dt;

    // RK4
    const [k1ax, k1ay] = accel(VX, VY, i * dt);
    const k1vx = VX, k1vy = VY;

    const [k2ax, k2ay] = accel(VX + 0.5 * dt * k1ax, VY + 0.5 * dt * k1ay, (i + 0.5) * dt);
    const k2vx = VX + 0.5 * dt * k1ax, k2vy = VY + 0.5 * dt * k1ay;

    const [k3ax, k3ay] = accel(VX + 0.5 * dt * k2ax, VY + 0.5 * dt * k2ay, (i + 0.5) * dt);
    const k3vx = VX + 0.5 * dt * k2ax, k3vy = VY + 0.5 * dt * k2ay;

    const [k4ax, k4ay] = accel(VX + dt * k3ax, VY + dt * k3ay, (i + 1) * dt);
    const k4vx = VX + dt * k3ax, k4vy = VY + dt * k3ay;

    X += (dt / 6) * (k1vx + 2 * k2vx + 2 * k3vx + k4vx);
    Y += (dt / 6) * (k1vy + 2 * k2vy + 2 * k3vy + k4vy);
    VX += (dt / 6) * (k1ax + 2 * k2ax + 2 * k3ax + k4ax);
    VY += (dt / 6) * (k1ay + 2 * k2ay + 2 * k3ay + k4ay);
  }

  return {
    x: Array.from(x),
    y: Array.from(y),
    vx: Array.from(vx),
    vy: Array.from(vy),
    t: Array.from(t),
    dt,
  };
}
// ============================================================
// EXP-10: Efeito Hall
// ============================================================

/** Tipo de portador de carga majoritário. */
export type HallCarrier = "electron" | "hole";

/** Material pré-definido com densidade de portadores típica (m^-3). */
export type HallMaterial = "Cu" | "Al" | "Si-n" | "Si-p" | "Ge" | "GaAs" | "custom";

export interface HallParams {
  material: HallMaterial;
  carrier: HallCarrier;
  /** Densidade de portadores n (m^-3). */
  n: number;
  /** Corrente I (A). */
  I: number;
  /** Campo magnético B (T), aplicado em ẑ. */
  B: number;
  /** Espessura t da amostra (m), na direção de B. */
  t: number;
  /** Largura w da amostra (m), na direção da tensão Hall. */
  w: number;
  /** Comprimento L (m), na direção da corrente. */
  L: number;
  /** Mobilidade μ (m²/V·s) — usada para resistividade longitudinal. */
  mobility: number;
}

export interface HallDerived {
  q: number;            // C (sinal do portador)
  rH: number;           // m³/C  (coeficiente de Hall  R_H = 1/(nq))
  vDrift: number;       // m/s
  jCurrent: number;     // A/m² (densidade de corrente)
  eHall: number;        // V/m  (campo de Hall)
  vHall: number;        // V    (tensão Hall)
  hallAngle: number;    // rad  (tan θ_H = μB)
  rhoXX: number;        // Ω·m  (resistividade longitudinal ≈ 1/(nqμ))
  rhoXY: number;        // Ω·m  (resistividade Hall = R_H·B)
  rXX: number;          // Ω    (resistência longitudinal R = ρ·L/(w·t))
  sheetN: number;       // m^-2 (densidade superficial = n·t)
}

export const HALL_MATERIALS: Record<Exclude<HallMaterial, "custom">, { n: number; carrier: HallCarrier; mobility: number; label: string }> = {
  "Cu":   { n: 8.5e28, carrier: "electron", mobility: 4.3e-3, label: "Cobre (Cu)" },
  "Al":   { n: 1.8e29, carrier: "electron", mobility: 1.5e-3, label: "Alumínio (Al)" },
  "Si-n": { n: 1.0e22, carrier: "electron", mobility: 0.135, label: "Silício tipo n" },
  "Si-p": { n: 1.0e22, carrier: "hole",     mobility: 0.048, label: "Silício tipo p" },
  "Ge":   { n: 2.4e19, carrier: "electron", mobility: 0.39,  label: "Germânio" },
  "GaAs": { n: 5.0e22, carrier: "electron", mobility: 0.85,  label: "GaAs tipo n" },
};

export function computeHall(p: HallParams): HallDerived {
  const q = (p.carrier === "electron" ? -1 : 1) * E_CHARGE;
  const n = Math.max(1, p.n);
  const t = Math.max(1e-9, p.t);
  const w = Math.max(1e-9, p.w);
  const L = Math.max(1e-9, p.L);
  const A = w * t;
  const j = p.I / A;
  const vDrift = j / (n * Math.abs(q));
  // R_H = 1/(n q); sinal segue o portador.
  const rH = 1 / (n * q);
  // V_H = R_H · I · B / t  (sinal preservado)
  const vHall = (rH * p.I * p.B) / t;
  const eHall = vHall / w;
  const mu = Math.max(0, p.mobility);
  const rhoXX = mu > 0 ? 1 / (n * Math.abs(q) * mu) : Infinity;
  const rXX = isFinite(rhoXX) ? rhoXX * L / A : Infinity;
  const rhoXY = rH * p.B;
  const hallAngle = Math.atan(mu * p.B);
  return {
    q, rH, vDrift, jCurrent: j, eHall, vHall, hallAngle,
    rhoXX, rhoXY, rXX, sheetN: n * t,
  };
}

// ===== Ampère's law: straight wires & toroid =====

export type AmpereGeometry = "single" | "parallel" | "toroid";

export interface AmpereParams {
  geometry: AmpereGeometry;
  I1: number;          // A — corrente do fio 1 (ou única, ou no toroide)
  I2: number;          // A — corrente do fio 2 (sentido + paralelo, − antiparalelo)
  separationCm: number;// cm — separação entre os dois fios paralelos (eixo x)
  wireLengthM: number; // m — comprimento útil dos fios (para força total)
  // Toroid
  N: number;           // espiras do toroide
  rMeanCm: number;     // raio médio do toroide (cm)
  aMinorCm: number;    // raio menor da seção (cm)
  // Probe point (cm) for single & parallel modes
  probeXcm: number;
  probeYcm: number;
}

export interface AmpereDerived {
  bAtProbe: number;       // T (módulo do campo no ponto de prova)
  bxAtProbe: number;      // T (componente x)
  byAtProbe: number;      // T (componente y)
  forcePerLength: number; // N/m — entre os dois fios (positivo = atrativa)
  forceTotal: number;     // N — sobre o trecho L
  bToroidInside: number;  // T — campo dentro do toroide (no raio médio)
  bToroidOutside: number; // T — campo fora (≈0)
  toroidRMin: number;     // m
  toroidRMax: number;     // m
}

/** Campo magnético de um fio retilíneo infinito a distância d (m): B = µ0 I / (2π d). */
export function bWireMag(I: number, d: number): number {
  if (d <= 0) return 0;
  return (MU_0 * Math.abs(I)) / (2 * Math.PI * d);
}

/** Componentes de B (T) em (x,y) m devido a fio em (xw,0) com corrente I no eixo +z. */
export function bWireXY(I: number, xw: number, x: number, y: number): { bx: number; by: number } {
  const dx = x - xw;
  const dy = y;
  const r2 = dx * dx + dy * dy;
  if (r2 < 1e-12) return { bx: 0, by: 0 };
  const k = (MU_0 * I) / (2 * Math.PI * r2);
  // B = (µ0 I / 2π r²) (-y, x) para corrente em +z
  return { bx: -k * dy, by: k * dx };
}

export function computeAmpere(p: AmpereParams): AmpereDerived {
  const x = p.probeXcm * 1e-2;
  const y = p.probeYcm * 1e-2;
  let bx = 0, by = 0;

  if (p.geometry === "single") {
    const r = { ...bWireXY(p.I1, 0, x, y) };
    bx += r.bx; by += r.by;
  } else if (p.geometry === "parallel") {
    const sep = p.separationCm * 1e-2;
    const a = bWireXY(p.I1, -sep / 2, x, y);
    const b = bWireXY(p.I2,  sep / 2, x, y);
    bx = a.bx + b.bx;
    by = a.by + b.by;
  }

  const sep = Math.max(1e-4, p.separationCm * 1e-2);
  // F/L = µ0 I1 I2 / (2π d). Atrativo se mesmo sentido (I1*I2 > 0)
  const fOverL = (MU_0 * p.I1 * p.I2) / (2 * Math.PI * sep);
  const fTotal = fOverL * Math.max(0, p.wireLengthM);

  const rMean = Math.max(1e-4, p.rMeanCm * 1e-2);
  const bToroidInside = (MU_0 * p.N * Math.abs(p.I1)) / (2 * Math.PI * rMean);

  return {
    bAtProbe: Math.hypot(bx, by),
    bxAtProbe: bx,
    byAtProbe: by,
    forcePerLength: fOverL,
    forceTotal: fTotal,
    bToroidInside,
    bToroidOutside: 0,
    toroidRMin: rMean - p.aMinorCm * 1e-2,
    toroidRMax: rMean + p.aMinorCm * 1e-2,
  };
}

// ============================================================
// EXP-12 — Lei de Gauss / fluxo elétrico
// ============================================================

export type GaussGeometry = "point" | "sphere" | "line" | "plane";
export type GaussSurface = "sphere" | "cylinder" | "pillbox";

export interface GaussParams {
  geometry: GaussGeometry;     // distribuição de carga-fonte
  // Source magnitudes
  Q: number;          // C — carga total (point/sphere)
  sourceRadiusCm: number; // cm — raio da esfera carregada (apenas sphere)
  lambda: number;     // C/m — densidade linear (line)
  sigma: number;      // C/m² — densidade superficial (plane)
  // Gaussian surface
  surface: GaussSurface;
  surfaceRadiusCm: number;  // cm — raio da gaussiana (sphere/cylinder/pillbox)
  surfaceLengthCm: number;  // cm — comprimento (cylinder) ou espessura virtual (pillbox)
  // Probe distance for plotting E(r)
  probeRcm: number;   // cm
}

export interface GaussDerived {
  E: number;            // V/m — campo no ponto de prova (radial ou normal)
  Qenc: number;         // C — carga interna à superfície gaussiana
  flux: number;         // V·m — fluxo total Φ = Qenc/ε0
  fluxFromArea: number; // V·m — fluxo via E·A (verificação)
  area: number;         // m² — área da superfície gaussiana relevante
}

/** Carga interna à gaussiana, dada a geometria-fonte e a superfície escolhida. */
export function gaussEnclosed(p: GaussParams): number {
  const rs = p.surfaceRadiusCm * 1e-2;
  const Ls = p.surfaceLengthCm * 1e-2;
  switch (p.geometry) {
    case "point":
      return p.Q;
    case "sphere": {
      const R = Math.max(1e-6, p.sourceRadiusCm * 1e-2);
      if (p.surface !== "sphere") return p.Q; // assume gaussiana envolve toda a esfera
      if (rs >= R) return p.Q;
      // densidade volumétrica uniforme ρ = Q / (4/3 π R³)
      return p.Q * (rs ** 3) / (R ** 3);
    }
    case "line": {
      // Gaussiana cilíndrica de raio rs, comprimento Ls envolve λ·Ls
      if (p.surface !== "cylinder") return p.lambda * Ls;
      return p.lambda * Ls;
    }
    case "plane": {
      // Pillbox de área A = π rs² atravessa o plano: Qenc = σ·A
      const A = Math.PI * rs * rs;
      return p.sigma * A;
    }
  }
}

/** Área "relevante" da gaussiana para Φ = E·A (faces onde E é não nulo e perpendicular). */
export function gaussArea(p: GaussParams): number {
  const rs = Math.max(1e-6, p.surfaceRadiusCm * 1e-2);
  const Ls = Math.max(1e-6, p.surfaceLengthCm * 1e-2);
  if (p.surface === "sphere") return 4 * Math.PI * rs * rs;
  if (p.surface === "cylinder") return 2 * Math.PI * rs * Ls; // lateral
  // pillbox: 2 faces (uma de cada lado do plano)
  return 2 * Math.PI * rs * rs;
}

/** Campo elétrico no ponto de prova (módulo) — radial / normal conforme a geometria. */
export function gaussField(p: GaussParams): number {
  const r = Math.max(1e-6, p.probeRcm * 1e-2);
  const k = 1 / (4 * Math.PI * EPSILON_0);
  switch (p.geometry) {
    case "point":
      return (k * Math.abs(p.Q)) / (r * r);
    case "sphere": {
      const R = Math.max(1e-6, p.sourceRadiusCm * 1e-2);
      if (r >= R) return (k * Math.abs(p.Q)) / (r * r);
      // dentro: E = k Q r / R³
      return (k * Math.abs(p.Q) * r) / (R ** 3);
    }
    case "line":
      return Math.abs(p.lambda) / (2 * Math.PI * EPSILON_0 * r);
    case "plane":
      return Math.abs(p.sigma) / (2 * EPSILON_0);
  }
}

export function computeGauss(p: GaussParams): GaussDerived {
  const Qenc = gaussEnclosed(p);
  const flux = Qenc / EPSILON_0;
  const E = gaussField(p);
  const A = gaussArea(p);
  // Fluxo via E·A (assume E uniforme nas faces relevantes — válido por simetria nas configs canônicas)
  // Para amostragem coerente, avalia E na própria superfície (r = surfaceRadius).
  const probe: GaussParams = { ...p, probeRcm: p.surfaceRadiusCm };
  const Eat = gaussField(probe) * Math.sign(Qenc || 1);
  const fluxFromArea = Eat * A;
  return { E, Qenc, flux, fluxFromArea, area: A };
}

// ============================================================
// Dipolo elétrico em campo externo
// ============================================================
export type DipoleMode = "field" | "torque";

export interface DipoleParams {
  mode: DipoleMode;
  qNc: number;          // nC — carga (módulo) das duas cargas (+q, -q)
  dCm: number;          // cm — separação entre as cargas
  Eext: number;         // V/m — campo externo uniforme (eixo x)
  thetaDeg: number;     // graus — ângulo entre p e Eext
  massMg: number;       // mg — massa de cada carga (para período de oscilação)
  probeXcm: number;     // cm — ponto de prova (modo field)
  probeYcm: number;     // cm
}

export interface DipoleDerived {
  p: number;            // C·m — módulo do momento de dipolo
  torque: number;       // N·m — τ = p·E·sinθ
  energy: number;       // J   — U = -p·E·cosθ
  forceNet: number;     // N   — força resultante (0 em campo uniforme)
  period: number;       // s   — período de pequenas oscilações em torno de θ=0
  Ex: number;           // V/m — campo do dipolo no ponto de prova (componente x)
  Ey: number;           // V/m — componente y
  Emag: number;         // V/m — módulo do campo no ponto
  rCm: number;          // cm  — distância do centro do dipolo ao ponto
}

export function computeDipole(p: DipoleParams): DipoleDerived {
  const k = 1 / (4 * Math.PI * EPSILON_0);
  const q = p.qNc * 1e-9;
  const d = Math.max(1e-6, p.dCm * 1e-2);
  const pmag = Math.abs(q) * d;
  const theta = (p.thetaDeg * Math.PI) / 180;
  const torque = pmag * p.Eext * Math.sin(theta);
  const energy = -pmag * p.Eext * Math.cos(theta);
  // Momento de inércia de duas massas iguais a r=d/2 do centro: I = 2·m·(d/2)² = m·d²/2
  const m = Math.max(1e-12, p.massMg * 1e-6); // kg
  const I = m * d * d / 2;
  const k_torsion = pmag * Math.abs(p.Eext); // dτ/dθ ≈ p·E em torno de θ=0
  const period = k_torsion > 0 ? 2 * Math.PI * Math.sqrt(I / k_torsion) : Infinity;

  // Campo do dipolo no ponto de prova. Dipolo com p = q·d ao longo do eixo do dipolo,
  // que está rotacionado por θ a partir do eixo +x (mesma convenção do Eext em x).
  // Posicionamos +q em +d/2 ao longo do eixo do dipolo, -q em -d/2.
  const ux = Math.cos(theta), uy = Math.sin(theta);
  const x = p.probeXcm * 1e-2;
  const y = p.probeYcm * 1e-2;
  const xp = x - (d / 2) * ux, yp = y - (d / 2) * uy;
  const xn = x + (d / 2) * ux, yn = y + (d / 2) * uy;
  const rp = Math.max(1e-6, Math.hypot(xp, yp));
  const rn = Math.max(1e-6, Math.hypot(xn, yn));
  const Ex = k * q * (xp / rp ** 3 - xn / rn ** 3);
  const Ey = k * q * (yp / rp ** 3 - yn / rn ** 3);
  const Emag = Math.hypot(Ex, Ey);
  const rCm = Math.hypot(p.probeXcm, p.probeYcm);
  return { p: pmag, torque, energy, forceNet: 0, period, Ex, Ey, Emag, rCm };
}

// ============================================================
// Potencial elétrico e equipotenciais
// ============================================================
export type PotentialPreset = "single" | "dipole" | "twoEqual" | "quadrupole";

export interface PointCharge { x: number; y: number; q: number } // m, m, C

export interface PotentialParams {
  preset: PotentialPreset;
  qNc: number;        // nC — magnitude base de cada carga
  sepCm: number;      // cm — separação característica
  probeXcm: number;
  probeYcm: number;
  showField: boolean; // mostrar setas de E
  showEquip: boolean; // mostrar equipotenciais
  numLevels: number;  // nº de equipotenciais por sinal
}

export interface PotentialDerived {
  V: number;          // V no ponto de prova
  Ex: number;         // V/m
  Ey: number;
  Emag: number;
  charges: PointCharge[];
}

export function buildCharges(p: PotentialParams): PointCharge[] {
  const q = p.qNc * 1e-9;
  const s = Math.max(1e-4, p.sepCm * 1e-2);
  switch (p.preset) {
    case "single":
      return [{ x: 0, y: 0, q }];
    case "dipole":
      return [
        { x: -s / 2, y: 0, q: +q },
        { x: +s / 2, y: 0, q: -q },
      ];
    case "twoEqual":
      return [
        { x: -s / 2, y: 0, q: +q },
        { x: +s / 2, y: 0, q: +q },
      ];
    case "quadrupole":
      return [
        { x: -s / 2, y: -s / 2, q: +q },
        { x: +s / 2, y: +s / 2, q: +q },
        { x: -s / 2, y: +s / 2, q: -q },
        { x: +s / 2, y: -s / 2, q: -q },
      ];
  }
}

export function potentialAt(charges: PointCharge[], x: number, y: number): number {
  const k = 1 / (4 * Math.PI * EPSILON_0);
  let V = 0;
  for (const c of charges) {
    const r = Math.hypot(x - c.x, y - c.y);
    if (r < 1e-4) continue;
    V += (k * c.q) / r;
  }
  return V;
}

export function fieldAt(charges: PointCharge[], x: number, y: number): { Ex: number; Ey: number } {
  const k = 1 / (4 * Math.PI * EPSILON_0);
  let Ex = 0, Ey = 0;
  for (const c of charges) {
    const dx = x - c.x, dy = y - c.y;
    const r = Math.hypot(dx, dy);
    if (r < 1e-4) continue;
    const f = (k * c.q) / (r * r * r);
    Ex += f * dx; Ey += f * dy;
  }
  return { Ex, Ey };
}

export function computePotential(p: PotentialParams): PotentialDerived {
  const charges = buildCharges(p);
  const x = p.probeXcm * 1e-2, y = p.probeYcm * 1e-2;
  const V = potentialAt(charges, x, y);
  const { Ex, Ey } = fieldAt(charges, x, y);
  return { V, Ex, Ey, Emag: Math.hypot(Ex, Ey), charges };
}

// ===== Double-slit diffraction & interference =====

export interface DoubleSlitParams {
  wavelengthNm: number;   // λ in nm
  slitSepUm: number;      // d in µm (center-to-center)
  slitWidthUm: number;    // a in µm
  screenDistanceM: number;// L in meters
  numSlits: number;       // N (1 = single slit, 2 = Young, >2 = grating)
  showEnvelope: boolean;  // overlay single-slit envelope
  probeMm: number;        // y on screen in mm
}

export interface DoubleSlitDerived {
  fringeSpacingMm: number;    // Δy = λL/d (small angle)
  centralWidthMm: number;     // 2 λ L / a (single-slit central peak full width)
  intensityAtProbe: number;   // normalized [0..1]
  angleAtProbeRad: number;
  firstMaxOrder: number;      // largest m with d sinθ ≤ d (i.e., |m| ≤ d/λ)
  numVisibleFringes: number;  // fringes inside central envelope (~ 2 d/a − 1)
}

/** Normalized intensity I(θ)/I₀ for N coherent equal slits of width a, separation d.
 *  I(θ) = [sin(Nφ)/Nsinφ]² · [sin(α)/α]²,
 *  with α = π a sinθ / λ, φ = π d sinθ / λ.
 */
export function dsIntensity(theta: number, lambda: number, a: number, d: number, N: number): number {
  const s = Math.sin(theta);
  const alpha = (Math.PI * a * s) / lambda;
  const phi = (Math.PI * d * s) / lambda;
  const single = Math.abs(alpha) < 1e-9 ? 1 : Math.pow(Math.sin(alpha) / alpha, 2);
  let multi = 1;
  if (N > 1) {
    const denom = Math.sin(phi);
    multi = Math.abs(denom) < 1e-9
      ? 1
      : Math.pow(Math.sin(N * phi) / (N * denom), 2);
  }
  return single * multi;
}

/** Single-slit envelope only (for overlay). */
export function dsEnvelope(theta: number, lambda: number, a: number): number {
  const alpha = (Math.PI * a * Math.sin(theta)) / lambda;
  return Math.abs(alpha) < 1e-9 ? 1 : Math.pow(Math.sin(alpha) / alpha, 2);
}

export function computeDoubleSlit(p: DoubleSlitParams): DoubleSlitDerived {
  const lambda = p.wavelengthNm * 1e-9;
  const a = p.slitWidthUm * 1e-6;
  const d = p.slitSepUm * 1e-6;
  const L = p.screenDistanceM;
  const N = Math.max(1, Math.round(p.numSlits));
  const yProbe = p.probeMm * 1e-3;
  const theta = Math.atan2(yProbe, L);
  const I = N > 1 ? dsIntensity(theta, lambda, a, d, N) : dsEnvelope(theta, lambda, a);
  const fringe = (lambda * L) / d;
  const centralWidth = (2 * lambda * L) / a;
  return {
    fringeSpacingMm: fringe * 1e3,
    centralWidthMm: centralWidth * 1e3,
    intensityAtProbe: I,
    angleAtProbeRad: theta,
    firstMaxOrder: Math.floor(d / lambda),
    numVisibleFringes: Math.max(1, 2 * Math.floor(d / a) - 1),
  };
}

/** Approximate visible-light wavelength → sRGB color (for canvas rendering). */
export function wavelengthToRgb(nm: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780) { r = 1; }
  let factor = 1;
  if (nm < 420) factor = 0.3 + 0.7 * (nm - 380) / 40;
  else if (nm > 700) factor = 0.3 + 0.7 * (780 - nm) / 80;
  const adj = (c: number) => Math.round(255 * Math.pow(Math.max(0, c) * factor, 0.8));
  return [adj(r), adj(g), adj(b)];
}

// ===== Projectile motion (with optional drag) =====

export const GRAVITY: Record<string, number> = {
  "Terra": 9.80665,
  "Lua": 1.62,
  "Marte": 3.711,
  "Júpiter": 24.79,
  "Sem gravidade": 0,
};

export type DragModel = "none" | "linear" | "quadratic";

export interface ProjectileParams {
  speed: number;        // m/s — initial speed v0
  angleDeg: number;     // launch angle in degrees
  height: number;       // m — initial height h0
  mass: number;         // kg
  gravity: number;      // m/s² (positive value, applied as -g)
  drag: DragModel;
  dragCoef: number;     // for linear: b (kg/s); for quadratic: c (kg/m). Effective only if drag != none
}

export interface ProjectilePoint { t: number; x: number; y: number; vx: number; vy: number }

export interface ProjectileResults {
  trajectory: ProjectilePoint[];
  range: number;          // m (x at impact)
  maxHeight: number;      // m
  flightTime: number;     // s
  impactSpeed: number;    // m/s
  impactAngleDeg: number; // ° (below horizontal, positive)
  apexTime: number;       // s
  // Vacuum reference values (no drag) for comparison
  vacuumRange: number;
  vacuumMaxHeight: number;
  vacuumFlightTime: number;
}

/** Numerical integrator (RK4) for projectile with optional drag. Returns full trajectory. */
export function simulateProjectile(p: ProjectileParams): ProjectileResults {
  const rad = (p.angleDeg * Math.PI) / 180;
  const vx0 = p.speed * Math.cos(rad);
  const vy0 = p.speed * Math.sin(rad);
  const g = Math.max(0, p.gravity);
  const m = Math.max(1e-6, p.mass);

  const accel = (vx: number, vy: number): [number, number] => {
    let ax = 0, ay = -g;
    if (p.drag === "linear" && p.dragCoef > 0) {
      ax += -(p.dragCoef / m) * vx;
      ay += -(p.dragCoef / m) * vy;
    } else if (p.drag === "quadratic" && p.dragCoef > 0) {
      const v = Math.hypot(vx, vy);
      ax += -(p.dragCoef / m) * v * vx;
      ay += -(p.dragCoef / m) * v * vy;
    }
    return [ax, ay];
  };

  // Adaptive-ish dt based on flight scale
  const tVacuum = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * Math.max(0, p.height))) / Math.max(g, 1e-6);
  const dt = Math.max(1e-4, Math.min(0.02, (g > 0 ? tVacuum : 10) / 1500));
  const tMax = (g > 0 ? tVacuum : 10) * 4 + 5;

  const traj: ProjectilePoint[] = [];
  let t = 0, x = 0, y = p.height, vx = vx0, vy = vy0;
  let maxY = y, apexT = 0;
  traj.push({ t, x, y, vx, vy });

  while (t < tMax) {
    const [k1ax, k1ay] = accel(vx, vy);
    const [k2ax, k2ay] = accel(vx + 0.5 * dt * k1ax, vy + 0.5 * dt * k1ay);
    const [k3ax, k3ay] = accel(vx + 0.5 * dt * k2ax, vy + 0.5 * dt * k2ay);
    const [k4ax, k4ay] = accel(vx + dt * k3ax, vy + dt * k3ay);
    const nvx = vx + (dt / 6) * (k1ax + 2 * k2ax + 2 * k3ax + k4ax);
    const nvy = vy + (dt / 6) * (k1ay + 2 * k2ay + 2 * k3ay + k4ay);
    const nx = x + (dt / 6) * (vx + 2 * (vx + 0.5 * dt * k1ax) + 2 * (vx + 0.5 * dt * k2ax) + (vx + dt * k3ax));
    const ny = y + (dt / 6) * (vy + 2 * (vy + 0.5 * dt * k1ay) + 2 * (vy + 0.5 * dt * k2ay) + (vy + dt * k3ay));

    if (ny <= 0 && y > 0) {
      // Linear interpolation to ground
      const frac = y / (y - ny);
      const tImp = t + frac * dt;
      const xImp = x + frac * (nx - x);
      const vxImp = vx + frac * (nvx - vx);
      const vyImp = vy + frac * (nvy - vy);
      traj.push({ t: tImp, x: xImp, y: 0, vx: vxImp, vy: vyImp });
      x = xImp; y = 0; vx = vxImp; vy = vyImp; t = tImp;
      break;
    }
    x = nx; y = ny; vx = nvx; vy = nvy; t += dt;
    if (y > maxY) { maxY = y; apexT = t; }
    traj.push({ t, x, y, vx, vy });
    if (g === 0 && x > 1e6) break;
  }

  const last = traj[traj.length - 1];
  const impactSpeed = Math.hypot(last.vx, last.vy);
  const impactAngleDeg = (Math.atan2(-last.vy, Math.abs(last.vx)) * 180) / Math.PI;

  // Vacuum reference (analytical)
  const vTflight = g > 0
    ? (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * Math.max(0, p.height))) / g
    : 0;
  const vRange = vx0 * vTflight;
  const vMaxH = p.height + (vy0 > 0 ? (vy0 * vy0) / (2 * Math.max(g, 1e-9)) : 0);

  return {
    trajectory: traj,
    range: last.x,
    maxHeight: maxY,
    flightTime: last.t,
    impactSpeed,
    impactAngleDeg,
    apexTime: apexT,
    vacuumRange: vRange,
    vacuumMaxHeight: vMaxH,
    vacuumFlightTime: vTflight,
  };
}

// ===== Simple pendulum (linear + nonlinear, with damping) =====

export interface PendulumParams {
  length: number;         // L (m)
  mass: number;           // m (kg)
  gravity: number;        // g (m/s²)
  angle0Deg: number;      // initial angular displacement θ₀ (degrees)
  omega0: number;         // initial angular velocity θ̇₀ (rad/s)
  damping: number;        // b (kg/s) — viscous torque coefficient (γ = b/m)
  duration: number;       // total simulated time (s)
  nonlinear: boolean;     // true: use sin θ ; false: small-angle approximation
}

export interface PendulumPoint {
  t: number;
  theta: number;          // rad
  omega: number;          // rad/s
  energy: number;         // J (referenced to lowest point)
}

export interface PendulumResults {
  series: PendulumPoint[];
  periodSmallAngle: number;   // T₀ = 2π√(L/g)
  periodMeasured: number | null; // from zero crossings (rad sign change), null if undamped period not detectable
  periodLargeAngle: number;   // T₀ · (1 + θ₀²/16) approximation
  initialEnergy: number;
  finalEnergy: number;
  maxOmega: number;
  amplitudeDeg: number;       // |θ₀| in degrees
  qualityFactor: number | null; // Q = ω₀ m / b   (only when damping > 0)
}

export function simulatePendulum(p: PendulumParams): PendulumResults {
  const L = Math.max(p.length, 1e-3);
  const m = Math.max(p.mass, 1e-3);
  const g = Math.max(p.gravity, 0);
  const gamma = p.damping / m; // 1/s
  const theta0 = (p.angle0Deg * Math.PI) / 180;
  const w0Sys = Math.sqrt(g / L); // natural angular frequency

  const energyOf = (th: number, om: number) => {
    const Ek = 0.5 * m * L * L * om * om;
    const Ep = p.nonlinear
      ? m * g * L * (1 - Math.cos(th))
      : 0.5 * m * g * L * th * th;
    return Ek + Ep;
  };

  // RK4 integrator
  const accel = (th: number, om: number) => {
    const restoring = p.nonlinear ? -(g / L) * Math.sin(th) : -(g / L) * th;
    return restoring - gamma * om;
  };

  const dt = Math.min(0.005, Math.max(1e-4, (2 * Math.PI) / w0Sys / 200));
  const N = Math.max(10, Math.floor(p.duration / dt));
  const series: PendulumPoint[] = [];
  let th = theta0;
  let om = p.omega0;
  let t = 0;
  let maxOm = Math.abs(om);
  series.push({ t, theta: th, omega: om, energy: energyOf(th, om) });

  // Track zero crossings of theta (with negative-going) for period
  const crossings: number[] = [];
  let prevTh = th;

  for (let i = 0; i < N; i++) {
    const k1th = om;
    const k1om = accel(th, om);
    const k2th = om + 0.5 * dt * k1om;
    const k2om = accel(th + 0.5 * dt * k1th, om + 0.5 * dt * k1om);
    const k3th = om + 0.5 * dt * k2om;
    const k3om = accel(th + 0.5 * dt * k2th, om + 0.5 * dt * k2om);
    const k4th = om + dt * k3om;
    const k4om = accel(th + dt * k3th, om + dt * k3om);
    const newTh = th + (dt / 6) * (k1th + 2 * k2th + 2 * k3th + k4th);
    const newOm = om + (dt / 6) * (k1om + 2 * k2om + 2 * k3om + k4om);

    // Detect sign change (positive -> negative crossing, full period between two such)
    if (prevTh > 0 && newTh <= 0) {
      const frac = prevTh / (prevTh - newTh);
      crossings.push(t + frac * dt);
    }
    prevTh = newTh;

    th = newTh; om = newOm; t += dt;
    if (Math.abs(om) > maxOm) maxOm = Math.abs(om);
    series.push({ t, theta: th, omega: om, energy: energyOf(th, om) });
  }

  const periodSmallAngle = (2 * Math.PI) / w0Sys;
  const periodLargeAngle = periodSmallAngle * (1 + (theta0 * theta0) / 16);
  let periodMeasured: number | null = null;
  if (crossings.length >= 2) {
    const diffs: number[] = [];
    for (let i = 1; i < crossings.length; i++) diffs.push(crossings[i] - crossings[i - 1]);
    periodMeasured = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  }

  const qualityFactor = p.damping > 0 ? (w0Sys * m) / p.damping : null;

  return {
    series,
    periodSmallAngle,
    periodMeasured,
    periodLargeAngle,
    initialEnergy: series[0].energy,
    finalEnergy: series[series.length - 1].energy,
    maxOmega: maxOm,
    amplitudeDeg: Math.abs(p.angle0Deg),
    qualityFactor,
  };
}

// ===== Ideal gas (PVT) =====

export const R_GAS = 8.314462618; // J/(mol·K)

export type GasProcess = "isothermal" | "isobaric" | "isochoric" | "adiabatic";

export interface IdealGasParams {
  process: GasProcess;
  moles: number;        // n (mol)
  gamma: number;        // Cp/Cv (e.g. 5/3 monoatômico, 7/5 diatômico)
  T1: number;           // K (estado inicial)
  V1: number;           // L (estado inicial)
  V2: number;           // L (estado final, usado em isotérmico/isobárico/adiabático)
  T2: number;           // K (estado final, usado em isocórico)
  steps: number;        // n° de pontos no caminho
}

export interface GasStatePoint { V: number; P: number; T: number }

export interface IdealGasResults {
  P1: number;           // Pa (calculado)
  P2: number;           // Pa
  T2: number;           // K (final, recalculado conforme processo)
  V2: number;           // L (final, recalculado conforme processo)
  work: number;         // J (W realizado pelo gás)
  heat: number;         // J (Q absorvido pelo gás)
  deltaU: number;       // J (variação de energia interna)
  deltaS: number;       // J/K (variação de entropia)
  cv: number;           // J/(mol·K)
  cp: number;           // J/(mol·K)
  path: GasStatePoint[];
}

// Volume in L → m³ conversion factor
const L_TO_M3 = 1e-3;

export function simulateIdealGas(p: IdealGasParams): IdealGasResults {
  const n = Math.max(p.moles, 1e-6);
  const gamma = Math.max(p.gamma, 1.01);
  const cv = R_GAS / (gamma - 1);
  const cp = cv + R_GAS;
  const T1 = Math.max(p.T1, 1);
  const V1m = Math.max(p.V1, 1e-6) * L_TO_M3;
  const P1 = (n * R_GAS * T1) / V1m;

  let V2m: number, T2: number, P2: number;

  switch (p.process) {
    case "isothermal": {
      T2 = T1;
      V2m = Math.max(p.V2, 1e-6) * L_TO_M3;
      P2 = (n * R_GAS * T2) / V2m;
      break;
    }
    case "isobaric": {
      P2 = P1;
      V2m = Math.max(p.V2, 1e-6) * L_TO_M3;
      T2 = (P2 * V2m) / (n * R_GAS);
      break;
    }
    case "isochoric": {
      V2m = V1m;
      T2 = Math.max(p.T2, 1);
      P2 = (n * R_GAS * T2) / V2m;
      break;
    }
    case "adiabatic": {
      V2m = Math.max(p.V2, 1e-6) * L_TO_M3;
      // PV^γ = const, TV^(γ-1) = const
      P2 = P1 * Math.pow(V1m / V2m, gamma);
      T2 = T1 * Math.pow(V1m / V2m, gamma - 1);
      break;
    }
  }

  // Trabalho, calor, ΔU, ΔS
  let W = 0, Q = 0, dU = 0, dS = 0;
  switch (p.process) {
    case "isothermal":
      W = n * R_GAS * T1 * Math.log(V2m / V1m);
      Q = W;
      dU = 0;
      dS = n * R_GAS * Math.log(V2m / V1m);
      break;
    case "isobaric":
      W = P1 * (V2m - V1m);
      dU = n * cv * (T2 - T1);
      Q = n * cp * (T2 - T1);
      dS = n * cp * Math.log(T2 / T1);
      break;
    case "isochoric":
      W = 0;
      dU = n * cv * (T2 - T1);
      Q = dU;
      dS = n * cv * Math.log(T2 / T1);
      break;
    case "adiabatic":
      W = (P1 * V1m - P2 * V2m) / (gamma - 1);
      Q = 0;
      dU = -W;
      dS = 0;
      break;
  }

  // Caminho no plano P–V (e T)
  const N = Math.max(20, Math.min(400, p.steps | 0));
  const path: GasStatePoint[] = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    let Vm: number, Pp: number, Tp: number;
    switch (p.process) {
      case "isochoric": {
        Vm = V1m;
        Tp = T1 + s * (T2 - T1);
        Pp = (n * R_GAS * Tp) / Vm;
        break;
      }
      case "isothermal": {
        Vm = V1m + s * (V2m - V1m);
        Tp = T1;
        Pp = (n * R_GAS * Tp) / Vm;
        break;
      }
      case "isobaric": {
        Vm = V1m + s * (V2m - V1m);
        Pp = P1;
        Tp = (Pp * Vm) / (n * R_GAS);
        break;
      }
      case "adiabatic": {
        Vm = V1m + s * (V2m - V1m);
        Pp = P1 * Math.pow(V1m / Vm, gamma);
        Tp = T1 * Math.pow(V1m / Vm, gamma - 1);
        break;
      }
    }
    path.push({ V: Vm / L_TO_M3, P: Pp, T: Tp });
  }

  return {
    P1, P2, T2, V2: V2m / L_TO_M3,
    work: W, heat: Q, deltaU: dU, deltaS: dS,
    cv, cp, path,
  };
}

// ===== Thin lens / geometric optics =====

export type LensShape = "biconvex" | "planoconvex" | "biconcave" | "planoconcave" | "custom";

export interface ThinLensParams {
  mode: "focal" | "lensmaker";   // como definir f
  focalCm: number;                // f em cm (mode = focal). +converging, -diverging
  shape: LensShape;
  R1cm: number;                   // raio 1 em cm (modo lensmaker)
  R2cm: number;                   // raio 2 em cm
  nLens: number;                  // índice de refração do vidro
  nMedium: number;                // índice do meio
  objectDistanceCm: number;       // d_o (cm, positivo para objeto real à esquerda)
  objectHeightCm: number;         // h_o (cm)
}

export interface ThinLensResults {
  focalCm: number;                // f efetivo (cm)
  imageDistanceCm: number | null; // d_i (cm) — null se objeto exatamente no foco
  imageHeightCm: number | null;   // h_i (cm)
  magnification: number | null;   // m = -d_i/d_o
  imageType: "real" | "virtual" | "no-image";
  orientation: "ereta" | "invertida" | "—";
  size: "ampliada" | "reduzida" | "do mesmo tamanho" | "—";
  power: number;                  // 1/f em dioptrias (f em metros)
  isConverging: boolean;
}

export function computeThinLens(p: ThinLensParams): ThinLensResults {
  // Determina f
  let f: number;
  if (p.mode === "focal") {
    f = p.focalCm;
  } else {
    // 1/f = (n_lens/n_meio - 1) * (1/R1 - 1/R2)
    const nrel = p.nLens / Math.max(p.nMedium, 1e-6) - 1;
    const r1 = p.R1cm === 0 ? Infinity : p.R1cm;
    const r2 = p.R2cm === 0 ? Infinity : p.R2cm;
    const inv = nrel * (1 / r1 - 1 / r2);
    f = inv === 0 ? Infinity : 1 / inv;
  }

  const dO = p.objectDistanceCm;
  const ho = p.objectHeightCm;
  let di: number | null = null;
  let hi: number | null = null;
  let m: number | null = null;
  let imageType: ThinLensResults["imageType"] = "no-image";
  let orientation: ThinLensResults["orientation"] = "—";
  let size: ThinLensResults["size"] = "—";

  if (Math.abs(dO - f) < 1e-6 || !isFinite(f)) {
    // objeto no foco → imagem no infinito
    imageType = "no-image";
  } else if (dO !== 0) {
    // 1/f = 1/dO + 1/di → di = 1 / (1/f - 1/dO)
    di = 1 / (1 / f - 1 / dO);
    m = -di / dO;
    hi = m * ho;
    imageType = di > 0 ? "real" : "virtual";
    orientation = m < 0 ? "invertida" : "ereta";
    const am = Math.abs(m);
    size = am > 1.0001 ? "ampliada" : am < 0.9999 ? "reduzida" : "do mesmo tamanho";
  }

  const power = isFinite(f) && f !== 0 ? 1 / (f / 100) : 0; // dioptrias

  return {
    focalCm: f,
    imageDistanceCm: di,
    imageHeightCm: hi,
    magnification: m,
    imageType,
    orientation,
    size,
    power,
    isConverging: f > 0,
  };
}

// ===== 1D Collisions (linear momentum) =====

export interface CollisionParams {
  m1: number;        // kg
  m2: number;        // kg
  u1: number;        // m/s (velocidade inicial do corpo 1)
  u2: number;        // m/s (velocidade inicial do corpo 2)
  e: number;         // coeficiente de restituição (0..1)
  x1_0: number;      // m (posição inicial do corpo 1)
  x2_0: number;      // m (posição inicial do corpo 2)
  r1: number;        // m (raio do corpo 1)
  r2: number;        // m (raio do corpo 2)
  duration: number;  // s
}

export interface CollisionResults {
  v1: number; v2: number;                       // velocidades finais (após colisão)
  p_before: number; p_after: number;            // momento total
  ke_before: number; ke_after: number;          // energias cinéticas
  ke_lost: number;                              // calor/deformação
  vcm: number;                                  // velocidade do centro de massa
  impulse: number;                              // J = m1·(v1-u1)
  collisionTime: number | null;                 // s — quando ocorre o contato
  collided: boolean;
  series: { t: number; x1: number; x2: number; v1: number; v2: number; ke: number; p: number }[];
}

export function simulateCollision(p: CollisionParams): CollisionResults {
  const { m1, m2, u1, u2, e, x1_0, x2_0, r1, r2, duration } = p;
  const M = m1 + m2;
  const vcm = (m1 * u1 + m2 * u2) / M;

  // Velocidades pós-colisão (modelo 1D com coef. de restituição)
  const v1f = ((m1 - e * m2) * u1 + (1 + e) * m2 * u2) / M;
  const v2f = ((m2 - e * m1) * u2 + (1 + e) * m1 * u1) / M;

  const p_before = m1 * u1 + m2 * u2;
  const p_after = m1 * v1f + m2 * v2f;
  const ke_before = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
  const ke_after = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;

  // Tempo até o contato: x1 + r1 + (u1)t == x2 - r2 + (u2)t → t = (x2 - x1 - r1 - r2)/(u1 - u2)
  const gap = x2_0 - x1_0 - r1 - r2;
  const rel = u1 - u2;
  let tc: number | null = null;
  if (rel > 1e-9 && gap > 0) tc = gap / rel;
  else if (rel > 1e-9 && gap <= 0) tc = 0; // já em contato

  // Para colisão completamente inelástica, os corpos seguem juntos (mesma velocidade)
  const series: CollisionResults["series"] = [];
  const N = 600;
  const dt = duration / N;
  for (let i = 0; i <= N; i++) {
    const t = i * dt;
    let x1: number, x2: number, vv1: number, vv2: number;
    if (tc === null || t < tc) {
      x1 = x1_0 + u1 * t;
      x2 = x2_0 + u2 * t;
      vv1 = u1; vv2 = u2;
    } else {
      const dtc = t - tc;
      const xc1 = x1_0 + u1 * tc;
      const xc2 = x2_0 + u2 * tc;
      x1 = xc1 + v1f * dtc;
      x2 = xc2 + v2f * dtc;
      vv1 = v1f; vv2 = v2f;
    }
    const ke = 0.5 * m1 * vv1 * vv1 + 0.5 * m2 * vv2 * vv2;
    const pp = m1 * vv1 + m2 * vv2;
    series.push({ t, x1, x2, v1: vv1, v2: vv2, ke, p: pp });
  }

  return {
    v1: v1f, v2: v2f,
    p_before, p_after,
    ke_before, ke_after,
    ke_lost: ke_before - ke_after,
    vcm,
    impulse: m1 * (v1f - u1),
    collisionTime: tc,
    collided: tc !== null && tc <= duration,
    series,
  };
}

// =====================
// EXP-21: Ondas estacionárias em corda
// =====================
export type StringBoundary = "fixed-fixed" | "fixed-free";

export interface StandingWaveParams {
  L: number;            // comprimento da corda (m)
  T: number;            // tração (N)
  mu: number;           // densidade linear (kg/m)
  mode: number;         // modo n (1, 2, 3, ...)
  amplitude: number;    // amplitude (m)
  boundary: StringBoundary;
  damping: number;      // 0..1 (amortecimento por ciclo, visual)
  xSamples?: number;    // pontos na corda
}

export interface StandingWaveResults {
  v: number;            // velocidade da onda (m/s)
  k: number;            // número de onda (rad/m)
  omega: number;        // frequência angular (rad/s)
  wavelength: number;   // λ (m)
  frequency: number;    // f (Hz)
  period: number;       // T (s)
  energy: number;       // energia média por unidade de massa total (J)
  nodes: number[];      // posições dos nós (m)
  antinodes: number[];  // posições dos ventres (m)
  shape: { x: number; y: number }[];     // snapshot atual y(x)
  envelope: { x: number; yPos: number; yNeg: number }[]; // ±|A sin kx|
  modeTable: { n: number; f: number; wavelength: number }[]; // primeiros modos
}

export function computeStandingWave(p: StandingWaveParams, time = 0): StandingWaveResults {
  const { L, T, mu, mode, amplitude, boundary, damping } = p;
  const N = Math.max(64, Math.min(800, p.xSamples ?? 200));
  const v = Math.sqrt(T / mu);

  let wavelength: number;
  let k: number;
  let frequency: number;
  if (boundary === "fixed-fixed") {
    wavelength = (2 * L) / mode;
    k = (mode * Math.PI) / L;
    frequency = (mode * v) / (2 * L);
  } else {
    // fixed-free: n = 1,3,5,... → usar (2n-1)
    const m = 2 * mode - 1;
    wavelength = (4 * L) / m;
    k = (m * Math.PI) / (2 * L);
    frequency = (m * v) / (4 * L);
  }
  const omega = 2 * Math.PI * frequency;
  const period = 1 / frequency;

  // amortecimento exponencial visual: A(t) = A0 e^(-α t), α tal que após 1 ciclo cai por damping
  const alpha = damping > 0 ? -Math.log(1 - Math.min(0.95, damping)) * frequency : 0;
  const Aeff = amplitude * Math.exp(-alpha * time);

  const shape: { x: number; y: number }[] = [];
  const envelope: { x: number; yPos: number; yNeg: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * L;
    const spatial = Math.sin(k * x);
    const y = Aeff * spatial * Math.cos(omega * time);
    shape.push({ x, y });
    const env = amplitude * Math.abs(spatial);
    envelope.push({ x, yPos: env, yNeg: -env });
  }

  // Nós: onde sin(kx)=0
  const nodes: number[] = [];
  const antinodes: number[] = [];
  if (boundary === "fixed-fixed") {
    for (let n = 0; n <= mode; n++) nodes.push((n * L) / mode);
    for (let n = 0; n < mode; n++) antinodes.push(((n + 0.5) * L) / mode);
  } else {
    const m = 2 * mode - 1;
    // nós em x = 2jL/m, j = 0..(m-1)/2 (até <= L)
    for (let j = 0; (2 * j * L) / m <= L + 1e-9; j++) nodes.push((2 * j * L) / m);
    // ventres em x = (2j+1)L/m
    for (let j = 0; ((2 * j + 1) * L) / m <= L + 1e-9; j++) antinodes.push(((2 * j + 1) * L) / m);
  }

  // Energia média de uma onda estacionária num modo: <E> = (1/4) μ L ω² A²
  const energy = 0.25 * mu * L * omega * omega * amplitude * amplitude;

  // Tabela dos 6 primeiros modos
  const modeTable: { n: number; f: number; wavelength: number }[] = [];
  for (let n = 1; n <= 6; n++) {
    if (boundary === "fixed-fixed") {
      modeTable.push({ n, f: (n * v) / (2 * L), wavelength: (2 * L) / n });
    } else {
      const m = 2 * n - 1;
      modeTable.push({ n, f: (m * v) / (4 * L), wavelength: (4 * L) / m });
    }
  }

  return { v, k, omega, wavelength, frequency, period, energy, nodes, antinodes, shape, envelope, modeTable };
}

// ===== Calorimetria e mudanças de fase =====

export interface CalorimetryParams {
  // água no calorímetro
  mWater: number;       // kg
  TWater: number;       // °C
  // sólido quente
  mSolid: number;       // kg
  TSolid: number;       // °C
  cSolid: number;       // J/(kg·K)
  solidName: string;
  // gelo opcional
  mIce: number;         // kg (0 desativa)
  // calorímetro (capacidade térmica)
  CCal: number;         // J/K
  TCal: number;         // °C (assume = TWater)
  // tempo simulado
  tauSeconds: number;   // constante de tempo para aproximação exponencial ao equilíbrio
}

export interface CalorimetryResults {
  Tf: number;                 // °C equilíbrio
  meltedFraction: number;     // 0..1 do gelo que derreteu
  remainingIce: number;       // kg de gelo restante
  qWater: number;             // J recebido pela água+calorímetro do estado inicial até Tf
  qSolid: number;             // J cedido pelo sólido (negativo se esfria)
  qIce: number;               // J recebido pelo gelo (fusão + aquecimento)
  energyBalance: number;      // J — resíduo (~0 indica conservação)
  scenario: "no-ice" | "all-melt" | "partial-melt" | "all-freeze";
  series: { t: number; TWater: number; TSolid: number; TIce: number }[];
  // constantes usadas
  cWater: number;             // J/(kg·K)
  Lf: number;                 // J/kg (fusão da água)
}

export const C_WATER = 4186;     // J/(kg·K)
export const C_ICE = 2090;       // J/(kg·K)
export const LF_WATER = 334000;  // J/kg

/**
 * Resolve o equilíbrio térmico de: água (líquida, Tw) + calorímetro (CCal, Tw)
 * + sólido quente (mSolid, cSolid, TSolid) + gelo a 0°C (mIce).
 * Convenção: Q recebido > 0. Soma de calores = 0.
 */
export function computeCalorimetry(p: CalorimetryParams): CalorimetryResults {
  const cw = C_WATER;
  const Lf = LF_WATER;
  const Cw = p.mWater * cw + p.CCal;     // capacidade térmica da água+calorímetro
  const Cs = p.mSolid * p.cSolid;
  const mi = Math.max(0, p.mIce);

  // Caso sem gelo: Cw·(Tf - Tw) + Cs·(Tf - Ts) = 0
  const TfNoIce = (Cw * p.TWater + Cs * p.TSolid) / (Cw + Cs);

  let Tf = TfNoIce;
  let scenario: CalorimetryResults["scenario"] = "no-ice";
  let meltedFraction = 0;
  let remainingIce = mi;

  if (mi > 1e-9) {
    // Energia disponível (assumindo Tf=0°C) que o sistema água+sólido cede ao baixar para 0:
    const QtoZero = Cw * (p.TWater - 0) + Cs * (p.TSolid - 0); // J
    const QmeltAll = mi * Lf;

    if (QtoZero <= 0) {
      // sistema já está em ou abaixo de 0; o gelo não derrete (e parte da água congela em situações reais).
      // Para simplificação tratamos como "all-freeze" parcial: Tf = 0 e nada derrete.
      Tf = 0;
      scenario = "all-freeze";
      meltedFraction = 0;
      remainingIce = mi;
    } else if (QtoZero < QmeltAll) {
      // não há energia suficiente para derreter todo o gelo => Tf = 0 e parte do gelo derrete
      Tf = 0;
      const melted = QtoZero / Lf;
      meltedFraction = melted / mi;
      remainingIce = mi - melted;
      scenario = "partial-melt";
    } else {
      // todo gelo derrete; depois mistura como água a 0°C com massa mi
      // Balanço: Cw·(Tf - Tw) + Cs·(Tf - Ts) + mi·Lf + mi·cw·(Tf - 0) = 0
      Tf = (Cw * p.TWater + Cs * p.TSolid - mi * Lf) / (Cw + Cs + mi * cw);
      meltedFraction = 1;
      remainingIce = 0;
      scenario = "all-melt";
    }
  }

  // Calores (estado inicial -> estado final)
  const qWater = Cw * (Tf - p.TWater);
  const qSolid = Cs * (Tf - p.TSolid);
  let qIce = 0;
  if (mi > 0) {
    if (scenario === "partial-melt") {
      qIce = (mi - remainingIce) * Lf; // só fusão
    } else if (scenario === "all-melt") {
      qIce = mi * Lf + mi * cw * (Tf - 0);
    } else if (scenario === "all-freeze") {
      qIce = 0;
    }
  }
  const energyBalance = qWater + qSolid + qIce;

  // Série temporal: aproximação exponencial de cada corpo ao equilíbrio
  const tau = Math.max(0.1, p.tauSeconds);
  const tMax = tau * 5;
  const N = 120;
  const series: { t: number; TWater: number; TSolid: number; TIce: number }[] = [];
  const Tice0 = mi > 0 ? 0 : Tf;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * tMax;
    const k = 1 - Math.exp(-t / tau);
    series.push({
      t,
      TWater: p.TWater + (Tf - p.TWater) * k,
      TSolid: p.TSolid + (Tf - p.TSolid) * k,
      TIce: Tice0 + (Tf - Tice0) * k,
    });
  }

  return {
    Tf, meltedFraction, remainingIce,
    qWater, qSolid, qIce, energyBalance,
    scenario, series, cWater: cw, Lf,
  };
}

// =============================================================
// Transitório LR / RLC série — resposta a degrau e descarga
// =============================================================

export type TransientMode = "LR" | "RLC";
export type TransientPhase = "step" | "discharge";
export type TransientRegime = "underdamped" | "critical" | "overdamped" | "lr";

export interface TransientParams {
  mode: TransientMode;
  phase: TransientPhase;
  V0: number;       // V (tensão da fonte aplicada no degrau)
  R: number;        // Ω
  L: number;        // H
  C: number;        // F (usado em RLC)
  I_init: number;   // A (corrente inicial em t=0)
  Vc_init: number;  // V (tensão inicial no capacitor — RLC)
  tMax: number;     // s — janela de simulação
}

export interface TransientSample {
  t: number;
  i: number;        // corrente (A)
  vR: number;
  vL: number;
  vC: number;       // 0 em LR
  energyL: number;  // ½ L i²
  energyC: number;  // ½ C v_C²
}

export interface TransientResults {
  regime: TransientRegime;
  tau: number;              // L/R (LR) ou 1/α (RLC)
  alpha: number;            // R/(2L)
  omega0: number;           // 1/√(LC) (RLC) — 0 em LR
  omegaD: number;           // ωd se subamortecido
  zeta: number;             // R/2 · √(C/L)
  Q: number;                // ω0 L / R
  fNatural: number;         // ω0/(2π)
  fDamped: number;          // ωd/(2π)
  s1: number;               // raízes características (overdamped)
  s2: number;
  steadyI: number;          // corrente em t→∞
  steadyVc: number;         // tensão no cap em t→∞
  series: TransientSample[];
  i: (t: number) => number;
  vC: (t: number) => number;
}

export function computeTransient(p: TransientParams): TransientResults {
  const { mode, phase, R, L, C } = p;
  const Vsrc = phase === "step" ? p.V0 : 0; // descarga = fonte removida (curto)

  // ---------------- LR ----------------
  if (mode === "LR") {
    const tau = L / R;
    const Iinf = Vsrc / R;
    const I0 = p.I_init;
    const A = I0 - Iinf;
    const i = (t: number) => Iinf + A * Math.exp(-t / tau);
    const vC = (_t: number) => 0;

    const N = 400;
    const series: TransientSample[] = [];
    for (let k = 0; k <= N; k++) {
      const t = (k / N) * p.tMax;
      const it = i(t);
      // dI/dt = -A/τ e^(-t/τ) → vL = L dI/dt
      const di = -A / tau * Math.exp(-t / tau);
      const vL = L * di;
      const vR = R * it;
      series.push({ t, i: it, vR, vL, vC: 0, energyL: 0.5 * L * it * it, energyC: 0 });
    }
    return {
      regime: "lr", tau, alpha: 1 / tau, omega0: 0, omegaD: 0, zeta: Infinity, Q: 0,
      fNatural: 0, fDamped: 0, s1: -1 / tau, s2: -1 / tau,
      steadyI: Iinf, steadyVc: 0, series, i, vC,
    };
  }

  // ---------------- RLC série ----------------
  // L q'' + R q' + q/C = Vsrc, i = q'
  const alpha = R / (2 * L);
  const omega0 = 1 / Math.sqrt(L * C);
  const zeta = alpha / omega0;
  const Q = (omega0 * L) / R;
  const q_inf = C * Vsrc;          // carga de equilíbrio
  const q0 = C * p.Vc_init;
  const i0 = p.I_init;
  const u0 = q0 - q_inf;           // desvio inicial em q

  let i: (t: number) => number;
  let vC: (t: number) => number;
  let regime: TransientRegime;
  let omegaD = 0, s1 = 0, s2 = 0;

  if (Math.abs(zeta - 1) < 1e-6) {
    regime = "critical";
    const A = u0;
    const B = i0 + alpha * A;
    const q = (t: number) => q_inf + (A + B * t) * Math.exp(-alpha * t);
    i = (t: number) => (B - alpha * (A + B * t)) * Math.exp(-alpha * t);
    vC = (t: number) => q(t) / C;
    s1 = s2 = -alpha;
  } else if (zeta < 1) {
    regime = "underdamped";
    omegaD = Math.sqrt(omega0 * omega0 - alpha * alpha);
    const A = u0;
    const B = (i0 + alpha * A) / omegaD;
    const q = (t: number) =>
      q_inf + Math.exp(-alpha * t) * (A * Math.cos(omegaD * t) + B * Math.sin(omegaD * t));
    i = (t: number) => {
      const e = Math.exp(-alpha * t);
      const cos = Math.cos(omegaD * t), sin = Math.sin(omegaD * t);
      return e * ((-alpha) * (A * cos + B * sin) + (-A * omegaD * sin + B * omegaD * cos));
    };
    vC = (t: number) => q(t) / C;
  } else {
    regime = "overdamped";
    const disc = Math.sqrt(alpha * alpha - omega0 * omega0);
    s1 = -alpha + disc;
    s2 = -alpha - disc;
    const A1 = (i0 - s2 * u0) / (s1 - s2);
    const A2 = u0 - A1;
    const q = (t: number) => q_inf + A1 * Math.exp(s1 * t) + A2 * Math.exp(s2 * t);
    i = (t: number) => A1 * s1 * Math.exp(s1 * t) + A2 * s2 * Math.exp(s2 * t);
    vC = (t: number) => q(t) / C;
  }

  const N = 600;
  const series: TransientSample[] = [];
  for (let k = 0; k <= N; k++) {
    const t = (k / N) * p.tMax;
    const it = i(t);
    const vc = vC(t);
    const vr = R * it;
    const vl = Vsrc - vr - vc; // por KVL
    series.push({
      t, i: it, vR: vr, vL: vl, vC: vc,
      energyL: 0.5 * L * it * it,
      energyC: 0.5 * C * vc * vc,
    });
  }

  return {
    regime, tau: 1 / alpha, alpha, omega0, omegaD, zeta, Q,
    fNatural: omega0 / (2 * Math.PI), fDamped: omegaD / (2 * Math.PI),
    s1, s2, steadyI: 0, steadyVc: Vsrc, series, i, vC,
  };
}

// ============================================================================
// EXP-26 · Interferômetro de Michelson
// ============================================================================
// Fonte monocromática extensa → franjas de igual inclinação (anéis concêntricos).
// Com pequena inclinação de um dos espelhos → franjas retilíneas (igual espessura).

export type MichelsonMode = "circular" | "linear";

export interface MichelsonParams {
  mode: MichelsonMode;
  wavelengthNm: number;   // λ em nm
  L1mm: number;           // braço fixo (referência), em mm
  L2mm: number;           // braço móvel M2, em mm
  tiltMrad: number;       // inclinação do espelho (mrad) — só usado em "linear"
  visibility: number;     // 0..1 (contraste; depende de coerência e do divisor)
  screenSizeMm: number;   // tamanho do plano de observação
  apertureMm: number;     // diâmetro útil do feixe (limita raio dos anéis)
}

export interface MichelsonResults {
  lambdaM: number;
  pathDiffM: number;        // Δ = 2·(L2 − L1) (caminho geométrico)
  orderCenter: number;      // m₀ = |Δ|/λ
  centralIntensity: number; // 0..1 (cos² no centro)
  fringeSpacingMm: number;  // em linear: Λ = λ/(2·tilt). Em circular: separação radial típica do anel central.
  numVisibleRings: number;  // estimativa de anéis dentro da abertura
  // mapa 2D de intensidade [0..1] (matriz quadrada gridN×gridN, indexada por linha-major)
  intensityMap: Float32Array;
  gridN: number;
  // varredura: deslocamento de M2 → intensidade central (frequência de batimento = 2/λ por unidade de m)
  scanCurve: { dx: number; I: number }[];
}

export function computeMichelson(p: MichelsonParams): MichelsonResults {
  const lambda = Math.max(1e-12, p.wavelengthNm * 1e-9);
  const L1 = p.L1mm * 1e-3, L2 = p.L2mm * 1e-3;
  const delta = 2 * (L2 - L1);                  // diferença de caminho óptico
  const orderCenter = Math.abs(delta) / lambda;
  const V = Math.max(0, Math.min(1, p.visibility));
  // intensidade normalizada (centro): I/Imax = ½(1 + V·cos(2π Δ/λ))
  const centralIntensity = 0.5 * (1 + V * Math.cos(2 * Math.PI * delta / lambda));

  const N = 220;
  const map = new Float32Array(N * N);
  const halfMm = p.screenSizeMm / 2;
  const aperture = p.apertureMm * 1e-3;
  const halfAp = aperture / 2;
  const tilt = p.tiltMrad * 1e-3;

  // Em circular: usar fonte extensa → para um ponto a uma distância r do eixo no plano de observação,
  // a inclinação θ vista é proporcional a r/f (consideramos f normalizado: θ ≈ r/L_eff, L_eff = max(|Δ|, 0.1 m)).
  // Caminho efetivo: Δ_eff = Δ·cos θ ≈ Δ·(1 − θ²/2). Variação rápida de I com r² → anéis concêntricos.
  // Em linear: dois feixes inclinados de 2·tilt → Δ_local = Δ + 2·tilt·x → franjas paralelas com Λ = λ/(2·tilt).
  const Leff = Math.max(Math.abs(delta), 0.1);

  for (let iy = 0; iy < N; iy++) {
    const y = ((iy / (N - 1)) - 0.5) * 2 * halfMm * 1e-3; // metros
    for (let ix = 0; ix < N; ix++) {
      const x = ((ix / (N - 1)) - 0.5) * 2 * halfMm * 1e-3;
      const r2 = x * x + y * y;
      // Máscara de abertura circular
      if (r2 > halfAp * halfAp) {
        map[iy * N + ix] = 0;
        continue;
      }
      let pathLocal: number;
      if (p.mode === "linear") {
        pathLocal = delta + 2 * tilt * x;
      } else {
        const theta2 = r2 / (Leff * Leff);
        pathLocal = delta * (1 - 0.5 * theta2);
      }
      const I = 0.5 * (1 + V * Math.cos(2 * Math.PI * pathLocal / lambda));
      map[iy * N + ix] = I;
    }
  }

  // Espaçamento e contagem de anéis
  let fringeSpacingMm = 0;
  let numVisibleRings = 0;
  if (p.mode === "linear") {
    fringeSpacingMm = tilt > 0 ? (lambda / (2 * tilt)) * 1e3 : Infinity;
  } else {
    // raio do n-ésimo mínimo a partir do centro: 2π·|Δ|·(1−r²/2L²)/λ = (m_center − n)·2π
    // ⇒ r_n = L·√(2 n λ / |Δ|). Conte n até r ≤ halfAp.
    if (Math.abs(delta) > 1e-12) {
      const maxN = Math.floor((halfAp * halfAp) * Math.abs(delta) / (2 * Leff * Leff * lambda));
      numVisibleRings = Math.max(0, maxN);
      // separação radial entre primeiro e segundo anel
      const r1 = Leff * Math.sqrt(2 * 1 * lambda / Math.abs(delta));
      const r2 = Leff * Math.sqrt(2 * 2 * lambda / Math.abs(delta));
      fringeSpacingMm = (r2 - r1) * 1e3;
    } else {
      fringeSpacingMm = Infinity;
    }
  }

  // Varredura: desloca M2 em ±5λ a partir da posição atual e plota I_center
  const scanCurve: { dx: number; I: number }[] = [];
  const M = 400;
  const span = 5 * lambda; // metros
  for (let k = 0; k <= M; k++) {
    const dx = -span + (2 * span * k) / M;
    const d = delta + 2 * dx;
    scanCurve.push({ dx: dx * 1e9, I: 0.5 * (1 + V * Math.cos(2 * Math.PI * d / lambda)) }); // dx em nm
  }

  return {
    lambdaM: lambda,
    pathDiffM: delta,
    orderCenter,
    centralIntensity,
    fringeSpacingMm,
    numVisibleRings,
    intensityMap: map,
    gridN: N,
    scanCurve,
  };
}

// ============================================================================
// EXP-27 · Espalhamento Compton
// ============================================================================
export const SPEED_OF_LIGHT = SPEED_C;          // alias (m/s)
export const ELECTRON_MASS_KG = 9.1093837015e-31;
export const ELECTRON_REST_ENERGY_KEV = 510.99895;
export const COMPTON_WAVELENGTH_M = PLANCK_H / (ELECTRON_MASS_KG * SPEED_OF_LIGHT); // 2.4263e-12 m
export const ELECTRON_CHARGE = ELECTRON_E;      // alias (C)
export const CLASSICAL_ELECTRON_RADIUS_M = 2.8179403262e-15;

export interface ComptonParams {
  E0_keV: number;       // energia do fóton incidente
  thetaDeg: number;     // ângulo de espalhamento do fóton
}

export interface ComptonResults {
  lambda0_m: number;
  lambdaPrime_m: number;
  deltaLambda_m: number;
  Eprime_keV: number;
  K_electron_keV: number;
  recoilPhiDeg: number;       // ângulo de recuo do elétron
  energyRatio: number;        // E'/E0
  kleinNishina: number;       // dσ/dΩ em barn/sr
  scanByTheta: { theta: number; deltaLambda: number; Eprime: number; phi: number; KN: number }[];
}

/** Klein–Nishina dσ/dΩ (em barn/sr). α = E0/(m_e c²) */
function kleinNishinaCrossSection(E0_keV: number, thetaRad: number): number {
  const alpha = E0_keV / ELECTRON_REST_ENERGY_KEV;
  const cosT = Math.cos(thetaRad);
  const ratio = 1 / (1 + alpha * (1 - cosT));
  const r0_cm = CLASSICAL_ELECTRON_RADIUS_M * 100; // cm
  const dsig_cm2 = 0.5 * r0_cm * r0_cm * ratio * ratio * (ratio + 1 / ratio - Math.sin(thetaRad) ** 2);
  return dsig_cm2 * 1e24; // → barn (1 barn = 1e-24 cm²)
}

export function computeCompton(p: ComptonParams): ComptonResults {
  const E0 = Math.max(0.01, p.E0_keV);
  const theta = (p.thetaDeg * Math.PI) / 180;
  const lambda0 = (PLANCK_H * SPEED_OF_LIGHT) / (E0 * 1e3 * ELECTRON_CHARGE); // m
  const dLambda = COMPTON_WAVELENGTH_M * (1 - Math.cos(theta));
  const lambdaP = lambda0 + dLambda;
  const Eprime = (PLANCK_H * SPEED_OF_LIGHT) / lambdaP / ELECTRON_CHARGE / 1e3; // keV
  const K = E0 - Eprime;
  // Ângulo de recuo do elétron: cot(φ) = (1 + α) tan(θ/2)
  const alpha = E0 / ELECTRON_RES_E();
  let phiDeg = 0;
  if (Math.sin(theta) < 1e-9) {
    phiDeg = theta === 0 ? 0 : 0;
  } else {
    const cotPhi = (1 + alpha) * Math.tan(theta / 2);
    const phi = Math.atan(1 / Math.max(1e-12, cotPhi));
    phiDeg = (phi * 180) / Math.PI;
  }
  const KN = kleinNishinaCrossSection(E0, theta);

  const scan: ComptonResults["scanByTheta"] = [];
  for (let t = 0; t <= 180; t += 1) {
    const tr = (t * Math.PI) / 180;
    const dL = COMPTON_WAVELENGTH_M * (1 - Math.cos(tr));
    const lp = lambda0 + dL;
    const Ep = (PLANCK_H * SPEED_OF_LIGHT) / lp / ELECTRON_CHARGE / 1e3;
    let phi = 0;
    if (t > 0 && t < 180) {
      const cp = (1 + alpha) * Math.tan(tr / 2);
      phi = (Math.atan(1 / Math.max(1e-12, cp)) * 180) / Math.PI;
    } else if (t === 0) phi = 90;
    scan.push({ theta: t, deltaLambda: dL, Eprime: Ep, phi, KN: kleinNishinaCrossSection(E0, tr) });
  }

  return {
    lambda0_m: lambda0,
    lambdaPrime_m: lambdaP,
    deltaLambda_m: dLambda,
    Eprime_keV: Eprime,
    K_electron_keV: K,
    recoilPhiDeg: phiDeg,
    energyRatio: Eprime / E0,
    kleinNishina: KN,
    scanByTheta: scan,
  };
}

function ELECTRON_RES_E() { return ELECTRON_REST_ENERGY_KEV; }

// ============================================================================
// EXP-28 · Relatividade especial
// ============================================================================
export type RelativityScenario = "dilation" | "contraction" | "addition" | "twin";

export interface RelativityParams {
  beta: number;            // v/c em [0, 0.9999]
  scenario: RelativityScenario;
  L0_m: number;            // comprimento próprio (m)
  dt0_s: number;           // intervalo próprio (s)
  u_over_c: number;        // velocidade do objeto no referencial S' (para soma de velocidades)
  travelDistanceLy: number;// distância de ida (anos-luz), para gêmeos
}

export interface RelativityResults {
  beta: number;
  gamma: number;
  // Dilatação / contração
  dt_dilated_s: number;
  L_contracted_m: number;
  // Soma relativística (u + v) / (1 + uv/c²)
  uPrimeOverC: number;
  // Gêmeos
  earthTimeYears: number;          // tempo medido na Terra (ida + volta)
  travelerTimeYears: number;       // tempo próprio do viajante
  ageDifferenceYears: number;
  // Curva γ(β) para gráfico
  gammaCurve: { beta: number; gamma: number }[];
}

export function computeRelativity(p: RelativityParams): RelativityResults {
  const beta = Math.min(0.99999, Math.max(0, Math.abs(p.beta)));
  const gamma = 1 / Math.sqrt(1 - beta * beta);
  const dt = p.dt0_s * gamma;
  const L = p.L0_m / gamma;
  const u = Math.min(0.99999, Math.max(-0.99999, p.u_over_c));
  const uP = (u + beta) / (1 + u * beta);
  const dEarth = 2 * p.travelDistanceLy / Math.max(1e-6, beta); // anos (D em anos-luz / (β c) → β fração de c)
  const dTrav = dEarth / gamma;
  const curve: { beta: number; gamma: number }[] = [];
  for (let i = 0; i <= 200; i++) {
    const b = (i / 200) * 0.999;
    curve.push({ beta: b, gamma: 1 / Math.sqrt(1 - b * b) });
  }
  return {
    beta, gamma,
    dt_dilated_s: dt,
    L_contracted_m: L,
    uPrimeOverC: uP,
    earthTimeYears: dEarth,
    travelerTimeYears: dTrav,
    ageDifferenceYears: dEarth - dTrav,
    gammaCurve: curve,
  };
}

// ============================================================
// EFEITO ZEEMAN — divisão de linhas espectrais em campo B
// ============================================================
export type ZeemanPolarization = "pi" | "sigma+" | "sigma-";
export interface ZeemanLine {
  mUpper: number; mLower: number;
  energyShift_eV: number;
  wavelengthShift_pm: number;
  frequencyShift_GHz: number;
  polarization: ZeemanPolarization;
  intensity: number;
}
export interface ZeemanTransitionPreset {
  name: string;
  short: string;
  lambda0_nm: number;
  Su: number; Lu: number; Ju: number;
  Sl: number; Ll: number; Jl: number;
}
export interface ZeemanParams {
  presetIndex: number;
  B_T: number;
  observation: "longitudinal" | "transverse";
}
export interface ZeemanResults {
  preset: ZeemanTransitionPreset;
  gU: number; gL: number;
  lines: ZeemanLine[];
  scanByB: { B: number; maxShift_pm: number; nLines: number }[];
  muB_eVT: number;
  nu0_THz: number;
  E0_eV: number;
  totalSubU: number;
  totalSubL: number;
  type: "Normal" | "Anômalo";
}
export const ZEEMAN_PRESETS: ZeemanTransitionPreset[] = [
  { name: "Cd 643.8 nm  (¹P₁ → ¹D₂)", short: "Cd", lambda0_nm: 643.847, Su:0, Lu:1, Ju:1, Sl:0, Ll:2, Jl:2 },
  { name: "Zn 468.0 nm  (³S₁ → ³P₂)", short: "Zn", lambda0_nm: 468.014, Su:1, Lu:0, Ju:1, Sl:1, Ll:1, Jl:2 },
  { name: "Na D₁ 589.6 nm  (²P₁/₂ → ²S₁/₂)", short: "Na-D1", lambda0_nm: 589.592, Su:0.5, Lu:1, Ju:0.5, Sl:0.5, Ll:0, Jl:0.5 },
  { name: "Na D₂ 589.0 nm  (²P₃/₂ → ²S₁/₂)", short: "Na-D2", lambda0_nm: 588.995, Su:0.5, Lu:1, Ju:1.5, Sl:0.5, Ll:0, Jl:0.5 },
];
const ZEEMAN_MU_B_eV_T = 5.7883818012e-5;
const ZEEMAN_HC_eV_nm = 1239.841984;
const ZEEMAN_h_eV_s = 4.135667696e-15;
const landeFactor = (S:number, L:number, J:number) => {
  if (J === 0) return 0;
  return 1 + (J*(J+1) + S*(S+1) - L*(L+1)) / (2*J*(J+1));
};
export function computeZeeman(p: ZeemanParams): ZeemanResults {
  const preset = ZEEMAN_PRESETS[p.presetIndex] ?? ZEEMAN_PRESETS[0];
  const gU = landeFactor(preset.Su, preset.Lu, preset.Ju);
  const gL = landeFactor(preset.Sl, preset.Ll, preset.Jl);
  const mUs: number[] = []; for (let m = -preset.Ju; m <= preset.Ju + 1e-9; m++) mUs.push(m);
  const mLs: number[] = []; for (let m = -preset.Jl; m <= preset.Jl + 1e-9; m++) mLs.push(m);
  const lines: ZeemanLine[] = [];
  const E0 = ZEEMAN_HC_eV_nm / preset.lambda0_nm;
  for (const mu of mUs) for (const ml of mLs) {
    const dm = mu - ml;
    if (Math.abs(dm) > 1.0001) continue;
    const pol: ZeemanPolarization = Math.abs(dm) < 0.5 ? "pi" : dm > 0 ? "sigma+" : "sigma-";
    if (p.observation === "longitudinal" && pol === "pi") continue;
    const dE = ZEEMAN_MU_B_eV_T * p.B_T * (gU*mu - gL*ml);
    const lp = ZEEMAN_HC_eV_nm / (E0 + dE);
    const dLpm = (lp - preset.lambda0_nm) * 1000;
    const dNuGHz = (dE / ZEEMAN_h_eV_s) / 1e9;
    let intensity = 1;
    if (p.observation === "transverse" && pol === "pi") intensity = 1.0;
    if (p.observation === "transverse" && pol !== "pi") intensity = 0.7;
    if (p.observation === "longitudinal") intensity = 1.0;
    lines.push({ mUpper: mu, mLower: ml, energyShift_eV: dE, wavelengthShift_pm: dLpm,
      frequencyShift_GHz: dNuGHz, polarization: pol, intensity });
  }
  // Scan vs B
  const scanByB: ZeemanResults["scanByB"] = [];
  const Bmax = Math.max(5, p.B_T * 1.5);
  let maxCoef = 0;
  for (const mu of mUs) for (const ml of mLs) {
    if (Math.abs(mu - ml) > 1.0001) continue;
    const c = Math.abs(gU*mu - gL*ml);
    if (c > maxCoef) maxCoef = c;
  }
  for (let i = 0; i <= 60; i++) {
    const B = (i / 60) * Bmax;
    const maxMag = ZEEMAN_MU_B_eV_T * B * maxCoef;
    const maxShift_pm = Math.abs((ZEEMAN_HC_eV_nm / (E0 + maxMag)) - preset.lambda0_nm) * 1000;
    scanByB.push({ B, maxShift_pm, nLines: lines.length });
  }
  const nu0_THz = (E0 / ZEEMAN_h_eV_s) / 1e12;
  const isNormal = preset.Su === 0 && preset.Sl === 0;
  return {
    preset, gU, gL, lines, scanByB,
    muB_eVT: ZEEMAN_MU_B_eV_T, nu0_THz, E0_eV: E0,
    totalSubU: mUs.length, totalSubL: mLs.length,
    type: isNormal ? "Normal" : "Anômalo",
  };
}

// ============================================================
// EXP-30 · Davisson–Germer (difração de elétrons)
// ============================================================
export interface DavissonPreset { name: string; symbol: string; d_nm: number }
export const DAVISSON_PRESETS: DavissonPreset[] = [
  { name: "Níquel (111)", symbol: "Ni", d_nm: 0.215 },
  { name: "Grafite (002)", symbol: "C",  d_nm: 0.335 },
  { name: "Alumínio (111)", symbol: "Al", d_nm: 0.234 },
  { name: "Cloreto de sódio (200)", symbol: "NaCl", d_nm: 0.282 },
];
export interface DavissonParams { presetIndex: number; voltage_V: number; maxOrder: number }
export interface DavissonPeak { n: number; phi_deg: number; intensity: number }
export interface DavissonResults {
  preset: DavissonPreset;
  lambda_nm: number;
  momentum_kgms: number;
  energy_eV: number;
  peaks: DavissonPeak[];
  scanByV: { V: number; lambda_nm: number; firstPeak_deg: number }[];
  pattern: { phi: number; I: number }[];
}
export function computeDavissonGermer(p: DavissonParams): DavissonResults {
  const preset = DAVISSON_PRESETS[p.presetIndex] ?? DAVISSON_PRESETS[0];
  // λ relativística aproximada (não-rel ok até ~10 kV): λ(nm) = 1.226/√V
  const V = Math.max(1e-3, p.voltage_V);
  const lambda_nm = 1.22639 / Math.sqrt(V);
  const energy_eV = V; // elétron acelerado por V volts
  const p_kgms = Math.sqrt(2 * ELECTRON_MASS_KG * V * ELECTRON_CHARGE);
  const peaks: DavissonPeak[] = [];
  for (let n = 1; n <= p.maxOrder; n++) {
    const s = (n * lambda_nm) / preset.d_nm;
    if (s <= 1) {
      const phi = Math.asin(s) * 180 / Math.PI;
      peaks.push({ n, phi_deg: phi, intensity: 1 / n });
    }
  }
  // Padrão de intensidade I(φ): soma de gaussianas estreitas centradas em cada pico
  const pattern: DavissonResults["pattern"] = [];
  const sigma = 1.2; // graus
  for (let phi = 0; phi <= 90; phi += 0.5) {
    let I = 0;
    for (const pk of peaks) {
      const dx = phi - pk.phi_deg;
      I += pk.intensity * Math.exp(-(dx*dx)/(2*sigma*sigma));
    }
    pattern.push({ phi, I });
  }
  const scanByV: DavissonResults["scanByV"] = [];
  for (let i = 1; i <= 60; i++) {
    const Vi = (i/60) * Math.max(200, V*1.5);
    const li = 1.22639/Math.sqrt(Vi);
    const s1 = li / preset.d_nm;
    scanByV.push({ V: Vi, lambda_nm: li, firstPeak_deg: s1 <= 1 ? Math.asin(s1)*180/Math.PI : 90 });
  }
  return { preset, lambda_nm, momentum_kgms: p_kgms, energy_eV, peaks, scanByV, pattern };
}

// ============================================================
// EXP-31 · Stern–Gerlach
// ============================================================
export interface SternPreset { name: string; symbol: string; mass_amu: number; gFactor: number; spin: number }
export const STERN_PRESETS: SternPreset[] = [
  { name: "Prata (Ag)",  symbol: "Ag", mass_amu: 107.87, gFactor: 2.00232, spin: 0.5 },
  { name: "Hidrogênio (H)", symbol: "H", mass_amu: 1.008, gFactor: 2.00232, spin: 0.5 },
  { name: "Sódio (Na)",   symbol: "Na", mass_amu: 22.99, gFactor: 2.00232, spin: 0.5 },
  { name: "Césio (Cs)",   symbol: "Cs", mass_amu: 132.91, gFactor: 2.00232, spin: 0.5 },
];
export interface SternParams {
  presetIndex: number;
  gradient_T_per_m: number; // dBz/dz
  ovenTemp_K: number;
  magnetLength_m: number;
  driftLength_m: number;
}
export interface SternResults {
  preset: SternPreset;
  v_mean: number;
  mu_z_JT: number;             // |μ_z| = g·m_s·μ_B (J/T)
  force_N: number;             // |F| = μ_z · dB/dz
  acc: number;
  deflection_m: number;        // separação total Δz entre m_s=+1/2 e -1/2
  spreadGauss_m: number;       // largura por distribuição térmica
  beams: { ms: number; z_mm: number; weight: number }[];
  scanByGrad: { grad: number; sep_mm: number }[];
}
const AMU_KG = 1.66053906660e-27;
const K_B = 1.380649e-23;
const MU_B_JT = 9.2740100783e-24;
export function computeSternGerlach(p: SternParams): SternResults {
  const preset = STERN_PRESETS[p.presetIndex] ?? STERN_PRESETS[0];
  const m = preset.mass_amu * AMU_KG;
  const v = Math.sqrt((2 * K_B * Math.max(1, p.ovenTemp_K)) / m);
  const mu_z = preset.gFactor * 0.5 * MU_B_JT; // |m_s|=1/2
  const F = mu_z * p.gradient_T_per_m;
  const a = F / m;
  const L = p.magnetLength_m, D = p.driftLength_m;
  // Deflexão de um lado: z = (1/2) a (L/v)^2 + a L D / v^2
  const t1 = L / v;
  const z_one = 0.5 * a * t1*t1 + (a * L * D) / (v*v);
  const sep = 2 * z_one;
  const spread = 0.15 * z_one; // largura estatística aproximada
  const beams = [
    { ms: +0.5, z_mm: +z_one * 1000, weight: 0.5 },
    { ms: -0.5, z_mm: -z_one * 1000, weight: 0.5 },
  ];
  const scanByGrad: SternResults["scanByGrad"] = [];
  const gmax = Math.max(50, p.gradient_T_per_m * 1.5);
  for (let i = 0; i <= 60; i++) {
    const g = (i/60) * gmax;
    const Fi = mu_z * g;
    const ai = Fi / m;
    const zi = 0.5 * ai * t1*t1 + (ai * L * D) / (v*v);
    scanByGrad.push({ grad: g, sep_mm: 2 * zi * 1000 });
  }
  return { preset, v_mean: v, mu_z_JT: mu_z, force_N: F, acc: a, deflection_m: sep, spreadGauss_m: spread, beams, scanByGrad };
}

// ============================================================
// EXP-32 · Efeito Hall quântico
// ============================================================
export interface QHallParams {
  density_per_m2: number;   // n_s densidade superficial 2D
  B_T: number;
  current_uA: number;
  temperature_K: number;
}
export interface QHallResults {
  fillingFactor: number;
  R_xy_Ohm: number;          // resistência de Hall (platô idealizado)
  R_xx_Ohm: number;          // resistência longitudinal (picos entre platôs)
  V_H_mV: number;            // tensão de Hall
  R_K_Ohm: number;           // constante de von Klitzing
  curve: { B: number; R_xy: number; R_xx: number; nu: number }[];
  nearestPlateau: number;    // ν inteiro mais próximo
  plateauR_Ohm: number;
}
const PLANCK_H_QH = 6.62607015e-34;
const E_QH = 1.602176634e-19;
const R_K = PLANCK_H_QH / (E_QH * E_QH); // 25812.807 Ω
export function computeQuantumHall(p: QHallParams): QHallResults {
  const safeB = Math.max(1e-3, p.B_T);
  const nu = (p.density_per_m2 * PLANCK_H_QH) / (E_QH * safeB);
  const nearest = Math.max(1, Math.round(nu));
  // Quão "no platô" estamos: largura ~ 0.15 em ν
  const dist = Math.abs(nu - nearest);
  const platWidth = 0.18;
  const onPlateau = Math.exp(-(dist*dist)/(2*platWidth*platWidth));
  const Rxy_ideal = R_K / nearest;
  const Rxy_classical = safeB / (p.density_per_m2 * E_QH);
  const Rxy = onPlateau * Rxy_ideal + (1 - onPlateau) * Rxy_classical;
  // R_xx pico na transição (entre platôs)
  const trans = Math.exp(-Math.pow((nu - (nearest - 0.5)), 2) / (2*0.08*0.08))
              + Math.exp(-Math.pow((nu - (nearest + 0.5)), 2) / (2*0.08*0.08));
  const tempFactor = Math.exp(-Math.max(0, 4 - p.temperature_K)/10); // T↑ alarga
  const Rxx = (trans + tempFactor*0.2) * 200; // Ω, escala arbitrária
  const V_H_mV = (Rxy * p.current_uA * 1e-6) * 1e3;
  const curve: QHallResults["curve"] = [];
  const Bmax = Math.max(10, safeB * 1.5);
  for (let i = 0; i <= 200; i++) {
    const Bi = (i/200) * Bmax + 0.01;
    const ni = (p.density_per_m2 * PLANCK_H_QH) / (E_QH * Bi);
    const near = Math.max(1, Math.round(ni));
    const d = Math.abs(ni - near);
    const op = Math.exp(-(d*d)/(2*platWidth*platWidth));
    const ry = op * (R_K/near) + (1-op) * (Bi / (p.density_per_m2 * E_QH));
    const trI = Math.exp(-Math.pow((ni - (near - 0.5)), 2) / (2*0.08*0.08))
              + Math.exp(-Math.pow((ni - (near + 0.5)), 2) / (2*0.08*0.08));
    curve.push({ B: Bi, R_xy: ry, R_xx: (trI + tempFactor*0.2) * 200, nu: ni });
  }
  return { fillingFactor: nu, R_xy_Ohm: Rxy, R_xx_Ohm: Rxx, V_H_mV, R_K_Ohm: R_K, curve, nearestPlateau: nearest, plateauR_Ohm: Rxy_ideal };
}

// ============================================================
// EXP-33 · Espalhamento de Rutherford
// ============================================================
export interface RutherfordParams {
  energy_MeV: number;
  Z_target: number;
  z_projectile: number; // 2 para alfa
  impactParameter_fm: number;
}
export interface RutherfordResults {
  energy_J: number;
  scatteringAngle_deg: number;
  distance_min_fm: number;
  diffCrossSection_b_per_sr: number; // barns/sr no ângulo atual
  trajectory: { x: number; y: number }[]; // em fm
  angleVsB: { b_fm: number; theta_deg: number }[];
  csVsTheta: { theta: number; ds: number }[]; // barns/sr
  k_eVfm: number; // Zz·e²/(4πε₀) em eV·fm = 1.439976 Z z
}
const COULOMB_K_eV_fm_per_Zz = 1.43996454; // e²/(4πε₀) em eV·nm = 1.44; em eV·fm
export function computeRutherford(p: RutherfordParams): RutherfordResults {
  const E_eV = p.energy_MeV * 1e6;
  const k = COULOMB_K_eV_fm_per_Zz * p.Z_target * p.z_projectile; // eV·fm
  const b = Math.max(1e-6, p.impactParameter_fm);
  // cot(θ/2) = 2 E b / k  →  θ = 2 atan(k/(2 E b))
  const theta = 2 * Math.atan(k / (2 * E_eV * b));
  const thetaDeg = theta * 180 / Math.PI;
  // r_min na trajetória (com momento angular): r_min = (k/(2E)) (1 + 1/sin(θ/2))
  const a = k / (2 * E_eV); // semi-eixo do problema (fm)
  const r_min = a * (1 + 1/Math.sin(theta/2));
  // dσ/dΩ = (k/(4E))² / sin⁴(θ/2)  em fm²/sr;  1 b = 100 fm²  →  fm² = 0.01 b
  const dsigma_fm2 = Math.pow(k/(4*E_eV), 2) / Math.pow(Math.sin(theta/2), 4);
  const dsigma_b = dsigma_fm2 / 100; // barns/sr
  // Trajetória hiperbólica plana, parametrizada por ν: r(ν) = a(e²-1)/(1 + e cos ν)
  // Para Coulomb repulsivo: usa branch com (1 + e cos ν), e = 1/sin(θ/2)
  const e = 1 / Math.sin(theta/2);
  const semi = a * (e*e - 1);
  const trajectory: { x: number; y: number }[] = [];
  const nuMax = Math.acos(-1/e) - 1e-3;
  for (let i = -100; i <= 100; i++) {
    const nu = (i/100) * nuMax;
    const r = semi / (1 + e * Math.cos(nu));
    if (r > 0 && r < 1000) trajectory.push({ x: r*Math.cos(nu), y: r*Math.sin(nu) });
  }
  const angleVsB: RutherfordResults["angleVsB"] = [];
  const bMax = Math.max(50, b*3);
  for (let i = 1; i <= 80; i++) {
    const bi = (i/80) * bMax;
    const th = 2 * Math.atan(k / (2 * E_eV * bi));
    angleVsB.push({ b_fm: bi, theta_deg: th * 180 / Math.PI });
  }
  const csVsTheta: RutherfordResults["csVsTheta"] = [];
  for (let t = 1; t <= 179; t += 1) {
    const tr = t * Math.PI / 180;
    const ds = Math.pow(k/(4*E_eV), 2) / Math.pow(Math.sin(tr/2), 4) / 100;
    csVsTheta.push({ theta: t, ds });
  }
  return {
    energy_J: E_eV * 1.602176634e-19,
    scatteringAngle_deg: thetaDeg,
    distance_min_fm: r_min,
    diffCrossSection_b_per_sr: dsigma_b,
    trajectory, angleVsB, csVsTheta,
    k_eVfm: k,
  };
}

// ============================================================================
// EXP-34 · Franck–Hertz
// ============================================================================
export interface FranckHertzGas { name: string; excitation_eV: number; mfp_factor: number }
export const FH_GASES: FranckHertzGas[] = [
  { name: "Mercúrio (Hg)", excitation_eV: 4.9, mfp_factor: 1.0 },
  { name: "Neônio (Ne)",   excitation_eV: 18.7, mfp_factor: 0.8 },
  { name: "Argônio (Ar)",  excitation_eV: 11.5, mfp_factor: 0.9 },
];
export interface FranckHertzParams {
  gasName: string;
  excitation_eV: number;
  V_acc_max: number;     // tensão de aceleração máxima (V)
  V_retard: number;      // potencial retardador (V)
  T_C: number;           // temperatura (°C) — afeta densidade do vapor e largura
}
export interface FranckHertzResults {
  curve: { V: number; I: number }[];   // I(V) em u.a.
  peaks: { V: number; n: number }[];
  spacing_V: number;
  photon_nm: number;
}
export function computeFranckHertz(p: FranckHertzParams): FranckHertzResults {
  const Ve = Math.max(0.5, p.excitation_eV);
  const Vr = Math.max(0, p.V_retard);
  const dens = 1 + Math.max(0, p.T_C - 80) / 120; // densidade aumenta com T
  const sigma = 0.35 / dens;                       // largura dos picos
  const N = 320;
  const curve: { V: number; I: number }[] = [];
  const Vmax = Math.max(Ve * 2, p.V_acc_max);
  for (let i = 0; i <= N; i++) {
    const V = (i / N) * Vmax;
    // fundo crescente (corrente termiônica filtrada por retardador)
    let I = Math.max(0, V - Vr) * 0.6;
    // quedas em V = n*Ve + Vr (n = 1, 2, ...)
    for (let n = 1; n < 12; n++) {
      const Vp = n * Ve + Vr;
      if (V > Vp - 3*sigma)
        I -= 0.85 * (V * 0.25 + 1) * Math.exp(-Math.pow((V - Vp) / sigma, 2));
    }
    curve.push({ V, I: Math.max(0, I) });
  }
  const peaks: { V: number; n: number }[] = [];
  for (let n = 1; n < 12; n++) {
    const V = n * Ve + Vr;
    if (V <= Vmax) peaks.push({ V, n });
  }
  const photon_nm = 1239.841984 / Ve;
  return { curve, peaks, spacing_V: Ve, photon_nm };
}

// ============================================================================
// EXP-35 · Millikan (gota de óleo)
// ============================================================================
export const ELEMENTARY_CHARGE = 1.602176634e-19;
export interface MillikanParams {
  radius_um: number;      // raio da gota (μm)
  charges_n: number;      // número de cargas elementares
  rho_oil: number;        // kg/m³
  rho_air: number;        // kg/m³
  eta: number;            // viscosidade do ar (Pa·s)
  plateGap_mm: number;    // distância entre placas (mm)
  voltage_V: number;      // tensão aplicada (V)
  g: number;              // gravidade
}
export interface MillikanResults {
  q: number;              // C
  q_over_e: number;
  mass_kg: number;
  weight_N: number;
  buoyancy_N: number;
  E_Vm: number;
  fE_N: number;
  v_fall_mms: number;     // velocidade terminal de queda (sem campo)
  v_rise_mms: number;     // velocidade terminal de subida (com campo)
  net_N: number;          // força resultante com campo ligado
  histogram: { e_units: number; count: number }[];
}
export function computeMillikan(p: MillikanParams): MillikanResults {
  const r = p.radius_um * 1e-6;
  const V = (4/3) * Math.PI * Math.pow(r, 3);
  const mass = V * p.rho_oil;
  const W = mass * p.g;
  const B = V * p.rho_air * p.g;
  const E = p.voltage_V / (p.plateGap_mm * 1e-3);
  const q = p.charges_n * ELEMENTARY_CHARGE;
  const fE = q * E;
  const net = fE - (W - B);
  const k = 6 * Math.PI * p.eta * r; // coeficiente de Stokes
  const v_fall = (W - B) / k;        // m/s (positivo = para baixo)
  const v_rise = net / k;            // m/s (positivo = para cima)
  // histograma sintético de medidas — agrupado por múltiplos inteiros de e
  const histogram: { e_units: number; count: number }[] = [];
  for (let n = 1; n <= 8; n++) {
    const dist = Math.abs(n - p.charges_n);
    const count = Math.max(0, Math.round(20 * Math.exp(-dist*dist/1.5)));
    histogram.push({ e_units: n, count });
  }
  return {
    q, q_over_e: q / ELEMENTARY_CHARGE,
    mass_kg: mass, weight_N: W, buoyancy_N: B,
    E_Vm: E, fE_N: fE, net_N: net,
    v_fall_mms: v_fall * 1000, v_rise_mms: v_rise * 1000,
    histogram,
  };
}

// ============================================================================
// EXP-36 · Ressonância Magnética Nuclear (RMN)
// ============================================================================
export interface NMRNucleus { name: string; label: string; gamma_MHz_per_T: number; spin: string }
export const NMR_NUCLEI: NMRNucleus[] = [
  { name: "1H",  label: "¹H (próton)",  gamma_MHz_per_T: 42.577, spin: "1/2" },
  { name: "13C", label: "¹³C",          gamma_MHz_per_T: 10.708, spin: "1/2" },
  { name: "19F", label: "¹⁹F",          gamma_MHz_per_T: 40.078, spin: "1/2" },
  { name: "31P", label: "³¹P",          gamma_MHz_per_T: 17.235, spin: "1/2" },
];
export interface NMRParams {
  nucleusName: string;
  B0_T: number;         // campo estático
  freq_MHz: number;     // frequência RF aplicada
  T1_ms: number;        // relaxação longitudinal
  T2_ms: number;        // relaxação transversal
  time_ms: number;      // tempo após pulso 90°
}
export interface NMRResults {
  gamma_MHz_per_T: number;
  larmor_MHz: number;
  detuning_kHz: number;
  Mz_over_M0: number;
  Mxy_over_M0: number;
  fid: { t: number; signal: number }[];   // FID amortecida
  spectrum: { f: number; amp: number }[]; // Lorentziana centrada em Larmor
}
export function computeNMR(p: NMRParams): NMRResults {
  const nuc = NMR_NUCLEI.find((n) => n.name === p.nucleusName) ?? NMR_NUCLEI[0];
  const larmor = nuc.gamma_MHz_per_T * p.B0_T;
  const detuning = (p.freq_MHz - larmor) * 1000; // kHz
  const t = Math.max(0, p.time_ms);
  const T1 = Math.max(0.01, p.T1_ms);
  const T2 = Math.max(0.01, p.T2_ms);
  // Após pulso 90°: Mz cresce de 0 → M0; Mxy decai de M0 → 0
  const Mz = 1 - Math.exp(-t / T1);
  const Mxy = Math.exp(-t / T2);
  // FID
  const fid: { t: number; signal: number }[] = [];
  const omega = 2 * Math.PI * (detuning / 1000); // rad/ms (em torno do referencial girante)
  const N = 240;
  const tMax = Math.min(5 * T2, 200);
  for (let i = 0; i <= N; i++) {
    const tt = (i / N) * tMax;
    fid.push({ t: tt, signal: Math.exp(-tt / T2) * Math.cos(omega * tt) });
  }
  // Espectro (lorentziana, FWHM = 1/(π T2) em kHz se T2 em ms)
  const spectrum: { f: number; amp: number }[] = [];
  const fwhm_kHz = 1000 / (Math.PI * T2);
  const half = fwhm_kHz / 2;
  const center = larmor * 1000; // kHz
  for (let i = 0; i <= 200; i++) {
    const f_kHz = center - 10 * fwhm_kHz + (i / 200) * 20 * fwhm_kHz;
    const amp = (half * half) / (Math.pow(f_kHz - center, 2) + half * half);
    spectrum.push({ f: f_kHz - center, amp });
  }
  return {
    gamma_MHz_per_T: nuc.gamma_MHz_per_T,
    larmor_MHz: larmor,
    detuning_kHz: detuning,
    Mz_over_M0: Mz, Mxy_over_M0: Mxy,
    fid, spectrum,
  };
}

// ============================================================================
// EXP-37 · Laser e cavidade Fabry–Perot
// ============================================================================
export interface LaserParams {
  L_mm: number;           // comprimento da cavidade (mm)
  R1: number;             // refletividade espelho 1
  R2: number;             // refletividade espelho 2 (acoplador)
  lambda_nm: number;      // comprimento de onda central
  gainBW_GHz: number;     // largura da curva de ganho (FWHM)
  pump_ratio: number;     // bombeamento / limiar
}
export interface LaserResults {
  fsr_GHz: number;        // free spectral range
  finesse: number;
  linewidth_MHz: number;  // largura de cada modo (FP passivo)
  coherence_m: number;    // comprimento de coerência ~ c/Δν
  threshold_factor: number;
  output_power_au: number;
  modes: { f_GHz: number; gain: number; lasing: boolean }[];
  gainCurve: { f_GHz: number; g: number }[];
  airy: { f_GHz: number; T: number }[]; // transmissão do FP em torno de 0
}
export function computeLaser(p: LaserParams): LaserResults {
  const c = 299792458; // m/s
  const L = p.L_mm * 1e-3;
  const fsr_Hz = c / (2 * L);
  const fsr_GHz = fsr_Hz / 1e9;
  const R = Math.sqrt(p.R1 * p.R2);
  const finesse = (Math.PI * Math.sqrt(R)) / (1 - R);
  const linewidth_GHz = fsr_GHz / finesse;
  const coherence = c / (linewidth_GHz * 1e9);
  const f0 = c / (p.lambda_nm * 1e-9) / 1e9; // GHz (central)
  // Modos longitudinais e curva de ganho gaussiana
  const half = p.gainBW_GHz / 2;
  const modes: LaserResults["modes"] = [];
  const gainCurve: { f_GHz: number; g: number }[] = [];
  const span = p.gainBW_GHz * 1.5;
  for (let i = -200; i <= 200; i++) {
    const df = (i / 200) * span;
    const g = Math.exp(-Math.pow(df / half, 2) * Math.LN2);
    gainCurve.push({ f_GHz: df, g });
  }
  const mMax = Math.ceil(span / fsr_GHz);
  for (let m = -mMax; m <= mMax; m++) {
    const df = m * fsr_GHz;
    if (Math.abs(df) > span) continue;
    const g = Math.exp(-Math.pow(df / half, 2) * Math.LN2);
    const lasing = p.pump_ratio * g > 1;
    modes.push({ f_GHz: df, gain: g, lasing });
  }
  // Função de Airy (transmissão do interferômetro FP)
  const airy: { f_GHz: number; T: number }[] = [];
  const F = (4 * R) / Math.pow(1 - R, 2);
  for (let i = -200; i <= 200; i++) {
    const df = (i / 200) * 2 * fsr_GHz;
    const phi = 2 * Math.PI * df / fsr_GHz;
    const T = 1 / (1 + F * Math.pow(Math.sin(phi / 2), 2));
    airy.push({ f_GHz: df, T });
  }
  const lasingModes = modes.filter((m) => m.lasing).length;
  const output = Math.max(0, p.pump_ratio - 1) * (1 - p.R2) * (1 + 0.05 * lasingModes);
  // expor f central (informativo)
  void f0;
  return {
    fsr_GHz, finesse,
    linewidth_MHz: linewidth_GHz * 1000,
    coherence_m: coherence,
    threshold_factor: p.pump_ratio,
    output_power_au: output,
    modes, gainCurve, airy,
  };
}

// ============================================================================
// EXP-38 · Corpo Negro (Lei de Planck)
// ============================================================================
const H_PLANCK = 6.62607015e-34;
const C_LIGHT = 299792458;
const K_BOLTZ = 1.380649e-23;
const SIGMA_SB = 5.670374419e-8;
const WIEN_B = 2.897771955e-3; // m·K

export interface BlackbodyParams { T_K: number; lambdaMin_nm: number; lambdaMax_nm: number }
export interface BlackbodyResults {
  spectrum: { lambda_nm: number; B_planck: number; B_rj: number; B_wien: number }[];
  peak_nm: number;        // lei de Wien
  total_Wm2: number;      // Stefan-Boltzmann
  peak_intensity: number;
  color: string;          // estimativa de cor visual aproximada
}
export function computeBlackbody(p: BlackbodyParams): BlackbodyResults {
  const T = Math.max(1, p.T_K);
  const spectrum: BlackbodyResults["spectrum"] = [];
  const N = 220;
  const a = p.lambdaMin_nm, b = p.lambdaMax_nm;
  let peakI = 0;
  for (let i = 0; i <= N; i++) {
    const lambda_nm = a + (i / N) * (b - a);
    const lambda = lambda_nm * 1e-9;
    const x = (H_PLANCK * C_LIGHT) / (lambda * K_BOLTZ * T);
    const pre = (2 * H_PLANCK * C_LIGHT * C_LIGHT) / Math.pow(lambda, 5);
    const B = pre / (Math.exp(Math.min(x, 700)) - 1);
    const B_rj = (2 * C_LIGHT * K_BOLTZ * T) / Math.pow(lambda, 4);
    const B_wien = pre * Math.exp(-Math.min(x, 700));
    spectrum.push({ lambda_nm, B_planck: B, B_rj, B_wien });
    if (B > peakI) peakI = B;
  }
  const peak_m = WIEN_B / T;
  const total = SIGMA_SB * Math.pow(T, 4);
  let color = "#7a7a7a";
  if (T < 1000) color = "#3a0d04";
  else if (T < 2000) color = "#d63a00";
  else if (T < 3500) color = "#ff8a30";
  else if (T < 5000) color = "#ffd07a";
  else if (T < 7000) color = "#fff5e0";
  else if (T < 10000) color = "#cfe2ff";
  else color = "#8fb6ff";
  return { spectrum, peak_nm: peak_m * 1e9, total_Wm2: total, peak_intensity: peakI, color };
}

// ============================================================================
// EXP-39 · Átomo de Hidrogênio (Séries espectrais)
// ============================================================================
export const RYDBERG_H = 1.0967758e7; // 1/m
export interface HSeries { name: string; n_low: number; region: string; color: string }
export const H_SERIES: HSeries[] = [
  { name: "Lyman",    n_low: 1, region: "UV",            color: "#a78bfa" },
  { name: "Balmer",   n_low: 2, region: "Visível/NUV",   color: "#22d3ee" },
  { name: "Paschen",  n_low: 3, region: "IV próximo",    color: "#f59e0b" },
  { name: "Brackett", n_low: 4, region: "IV médio",      color: "#ef4444" },
  { name: "Pfund",    n_low: 5, region: "IV longo",      color: "#84cc16" },
];
export interface HydrogenParams { seriesIndex: number; nMax: number }
export interface HydrogenLine {
  n_up: number; n_low: number;
  lambda_nm: number; freq_THz: number;
  energy_eV: number; visible: boolean;
}
export interface HydrogenResults {
  series: HSeries;
  lines: HydrogenLine[];
  ionization_eV: number;
  levels: { n: number; E_eV: number }[];
}
export function computeHydrogen(p: HydrogenParams): HydrogenResults {
  const series = H_SERIES[Math.max(0, Math.min(H_SERIES.length - 1, p.seriesIndex))];
  const nl = series.n_low;
  const lines: HydrogenLine[] = [];
  for (let nu = nl + 1; nu <= Math.max(nl + 1, p.nMax); nu++) {
    const invL = RYDBERG_H * (1 / (nl * nl) - 1 / (nu * nu));
    const lambda = 1 / invL;
    const lambda_nm = lambda * 1e9;
    const f = C_LIGHT / lambda;
    const E_eV = (H_PLANCK * f) / 1.602176634e-19;
    lines.push({
      n_up: nu, n_low: nl,
      lambda_nm, freq_THz: f / 1e12, energy_eV: E_eV,
      visible: lambda_nm >= 380 && lambda_nm <= 780,
    });
  }
  const levels: { n: number; E_eV: number }[] = [];
  for (let n = 1; n <= Math.max(6, p.nMax); n++) levels.push({ n, E_eV: -13.605693 / (n * n) });
  return { series, lines, ionization_eV: 13.605693, levels };
}

// ============================================================================
// EXP-40 · Tunelamento Quântico (barreira retangular)
// ============================================================================
const ELECTRON_MASS = 9.1093837015e-31;
const HBAR = 1.054571817e-34;
const EV = 1.602176634e-19;
export interface TunnelParams {
  V0_eV: number;     // altura da barreira
  a_nm: number;      // largura
  E_eV: number;      // energia da partícula
  mass_me: number;   // massa em unidades de m_e
}
export interface TunnelResults {
  T: number; R: number;
  k_invnm: number;   // número de onda fora (1/nm)
  kappa_invnm: number; // dentro da barreira se E<V0
  regime: "tunelamento (E<V0)" | "ressonante (E>V0)" | "limiar (E≈V0)";
  T_curve_E: { E_eV: number; T: number }[];   // T vs E (com V0 fixo)
  T_curve_a: { a_nm: number; T: number }[];   // T vs largura
}
function transmission(V0_eV: number, a_nm: number, E_eV: number, m_kg: number): number {
  const a = a_nm * 1e-9;
  const V = V0_eV * EV;
  const E = E_eV * EV;
  if (E <= 0) return 0;
  if (Math.abs(E - V) < 1e-6 * Math.max(V, 1e-30)) {
    const k = Math.sqrt(2 * m_kg * E) / HBAR;
    return 1 / (1 + (k * a) * (k * a) / 4);
  }
  if (E < V) {
    const kappa = Math.sqrt(2 * m_kg * (V - E)) / HBAR;
    const arg = kappa * a;
    const sh = Math.sinh(Math.min(arg, 350));
    const denom = 1 + (V * V) / (4 * E * (V - E)) * sh * sh;
    return 1 / denom;
  } else {
    const k2 = Math.sqrt(2 * m_kg * (E - V)) / HBAR;
    const s = Math.sin(k2 * a);
    const denom = 1 + (V * V) / (4 * E * (E - V)) * s * s;
    return 1 / denom;
  }
}
export function computeTunnel(p: TunnelParams): TunnelResults {
  const m = p.mass_me * ELECTRON_MASS;
  const T = transmission(p.V0_eV, p.a_nm, p.E_eV, m);
  const k = Math.sqrt(2 * m * p.E_eV * EV) / HBAR;     // m^-1
  const kappa = p.E_eV < p.V0_eV
    ? Math.sqrt(2 * m * (p.V0_eV - p.E_eV) * EV) / HBAR
    : 0;
  const regime: TunnelResults["regime"] =
    Math.abs(p.E_eV - p.V0_eV) < 0.01 ? "limiar (E≈V0)"
      : p.E_eV < p.V0_eV ? "tunelamento (E<V0)" : "ressonante (E>V0)";
  const T_curve_E: TunnelResults["T_curve_E"] = [];
  for (let i = 0; i <= 200; i++) {
    const E = (i / 200) * (3 * p.V0_eV) + 0.01;
    T_curve_E.push({ E_eV: E, T: transmission(p.V0_eV, p.a_nm, E, m) });
  }
  const T_curve_a: TunnelResults["T_curve_a"] = [];
  for (let i = 0; i <= 200; i++) {
    const a = 0.05 + (i / 200) * 3;
    T_curve_a.push({ a_nm: a, T: transmission(p.V0_eV, a, p.E_eV, m) });
  }
  return { T, R: 1 - T, k_invnm: k / 1e9, kappa_invnm: kappa / 1e9, regime, T_curve_E, T_curve_a };
}

// ============================================================================
// EXP-41 · Pêndulo de Foucault
// ============================================================================
export const OMEGA_EARTH = 7.2921159e-5; // rad/s
export interface FoucaultParams {
  L_m: number;            // comprimento do fio
  latitude_deg: number;   // latitude φ
  amplitude_deg: number;  // amplitude inicial
  time_s: number;         // instante de observação
  g: number;
}
export interface FoucaultResults {
  T_s: number;            // período do pêndulo
  omega_pend: number;     // 2π/T
  omega_prec: number;     // Ω sin φ (rad/s)
  T_prec_h: number;       // período de precessão (h)
  rotation_deg: number;   // rotação acumulada do plano em t
  trace: { x: number; y: number }[];
}
export function computeFoucault(p: FoucaultParams): FoucaultResults {
  const T = 2 * Math.PI * Math.sqrt(p.L_m / p.g);
  const omega = 2 * Math.PI / T;
  const phi = (p.latitude_deg * Math.PI) / 180;
  const omegaPrec = OMEGA_EARTH * Math.sin(phi);
  const Tprec_s = omegaPrec !== 0 ? (2 * Math.PI) / Math.abs(omegaPrec) : Infinity;
  const Tprec_h = Tprec_s / 3600;
  const t = Math.max(0, p.time_s);
  const rot_deg = (omegaPrec * t * 180) / Math.PI;
  // Curva: roseta de Foucault (amplitude * cos(ω t) girada por Ω sin φ · t)
  const A = (p.amplitude_deg * Math.PI / 180) * p.L_m;
  const trace: { x: number; y: number }[] = [];
  const N = 600;
  const tEnd = Math.max(t, Math.min(Tprec_s, T * 60));
  for (let i = 0; i <= N; i++) {
    const tt = (i / N) * tEnd;
    const r = A * Math.cos(omega * tt);
    const th = omegaPrec * tt;
    trace.push({ x: r * Math.cos(th), y: r * Math.sin(th) });
  }
  return { T_s: T, omega_pend: omega, omega_prec: omegaPrec, T_prec_h: Tprec_h, rotation_deg: rot_deg, trace };
}

// ============================================================================
// EXP-42 · Difração por Rede (espectrômetro)
// ============================================================================
export interface GratingParams {
  N_per_mm: number;     // linhas por mm
  lambda_nm: number;
  N_total: number;      // número total de fendas iluminadas (poder resolvente)
  angleMax_deg: number; // janela de varredura (±)
}
export interface GratingLine { m: number; angle_deg: number; visible: boolean }
export interface GratingResults {
  d_um: number;          // espaçamento da rede (μm)
  d_nm: number;
  orders: GratingLine[];
  dispersion_deg_per_nm: number; // dθ/dλ em m=1
  resolving_power: number;       // R = m·N
  intensity: { angle_deg: number; I: number }[];
}
export function computeGrating(p: GratingParams): GratingResults {
  const d = 1 / (p.N_per_mm * 1000); // m
  const lambda = p.lambda_nm * 1e-9;
  const orders: GratingLine[] = [];
  const mMax = Math.floor(d / lambda);
  for (let m = -mMax; m <= mMax; m++) {
    const s = (m * lambda) / d;
    if (Math.abs(s) > 1) continue;
    const ang = (Math.asin(s) * 180) / Math.PI;
    if (Math.abs(ang) > p.angleMax_deg) continue;
    orders.push({ m, angle_deg: ang, visible: true });
  }
  // Padrão de intensidade I(θ) = [sin(N·δ/2)/sin(δ/2)]² (sem envelope de fenda única)
  const intensity: { angle_deg: number; I: number }[] = [];
  const N = Math.max(2, Math.round(p.N_total));
  const Npts = 600;
  for (let i = 0; i <= Npts; i++) {
    const ang = -p.angleMax_deg + (i / Npts) * 2 * p.angleMax_deg;
    const theta = (ang * Math.PI) / 180;
    const delta = (2 * Math.PI * d * Math.sin(theta)) / lambda;
    const s2 = Math.sin(delta / 2);
    const num = Math.sin((N * delta) / 2);
    const I = Math.abs(s2) < 1e-9 ? 1 : Math.pow(num / (N * s2), 2);
    intensity.push({ angle_deg: ang, I });
  }
  // Dispersão angular em m=1: dθ/dλ = m/(d cos θ)
  const sin1 = lambda / d;
  let disp = 0;
  if (Math.abs(sin1) <= 1) {
    const cos1 = Math.sqrt(1 - sin1 * sin1);
    disp = (1 / (d * cos1)) * 1e-9 * (180 / Math.PI); // deg/nm
  }
  return {
    d_um: d * 1e6, d_nm: d * 1e9,
    orders, dispersion_deg_per_nm: disp,
    resolving_power: 1 * N,
    intensity,
  };
}

// ============================================================================
// EXP-43 · Queda livre & aceleração da gravidade
// ============================================================================
export interface FreefallParams {
  h0_m: number;        // altura inicial
  v0_m_s: number;      // velocidade inicial (positiva = para baixo)
  g: number;           // gravidade m/s²
  mass_kg: number;     // massa do objeto
  drag: boolean;       // ativa resistência do ar (modelo linear)
  k_drag: number;      // coeficiente linear b (F_d = -b·v)
}
export interface FreefallResults {
  t_fall_s: number;        // tempo para tocar o solo (sem arrasto: √(2h/g))
  v_impact_m_s: number;    // velocidade no impacto (sem arrasto: √(2gh))
  v_terminal_m_s: number;  // m·g/b (se houver arrasto)
  E_kin_J: number;         // ½mv² no impacto
  trajectory: { t: number; y: number; v: number; a: number }[];
  trajectoryNoDrag: { t: number; y: number; v: number }[];
}
export function computeFreefall(p: FreefallParams): FreefallResults {
  const g = Math.max(0.01, p.g);
  const h = Math.max(0.01, p.h0_m);
  const m = Math.max(0.001, p.mass_kg);
  const b = Math.max(0, p.k_drag);
  // sem arrasto (analítico)
  const t_no = (-p.v0_m_s + Math.sqrt(p.v0_m_s * p.v0_m_s + 2 * g * h)) / g;
  const v_no = p.v0_m_s + g * t_no;
  // integração RK simples para arrasto linear
  let t = 0, y = h, v = p.v0_m_s;
  const dt = Math.max(0.001, t_no / 400);
  const traj: { t: number; y: number; v: number; a: number }[] = [{ t, y, v, a: g - (b / m) * v }];
  const trajNo: { t: number; y: number; v: number }[] = [];
  while (y > 0 && t < t_no * 8 + 1) {
    const a = g - (p.drag ? (b / m) * v : 0);
    v += a * dt;
    y -= v * dt;
    t += dt;
    if (traj.length < 400) traj.push({ t, y: Math.max(0, y), v, a });
  }
  const t_fall = t, v_imp = v;
  // curva sem arrasto (para comparação)
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const tt = (i / N) * t_no;
    trajNo.push({ t: tt, y: h - p.v0_m_s * tt - 0.5 * g * tt * tt, v: p.v0_m_s + g * tt });
  }
  return {
    t_fall_s: p.drag ? t_fall : t_no,
    v_impact_m_s: p.drag ? v_imp : v_no,
    v_terminal_m_s: b > 0 ? (m * g) / b : Infinity,
    E_kin_J: 0.5 * m * (p.drag ? v_imp : v_no) ** 2,
    trajectory: traj,
    trajectoryNoDrag: trajNo,
  };
}

// ============================================================================
// EXP-44 · Plano inclinado com atrito
// ============================================================================
export interface InclineParams {
  angle_deg: number;
  mass_kg: number;
  mu_s: number;     // atrito estático
  mu_k: number;     // atrito cinético
  g: number;
  length_m: number; // comprimento do plano
}
export interface InclineResults {
  Fg_paral_N: number;        // m·g·sin θ
  Fg_norm_N: number;         // m·g·cos θ
  Normal_N: number;          // N = m·g·cos θ
  F_atrito_max_N: number;    // μ_s·N
  F_atrito_cin_N: number;    // μ_k·N
  angle_critical_deg: number; // arctan(μ_s)
  willMove: boolean;
  acceleration_m_s2: number; // g(sin θ − μ_k cos θ) se move
  t_descida_s: number;        // tempo para descer L
  v_final_m_s: number;        // velocidade no fim
  velocity: { t: number; v: number; x: number }[];
}
export function computeIncline(p: InclineParams): InclineResults {
  const th = (p.angle_deg * Math.PI) / 180;
  const m = Math.max(0.001, p.mass_kg);
  const g = Math.max(0.01, p.g);
  const N = m * g * Math.cos(th);
  const Fpar = m * g * Math.sin(th);
  const fs_max = Math.max(0, p.mu_s) * N;
  const fk = Math.max(0, p.mu_k) * N;
  const willMove = Fpar > fs_max;
  const a = willMove ? g * (Math.sin(th) - p.mu_k * Math.cos(th)) : 0;
  const L = Math.max(0.01, p.length_m);
  const t_desc = a > 0 ? Math.sqrt((2 * L) / a) : Infinity;
  const v_fin = a > 0 ? a * t_desc : 0;
  const vel: { t: number; v: number; x: number }[] = [];
  if (a > 0) {
    const M = 80;
    for (let i = 0; i <= M; i++) {
      const tt = (i / M) * t_desc;
      vel.push({ t: tt, v: a * tt, x: 0.5 * a * tt * tt });
    }
  }
  return {
    Fg_paral_N: Fpar, Fg_norm_N: m * g * Math.cos(th), Normal_N: N,
    F_atrito_max_N: fs_max, F_atrito_cin_N: fk,
    angle_critical_deg: (Math.atan(p.mu_s) * 180) / Math.PI,
    willMove, acceleration_m_s2: a, t_descida_s: t_desc, v_final_m_s: v_fin,
    velocity: vel,
  };
}

// ============================================================================
// EXP-45 · Lei de Hooke & MHS de uma mola
// ============================================================================
export type SpringAssoc = "single" | "series" | "parallel";
export interface SpringParams {
  k_N_per_m: number;   // mola principal
  k2_N_per_m: number;  // segunda mola
  assoc: SpringAssoc;
  mass_kg: number;
  amplitude_m: number;
  time_s: number;      // instante atual
  g: number;
}
export interface SpringResults {
  k_eq_N_per_m: number;
  T_s: number;          // período 2π√(m/k_eq)
  freq_Hz: number;
  omega_rad_s: number;
  x_static_m: number;   // alongamento estático mg/k
  x_t_m: number;        // x(t) = A·cos(ω·t)
  v_t_m_s: number;      // ẋ(t)
  a_t_m_s2: number;     // ẍ(t)
  U_elastica_J: number; // ½·k·A²
  E_total_J: number;    // mesma coisa (conservação)
  trajectory: { t: number; x: number; v: number }[];
}
export function computeSpring(p: SpringParams): SpringResults {
  const k1 = Math.max(0.001, p.k_N_per_m);
  const k2 = Math.max(0.001, p.k2_N_per_m);
  let k_eq = k1;
  if (p.assoc === "series") k_eq = (k1 * k2) / (k1 + k2);
  else if (p.assoc === "parallel") k_eq = k1 + k2;
  const m = Math.max(0.001, p.mass_kg);
  const omega = Math.sqrt(k_eq / m);
  const T = (2 * Math.PI) / omega;
  const A = p.amplitude_m;
  const x = A * Math.cos(omega * p.time_s);
  const v = -A * omega * Math.sin(omega * p.time_s);
  const a = -A * omega * omega * Math.cos(omega * p.time_s);
  const traj: { t: number; x: number; v: number }[] = [];
  const M = 200;
  for (let i = 0; i <= M; i++) {
    const tt = (i / M) * 3 * T;
    traj.push({ t: tt, x: A * Math.cos(omega * tt), v: -A * omega * Math.sin(omega * tt) });
  }
  return {
    k_eq_N_per_m: k_eq, T_s: T, freq_Hz: 1 / T, omega_rad_s: omega,
    x_static_m: (m * p.g) / k_eq, x_t_m: x, v_t_m_s: v, a_t_m_s2: a,
    U_elastica_J: 0.5 * k_eq * A * A, E_total_J: 0.5 * k_eq * A * A,
    trajectory: traj,
  };
}

// ============================================================================
// EXP-46 · Princípio de Arquimedes & empuxo
// ============================================================================
export interface Fluid { name: string; rho: number /* kg/m³ */ }
export const FLUIDS: Fluid[] = [
  { name: "Água (4 °C)", rho: 1000 },
  { name: "Água do mar", rho: 1025 },
  { name: "Óleo", rho: 920 },
  { name: "Álcool etílico", rho: 789 },
  { name: "Mercúrio", rho: 13546 },
  { name: "Glicerina", rho: 1260 },
];
export interface ArchimedesParams {
  rho_obj_kg_m3: number;       // densidade do objeto
  volume_obj_L: number;         // volume em litros
  rho_fluid_kg_m3: number;
  g: number;
}
export interface ArchimedesResults {
  mass_kg: number;
  weight_N: number;
  V_m3: number;
  V_submerged_m3: number;
  buoyancy_max_N: number;     // se totalmente submerso
  buoyancy_eq_N: number;      // empuxo no equilíbrio (flutuando ou submerso)
  apparent_weight_N: number;  // P − E (peso aparente quando totalmente submerso)
  floats: boolean;
  fraction_submerged: number; // 0 a 1
  height_above_pct: number;   // % acima da linha d'água (se flutua)
}
export function computeArchimedes(p: ArchimedesParams): ArchimedesResults {
  const V = Math.max(1e-9, p.volume_obj_L) * 1e-3;
  const m = p.rho_obj_kg_m3 * V;
  const W = m * p.g;
  const E_full = p.rho_fluid_kg_m3 * V * p.g;
  const floats = p.rho_obj_kg_m3 < p.rho_fluid_kg_m3;
  const frac = floats ? p.rho_obj_kg_m3 / p.rho_fluid_kg_m3 : 1;
  const Vs = V * frac;
  const E_eq = p.rho_fluid_kg_m3 * Vs * p.g;
  return {
    mass_kg: m, weight_N: W, V_m3: V, V_submerged_m3: Vs,
    buoyancy_max_N: E_full, buoyancy_eq_N: E_eq,
    apparent_weight_N: W - E_full,
    floats, fraction_submerged: frac, height_above_pct: (1 - frac) * 100,
  };
}

// ============================================================================
// EXP-47 · Espelhos esféricos (côncavo e convexo)
// ============================================================================
export type MirrorKind = "concave" | "convex";
export interface MirrorParams {
  kind: MirrorKind;
  R_cm: number;       // raio de curvatura (sempre positivo no slider)
  p_cm: number;       // distância do objeto (sempre positiva)
  h_obj_cm: number;   // altura do objeto
}
export interface MirrorResults {
  f_cm: number;       // foco (positivo côncavo, negativo convexo)
  p_cm: number;
  pl_cm: number;      // distância da imagem (sinal: + real, − virtual)
  m: number;          // aumento (−p'/p); + direita / − invertida
  h_img_cm: number;
  isReal: boolean;
  isInverted: boolean;
  isMagnified: boolean;
  region: string;     // descrição qualitativa (entre F e C, além de C, etc.)
}
export function computeMirror(p: MirrorParams): MirrorResults {
  const R = Math.max(0.5, p.R_cm);
  const f = p.kind === "concave" ? R / 2 : -R / 2;
  const po = Math.max(0.1, p.p_cm);
  const denom = 1 / f - 1 / po;
  const pl = Math.abs(denom) < 1e-9 ? Infinity : 1 / denom;
  const m = -pl / po;
  const h_img = m * p.h_obj_cm;
  const isReal = isFinite(pl) && pl > 0;
  const isInverted = m < 0;
  let region = "";
  if (p.kind === "convex") region = "Convexo: imagem sempre virtual, direita e menor";
  else {
    if (po < f) region = "Objeto entre F e o espelho — imagem virtual, direita e maior";
    else if (po < R) region = "Objeto entre F e C — imagem real, invertida e maior";
    else if (Math.abs(po - R) < 0.5) region = "Objeto sobre C — imagem real, invertida, mesmo tamanho";
    else region = "Objeto além de C — imagem real, invertida e menor";
  }
  return {
    f_cm: f, p_cm: po, pl_cm: pl, m, h_img_cm: h_img,
    isReal, isInverted, isMagnified: Math.abs(m) > 1, region,
  };
}

// ============================================================================
// EXP-48 · Oscilações forçadas e ressonância
// ============================================================================
export interface ForcedParams {
  mass_kg: number;
  k_N_per_m: number;
  b_N_s_per_m: number;
  F0_N: number;
  driveOmega_rad_s: number; // frequência da força externa
  duration_s: number;
}
export interface ForcedResults {
  omega0_rad_s: number;     // ω₀ = √(k/m)
  gamma_per_s: number;      // γ = b/(2m)
  Q: number;                // ω₀/(2γ)
  omegaR_rad_s: number;     // pico da amplitude: √(ω₀² − 2γ²)
  A_drive_m: number;        // amplitude estacionária na ω atual
  phase_rad: number;        // defasagem φ
  bandwidth_rad_s: number;  // Δω ≈ 2γ
  Amax_m: number;           // amplitude no pico
  sweep: { omega: number; A: number; phase: number }[]; // curva A(ω) e φ(ω)
  trajectory: { t: number; x: number; F: number }[];    // resposta x(t) (estacionária)
}
export function computeForcedOscillator(p: ForcedParams): ForcedResults {
  const m = Math.max(1e-6, p.mass_kg);
  const k = Math.max(1e-6, p.k_N_per_m);
  const b = Math.max(0, p.b_N_s_per_m);
  const omega0 = Math.sqrt(k / m);
  const gamma = b / (2 * m);
  const Q = gamma > 0 ? omega0 / (2 * gamma) : Infinity;
  const omegaR2 = omega0 * omega0 - 2 * gamma * gamma;
  const omegaR = omegaR2 > 0 ? Math.sqrt(omegaR2) : 0;
  const ampAt = (w: number) => (p.F0_N / m) / Math.sqrt((omega0 * omega0 - w * w) ** 2 + (2 * gamma * w) ** 2);
  const phaseAt = (w: number) => Math.atan2(2 * gamma * w, omega0 * omega0 - w * w);
  const A_drive = ampAt(p.driveOmega_rad_s);
  const phase = phaseAt(p.driveOmega_rad_s);
  const Amax = omegaR > 0 ? ampAt(omegaR) : ampAt(omega0);

  const N = 240;
  const wMax = Math.max(omega0 * 3, p.driveOmega_rad_s * 1.5, 1);
  const sweep: { omega: number; A: number; phase: number }[] = [];
  for (let i = 1; i <= N; i++) {
    const w = (i / N) * wMax;
    sweep.push({ omega: w, A: ampAt(w), phase: phaseAt(w) });
  }

  const dur = Math.max(0.1, p.duration_s);
  const M = 400;
  const trajectory: { t: number; x: number; F: number }[] = [];
  for (let i = 0; i <= M; i++) {
    const t = (i / M) * dur;
    const x = A_drive * Math.cos(p.driveOmega_rad_s * t - phase);
    const F = p.F0_N * Math.cos(p.driveOmega_rad_s * t);
    trajectory.push({ t, x, F });
  }

  return {
    omega0_rad_s: omega0,
    gamma_per_s: gamma,
    Q,
    omegaR_rad_s: omegaR,
    A_drive_m: A_drive,
    phase_rad: phase,
    bandwidth_rad_s: 2 * gamma,
    Amax_m: Amax,
    sweep,
    trajectory,
  };
}

// ============================================================================
// EXP-49 · Batimentos (superposição de dois MHS)
// ============================================================================
export interface BeatsParams {
  f1_Hz: number;
  f2_Hz: number;
  A_m: number;     // amplitude de cada componente
  duration_s: number;
}
export interface BeatsResults {
  fBeat_Hz: number;    // |f1 − f2|
  fAvg_Hz: number;     // (f1 + f2)/2
  Tbeat_s: number;     // 1/f_beat (envelope completo entre máximos)
  TenvHalf_s: number;  // 1/(2 f_beat) (entre nós consecutivos)
  Amax_m: number;      // 2A
  trajectory: { t: number; x: number; env: number }[];
}
export function computeBeats(p: BeatsParams): BeatsResults {
  const f1 = p.f1_Hz, f2 = p.f2_Hz;
  const fBeat = Math.abs(f1 - f2);
  const fAvg = (f1 + f2) / 2;
  const dur = Math.max(0.01, p.duration_s);
  const A = p.A_m;
  const M = 800;
  const trajectory: { t: number; x: number; env: number }[] = [];
  for (let i = 0; i <= M; i++) {
    const t = (i / M) * dur;
    const env = 2 * A * Math.cos(Math.PI * (f1 - f2) * t);
    const x = env * Math.cos(2 * Math.PI * fAvg * t);
    trajectory.push({ t, x, env });
  }
  return {
    fBeat_Hz: fBeat,
    fAvg_Hz: fAvg,
    Tbeat_s: fBeat > 0 ? 1 / fBeat : Infinity,
    TenvHalf_s: fBeat > 0 ? 1 / (2 * fBeat) : Infinity,
    Amax_m: 2 * A,
    trajectory,
  };
}

// ============================================================================
// EXP-50 · Ciclo de Carnot e máquinas térmicas
// ============================================================================
export interface CarnotParams {
  moles: number;
  gamma: number;     // Cp/Cv
  Th_K: number;      // reservatório quente
  Tc_K: number;      // reservatório frio
  V1_L: number;      // início da expansão isotérmica quente
  V2_L: number;      // fim da expansão isotérmica quente
}
export interface CarnotResults {
  efficiency: number;          // 1 − Tc/Th
  efficiencyOtto: number;      // 1 − 1/r^(γ−1), r = V1/V2
  Qh_J: number;                // calor absorvido (quente)
  Qc_J: number;                // calor rejeitado (frio, valor absoluto)
  Wnet_J: number;              // trabalho líquido
  V3_L: number;                // após adiabática 2→3
  V4_L: number;                // após isotérmica fria 3→4
  cycle: { P_Pa: number; V_L: number; T_K: number; leg: 1 | 2 | 3 | 4 }[];
}
export function computeCarnot(p: CarnotParams): CarnotResults {
  const R = 8.314;
  const n = Math.max(1e-6, p.moles);
  const g = Math.max(1.01, p.gamma);
  const Th = Math.max(1, p.Th_K);
  const Tc = Math.max(1, Math.min(p.Tc_K, Th - 0.01));
  const V1 = Math.max(1e-3, p.V1_L) * 1e-3; // m³
  const V2 = Math.max(V1 * 1.0001, p.V2_L * 1e-3);
  // adiabática 2→3: T·V^(γ−1) = const → V3 = V2 · (Th/Tc)^(1/(γ−1))
  const V3 = V2 * Math.pow(Th / Tc, 1 / (g - 1));
  // adiabática 4→1: V4 = V1 · (Th/Tc)^(1/(γ−1))
  const V4 = V1 * Math.pow(Th / Tc, 1 / (g - 1));
  const Qh = n * R * Th * Math.log(V2 / V1);
  const Qc = n * R * Tc * Math.log(V3 / V4); // > 0, rejeitado
  const Wnet = Qh - Qc;
  const eff = 1 - Tc / Th;
  const rOtto = V1 > 0 ? V2 / V1 : 1;
  const effOtto = 1 - Math.pow(1 / Math.max(1.01, rOtto), g - 1);

  const cycle: CarnotResults["cycle"] = [];
  const seg = 60;
  // 1→2 isotérmica Th
  for (let i = 0; i <= seg; i++) {
    const V = V1 + (V2 - V1) * (i / seg);
    cycle.push({ V_L: V * 1e3, P_Pa: (n * R * Th) / V, T_K: Th, leg: 1 });
  }
  // 2→3 adiabática
  const K23 = (n * R * Th) * Math.pow(V2, g - 1); // P·V^γ = nRT·V^(γ-1)
  for (let i = 1; i <= seg; i++) {
    const V = V2 + (V3 - V2) * (i / seg);
    const P = K23 / Math.pow(V, g);
    cycle.push({ V_L: V * 1e3, P_Pa: P, T_K: (P * V) / (n * R), leg: 2 });
  }
  // 3→4 isotérmica Tc
  for (let i = 1; i <= seg; i++) {
    const V = V3 + (V4 - V3) * (i / seg);
    cycle.push({ V_L: V * 1e3, P_Pa: (n * R * Tc) / V, T_K: Tc, leg: 3 });
  }
  // 4→1 adiabática
  const K41 = (n * R * Tc) * Math.pow(V4, g - 1);
  for (let i = 1; i <= seg; i++) {
    const V = V4 + (V1 - V4) * (i / seg);
    const P = K41 / Math.pow(V, g);
    cycle.push({ V_L: V * 1e3, P_Pa: P, T_K: (P * V) / (n * R), leg: 4 });
  }
  return { efficiency: eff, efficiencyOtto: effOtto, Qh_J: Qh, Qc_J: Qc, Wnet_J: Wnet, V3_L: V3 * 1e3, V4_L: V4 * 1e3, cycle };
}

// ============================================================================
// EXP-51 · Condução de calor (Lei de Fourier)
// ============================================================================
export interface FourierLayer { name: string; k_W_mK: number; L_m: number }
export interface FourierParams {
  T_hot_K: number;
  T_cold_K: number;
  area_m2: number;
  layers: FourierLayer[];
}
export interface FourierResults {
  q_W: number;                 // taxa de calor
  flux_W_m2: number;           // q/A
  R_total_K_per_W: number;     // soma das resistências
  interfaceTemps_K: number[];  // T em cada interface (n+1 pontos)
  profile: { x_m: number; T_K: number }[];
}
export function computeFourier(p: FourierParams): FourierResults {
  const dT = p.T_hot_K - p.T_cold_K;
  const A = Math.max(1e-6, p.area_m2);
  const R = p.layers.map((l) => l.L_m / (Math.max(1e-6, l.k_W_mK) * A));
  const Rtot = R.reduce((a, b) => a + b, 0) || 1e-9;
  const q = dT / Rtot;
  const flux = q / A;
  const interfaceTemps: number[] = [p.T_hot_K];
  let T = p.T_hot_K;
  for (const Ri of R) { T -= q * Ri; interfaceTemps.push(T); }
  const profile: { x_m: number; T_K: number }[] = [];
  let x = 0;
  for (let i = 0; i < p.layers.length; i++) {
    const L = p.layers[i].L_m;
    const T0 = interfaceTemps[i], T1 = interfaceTemps[i + 1];
    const steps = 20;
    for (let s = 0; s <= steps; s++) {
      const xi = x + (L * s) / steps;
      const Ti = T0 + (T1 - T0) * (s / steps);
      profile.push({ x_m: xi, T_K: Ti });
    }
    x += L;
  }
  return { q_W: q, flux_W_m2: flux, R_total_K_per_W: Rtot, interfaceTemps_K: interfaceTemps, profile };
}

// ============================================================================
// EXP-52 · Distribuição de Maxwell-Boltzmann
// ============================================================================
export interface MaxwellParams {
  T_K: number;
  M_g_per_mol: number;   // massa molar
  vMax_m_s: number;      // limite superior do gráfico
}
export interface MaxwellResults {
  v_mp: number;          // mais provável √(2RT/M)
  v_avg: number;         // √(8RT/(πM))
  v_rms: number;         // √(3RT/M)
  distribution: { v: number; f: number }[];   // f(v)
  histogram: { v: number; count: number }[];  // amostragem por rejeição
  samples: number;
}
export function computeMaxwell(p: MaxwellParams): MaxwellResults {
  const R = 8.314;
  const M = Math.max(1e-6, p.M_g_per_mol) * 1e-3; // kg/mol
  const T = Math.max(1, p.T_K);
  const a = M / (2 * R * T);
  const v_mp = Math.sqrt(2 * R * T / M);
  const v_avg = Math.sqrt(8 * R * T / (Math.PI * M));
  const v_rms = Math.sqrt(3 * R * T / M);
  const f = (v: number) => 4 * Math.PI * Math.pow(a / Math.PI, 1.5) * v * v * Math.exp(-a * v * v);
  const vMax = Math.max(p.vMax_m_s, v_rms * 2.5);
  const N = 240;
  const distribution: { v: number; f: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const v = (i / N) * vMax;
    distribution.push({ v, f: f(v) });
  }
  // Amostragem pseudo-determinística (semente fixa) por rejeição
  const samples = 2000;
  const fmax = f(v_mp);
  const bins = 40;
  const histogram = Array.from({ length: bins }, (_, i) => ({ v: ((i + 0.5) / bins) * vMax, count: 0 }));
  let s = 12345;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  let collected = 0;
  for (let i = 0; i < samples * 6 && collected < samples; i++) {
    const v = rnd() * vMax;
    const y = rnd() * fmax * 1.05;
    if (y <= f(v)) {
      const b = Math.min(bins - 1, Math.floor((v / vMax) * bins));
      histogram[b].count++;
      collected++;
    }
  }
  return { v_mp, v_avg, v_rms, distribution, histogram, samples: collected };
}

// ============================================================================
// EXP-53 · Radiação térmica (Stefan-Boltzmann & Wien)
// ============================================================================
export interface StefanParams {
  T1_K: number;            // corpo emissor
  T2_K: number;            // ambiente
  emissivity: number;      // ε ∈ [0,1]
  area_m2: number;
}
export interface StefanResults {
  P_emitted_W: number;     // εσA T1^4
  P_absorbed_W: number;    // εσA T2^4 (ambiente como corpo negro)
  P_net_W: number;         // εσA (T1^4 − T2^4)
  lambda_max_m: number;    // Wien: b/T1
  flux_W_m2: number;       // εσ T1^4
  spectrum: { lambda_nm: number; B: number }[];   // radiância espectral de Planck (T1)
  curveT: { T_K: number; P: number }[];           // varredura P(T)
}
export function computeStefan(p: StefanParams): StefanResults {
  const sigma = 5.670374419e-8;
  const b = 2.897771955e-3;
  const h = 6.62607015e-34, c = 2.99792458e8, kB = 1.380649e-23;
  const eps = Math.max(0, Math.min(1, p.emissivity));
  const A = Math.max(0, p.area_m2);
  const T1 = Math.max(1, p.T1_K);
  const T2 = Math.max(1, p.T2_K);
  const Pe = eps * sigma * A * Math.pow(T1, 4);
  const Pa = eps * sigma * A * Math.pow(T2, 4);
  const lambdaMax = b / T1;
  const planck = (lam: number, T: number) => {
    const x = (h * c) / (lam * kB * T);
    return (2 * h * c * c) / Math.pow(lam, 5) / (Math.exp(x) - 1);
  };
  const spectrum: { lambda_nm: number; B: number }[] = [];
  const lamMaxPlot = Math.max(lambdaMax * 4, 3000e-9);
  const N = 240;
  for (let i = 1; i <= N; i++) {
    const lam = (i / N) * lamMaxPlot;
    spectrum.push({ lambda_nm: lam * 1e9, B: planck(lam, T1) });
  }
  const curveT: { T_K: number; P: number }[] = [];
  const Tmax = Math.max(T1, T2) * 1.5 + 100;
  for (let i = 1; i <= 80; i++) {
    const T = (i / 80) * Tmax;
    curveT.push({ T_K: T, P: eps * sigma * A * Math.pow(T, 4) });
  }
  return {
    P_emitted_W: Pe,
    P_absorbed_W: Pa,
    P_net_W: Pe - Pa,
    lambda_max_m: lambdaMax,
    flux_W_m2: eps * sigma * Math.pow(T1, 4),
    spectrum,
    curveT,
  };
}

// =============================================================
// EXP-54 · Bernoulli / Venturi
// =============================================================
export interface BernoulliParams {
  P1_Pa: number;
  v1_ms: number;
  A1_m2: number;
  A2_m2: number;
  rho_kg_m3: number;
  h1_m: number;
  h2_m: number;
}
export interface BernoulliResults {
  v2_ms: number;
  P2_Pa: number;
  Q_m3s: number;          // vazão volumétrica
  massFlow_kgs: number;
  deltaP_Pa: number;      // P1 − P2
  reynolds: number;       // baseado em diâmetro da seção 2
  profile: { x: number; A: number; v: number; P: number }[]; // varredura ao longo do tubo
}
export function computeBernoulli(p: BernoulliParams): BernoulliResults {
  const g = 9.80665;
  const A1 = Math.max(1e-9, p.A1_m2);
  const A2 = Math.max(1e-9, p.A2_m2);
  const v2 = (p.v1_ms * A1) / A2;
  const P2 = p.P1_Pa + 0.5 * p.rho_kg_m3 * (p.v1_ms ** 2 - v2 ** 2) + p.rho_kg_m3 * g * (p.h1_m - p.h2_m);
  const Q = A1 * p.v1_ms;
  const d2 = 2 * Math.sqrt(A2 / Math.PI);
  const eta = 1e-3; // água a 20 °C (referência)
  const Re = (p.rho_kg_m3 * v2 * d2) / eta;
  const profile: { x: number; A: number; v: number; P: number }[] = [];
  const N = 80;
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    // garganta em x ≈ 0.5 (interpolação suave entre A1 e A2)
    const s = Math.cos(Math.PI * x) * 0.5 + 0.5; // 1 nas pontas, 0 no meio
    const A = A2 + (A1 - A2) * s;
    const v = (p.v1_ms * A1) / A;
    const h = p.h1_m + (p.h2_m - p.h1_m) * x;
    const P = p.P1_Pa + 0.5 * p.rho_kg_m3 * (p.v1_ms ** 2 - v ** 2) + p.rho_kg_m3 * g * (p.h1_m - h);
    profile.push({ x, A, v, P });
  }
  return { v2_ms: v2, P2_Pa: P2, Q_m3s: Q, massFlow_kgs: Q * p.rho_kg_m3, deltaP_Pa: p.P1_Pa - P2, reynolds: Re, profile };
}

// =============================================================
// EXP-55 · Lei de Stokes (esfera caindo em fluido viscoso)
// =============================================================
export interface StokesParams {
  radius_mm: number;
  rho_sphere: number;     // kg/m³
  rho_fluid: number;      // kg/m³
  eta_Pas: number;        // viscosidade dinâmica
}
export interface StokesResults {
  v_terminal: number;     // m/s
  tau_s: number;          // tempo característico
  reynolds: number;       // a v_terminal
  drag_N: number;         // F_d = 6πη r v_t
  weight_N: number;
  buoyancy_N: number;
  series: { t: number; v: number; x: number }[];
}
export function computeStokes(p: StokesParams): StokesResults {
  const g = 9.80665;
  const r = Math.max(1e-6, p.radius_mm) * 1e-3;
  const V = (4 / 3) * Math.PI * r ** 3;
  const m = p.rho_sphere * V;
  const W = m * g;
  const Fb = p.rho_fluid * V * g;
  const vt = (2 * (p.rho_sphere - p.rho_fluid) * g * r * r) / (9 * Math.max(1e-9, p.eta_Pas));
  const tau = m / (6 * Math.PI * p.eta_Pas * r);
  const Re = (2 * p.rho_fluid * Math.abs(vt) * r) / Math.max(1e-9, p.eta_Pas);
  const Fd = 6 * Math.PI * p.eta_Pas * r * vt;
  const series: { t: number; v: number; x: number }[] = [];
  const T = Math.max(4 * Math.abs(tau), 1);
  const N = 200;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T;
    const v = vt * (1 - Math.exp(-t / tau));
    const x = vt * (t + tau * (Math.exp(-t / tau) - 1));
    series.push({ t, v, x });
  }
  return { v_terminal: vt, tau_s: tau, reynolds: Re, drag_N: Fd, weight_N: W, buoyancy_N: Fb, series };
}

// =============================================================
// EXP-56 · Escoamento de Poiseuille (tubo cilíndrico)
// =============================================================
export interface PoiseuilleParams {
  deltaP_Pa: number;
  L_m: number;
  radius_mm: number;
  eta_Pas: number;
  rho_kg_m3: number;
}
export interface PoiseuilleResults {
  Q_m3s: number;
  v_max: number;
  v_mean: number;
  resistance: number;     // R_h = 8ηL/(πR⁴)
  reynolds: number;       // 2ρ v_mean R / η
  shear_wall_Pa: number;  // τ_w = ΔP R / (2L)
  profile: { r: number; v: number }[]; // perfil parabólico v(r)
}
export function computePoiseuille(p: PoiseuilleParams): PoiseuilleResults {
  const R = Math.max(1e-6, p.radius_mm) * 1e-3;
  const eta = Math.max(1e-9, p.eta_Pas);
  const L = Math.max(1e-6, p.L_m);
  const Q = (Math.PI * Math.pow(R, 4) * p.deltaP_Pa) / (8 * eta * L);
  const v_max = (p.deltaP_Pa * R * R) / (4 * eta * L);
  const v_mean = v_max / 2;
  const Rh = (8 * eta * L) / (Math.PI * Math.pow(R, 4));
  const Re = (2 * p.rho_kg_m3 * v_mean * R) / eta;
  const tau_w = (p.deltaP_Pa * R) / (2 * L);
  const profile: { r: number; v: number }[] = [];
  const N = 80;
  for (let i = -N; i <= N; i++) {
    const r = (i / N) * R;
    const v = v_max * (1 - (r * r) / (R * R));
    profile.push({ r, v });
  }
  return { Q_m3s: Q, v_max, v_mean, resistance: Rh, reynolds: Re, shear_wall_Pa: tau_w, profile };
}
