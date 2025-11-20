# Architecture du Système de Profil Utilisateur - MealSync

## Vue d'ensemble

Le système de profil utilisateur permet une personnalisation ultra-avancée des suggestions de repas en prenant en compte plus de 200 critères différents, organisés en 16 catégories principales.

---

## Structure des Modèles de Données

### Modèle User (Base)
```
User
├── id: UUID
├── email: String (unique)
├── username: String? (unique)
├── createdAt: DateTime
├── updatedAt: DateTime
└── profile: UserProfile (1-1)
```

### Modèle UserProfile (Principal)
```
UserProfile
├── Informations de base
│   ├── userId: UUID (unique)
│   ├── gender: Gender
│   ├── birthDate: DateTime
│   ├── height: Float (cm)
│   ├── weight: Float (kg)
│   └── targetWeight: Float? (kg)
│
├── Activité et mode de vie
│   ├── activityLevel: ActivityLevel
│   ├── exerciseType: ExerciseType
│   ├── exerciseFrequency: Int (jours/semaine)
│   ├── workType: WorkType
│   ├── sleepHours: Int
│   └── stressLevel: StressLevel
│
├── Objectifs
│   ├── goal: Goal
│   ├── targetCalories: Int? (calculé ou manuel)
│   ├── weightChangeRate: WeightChangeRate
│   └── performanceGoals: String?
│
├── Préférences alimentaires
│   ├── dietaryRestrictions: DietaryRestriction[]
│   ├── excludedAliments: String[]
│   ├── preferredCuisines: String[]
│   └── foodPhilosophy: FoodPhilosophy[]
│
├── Allergies et intolérances
│   ├── allergies: Allergy[]
│   ├── allergySeverity: Severity
│   ├── intolerances: Intolerance[]
│   └── celiac: Boolean
│
├── Contraintes pratiques
│   ├── availableEquipments: String[] (IDs)
│   ├── kitchenSize: KitchenSize
│   ├── cookingSkill: CookingSkill
│   └── accessibility: Accessibility?
│
├── Répartition des repas
│   ├── mealsPerDay: Int (3-8)
│   ├── snacksPerDay: Int (0-5)
│   ├── intermittentFasting: IntermittentFasting?
│   └── mealDistribution: MealDistribution (1-1)
│
├── Préférences nutritionnelles
│   ├── macroRatio: MacroRatio
│   ├── proteinTarget: Float? (g ou %)
│   ├── carbTarget: Float? (g ou %)
│   ├── fatTarget: Float? (g ou %)
│   ├── fiberTarget: Float? (g)
│   └── micronutrientFocus: Micronutrient[]
│
├── Contraintes médicales
│   ├── medicalConditions: MedicalCondition[]
│   ├── medications: String[]
│   ├── sodiumLimit: Int? (mg)
│   ├── potassiumLimit: Int? (mg)
│   └── proteinLimit: Int? (g)
│
├── Préférences de goût
│   ├── tastePreferences: TastePreference[]
│   ├── texturePreferences: TexturePreference[]
│   ├── spiceLevel: SpiceLevel
│   └── likedFoods: String[]
│   └── dislikedFoods: String[]
│
├── Contraintes temporelles
│   ├── maxPrepTimePerMeal: Int? (minutes)
│   ├── maxPrepTimePerDay: Int? (minutes)
│   ├── availableDays: Day[]
│   └── mealPrepPreference: Boolean
│
├── Contraintes budgétaires
│   ├── budgetPerMeal: Float? + currency
│   ├── budgetPerDay: Float? + currency
│   └── pricePreference: PriceLevel
│
├── Préférences de préparation
│   ├── preferredCookingMethods: CookingMethod[]
│   ├── complexityPreference: Complexity
│   ├── batchCooking: Boolean
│   └── mealPrepDays: Day[]
│
├── Historique et suivi
│   ├── mealHistory: MealHistory[]
│   ├── weightHistory: WeightEntry[]
│   ├── likedMeals: String[] (IDs)
│   └── dislikedMeals: String[] (IDs)
│
└── Métriques calculées (auto)
    ├── bmr: Float? (kcal/jour)
    ├── tdee: Float? (kcal/jour)
    ├── bmi: Float?
    ├── bodyFatPercentage: Float?
    └── lastCalculated: DateTime
```

### Modèle MealDistribution (Optionnel)
```
MealDistribution
├── profileId: UUID (unique)
├── Répartition calorique (%)
│   ├── breakfastPercent: Float (20-30%)
│   ├── lunchPercent: Float (30-40%)
│   ├── dinnerPercent: Float (25-35%)
│   └── snackPercent: Float (5-15%)
└── Répartition macros (optionnel)
    ├── breakfastMacros: Json
    ├── lunchMacros: Json
    ├── dinnerMacros: Json
    └── snackMacros: Json
```

---

## Flux de Calcul des Besoins Caloriques

```
1. Saisie des données physiques
   └─> Genre, âge, taille, poids

2. Calcul du BMR (Basal Metabolic Rate)
   └─> Formule Mifflin-St Jeor
   └─> Résultat : kcal/jour

3. Application du facteur d'activité
   └─> BMR × facteur (1.2 à 1.9)
   └─> Résultat : TDEE (kcal/jour)

4. Ajustement selon l'objectif
   ├─> Perte de poids : TDEE - 500 à -750
   ├─> Maintien : TDEE ± 0
   └─> Prise de poids : TDEE + 300 à +500

5. Répartition par repas
   └─> Selon MealDistribution
   └─> Résultat : calories cibles par type de repas
```

---

## Flux de Filtrage des Repas

```
Requête de suggestion
    │
    ├─> Récupérer UserProfile
    │
    ├─> Calculer calories cibles pour le repas demandé
    │   └─> targetCalories × mealTypePercent
    │
    ├─> Construire filtres (SuggestionFilters)
    │   ├─> targetCalories: calculé
    │   ├─> excludedAliments: 
    │   │   ├─> profile.excludedAliments
    │   │   └─> aliments des restrictions (végétarien, etc.)
    │   ├─> availableEquipments: profile.availableEquipments
    │   ├─> maxTime: profile.maxPrepTimePerMeal
    │   ├─> preferredMacros: selon goal
    │   └─> preferredCuisines: profile.preferredCuisines
    │
    ├─> Appliquer filtres critiques (Niveau 1)
    │   ├─> Allergies sévères
    │   ├─> Restrictions médicales
    │   └─> Régimes stricts
    │
    ├─> Appliquer filtres importants (Niveau 2)
    │   ├─> Calories cibles (±10%)
    │   ├─> Préférences alimentaires
    │   └─> Équipements disponibles
    │
    ├─> Appliquer préférences (Niveau 3)
    │   ├─> Goûts et textures
    │   ├── Styles culinaires
    │   └── Complexité
    │
    ├─> Optimiser (Niveau 4)
    │   ├─> Budget
    │   ├─> Variété
    │   └─> Densité nutritionnelle
    │
    └─> Retourner suggestions triées par score
```

---

## Endpoints Proposés

### Gestion du Profil
```
POST   /users                    - Créer un utilisateur
GET    /users/{userId}           - Récupérer un utilisateur
PUT    /users/{userId}           - Mettre à jour un utilisateur
DELETE /users/{userId}           - Supprimer un utilisateur

GET    /users/{userId}/profile   - Récupérer le profil complet
PUT    /users/{userId}/profile   - Mettre à jour le profil
PATCH  /users/{userId}/profile  - Mise à jour partielle

GET    /users/{userId}/profile/calculated-needs
                                  - Obtenir BMR, TDEE, calories cibles
POST   /users/{userId}/profile/recalculate
                                  - Recalculer les métriques
```

### Suggestions Personnalisées
```
GET    /meals/suggestions?userId={userId}&mealType={type}
                                  - Suggestions basées sur le profil
GET    /meals/personalized?userId={userId}
                                  - Tous les repas filtrés selon profil
POST   /meal-plans/generate?userId={userId}
                                  - Générer plan avec profil (override params)
```

### Historique et Suivi
```
GET    /users/{userId}/history/meals
                                  - Historique des repas consommés
GET    /users/{userId}/history/weight
                                  - Historique du poids
POST   /users/{userId}/history/weight
                                  - Ajouter une entrée de poids
GET    /users/{userId}/progress
                                  - Progrès vers objectifs
```

---

## Matrice de Priorisation des Critères

| Niveau | Critères | Action si non respecté |
|--------|----------|------------------------|
| **1 - Critique** | Allergies sévères, restrictions médicales, cœliaque | **Exclure complètement** |
| **2 - Important** | Calories cibles, régimes (végétarien), équipements | **Exclure ou pénaliser fortement** |
| **3 - Préférence** | Goûts, textures, styles culinaires | **Pénaliser dans le score** |
| **4 - Optimisation** | Budget, variété, densité nutritionnelle | **Bonus dans le score** |

---

## Système de Scoring des Suggestions

```
Score initial = 100

- Niveau 1 (critique) non respecté : score = 0 (exclu)
- Niveau 2 (important) non respecté : score -= 50
- Niveau 3 (préférence) non respecté : score -= 10
- Niveau 4 (optimisation) respecté : score += 5

Bonus :
+ Calories dans la plage cible (±5%) : +20
+ Calories dans la plage acceptable (±10%) : +10
+ Macros alignés avec objectif : +15
+ Cuisine préférée : +10
+ Goût/texture préférés : +5
+ Budget respecté : +5
+ Densité nutritionnelle élevée : +5

Pénalités :
- Calories hors plage acceptable (>±15%) : -30
- Macros non alignés : -15
- Cuisine non préférée : -5
- Goût/texture non préférés : -5
- Budget dépassé : -10
```

---

## Exemple de Profil Complet

```json
{
  "userId": "uuid",
  "gender": "FEMALE",
  "birthDate": "1990-05-15",
  "height": 165,
  "weight": 70,
  "targetWeight": 65,
  "activityLevel": "MODERATELY_ACTIVE",
  "exerciseType": "STRENGTH",
  "exerciseFrequency": 4,
  "goal": "LOSE_WEIGHT",
  "weightChangeRate": "MODERATE",
  
  "dietaryRestrictions": ["VEGETARIAN"],
  "excludedAliments": ["mushrooms", "olives"],
  "preferredCuisines": ["ITALIAN", "MEDITERRANEAN"],
  
  "allergies": ["PEANUTS"],
  "allergySeverity": "SEVERE",
  "intolerances": ["LACTOSE"],
  
  "availableEquipments": ["oven-id", "stove-id"],
  "cookingSkill": "INTERMEDIATE",
  "maxPrepTimePerMeal": 45,
  
  "mealsPerDay": 4,
  "snacksPerDay": 1,
  "intermittentFasting": {
    "type": "16_8",
    "eatingWindow": { "start": "12:00", "end": "20:00" }
  },
  
  "macroRatio": "BALANCED",
  "proteinTarget": 120,
  "fiberTarget": 30,
  
  "medicalConditions": [],
  "sodiumLimit": 2000,
  
  "tastePreferences": {
    "sweet": "LIKE",
    "spicy": "MODERATE"
  },
  "spiceLevel": "MILD",
  
  "budgetPerMeal": 8.00,
  "currency": "EUR",
  
  "preferredCookingMethods": ["BAKING", "STEAMING"],
  "complexityPreference": "MODERATE",
  "mealPrepPreference": true
}
```

---

## Calculs Automatiques

### BMR (exemple)
```
Femme, 33 ans, 165 cm, 70 kg
BMR = 10 × 70 + 6.25 × 165 - 5 × 33 - 161
BMR = 700 + 1031.25 - 165 - 161
BMR = 1405.25 kcal/jour
```

### TDEE (exemple)
```
BMR = 1405.25
Activity Level = MODERATELY_ACTIVE (1.55)
TDEE = 1405.25 × 1.55
TDEE = 2178.14 kcal/jour
```

### Calories Cibles (exemple)
```
TDEE = 2178
Goal = LOSE_WEIGHT (déficit modéré -500)
Target Calories = 2178 - 500
Target Calories = 1678 kcal/jour
```

### Répartition par Repas (exemple)
```
Target Calories = 1678
Meals per day = 4

Breakfast (25%) = 1678 × 0.25 = 420 kcal
Lunch (35%) = 1678 × 0.35 = 587 kcal
Snack (10%) = 1678 × 0.10 = 168 kcal
Dinner (30%) = 1678 × 0.30 = 503 kcal
```

---

## Sécurité et Confidentialité

### Données Sensibles
- Informations médicales
- Poids et mensurations
- Conditions de santé
- Médications

### Mesures de Sécurité
- Authentification obligatoire
- Chiffrement des données sensibles
- Accès restreint (seul l'utilisateur)
- Audit log des accès
- Conformité RGPD

---

## Performance et Optimisation

### Indexation
- `userId` (unique)
- `goal` (filtrage fréquent)
- `dietaryRestrictions` (filtrage)
- `allergies` (filtrage critique)
- `availableEquipments` (filtrage)

### Cache
- Profil utilisateur (cache 1h)
- Calculs BMR/TDEE (cache jusqu'à modification)
- Suggestions (cache 15 min)

### Optimisation des Requêtes
- Chargement lazy des relations
- Agrégation des filtres
- Pagination des résultats

---

## Évolutivité

### Extensibilité
- Structure modulaire
- Critères optionnels
- JSON pour données flexibles
- Versioning du schéma

### Ajout de Nouveaux Critères
1. Ajouter au modèle Prisma
2. Ajouter à l'interface TypeScript
3. Mettre à jour la logique de filtrage
4. Mettre à jour la documentation

---

**Cette architecture permet une personnalisation ultra-précise tout en restant performante et maintenable.**





