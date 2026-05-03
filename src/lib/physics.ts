// Constantes e utilidades para o experimento de capacitor de placas paralelas
export const EPSILON_0 = 8.854e-12; // F/m

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