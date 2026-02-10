export interface UnifiedFoodResult {
  source: 'local' | 'openfoodfacts' | 'fatsecret';
  local_id: string | null;
  external_id: string | null;
  name: string;
  brand: string | null;
  barcode: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  image_url: string | null;
}
