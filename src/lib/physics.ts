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