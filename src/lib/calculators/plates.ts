/**
 * Plate calculator - determines which plates to load on each side of the bar.
 */

export interface PlateResult {
  plate: number;
  count: number;
}

const STANDARD_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

/**
 * Calculate plates needed per side to reach the target weight.
 * @param targetWeight - Desired total barbell weight in kg
 * @param barWeight - Weight of the empty bar in kg (default 20)
 * @returns Array of plate pairs needed per side, sorted largest first
 */
export function calculatePlates(
  targetWeight: number,
  barWeight: number = 20
): PlateResult[] {
  if (targetWeight <= barWeight) return [];

  let remaining = (targetWeight - barWeight) / 2;
  const result: PlateResult[] = [];

  for (const plate of STANDARD_PLATES) {
    if (remaining >= plate) {
      const count = Math.floor(remaining / plate);
      result.push({ plate, count });
      remaining = Math.round((remaining - plate * count) * 100) / 100;
    }
  }

  return result;
}
