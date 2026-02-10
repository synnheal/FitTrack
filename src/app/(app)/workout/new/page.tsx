'use client';

import { useState, useCallback } from 'react';
import {
  Plus,
  Minus,
  Check,
  ChevronLeft,
  Trash2,
  Dumbbell,
  Zap,
} from 'lucide-react';
import { useWakeLock } from '@/hooks/use-wake-lock';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RestTimer } from '@/components/rest-timer';

interface WorkoutSet {
  id: number;
  weight: number;
  reps: number;
  done: boolean;
}

interface Exercise {
  id: number;
  name: string;
  lastPerf: string;
  sets: WorkoutSet[];
}

const initialExercises: Exercise[] = [
  {
    id: 1,
    name: 'Squat',
    lastPerf: '100kg x 8',
    sets: [
      { id: 1, weight: 100, reps: 8, done: false },
      { id: 2, weight: 100, reps: 8, done: false },
      { id: 3, weight: 100, reps: 8, done: false },
      { id: 4, weight: 100, reps: 8, done: false },
    ],
  },
  {
    id: 2,
    name: 'Leg Press',
    lastPerf: '180kg x 10',
    sets: [
      { id: 1, weight: 180, reps: 10, done: false },
      { id: 2, weight: 180, reps: 10, done: false },
      { id: 3, weight: 180, reps: 10, done: false },
    ],
  },
  {
    id: 3,
    name: 'Leg Curl',
    lastPerf: '45kg x 12',
    sets: [
      { id: 1, weight: 45, reps: 12, done: false },
      { id: 2, weight: 45, reps: 12, done: false },
      { id: 3, weight: 45, reps: 12, done: false },
    ],
  },
];

function NumberStepper({
  value,
  onChange,
  step,
  unit,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  step: number;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(0, value - step))}
          className="min-h-[64px] min-w-[48px] bg-border hover:bg-surface-hover rounded-xl flex items-center justify-center transition-colors active:scale-95"
        >
          <Minus size={20} />
        </button>
        <div className="min-h-[64px] min-w-[64px] bg-surface rounded-xl flex items-center justify-center px-2">
          <span className="text-xl font-bold tabular-nums">{value}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
        <button
          onClick={() => onChange(value + step)}
          className="min-h-[64px] min-w-[48px] bg-border hover:bg-surface-hover rounded-xl flex items-center justify-center transition-colors active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}

export default function NewWorkoutPage() {
  // Wake lock to prevent screen from sleeping during workout
  useWakeLock();

  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const updateSet = useCallback(
    (exerciseId: number, setId: number, updates: Partial<WorkoutSet>) => {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, ...updates } : s
                ),
              }
            : ex
        )
      );
    },
    []
  );

  const addSet = useCallback((exerciseId: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const last = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              id: ex.sets.length + 1,
              weight: last?.weight ?? 0,
              reps: last?.reps ?? 8,
              done: false,
            },
          ],
        };
      })
    );
  }, []);

  const removeSet = useCallback((exerciseId: number, setId: number) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) }
          : ex
      )
    );
  }, []);

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const doneSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.done).length,
    0
  );

  if (!workoutStarted) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="min-h-[48px] min-w-[48px] bg-surface rounded-xl flex items-center justify-center hover:bg-border transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold">Nouvelle Séance</h2>
            <p className="text-sm text-gray-400">Leg Day - Hypertrophie</p>
          </div>
        </div>

        {/* Workout Preview */}
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                <Dumbbell size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Leg Day - Hypertrophie</h3>
                <p className="text-sm text-gray-400">
                  {exercises.length} exercices &bull; ~{totalSets} séries
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              {exercises.map((ex) => (
                <div key={ex.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{ex.name}</p>
                    <p className="text-xs text-gray-500">
                      {ex.sets.length} séries &bull; Dernier: {ex.lastPerf}
                    </p>
                  </div>
                  <Zap size={18} className="text-brand" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          variant="primary"
          className="w-full min-h-[64px] text-lg gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
          onClick={() => setWorkoutStarted(true)}
        >
          <Dumbbell size={24} />
          Démarrer la séance
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setWorkoutStarted(false)}
            className="min-h-[48px] min-w-[48px] bg-surface rounded-xl flex items-center justify-center hover:bg-border transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Leg Day</h2>
            <p className="text-sm text-gray-400">
              {doneSets}/{totalSets} séries complétées
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
          style={{ width: `${totalSets > 0 ? (doneSets / totalSets) * 100 : 0}%` }}
        />
      </div>

      {/* Rest Timer */}
      <RestTimer />

      {/* Exercise List */}
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{exercise.name}</h3>
                <p className="text-xs text-gray-500">
                  Dernier: {exercise.lastPerf}
                </p>
              </div>
              <div className="px-3 py-1 rounded-lg bg-brand/10 text-brand text-xs font-bold">
                {exercise.sets.filter((s) => s.done).length}/{exercise.sets.length}
              </div>
            </div>

            {/* Sets */}
            <div className="space-y-4">
              {exercise.sets.map((set, idx) => (
                <div
                  key={set.id}
                  className={`p-4 rounded-2xl border transition-colors ${
                    set.done
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-background border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-400">
                      Série {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {exercise.sets.length > 1 && (
                        <button
                          onClick={() => removeSet(exercise.id, set.id)}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <NumberStepper
                      value={set.weight}
                      onChange={(v) =>
                        updateSet(exercise.id, set.id, { weight: v })
                      }
                      step={2.5}
                      unit="kg"
                      label="Poids"
                    />
                    <NumberStepper
                      value={set.reps}
                      onChange={(v) =>
                        updateSet(exercise.id, set.id, { reps: v })
                      }
                      step={1}
                      unit="reps"
                      label="Reps"
                    />
                    <button
                      onClick={() =>
                        updateSet(exercise.id, set.id, { done: !set.done })
                      }
                      className={`min-h-[64px] min-w-[64px] rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        set.done
                          ? 'bg-green-500 text-white shadow-[0_4px_20px_rgba(34,197,94,0.3)]'
                          : 'bg-border hover:bg-surface-hover text-gray-400'
                      }`}
                    >
                      <Check size={28} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Set Button */}
            <button
              onClick={() => addSet(exercise.id)}
              className="w-full min-h-[56px] rounded-2xl border-2 border-dashed border-border text-gray-500 hover:text-brand hover:border-brand/50 hover:bg-brand/5 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />
              Ajouter une série
            </button>
          </CardContent>
        </Card>
      ))}

      {/* Finish Workout Button */}
      <Button
        variant="primary"
        className="w-full min-h-[64px] text-lg gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
      >
        <Check size={24} />
        Terminer la séance
      </Button>

      {/* Bottom spacer for mobile nav */}
      <div className="h-8" />
    </div>
  );
}
