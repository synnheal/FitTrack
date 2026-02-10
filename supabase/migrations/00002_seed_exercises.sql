-- ============================================================
-- SEED: 54 Default Exercises
-- ============================================================

INSERT INTO exercises (name, category, equipment, is_custom) VALUES
-- CHEST (9)
('Développé couché - Barre', 'chest', 'barbell', false),
('Développé couché - Haltères', 'chest', 'dumbbell', false),
('Développé incliné - Barre', 'chest', 'barbell', false),
('Développé incliné - Haltères', 'chest', 'dumbbell', false),
('Développé décliné - Barre', 'chest', 'barbell', false),
('Écarté couché - Haltères', 'chest', 'dumbbell', false),
('Écarté à la poulie vis-à-vis', 'chest', 'cable', false),
('Dips (pecs)', 'chest', 'bodyweight', false),
('Pompes', 'chest', 'bodyweight', false),

-- BACK (9)
('Tractions pronation', 'back', 'bodyweight', false),
('Tractions supination', 'back', 'bodyweight', false),
('Rowing barre', 'back', 'barbell', false),
('Rowing haltère unilatéral', 'back', 'dumbbell', false),
('Tirage vertical poulie haute', 'back', 'cable', false),
('Tirage horizontal poulie basse', 'back', 'cable', false),
('Soulevé de terre', 'back', 'barbell', false),
('Rowing T-bar', 'back', 'barbell', false),
('Pull-over haltère', 'back', 'dumbbell', false),

-- LEGS (10)
('Squat barre', 'legs', 'barbell', false),
('Squat avant (front squat)', 'legs', 'barbell', false),
('Presse à cuisses', 'legs', 'machine', false),
('Fentes marchées - Haltères', 'legs', 'dumbbell', false),
('Leg extension', 'legs', 'machine', false),
('Leg curl allongé', 'legs', 'machine', false),
('Soulevé de terre roumain', 'legs', 'barbell', false),
('Hip thrust - Barre', 'legs', 'barbell', false),
('Mollets debout machine', 'legs', 'machine', false),
('Mollets assis machine', 'legs', 'machine', false),

-- SHOULDERS (9)
('Développé militaire - Barre', 'shoulders', 'barbell', false),
('Développé Arnold - Haltères', 'shoulders', 'dumbbell', false),
('Élévation latérale - Haltères', 'shoulders', 'dumbbell', false),
('Élévation latérale - Poulie', 'shoulders', 'cable', false),
('Élévation frontale - Haltères', 'shoulders', 'dumbbell', false),
('Oiseau (rear delt) - Haltères', 'shoulders', 'dumbbell', false),
('Face pull - Poulie', 'shoulders', 'cable', false),
('Shrug - Haltères', 'shoulders', 'dumbbell', false),
('Shrug - Barre', 'shoulders', 'barbell', false),

-- ARMS (10)
('Curl biceps - Barre EZ', 'arms', 'barbell', false),
('Curl biceps - Haltères', 'arms', 'dumbbell', false),
('Curl marteau - Haltères', 'arms', 'dumbbell', false),
('Curl concentré', 'arms', 'dumbbell', false),
('Curl poulie basse', 'arms', 'cable', false),
('Extension triceps poulie haute', 'arms', 'cable', false),
('Barre au front (skull crusher)', 'arms', 'barbell', false),
('Dips (triceps)', 'arms', 'bodyweight', false),
('Extension triceps haltère au-dessus', 'arms', 'dumbbell', false),
('Kickback triceps', 'arms', 'dumbbell', false),

-- CORE (7)
('Crunch classique', 'core', 'bodyweight', false),
('Crunch à la poulie haute', 'core', 'cable', false),
('Relevé de jambes suspendu', 'core', 'bodyweight', false),
('Planche (gainage)', 'core', 'bodyweight', false),
('Russian twist', 'core', 'bodyweight', false),
('Ab wheel rollout', 'core', 'other', false),
('Rotation poulie (bûcheron)', 'core', 'cable', false);
