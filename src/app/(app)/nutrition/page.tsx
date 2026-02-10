'use client';

import { useState } from 'react';
import { Plus, Coffee, Sun, Moon, Apple, ChevronRight, ScanBarcode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarcodeScanner } from '@/components/barcode-scanner';
import { AddFoodModal, type AddedMeal } from '@/components/add-food-modal';

interface Meal {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealGroup {
  label: string;
  icon: React.ElementType;
  meals: Meal[];
}

const initialMealGroups: MealGroup[] = [
  { label: 'Petit-déjeuner', icon: Coffee, meals: [] },
  { label: 'Déjeuner', icon: Sun, meals: [] },
  { label: 'Collation', icon: Apple, meals: [] },
  { label: 'Dîner', icon: Moon, meals: [] },
];

const goals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

function MacroBar({
  label,
  current,
  goal,
  color,
}: {
  label: string;
  current: number;
  goal: number;
  color: string;
}) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-bold">
          <span className={color}>{current}g</span>
          <span className="text-gray-500"> / {goal}g</span>
        </span>
      </div>
      <div className="h-2.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function NutritionPage() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [mealGroups, setMealGroups] = useState(initialMealGroups);

  const totals = mealGroups.reduce(
    (acc, g) => {
      g.meals.forEach((m) => {
        acc.kcal += m.kcal;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fat += m.fat;
      });
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-8">
      {/* Add Food Modal */}
      {showAddFood && (
        <AddFoodModal
          onClose={() => setShowAddFood(false)}
          onFoodAdded={(meal: AddedMeal) => {
            const mealTypeToIndex: Record<string, number> = {
              breakfast: 0,
              lunch: 1,
              snack: 2,
              dinner: 3,
            };
            const groupIdx = mealTypeToIndex[meal.meal_type] ?? 3;
            setMealGroups((prev) =>
              prev.map((g, i) =>
                i === groupIdx
                  ? {
                      ...g,
                      meals: [
                        ...g.meals,
                        {
                          name: meal.brand ? `${meal.name} (${meal.brand})` : meal.name,
                          kcal: meal.kcal,
                          protein: meal.protein,
                          carbs: meal.carbs,
                          fat: meal.fat,
                        },
                      ],
                    }
                  : g
              )
            );
            setShowAddFood(false);
          }}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onFoodFound={(food) => {
            // Add scanned food to the last meal group (Dîner)
            setMealGroups((prev) =>
              prev.map((g, i) =>
                i === prev.length - 1
                  ? {
                      ...g,
                      meals: [
                        ...g.meals,
                        {
                          name: food.brand ? `${food.name} (${food.brand})` : food.name,
                          kcal: food.calories_per_100g,
                          protein: food.protein_per_100g,
                          carbs: food.carbs_per_100g,
                          fat: food.fat_per_100g,
                        },
                      ],
                    }
                  : g
              )
            );
            setShowScanner(false);
          }}
        />
      )}

      {/* Daily Summary */}
      <Card>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Aujourd&apos;hui</h2>
            <span className="text-sm text-gray-400">
              {totals.kcal} / {goals.kcal} kcal
            </span>
          </div>

          {/* Calorie ring */}
          <div className="flex items-center justify-center py-2">
            <div className="w-36 h-36 rounded-full border-8 border-border flex items-center justify-center relative">
              <svg className="w-full h-full absolute top-0 left-0 -rotate-90 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" viewBox="0 0 132 132">
                <circle
                  cx="66"
                  cy="66"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-brand"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={
                    2 * Math.PI * 58 * (1 - Math.min(totals.kcal / goals.kcal, 1))
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <span className="block text-2xl font-bold text-white">
                  {totals.kcal.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">kcal</span>
              </div>
            </div>
          </div>

          {/* Macro progress bars */}
          <div className="space-y-4">
            <MacroBar label="Protéines" current={totals.protein} goal={goals.protein} color="text-macro-protein" />
            <MacroBar label="Glucides" current={totals.carbs} goal={goals.carbs} color="text-macro-carbs" />
            <MacroBar label="Lipides" current={totals.fat} goal={goals.fat} color="text-macro-fat" />
          </div>
        </CardContent>
      </Card>

      {/* Meal Groups */}
      <div className="space-y-4">
        {mealGroups.map((group) => {
          const groupKcal = group.meals.reduce((s, m) => s + m.kcal, 0);
          const isOpen = expandedGroup === group.label;

          return (
            <Card key={group.label}>
              <CardContent>
                <button
                  onClick={() => setExpandedGroup(isOpen ? null : group.label)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                      <group.icon size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold">{group.label}</h3>
                      <p className="text-sm text-gray-400">
                        {group.meals.length} aliment{group.meals.length > 1 ? 's' : ''} &bull; {groupKcal} kcal
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-3 border-t border-border pt-4">
                    {group.meals.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">Aucun aliment</p>
                    ) : (
                      group.meals.map((meal, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2">
                          <div>
                            <p className="font-medium text-sm">{meal.name}</p>
                            <p className="text-xs text-gray-500">
                              P:{meal.protein}g &bull; G:{meal.carbs}g &bull; L:{meal.fat}g
                            </p>
                          </div>
                          <span className="text-sm font-bold text-gray-300">{meal.kcal} kcal</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-20 flex flex-col gap-3">
        <button
          onClick={() => setShowScanner(true)}
          className="w-14 h-14 rounded-full bg-surface border border-border shadow-lg flex items-center justify-center text-brand hover:bg-border transition-colors"
          title="Scanner code-barres"
        >
          <ScanBarcode size={24} />
        </button>
        <Button
          variant="primary"
          className="min-h-[56px] rounded-full px-6 gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
          onClick={() => setShowAddFood(true)}
        >
          <Plus size={22} />
          Ajouter aliment
        </Button>
      </div>
    </div>
  );
}
