import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import { foodSearchSchema } from '@/lib/validations/nutrition';
import { searchFoods, findFoodByBarcode, findOrCreateFoodByBarcode } from '@/lib/services/nutrition-service';
import { lookupOFFBarcode, searchOFFFoods } from '@/lib/services/openfoodfacts-service';
import { searchFatSecretFoods } from '@/lib/services/fatsecret-service';
import type { UnifiedFoodResult } from '@/types/food-search';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function localFoodToUnified(food: any): UnifiedFoodResult {
  return {
    source: 'local',
    local_id: food.id,
    external_id: null,
    name: food.name,
    brand: food.brand || null,
    barcode: food.barcode || null,
    calories_per_100g: food.calories_per_100g,
    protein_per_100g: food.protein_per_100g,
    carbs_per_100g: food.carbs_per_100g,
    fat_per_100g: food.fat_per_100g,
    image_url: null,
  };
}

function deduplicateResults(results: UnifiedFoodResult[]): UnifiedFoodResult[] {
  const seen = new Map<string, UnifiedFoodResult>();
  const sourcePriority: Record<string, number> = { local: 0, fatsecret: 1, openfoodfacts: 2 };

  for (const item of results) {
    const key = item.barcode || `${item.source}:${item.external_id || item.name}`;
    const existing = seen.get(key);

    if (!existing || sourcePriority[item.source] < sourcePriority[existing.source]) {
      seen.set(key, item);
    }
  }

  return Array.from(seen.values());
}

export async function GET(request: NextRequest) {
  try {
    const params = {
      q: request.nextUrl.searchParams.get('q') || undefined,
      barcode: request.nextUrl.searchParams.get('barcode') || undefined,
    };

    const validated = foodSearchSchema.parse(params);

    // --- Barcode lookup ---
    if (validated.barcode) {
      // 1. Check local DB first
      const localFood = await findFoodByBarcode(validated.barcode);
      if (localFood) {
        return successResponse([localFoodToUnified(localFood)]);
      }

      // 2. Try OpenFoodFacts
      const offResult = await lookupOFFBarcode(validated.barcode);
      if (offResult) {
        // Save to local DB for future lookups
        await findOrCreateFoodByBarcode(validated.barcode, {
          name: offResult.name,
          brand: offResult.brand,
          calories_per_100g: offResult.calories_per_100g,
          protein_per_100g: offResult.protein_per_100g,
          carbs_per_100g: offResult.carbs_per_100g,
          fat_per_100g: offResult.fat_per_100g,
        });
        return successResponse([offResult]);
      }

      return successResponse([]);
    }

    // --- Text search ---
    const query = validated.q!;

    const [fatSecretResult, offResult, localResult] = await Promise.allSettled([
      searchFatSecretFoods(query),
      searchOFFFoods(query),
      searchFoods(query),
    ]);

    const allResults: UnifiedFoodResult[] = [];

    // FatSecret results (priority for text search)
    if (fatSecretResult.status === 'fulfilled') {
      allResults.push(...fatSecretResult.value);
    }

    // OFF results
    if (offResult.status === 'fulfilled') {
      allResults.push(...offResult.value);
    }

    // Local DB results
    if (localResult.status === 'fulfilled') {
      allResults.push(...localResult.value.map(localFoodToUnified));
    }

    const deduplicated = deduplicateResults(allResults);
    return successResponse(deduplicated.slice(0, 50));
  } catch (error) {
    return handleApiError(error);
  }
}
