'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Search, Loader2, Coffee, Sun, Apple, Moon, ChevronLeft, Minus, Plus, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FoodItem {
  source: string;
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

export interface AddedMeal {
  name: string;
  brand: string | null;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity_grams: number;
  meal_type: MealType;
}

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

interface MealOption {
  type: MealType;
  label: string;
  icon: React.ElementType;
}

const mealOptions: MealOption[] = [
  { type: 'breakfast', label: 'Petit-déjeuner', icon: Coffee },
  { type: 'lunch', label: 'Déjeuner', icon: Sun },
  { type: 'snack', label: 'Collation', icon: Apple },
  { type: 'dinner', label: 'Dîner', icon: Moon },
];

type Step = 'meal-type' | 'search' | 'quantity' | 'create-food';

interface AddFoodModalProps {
  onClose: () => void;
  onFoodAdded: (meal: AddedMeal) => void;
}

export function AddFoodModal({ onClose, onFoodAdded }: AddFoodModalProps) {
  const [step, setStep] = useState<Step>('meal-type');
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '', brand: '', barcode: '',
    calories_per_100g: '', protein_per_100g: '', carbs_per_100g: '', fat_per_100g: '',
  });
  const [createError, setCreateError] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchFoods = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/nutrition/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      }
    } catch {
      // silent fail
    } finally {
      setSearching(false);
    }
  }, []);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchFoods(value), 400);
  }

  useEffect(() => {
    if (step === 'search' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  function selectMealType(type: MealType) {
    setSelectedMealType(type);
    setStep('search');
  }

  function selectFood(food: FoodItem) {
    setSelectedFood(food);
    setGrams(100);
    setStep('quantity');
  }

  function goBack() {
    if (step === 'quantity') {
      setSelectedFood(null);
      setStep('search');
    } else if (step === 'search' || step === 'create-food') {
      setQuery('');
      setResults([]);
      setCreateError('');
      setStep('meal-type');
    }
  }

  async function handleAdd() {
    if (!selectedFood || !selectedMealType) return;
    setSubmitting(true);

    const factor = grams / 100;
    const meal: AddedMeal = {
      name: selectedFood.name,
      brand: selectedFood.brand,
      kcal: Math.round(selectedFood.calories_per_100g * factor),
      protein: Math.round(selectedFood.protein_per_100g * factor * 10) / 10,
      carbs: Math.round(selectedFood.carbs_per_100g * factor * 10) / 10,
      fat: Math.round(selectedFood.fat_per_100g * factor * 10) / 10,
      quantity_grams: grams,
      meal_type: selectedMealType,
    };

    // Also persist to backend if food has a local_id
    if (selectedFood.local_id) {
      try {
        const today = new Date().toISOString().split('T')[0];
        await fetch('/api/nutrition/meals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            food_id: selectedFood.local_id,
            date: today,
            meal_type: selectedMealType,
            quantity_grams: grams,
          }),
        });
      } catch {
        // silent — local state still updates
      }
    }

    setSubmitting(false);
    onFoodAdded(meal);
  }

  async function handleCreateFood() {
    setCreateError('');
    const { name, brand, barcode, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g } = customFood;

    if (!name.trim()) {
      setCreateError('Le nom est requis');
      return;
    }
    const cal = parseFloat(calories_per_100g);
    const prot = parseFloat(protein_per_100g);
    const carb = parseFloat(carbs_per_100g);
    const lipid = parseFloat(fat_per_100g);

    if ([cal, prot, carb, lipid].some((v) => isNaN(v) || v < 0)) {
      setCreateError('Les macros doivent être des nombres positifs');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/nutrition/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          brand: brand.trim() || null,
          barcode: barcode.trim() || null,
          calories_per_100g: cal,
          protein_per_100g: prot,
          carbs_per_100g: carb,
          fat_per_100g: lipid,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setCreateError(err?.error || 'Erreur lors de la création');
        setSubmitting(false);
        return;
      }

      const created = await res.json();

      // Use it as selected food and go to quantity step
      selectFood({
        source: 'local',
        local_id: created.id,
        external_id: null,
        name: created.name,
        brand: created.brand || null,
        barcode: created.barcode || null,
        calories_per_100g: created.calories_per_100g,
        protein_per_100g: created.protein_per_100g,
        carbs_per_100g: created.carbs_per_100g,
        fat_per_100g: created.fat_per_100g,
        image_url: null,
      });
    } catch {
      setCreateError('Erreur réseau');
    } finally {
      setSubmitting(false);
    }
  }

  const factor = grams / 100;
  const stepTitle =
    step === 'meal-type'
      ? 'Choisir le repas'
      : step === 'search'
        ? 'Rechercher un aliment'
        : step === 'create-food'
          ? 'Créer un aliment'
          : 'Quantité';

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {step !== 'meal-type' && (
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-border transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h2 className="font-bold text-lg">{stepTitle}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center hover:bg-border transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Meal type */}
        {step === 'meal-type' && (
          <div className="space-y-3 max-w-sm mx-auto pt-4">
            {mealOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => selectMealType(opt.type)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-brand/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                  <opt.icon size={24} />
                </div>
                <span className="font-bold text-lg">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Search */}
        {step === 'search' && (
          <div className="max-w-sm mx-auto space-y-4">
            {/* Selected meal type badge */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {(() => {
                const opt = mealOptions.find((o) => o.type === selectedMealType);
                if (!opt) return null;
                return (
                  <>
                    <opt.icon size={16} className="text-brand" />
                    <span>{opt.label}</span>
                  </>
                );
              })()}
            </div>

            {/* Search input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Rechercher un aliment..."
                className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm"
              />
              {searching && (
                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
              )}
            </div>

            {/* Results */}
            <div className="space-y-2">
              {results.length === 0 && query.length >= 2 && !searching && (
                <p className="text-sm text-gray-500 text-center py-4">Aucun résultat</p>
              )}
              {results.map((food, idx) => (
                <button
                  key={`${food.source}-${food.external_id || food.local_id || idx}`}
                  onClick={() => selectFood(food)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:border-brand/30 transition-colors text-left"
                >
                  {food.image_url ? (
                    <img
                      src={food.image_url}
                      alt={food.name}
                      className="w-12 h-12 rounded-lg object-cover bg-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-border flex items-center justify-center text-gray-500 flex-shrink-0 text-xs">
                      {food.source === 'local' ? 'DB' : food.source === 'fatsecret' ? 'FS' : 'OFF'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{food.name}</p>
                    {food.brand && (
                      <p className="text-xs text-gray-500 truncate">{food.brand}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {food.calories_per_100g} kcal &bull; P:{food.protein_per_100g}g &bull; G:{food.carbs_per_100g}g &bull; L:{food.fat_per_100g}g
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Create custom food button */}
            <button
              onClick={() => {
                setCustomFood({
                  name: query, brand: '', barcode: '',
                  calories_per_100g: '', protein_per_100g: '', carbs_per_100g: '', fat_per_100g: '',
                });
                setStep('create-food');
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-brand/40 hover:border-brand/70 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand flex-shrink-0">
                <PenLine size={20} />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-brand">Créer un aliment</p>
                <p className="text-xs text-gray-500">Ajouter manuellement un aliment perso</p>
              </div>
            </button>
          </div>
        )}

        {/* Step: Create custom food */}
        {step === 'create-food' && (
          <div className="max-w-sm mx-auto space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nom *</label>
                <input
                  type="text"
                  value={customFood.name}
                  onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  placeholder="Ex: Poulet grillé"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Marque</label>
                  <input
                    type="text"
                    value={customFood.brand}
                    onChange={(e) => setCustomFood({ ...customFood, brand: e.target.value })}
                    placeholder="Optionnel"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Code-barres</label>
                  <input
                    type="text"
                    value={customFood.barcode}
                    onChange={(e) => setCustomFood({ ...customFood, barcode: e.target.value })}
                    placeholder="Optionnel"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 pt-2">Valeurs nutritionnelles pour 100g *</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Calories (kcal)</label>
                  <input
                    type="number"
                    value={customFood.calories_per_100g}
                    onChange={(e) => setCustomFood({ ...customFood, calories_per_100g: e.target.value })}
                    placeholder="0"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Protéines (g)</label>
                  <input
                    type="number"
                    value={customFood.protein_per_100g}
                    onChange={(e) => setCustomFood({ ...customFood, protein_per_100g: e.target.value })}
                    placeholder="0"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Glucides (g)</label>
                  <input
                    type="number"
                    value={customFood.carbs_per_100g}
                    onChange={(e) => setCustomFood({ ...customFood, carbs_per_100g: e.target.value })}
                    placeholder="0"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Lipides (g)</label>
                  <input
                    type="number"
                    value={customFood.fat_per_100g}
                    onChange={(e) => setCustomFood({ ...customFood, fat_per_100g: e.target.value })}
                    placeholder="0"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-brand/50 focus:outline-none transition-colors text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {createError}
              </div>
            )}

            <Button
              variant="primary"
              className="w-full min-h-[56px] rounded-xl text-lg"
              onClick={handleCreateFood}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Créer et continuer'
              )}
            </Button>
          </div>
        )}

        {/* Step 3: Quantity */}
        {step === 'quantity' && selectedFood && (
          <div className="max-w-sm mx-auto space-y-6 pt-2">
            {/* Food info */}
            <div className="flex items-center gap-4">
              {selectedFood.image_url ? (
                <img
                  src={selectedFood.image_url}
                  alt={selectedFood.name}
                  className="w-16 h-16 rounded-xl object-cover bg-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-border flex items-center justify-center text-gray-500 text-xs">
                  {selectedFood.calories_per_100g} kcal
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold">{selectedFood.name}</h3>
                {selectedFood.brand && (
                  <p className="text-sm text-gray-400">{selectedFood.brand}</p>
                )}
              </div>
            </div>

            {/* Grams selector */}
            <div className="space-y-3">
              <label className="text-sm text-gray-400">Quantité (grammes)</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGrams(Math.max(10, grams - 10))}
                  className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center hover:bg-border transition-colors"
                >
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  value={grams}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v) && v > 0 && v <= 5000) setGrams(v);
                  }}
                  className="flex-1 text-center text-2xl font-bold bg-surface border border-border rounded-xl py-3 text-white focus:border-brand/50 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setGrams(Math.min(5000, grams + 10))}
                  className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center hover:bg-border transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              {/* Quick amounts */}
              <div className="flex gap-2">
                {[50, 100, 150, 200, 250].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrams(g)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      grams === g
                        ? 'bg-brand text-white'
                        : 'bg-surface border border-border text-gray-400 hover:text-white'
                    }`}
                  >
                    {g}g
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated macros */}
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-3 rounded-xl bg-surface border border-border">
                <div className="text-xs text-gray-400 mb-1">Cal</div>
                <div className="font-bold text-brand">
                  {Math.round(selectedFood.calories_per_100g * factor)}
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface border border-border">
                <div className="text-xs text-gray-400 mb-1">Prot</div>
                <div className="font-bold text-macro-protein">
                  {Math.round(selectedFood.protein_per_100g * factor * 10) / 10}g
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface border border-border">
                <div className="text-xs text-gray-400 mb-1">Glu</div>
                <div className="font-bold text-macro-carbs">
                  {Math.round(selectedFood.carbs_per_100g * factor * 10) / 10}g
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface border border-border">
                <div className="text-xs text-gray-400 mb-1">Lip</div>
                <div className="font-bold text-macro-fat">
                  {Math.round(selectedFood.fat_per_100g * factor * 10) / 10}g
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Pour {grams}g
            </p>

            {/* Add button */}
            <Button
              variant="primary"
              className="w-full min-h-[56px] rounded-xl text-lg"
              onClick={handleAdd}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                'Ajouter'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
