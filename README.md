# FitTrack

Application de fitness complète pour tracker tes entraînements, ta nutrition et tes performances. Construite avec Next.js, Supabase et Tailwind CSS.

## Fonctionnalités

### Entraînements
- Création et suivi de séances en temps réel
- Templates d'entraînements personnalisables
- Timer de repos intégré
- Enregistrement des séries (poids, reps, RPE)
- Calcul automatique du 1RM

### Nutrition
- Recherche d'aliments multi-sources (base locale, FatSecret, OpenFoodFacts)
- Scanner de code-barres
- Suivi des macros (calories, protéines, glucides, lipides)
- Création de recettes personnalisées
- Journal alimentaire quotidien

### Statistiques
- Graphiques de progression par exercice
- Suivi du volume d'entraînement
- Records personnels (PR)
- Mesures corporelles (poids, tour de taille, etc.)
- Fréquence d'entraînement

### Social
- Système d'amis (demandes, acceptation, rejet)
- Recherche d'utilisateurs par nom
- Fil d'activité des amis
- Partage automatique des entraînements et records

### Profil
- Page profil éditable (nom, âge, poids, taille)
- Sélection d'objectif (prise de masse, sèche, force, maintien)
- Macros cibles personnalisables
- Avatar DiceBear auto-généré

### PWA
- Installable sur mobile (Progressive Web App)
- Mode hors-ligne avec synchronisation

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/) |
| Base de données | [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS) |
| Validation | [Zod](https://zod.dev/) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| Graphiques | [Recharts](https://recharts.org/) |
| PWA | [next-pwa](https://github.com/shadowwalker/next-pwa) |
| Langage | TypeScript |

## Architecture

```
src/
├── app/
│   ├── (app)/              # Pages authentifiées (layout avec sidebar)
│   │   ├── dashboard/      # Page d'accueil / entraînements
│   │   ├── nutrition/      # Suivi nutritionnel
│   │   ├── stats/          # Statistiques et graphiques
│   │   ├── social/         # Communauté et amis
│   │   ├── settings/       # Profil utilisateur
│   │   └── workout/        # Séance en cours
│   ├── (auth)/             # Pages login / signup
│   └── api/                # API Routes (REST)
│       ├── profiles/
│       ├── workouts/
│       ├── nutrition/
│       ├── social/
│       └── stats/
├── components/             # Composants UI réutilisables
├── hooks/                  # Custom React hooks
├── lib/
│   ├── services/           # Logique métier (Supabase queries)
│   ├── validations/        # Schémas Zod
│   ├── calculators/        # 1RM, macros, plaques
│   ├── supabase/           # Clients Supabase (server/client)
│   └── sync/               # Synchronisation offline
├── stores/                 # Zustand stores
└── types/                  # Types TypeScript + schéma DB
```

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Un projet [Supabase](https://supabase.com/) avec les tables configurées

### Setup

1. **Clone le repo**

```bash
git clone https://github.com/ton-username/mon-app-fitness.git
cd mon-app-fitness
```

2. **Installe les dépendances**

```bash
npm install
```

3. **Configure les variables d'environnement**

Crée un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta-cle-anon-publique

# Optionnel : recherche d'aliments FatSecret
FATSECRET_CLIENT_ID=ton-client-id
FATSECRET_CLIENT_SECRET=ton-client-secret
```

4. **Configure la base de données Supabase**

Les tables requises sont définies dans `src/types/database.ts`. Tables principales :
- `profiles` - profils utilisateurs
- `workouts` / `workout_sets` - séances et séries
- `exercises` / `workout_templates` - exercices et templates
- `foods` / `meal_logs` / `recipes` - nutrition
- `body_measurements` / `personal_records` - stats
- `friendships` / `social_feed` / `social_comments` - social

Active le **Row Level Security (RLS)** sur toutes les tables.

5. **Lance le serveur de développement**

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Linting ESLint |

## Sécurité

- Authentification gérée par Supabase Auth
- Row Level Security (RLS) sur toutes les tables
- Validation des entrées avec Zod sur chaque API route
- Aucun secret hardcodé dans le code source
- Clés API FatSecret uniquement côté serveur

## Licence

MIT
