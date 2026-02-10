/**
 * Estimated 1 Rep Max calculators using multiple formulas.
 * All functions are pure with no side effects.
 */

export interface OneRMResult {
  epley: number;
  brzycki: number;
  lombardi: number;
  average: number;
}

/** Epley formula: weight × (1 + reps / 30) */
function epley(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/** Brzycki formula: weight × 36 / (37 - reps) */
function brzycki(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps >= 37) return weight; // formula breaks at 37+
  return weight * (36 / (37 - reps));
}

/** Lombardi formula: weight × reps^0.10 */
function lombardi(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * Math.pow(reps, 0.10);
}

/**
 * Calculate estimated 1RM using three formulas and return their average.
 * @param weight - Weight lifted in kg
 * @param reps - Number of repetitions performed (must be >= 1)
 */
export function calculate1RM(weight: number, reps: number): OneRMResult {
  if (weight <= 0 || reps < 1) {
    return { epley: 0, brzycki: 0, lombardi: 0, average: 0 };
  }

  const e = Math.round(epley(weight, reps) * 10) / 10;
  const b = Math.round(brzycki(weight, reps) * 10) / 10;
  const l = Math.round(lombardi(weight, reps) * 10) / 10;
  const avg = Math.round(((e + b + l) / 3) * 10) / 10;

  return { epley: e, brzycki: b, lombardi: l, average: avg };
}
