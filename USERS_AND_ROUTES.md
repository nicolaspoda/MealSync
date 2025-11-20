# Utilisateurs Créés et Routes de Test

## 📋 Utilisateurs Créés

Exécutez le script `test_all_endpoints.sh` pour créer automatiquement tous les utilisateurs et tester toutes les routes.

### Commandes pour créer les utilisateurs manuellement :

```bash
# User 1 - Athlete (Muscle Gain)
curl -X POST "http://localhost:3000/users" \
  -H "x-api-key: abc123456" \
  -H "Content-Type: application/json" \
  -d '{"email":"athlete@test.com","username":"athlete_user"}'

# User 2 - Weight Loss
curl -X POST "http://localhost:3000/users" \
  -H "x-api-key: abc123456" \
  -H "Content-Type: application/json" \
  -d '{"email":"weightloss@test.com","username":"weightloss_user"}'

# User 3 - Vegetarian
curl -X POST "http://localhost:3000/users" \
  -H "x-api-key: abc123456" \
  -H "Content-Type: application/json" \
  -d '{"email":"vegetarian@test.com","username":"vegetarian_user"}'

# User 4 - Keto Diet
curl -X POST "http://localhost:3000/users" \
  -H "x-api-key: abc123456" \
  -H "Content-Type: application/json" \
  -d '{"email":"keto@test.com","username":"keto_user"}'

# User 5 - Allergies & Intolerances
curl -X POST "http://localhost:3000/users" \
  -H "x-api-key: abc123456" \
  -H "Content-Type: application/json" \
  -d '{"email":"allergies@test.com","username":"allergies_user"}'

# User 6 - Medical Conditions
curl -X POST "http://localhost:3000/users" \
  -H "x-api-key: abc123456" \
  -H "Content-Type: application/json" \
  -d '{"email":"medical@test.com","username":"medical_user"}'
```

## 🍽️ Routes de Test - Suggestions de Repas

### 1. Suggestions Générales (Tous Types de Repas)

```bash
# User 1 - Athlete (Muscle Gain)
GET /meals/suggestions?userId={USER1_ID}&limit=5

# User 2 - Weight Loss
GET /meals/suggestions?userId={USER2_ID}&limit=5

# User 3 - Vegetarian
GET /meals/suggestions?userId={USER3_ID}&limit=5

# User 4 - Keto
GET /meals/suggestions?userId={USER4_ID}&limit=5

# User 5 - Allergies
GET /meals/suggestions?userId={USER5_ID}&limit=5

# User 6 - Medical Conditions
GET /meals/suggestions?userId={USER6_ID}&limit=5
```

### 2. Suggestions par Type de Repas

```bash
# Petit-déjeuner
GET /meals/suggestions?userId={USER1_ID}&mealType=BREAKFAST&limit=3

# Déjeuner
GET /meals/suggestions?userId={USER1_ID}&mealType=LUNCH&limit=3

# Dîner
GET /meals/suggestions?userId={USER1_ID}&mealType=DINNER&limit=3

# Collation
GET /meals/suggestions?userId={USER1_ID}&mealType=SNACK&limit=3
```

## 🎯 Critères Testés

### User 1 - Athlete (Muscle Gain)
- ✅ Objectif: BUILD_MUSCLE
- ✅ Macro ratio: HIGH_PROTEIN
- ✅ Calories cibles: Calculées automatiquement
- ✅ Temps de préparation max: 45 min
- ✅ Compétence culinaire: INTERMEDIATE
- ✅ Complexité: MODERATE
- ✅ Méthodes de cuisson préférées: BAKING, GRILLING

### User 2 - Weight Loss
- ✅ Objectif: LOSE_WEIGHT
- ✅ Taux de changement: CONSERVATIVE
- ✅ Macro ratio: BALANCED
- ✅ Temps de préparation max: 30 min
- ✅ Complexité: SIMPLE
- ✅ Méthodes de cuisson: STEAMING, BAKING

### User 3 - Vegetarian
- ✅ Aliments exclus: Poulet, Bœuf, Porc, Poisson
- ✅ Cuisines préférées: MEDITERRANEAN, INDIAN
- ✅ Focus micronutriments: IRON, VITAMIN_B12, CALCIUM
- ✅ Suppléments: B12, Iron

### User 4 - Keto Diet
- ✅ Jeûne intermittent: 16_8
- ✅ Macro ratio: KETO_RATIO
- ✅ Aliments exclus: Riz, Pâtes, Pain, Pomme de terre
- ✅ Carb target: 20g
- ✅ Fat target: 150g

### User 5 - Allergies & Intolerances
- ✅ Allergies: PEANUTS, TREE_NUTS, MILK, EGGS
- ✅ Sévérité: SEVERE
- ✅ Intolérances: LACTOSE
- ✅ Cœliaque: true
- ✅ Aliments exclus: Arachides, Noix, Lait, Œufs

### User 6 - Medical Conditions
- ✅ Conditions médicales: HYPERTENSION, DIABETES_TYPE_2
- ✅ Limite sodium: 1500mg
- ✅ Limite potassium: 2000mg
- ✅ Limite protéines: 80g
- ✅ Target fibres: 25g
- ✅ Médicaments: Metformin, Lisinopril

## 📝 Script de Test Complet

Exécutez le script `test_all_endpoints.sh` pour tester automatiquement tous les endpoints :

```bash
chmod +x test_all_endpoints.sh
./test_all_endpoints.sh
```

Le script :
1. ✅ Crée 6 utilisateurs avec différents profils
2. ✅ Crée les profils complets avec tous les critères
3. ✅ Teste tous les endpoints CRUD
4. ✅ Teste les suggestions de repas pour chaque profil
5. ✅ Teste l'historique (poids et repas)
6. ✅ Affiche un résumé avec les IDs des utilisateurs créés

## 🔧 Variables d'Environnement

Assurez-vous que le serveur est démarré :

```bash
npm start
# ou
node build/src/server.js
```

L'API est accessible sur `http://localhost:3000`
La clé API est : `abc123456`

## 📊 Collection Postman

Importez la collection `postman/MealSync_User_Profile.postman_collection.json` dans Postman pour tester tous les endpoints avec une interface graphique.

Les IDs des utilisateurs seront automatiquement sauvegardés dans les variables de collection après leur création.



