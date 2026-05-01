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