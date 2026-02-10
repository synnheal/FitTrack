export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Row types (standalone, no self-reference)
type ProfileRow = {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  goal: 'bulk' | 'cut' | 'strength' | 'maintenance';
  calorie_target: number | null;
  protein_target: number | null;
  carbs_target: number | null;
  fat_target: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ExerciseRow = {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  equipment: string | null;
  image_url: string | null;
  is_custom: boolean;
  created_by: string | null;
  created_at: string;
};

type WorkoutTemplateRow = {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  estimated_duration: number | null;
  created_at: string;
  updated_at: string;
};

type TemplateExerciseRow = {
  id: string;
  template_id: string;
  exercise_id: string;
  order_index: number;
  target_sets: number;
  target_reps: string | null;
  rest_seconds: number | null;
};

type WorkoutRow = {
  id: string;
  profile_id: string;
  template_id: string | null;
  name: string;
  started_at: string;
  finished_at: string | null;
  notes: string | null;
  created_at: string;
};

type WorkoutSetRow = {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  rpe: number | null;
  notes: string | null;
  is_pr: boolean;
  created_at: string;
};

type PersonalRecordRow = {
  id: string;
  profile_id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  estimated_1rm: number;
  achieved_at: string;
  created_at: string;
};

type FoodRow = {
  id: string;
  name: string;
  brand: string | null;
  barcode: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  is_custom: boolean;
  created_by: string | null;
  created_at: string;
};

type MealLogRow = {
  id: string;
  profile_id: string;
  food_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity_grams: number;
  created_at: string;
};

type RecipeRow = {
  id: string;
  profile_id: string;
  name: string;
  instructions: string | null;
  servings: number;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
};

type RecipeIngredientRow = {
  id: string;
  recipe_id: string;
  food_id: string;
  quantity_grams: number;
};

type BodyMeasurementRow = {
  id: string;
  profile_id: string;
  date: string;
  weight: number | null;
  body_fat: number | null;
  arms: number | null;
  chest: number | null;
  waist: number | null;
  thighs: number | null;
  photo_url: string | null;
  created_at: string;
};

type SocialFeedRow = {
  id: string;
  profile_id: string;
  type: 'workout_completed' | 'pr_achieved' | 'recipe_shared';
  reference_id: string;
  created_at: string;
};

type SocialCommentRow = {
  id: string;
  feed_item_id: string;
  profile_id: string;
  content: string;
  created_at: string;
};

type FriendshipRow = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      exercises: {
        Row: ExerciseRow;
        Insert: Omit<ExerciseRow, 'id' | 'created_at'>;
        Update: Partial<Omit<ExerciseRow, 'id' | 'created_at'>>;
      };
      workout_templates: {
        Row: WorkoutTemplateRow;
        Insert: Omit<WorkoutTemplateRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WorkoutTemplateRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      template_exercises: {
        Row: TemplateExerciseRow;
        Insert: Omit<TemplateExerciseRow, 'id'>;
        Update: Partial<Omit<TemplateExerciseRow, 'id'>>;
      };
      workouts: {
        Row: WorkoutRow;
        Insert: Omit<WorkoutRow, 'id' | 'created_at'>;
        Update: Partial<Omit<WorkoutRow, 'id' | 'created_at'>>;
      };
      workout_sets: {
        Row: WorkoutSetRow;
        Insert: Omit<WorkoutSetRow, 'id' | 'created_at'>;
        Update: Partial<Omit<WorkoutSetRow, 'id' | 'created_at'>>;
      };
      personal_records: {
        Row: PersonalRecordRow;
        Insert: Omit<PersonalRecordRow, 'id' | 'created_at'>;
        Update: Partial<Omit<PersonalRecordRow, 'id' | 'created_at'>>;
      };
      foods: {
        Row: FoodRow;
        Insert: Omit<FoodRow, 'id' | 'created_at'>;
        Update: Partial<Omit<FoodRow, 'id' | 'created_at'>>;
      };
      meal_logs: {
        Row: MealLogRow;
        Insert: Omit<MealLogRow, 'id' | 'created_at'>;
        Update: Partial<Omit<MealLogRow, 'id' | 'created_at'>>;
      };
      recipes: {
        Row: RecipeRow;
        Insert: Omit<RecipeRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RecipeRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      recipe_ingredients: {
        Row: RecipeIngredientRow;
        Insert: Omit<RecipeIngredientRow, 'id'>;
        Update: Partial<Omit<RecipeIngredientRow, 'id'>>;
      };
      body_measurements: {
        Row: BodyMeasurementRow;
        Insert: Omit<BodyMeasurementRow, 'id' | 'created_at'>;
        Update: Partial<Omit<BodyMeasurementRow, 'id' | 'created_at'>>;
      };
      social_feed: {
        Row: SocialFeedRow;
        Insert: Omit<SocialFeedRow, 'id' | 'created_at'>;
        Update: Partial<Omit<SocialFeedRow, 'id' | 'created_at'>>;
      };
      social_comments: {
        Row: SocialCommentRow;
        Insert: Omit<SocialCommentRow, 'id' | 'created_at'>;
        Update: Partial<Omit<SocialCommentRow, 'id' | 'created_at'>>;
      };
      friendships: {
        Row: FriendshipRow;
        Insert: Omit<FriendshipRow, 'id' | 'created_at'>;
        Update: Partial<Omit<FriendshipRow, 'id' | 'created_at'>>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Convenience types
export type Profile = ProfileRow;
export type Exercise = ExerciseRow;
export type WorkoutTemplate = WorkoutTemplateRow;
export type Workout = WorkoutRow;
export type WorkoutSet = WorkoutSetRow;
export type PersonalRecord = PersonalRecordRow;
export type Food = FoodRow;
export type MealLog = MealLogRow;
export type Recipe = RecipeRow;
export type BodyMeasurement = BodyMeasurementRow;
export type SocialFeedItem = SocialFeedRow;
export type Friendship = FriendshipRow;
