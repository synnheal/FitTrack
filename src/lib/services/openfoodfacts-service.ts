import type { UnifiedFoodResult } from '@/types/food-search';

const OFF_BASE_URL = 'https://world.openfoodfacts.org';
const TIMEOUT_MS = 5000;
const USER_AGENT = 'MonAppFitness/1.0 (contact@monappfitness.com)';

async function fetchOFF(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    });
  } finally {
    clearTimeout(timeout);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(product: any, barcode?: string): UnifiedFoodResult | null {
  const nutriments = product.nutriments;
  if (!nutriments) return null;

  const name = product.product_name || product.generic_name;
  if (!name) return null;

  return {
    source: 'openfoodfacts',
    local_id: null,
    external_id: product.code || barcode || null,
    name,
    brand: product.brands || null,
    barcode: product.code || barcode || null,
    calories_per_100g: Math.round(nutriments['energy-kcal_100g'] || 0),
    protein_per_100g: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
    carbs_per_100g: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
    fat_per_100g: Math.round((nutriments.fat_100g || 0) * 10) / 10,
    image_url: product.image_front_small_url || null,
  };
}

export async function lookupOFFBarcode(barcode: string): Promise<UnifiedFoodResult | null> {
  try {
    const res = await fetchOFF(
      `${OFF_BASE_URL}/api/v2/product/${encodeURIComponent(barcode)}.json`
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    return normalizeProduct(data.product, barcode);
  } catch {
    return null;
  }
}

export async function searchOFFFoods(query: string): Promise<UnifiedFoodResult[]> {
  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: '1',
      action: 'process',
      json: '1',
      page_size: '25',
      fields: 'code,product_name,generic_name,brands,nutriments,image_front_small_url',
    });

    const res = await fetchOFF(`${OFF_BASE_URL}/cgi/search.pl?${params}`);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.products || !Array.isArray(data.products)) return [];

    return data.products
      .map((p: unknown) => normalizeProduct(p))
      .filter((r: UnifiedFoodResult | null): r is UnifiedFoodResult => r !== null);
  } catch {
    return [];
  }
}
