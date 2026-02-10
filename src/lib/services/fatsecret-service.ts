import type { UnifiedFoodResult } from '@/types/food-search';

const FATSECRET_TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';
const FATSECRET_API_URL = 'https://platform.fatsecret.com/rest/server.api';
const TIMEOUT_MS = 5000;

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = process.env.FATSECRET_CLIENT_ID;
  const clientSecret = process.env.FATSECRET_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('FatSecret credentials not configured');
  }

  const res = await fetch(FATSECRET_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials&scope=basic',
  });

  if (!res.ok) {
    throw new Error(`FatSecret token request failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.access_token;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeServing(food: any): UnifiedFoodResult | null {
  const servings = food.servings?.serving;
  if (!servings) return null;

  const serving = Array.isArray(servings) ? servings[0] : servings;

  const metricAmount = parseFloat(serving.metric_serving_amount) || 100;
  const factor = 100 / metricAmount;

  return {
    source: 'fatsecret',
    local_id: null,
    external_id: String(food.food_id),
    name: food.food_name || 'Unknown',
    brand: food.brand_name || null,
    barcode: null,
    calories_per_100g: Math.round((parseFloat(serving.calories) || 0) * factor),
    protein_per_100g: Math.round(((parseFloat(serving.protein) || 0) * factor) * 10) / 10,
    carbs_per_100g: Math.round(((parseFloat(serving.carbohydrate) || 0) * factor) * 10) / 10,
    fat_per_100g: Math.round(((parseFloat(serving.fat) || 0) * factor) * 10) / 10,
    image_url: null,
  };
}

export async function searchFatSecretFoods(query: string): Promise<UnifiedFoodResult[]> {
  try {
    const token = await getAccessToken();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const params = new URLSearchParams({
        method: 'foods.search',
        search_expression: query,
        format: 'json',
        max_results: '25',
      });

      const res = await fetch(`${FATSECRET_API_URL}?${params}`, {
        signal: controller.signal,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return [];

      const data = await res.json();
      const foods = data.foods?.food;
      if (!foods) return [];

      const foodList = Array.isArray(foods) ? foods : [foods];

      // Fetch details with servings for each food (batch with Promise.allSettled)
      const detailPromises = foodList.slice(0, 25).map(async (f: { food_id: string }) => {
        const detailParams = new URLSearchParams({
          method: 'food.get.v4',
          food_id: String(f.food_id),
          format: 'json',
        });

        const detailRes = await fetch(`${FATSECRET_API_URL}?${detailParams}`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!detailRes.ok) return null;
        const detail = await detailRes.json();
        return detail.food ? normalizeServing(detail.food) : null;
      });

      const results = await Promise.allSettled(detailPromises);
      return results
        .filter((r): r is PromiseFulfilledResult<UnifiedFoodResult | null> => r.status === 'fulfilled')
        .map(r => r.value)
        .filter((r): r is UnifiedFoodResult => r !== null);
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return [];
  }
}
