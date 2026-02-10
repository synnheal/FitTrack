/**
 * Recipe macro calculator - computes nutritional values from ingredients.
 */

export interface FoodNutrition {
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

export interface IngredientInput {
  food: FoodNutrition;
  quantity_grams: number;
}

export interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Calculate total macros for a recipe given its ingredients.
 * @param ingredients - Array of ingredients with food nutrition data and quantity
 * @param servings - Number of servings the recipe makes (default 1)
 * @returns Macros per serving, rounded to 1 decimal
 */
export function calculateRecipeMacros(
  ingredients: IngredientInput[],
  servings: number = 1
): MacroResult {
  if (ingredients.length === 0 || servings <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const totals = ingredients.reduce(
    (acc, { food, quantity_grams }) => {
      const factor = quantity_grams / 100;
      return {
        calories: acc.calories + food.calories_per_100g * factor,
        protein: acc.protein + food.protein_per_100g * factor,
        carbs: acc.carbs + food.carbs_per_100g * factor,
        fat: acc.fat + food.fat_per_100g * factor,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    calories: Math.round((totals.calories / servings) * 10) / 10,
    protein: Math.round((totals.protein / servings) * 10) / 10,
    carbs: Math.round((totals.carbs / servings) * 10) / 10,
    fat: Math.round((totals.fat / servings) * 10) / 10,
  };
}
