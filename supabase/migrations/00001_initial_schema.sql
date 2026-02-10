-- ============================================================
-- FitTrack - Initial Database Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  age INT,
  weight NUMERIC(5,1),
  height NUMERIC(5,1),
  goal TEXT NOT NULL DEFAULT 'maintenance' CHECK (goal IN ('bulk', 'cut', 'strength', 'maintenance')),
  calorie_target INT,
  protein_target INT,
  carbs_target INT,
  fat_target INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- ============================================================
-- EXERCISES (seeded + custom)
-- ============================================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('chest', 'back', 'legs', 'shoulders', 'arms', 'core')),
  equipment TEXT,
  image_url TEXT,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_exercises_category ON exercises(category);

-- ============================================================
-- WORKOUT TEMPLATES
-- ============================================================
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  estimated_duration INT, -- minutes
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE template_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INT NOT NULL DEFAULT 0,
  target_sets INT NOT NULL DEFAULT 3,
  target_reps TEXT, -- e.g. "8-12" or "5"
  rest_seconds INT DEFAULT 90
);

-- ============================================================
-- WORKOUTS (sessions)
-- ============================================================
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES workout_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workouts_profile ON workouts(profile_id, started_at DESC);

CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  reps INT NOT NULL,
  weight NUMERIC(6,1) NOT NULL DEFAULT 0,
  rpe INT CHECK (rpe BETWEEN 1 AND 10),
  notes TEXT,
  is_pr BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workout_sets_workout ON workout_sets(workout_id);
CREATE INDEX idx_workout_sets_exercise ON workout_sets(exercise_id);

-- ============================================================
-- PERSONAL RECORDS
-- ============================================================
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  weight NUMERIC(6,1) NOT NULL,
  reps INT NOT NULL,
  estimated_1rm NUMERIC(6,1) NOT NULL,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pr_profile_exercise ON personal_records(profile_id, exercise_id);

-- ============================================================
-- FOODS & NUTRITION
-- ============================================================
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT UNIQUE,
  calories_per_100g NUMERIC(7,1) NOT NULL,
  protein_per_100g NUMERIC(5,1) NOT NULL,
  carbs_per_100g NUMERIC(5,1) NOT NULL,
  fat_per_100g NUMERIC(5,1) NOT NULL,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_foods_barcode ON foods(barcode);

CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  quantity_grams NUMERIC(7,1) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_meal_logs_profile_date ON meal_logs(profile_id, date DESC);

-- ============================================================
-- RECIPES
-- ============================================================
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instructions TEXT,
  servings INT NOT NULL DEFAULT 1,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  quantity_grams NUMERIC(7,1) NOT NULL
);

-- ============================================================
-- BODY MEASUREMENTS
-- ============================================================
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight NUMERIC(5,1),
  body_fat NUMERIC(4,1),
  arms NUMERIC(4,1),
  chest NUMERIC(5,1),
  waist NUMERIC(5,1),
  thighs NUMERIC(5,1),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_measurements_profile_date ON body_measurements(profile_id, date DESC);

-- ============================================================
-- SOCIAL FEED
-- ============================================================
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

CREATE TABLE social_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('workout_completed', 'pr_achieved', 'recipe_shared')),
  reference_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_social_feed_created ON social_feed(created_at DESC);

CREATE TABLE social_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_item_id UUID NOT NULL REFERENCES social_feed(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;

-- Helper: get all profile IDs owned by current user
CREATE OR REPLACE FUNCTION my_profile_ids()
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid();
$$;

-- Helper: get friend profile IDs (accepted friendships)
CREATE OR REPLACE FUNCTION my_friend_profile_ids()
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT CASE
    WHEN requester_id IN (SELECT my_profile_ids()) THEN addressee_id
    ELSE requester_id
  END
  FROM friendships
  WHERE status = 'accepted'
    AND (requester_id IN (SELECT my_profile_ids()) OR addressee_id IN (SELECT my_profile_ids()));
$$;

-- PROFILES: users see only their own profiles
CREATE POLICY profiles_select ON profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY profiles_delete ON profiles FOR DELETE USING (user_id = auth.uid());

-- EXERCISES: everyone sees default exercises, custom only by creator
CREATE POLICY exercises_select ON exercises FOR SELECT USING (
  NOT is_custom OR created_by IN (SELECT my_profile_ids())
);
CREATE POLICY exercises_insert ON exercises FOR INSERT WITH CHECK (
  created_by IN (SELECT my_profile_ids())
);
CREATE POLICY exercises_update ON exercises FOR UPDATE USING (
  created_by IN (SELECT my_profile_ids())
);

-- WORKOUT TEMPLATES: own profiles only
CREATE POLICY templates_select ON workout_templates FOR SELECT USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY templates_insert ON workout_templates FOR INSERT WITH CHECK (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY templates_update ON workout_templates FOR UPDATE USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY templates_delete ON workout_templates FOR DELETE USING (profile_id IN (SELECT my_profile_ids()));

-- TEMPLATE EXERCISES: via template ownership
CREATE POLICY tpl_ex_select ON template_exercises FOR SELECT USING (
  template_id IN (SELECT id FROM workout_templates WHERE profile_id IN (SELECT my_profile_ids()))
);
CREATE POLICY tpl_ex_insert ON template_exercises FOR INSERT WITH CHECK (
  template_id IN (SELECT id FROM workout_templates WHERE profile_id IN (SELECT my_profile_ids()))
);
CREATE POLICY tpl_ex_update ON template_exercises FOR UPDATE USING (
  template_id IN (SELECT id FROM workout_templates WHERE profile_id IN (SELECT my_profile_ids()))
);
CREATE POLICY tpl_ex_delete ON template_exercises FOR DELETE USING (
  template_id IN (SELECT id FROM workout_templates WHERE profile_id IN (SELECT my_profile_ids()))
);

-- WORKOUTS: own profiles only
CREATE POLICY workouts_select ON workouts FOR SELECT USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY workouts_insert ON workouts FOR INSERT WITH CHECK (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY workouts_update ON workouts FOR UPDATE USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY workouts_delete ON workouts FOR DELETE USING (profile_id IN (SELECT my_profile_ids()));

-- WORKOUT SETS: via workout ownership
CREATE POLICY sets_select ON workout_sets FOR SELECT USING (
  workout_id IN (SELECT id FROM workouts WHERE profile_id IN (SELECT my_profile_ids()))
);
CREATE POLICY sets_insert ON workout_sets FOR INSERT WITH CHECK (
  workout_id IN (SELECT id FROM workouts WHERE profile_id IN (SELECT my_profile_ids()))
);
CREATE POLICY sets_update ON workout_sets FOR UPDATE USING (
  workout_id IN (SELECT id FROM workouts WHERE profile_id IN (SELECT my_profile_ids()))
);

-- PERSONAL RECORDS: own profiles only
CREATE POLICY pr_select ON personal_records FOR SELECT USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY pr_insert ON personal_records FOR INSERT WITH CHECK (profile_id IN (SELECT my_profile_ids()));

-- FOODS: everyone sees defaults, custom only by creator
CREATE POLICY foods_select ON foods FOR SELECT USING (
  NOT is_custom OR created_by IN (SELECT my_profile_ids())
);
CREATE POLICY foods_insert ON foods FOR INSERT WITH CHECK (
  created_by IN (SELECT my_profile_ids())
);

-- MEAL LOGS: own profiles only
CREATE POLICY meals_select ON meal_logs FOR SELECT USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY meals_insert ON meal_logs FOR INSERT WITH CHECK (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY meals_update ON meal_logs FOR UPDATE USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY meals_delete ON meal_logs FOR DELETE USING (profile_id IN (SELECT my_profile_ids()));

-- RECIPES: own + shared by friends
CREATE POLICY recipes_select ON recipes FOR SELECT USING (
  profile_id IN (SELECT my_profile_ids())
  OR (is_shared AND profile_id IN (SELECT my_friend_profile_ids()))
);
CREATE POLICY recipes_insert ON recipes FOR INSERT WITH CHECK (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY recipes_update ON recipes FOR UPDATE USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY recipes_delete ON recipes FOR DELETE USING (profile_id IN (SELECT my_profile_ids()));

-- RECIPE INGREDIENTS: via recipe ownership
CREATE POLICY ri_select ON recipe_ingredients FOR SELECT USING (
  recipe_id IN (SELECT id FROM recipes WHERE profile_id IN (SELECT my_profile_ids())
    OR (is_shared AND profile_id IN (SELECT my_friend_profile_ids())))
);
CREATE POLICY ri_insert ON recipe_ingredients FOR INSERT WITH CHECK (
  recipe_id IN (SELECT id FROM recipes WHERE profile_id IN (SELECT my_profile_ids()))
);

-- BODY MEASUREMENTS: own profiles only
CREATE POLICY measurements_select ON body_measurements FOR SELECT USING (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY measurements_insert ON body_measurements FOR INSERT WITH CHECK (profile_id IN (SELECT my_profile_ids()));
CREATE POLICY measurements_update ON body_measurements FOR UPDATE USING (profile_id IN (SELECT my_profile_ids()));

-- FRIENDSHIPS: involved parties only
CREATE POLICY friendships_select ON friendships FOR SELECT USING (
  requester_id IN (SELECT my_profile_ids()) OR addressee_id IN (SELECT my_profile_ids())
);
CREATE POLICY friendships_insert ON friendships FOR INSERT WITH CHECK (
  requester_id IN (SELECT my_profile_ids())
);
CREATE POLICY friendships_update ON friendships FOR UPDATE USING (
  addressee_id IN (SELECT my_profile_ids())
);

-- SOCIAL FEED: own + friends
CREATE POLICY feed_select ON social_feed FOR SELECT USING (
  profile_id IN (SELECT my_profile_ids()) OR profile_id IN (SELECT my_friend_profile_ids())
);
CREATE POLICY feed_insert ON social_feed FOR INSERT WITH CHECK (profile_id IN (SELECT my_profile_ids()));

-- SOCIAL COMMENTS: on visible feed items
CREATE POLICY comments_select ON social_comments FOR SELECT USING (
  feed_item_id IN (SELECT id FROM social_feed WHERE
    profile_id IN (SELECT my_profile_ids()) OR profile_id IN (SELECT my_friend_profile_ids())
  )
);
CREATE POLICY comments_insert ON social_comments FOR INSERT WITH CHECK (
  profile_id IN (SELECT my_profile_ids())
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER templates_updated_at BEFORE UPDATE ON workout_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
