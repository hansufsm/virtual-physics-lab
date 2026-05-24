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
