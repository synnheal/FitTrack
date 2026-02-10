import { create } from 'zustand';

export interface ActiveSet {
  exercise_id: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  rpe: number | null;
  completed: boolean;
}

export interface ActiveExercise {
  exercise_id: string;
  exercise_name: string;
  sets: ActiveSet[];
}

interface WorkoutState {
  isActive: boolean;
  workoutName: string;
  templateId: string | null;
  exercises: ActiveExercise[];
  startedAt: string | null;
  elapsedSeconds: number;
  restTimer: {
    isRunning: boolean;
    remaining: number;
    duration: number;
  };
}

interface WorkoutActions {
  startWorkout: (name: string, templateId?: string) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
  addExercise: (exerciseId: string, exerciseName: string, targetSets?: number) => void;
  removeExercise: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setIndex: number, data: Partial<ActiveSet>) => void;
  addSet: (exerciseId: string) => void;
  removeSet: (exerciseId: string, setIndex: number) => void;
  completeSet: (exerciseId: string, setIndex: number) => void;
  setElapsedSeconds: (seconds: number) => void;
  startRestTimer: (duration: number) => void;
  tickRestTimer: () => void;
  resetRestTimer: () => void;
}

const initialRestTimer = { isRunning: false, remaining: 0, duration: 90 };

export const useWorkoutStore = create<WorkoutState & WorkoutActions>()((set) => ({
  isActive: false,
  workoutName: '',
  templateId: null,
  exercises: [],
  startedAt: null,
  elapsedSeconds: 0,
  restTimer: { ...initialRestTimer },

  startWorkout: (name, templateId) =>
    set({
      isActive: true,
      workoutName: name,
      templateId: templateId ?? null,
      exercises: [],
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      restTimer: { ...initialRestTimer },
    }),

  finishWorkout: () =>
    set({
      isActive: false,
      workoutName: '',
      templateId: null,
      exercises: [],
      startedAt: null,
      elapsedSeconds: 0,
      restTimer: { ...initialRestTimer },
    }),

  cancelWorkout: () =>
    set({
      isActive: false,
      workoutName: '',
      templateId: null,
      exercises: [],
      startedAt: null,
      elapsedSeconds: 0,
      restTimer: { ...initialRestTimer },
    }),

  addExercise: (exerciseId, exerciseName, targetSets = 3) =>
    set((state) => ({
      exercises: [
        ...state.exercises,
        {
          exercise_id: exerciseId,
          exercise_name: exerciseName,
          sets: Array.from({ length: targetSets }, (_, i) => ({
            exercise_id: exerciseId,
            set_number: i + 1,
            reps: null,
            weight: null,
            rpe: null,
            completed: false,
          })),
        },
      ],
    })),

  removeExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.filter((e) => e.exercise_id !== exerciseId),
    })),

  updateSet: (exerciseId, setIndex, data) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e.exercise_id === exerciseId
          ? {
              ...e,
              sets: e.sets.map((s, i) => (i === setIndex ? { ...s, ...data } : s)),
            }
          : e
      ),
    })),

  addSet: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e.exercise_id === exerciseId
          ? {
              ...e,
              sets: [
                ...e.sets,
                {
                  exercise_id: exerciseId,
                  set_number: e.sets.length + 1,
                  reps: null,
                  weight: null,
                  rpe: null,
                  completed: false,
                },
              ],
            }
          : e
      ),
    })),

  removeSet: (exerciseId, setIndex) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e.exercise_id === exerciseId
          ? {
              ...e,
              sets: e.sets
                .filter((_, i) => i !== setIndex)
                .map((s, i) => ({ ...s, set_number: i + 1 })),
            }
          : e
      ),
    })),

  completeSet: (exerciseId, setIndex) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e.exercise_id === exerciseId
          ? {
              ...e,
              sets: e.sets.map((s, i) =>
                i === setIndex ? { ...s, completed: true } : s
              ),
            }
          : e
      ),
    })),

  setElapsedSeconds: (seconds) => set({ elapsedSeconds: seconds }),

  startRestTimer: (duration) =>
    set({ restTimer: { isRunning: true, remaining: duration, duration } }),

  tickRestTimer: () =>
    set((state) => {
      const next = state.restTimer.remaining - 1;
      if (next <= 0) {
        return { restTimer: { ...state.restTimer, isRunning: false, remaining: 0 } };
      }
      return { restTimer: { ...state.restTimer, remaining: next } };
    }),

  resetRestTimer: () => set({ restTimer: { ...initialRestTimer } }),
}));
