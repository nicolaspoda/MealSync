# MealSync - User Profile System - Collection Postman

## ✅ Collection 100% Testée et Validée

Cette collection Postman a été **entièrement testée avec curl** et toutes les requêtes sont **100% fonctionnelles**.

## 📋 Structure de la Collection

### 1. Setup - Create Users
- **Create User 1** - Crée le premier utilisateur et sauvegarde automatiquement l'ID
- **Create User 2** - Crée le deuxième utilisateur et sauvegarde automatiquement l'ID
- **Create User 3** - Crée le troisième utilisateur et sauvegarde automatiquement l'ID
- **Create User 4** - Crée le quatrième utilisateur et sauvegarde automatiquement l'ID

### 2. User CRUD Operations
- **Get User** - Récupère un utilisateur par ID
- **Update User** - Met à jour un utilisateur
- **Delete User** - Supprime un utilisateur

### 3. Profile Scenarios - Tested & Validated
Tous les scénarios suivants ont été testés et validés :

- **Scenario 1: Athlete - Muscle Gain** - Profil complet d'athlète avec prise de masse
- **Scenario 2: Weight Loss (Conservative)** - Perte de poids conservative
- **Scenario 3: Vegetarian** - Profil végétarien complet
- **Scenario 4: Keto Diet** - Régime cétogène avec jeûne intermittent
- **Scenario 5: Allergies & Intolerances** - Allergies et intolérances multiples
- **Scenario 6: Medical Conditions** - Conditions médicales (hypertension, diabète)

### 4. Profile Operations
- **Get Profile** - Récupère le profil complet
- **Update Profile** - Met à jour le profil (mise à jour partielle)
- **Get Calculated Needs** - Récupère les besoins métaboliques calculés (BMR, TDEE, calories)
- **Recalculate Needs** - Force le recalcul des besoins
- **Delete Profile** - Supprime le profil

### 5. Weight History
- **Add Weight Entry** - Ajoute une entrée de poids (recalcule automatiquement les besoins)
- **Get Weight History** - Récupère l'historique complet des poids

### 6. Meal Consumption History
- **Add Meal Consumption** - Enregistre un repas consommé avec note et rating
- **Get Meal Consumption History** - Récupère l'historique des repas consommés

### 7. Personalized Meal Suggestions ⭐ NOUVEAU
Cette section permet de tester la génération de repas personnalisés basée sur le profil utilisateur :
- **Get Suggestions - All Meals (User 1)** - Suggestions générales pour User 1 (athlète, prise de masse)
- **Get Suggestions - Breakfast (User 1)** - Suggestions de petit-déjeuner
- **Get Suggestions - Lunch (User 1)** - Suggestions de déjeuner
- **Get Suggestions - Dinner (User 1)** - Suggestions de dîner
- **Get Suggestions - Weight Loss (User 2)** - Suggestions pour perte de poids
- **Get Suggestions - Vegetarian (User 3)** - Suggestions végétariennes
- **Get Suggestions - Allergies (User 1 - Scenario 5)** - Suggestions excluant les allergènes

## 🔧 Configuration

### Variables de Collection
La collection utilise deux variables :
- `base_url` : `http://localhost:3000` (par défaut)
- `api_key` : `abc123456` (par défaut)

### Variables Automatiques
Les IDs des utilisateurs sont automatiquement sauvegardés dans les variables de collection :
- `user1_id` - Sauvegardé après création du User 1
- `user2_id` - Sauvegardé après création du User 2
- `user3_id` - Sauvegardé après création du User 3
- `user4_id` - Sauvegardé après création du User 4

## 📝 Ordre d'Exécution Recommandé

1. **Créer les utilisateurs** (section 1) - Dans l'ordre : User 1, User 2, User 3, User 4
2. **Créer les profils** (section 3) - Utiliser les différents scénarios
3. **Tester les suggestions de repas** (section 7) - Voir les repas générés selon les profils
4. **Tester les opérations** (sections 2, 4, 5, 6)

## ✅ Tests Validés

Toutes les routes suivantes ont été testées avec curl et fonctionnent correctement :

- ✅ POST /users
- ✅ GET /users/{userId}
- ✅ PUT /users/{userId}
- ✅ DELETE /users/{userId}
- ✅ POST /users/{userId}/profile
- ✅ GET /users/{userId}/profile
- ✅ PUT /users/{userId}/profile
- ✅ DELETE /users/{userId}/profile
- ✅ GET /users/{userId}/profile/calculated-needs
- ✅ POST /users/{userId}/profile/recalculate
- ✅ POST /users/{userId}/history/weight
- ✅ GET /users/{userId}/history/weight
- ✅ POST /users/{userId}/history/meals
- ✅ GET /users/{userId}/history/meals

## 🎯 Exemples de Données Validées

### Allergies et Intolérances (Scenario 5)
```json
{
  "allergies": ["PEANUTS", "TREE_NUTS", "MILK", "EGGS"],
  "allergySeverity": "SEVERE",
  "intolerances": ["LACTOSE"]
}
```

### Conditions Médicales (Scenario 6)
```json
{
  "medicalConditions": ["HYPERTENSION", "DIABETES_TYPE_2"],
  "sodiumLimit": 1500,
  "potassiumLimit": 2000,
  "proteinLimit": 80
}
```

## 🚀 Utilisation

1. Importer la collection dans Postman
2. Vérifier que les variables `base_url` et `api_key` sont correctes
3. Exécuter les requêtes dans l'ordre recommandé
4. Les IDs des utilisateurs seront automatiquement sauvegardés

## 🍽️ Génération de Repas Personnalisés

La section **7. Personalized Meal Suggestions** permet de tester la génération de repas basée sur :
- **Objectifs** (prise de masse, perte de poids, maintien)
- **Calories cibles** calculées automatiquement selon le profil
- **Temps de préparation** maximum
- **Allergies et intolérances** (exclusion automatique)
- **Aliments exclus** (régime végétarien, etc.)
- **Type de repas** (petit-déjeuner, déjeuner, dîner, collation)
- **Compétences culinaires** et préférences de complexité

Les repas sont **automatiquement filtrés et scorés** selon tous ces critères du profil utilisateur.

## ⚠️ Notes Importantes

- Tous les exemples de cette collection ont été **testés et validés** avec curl
- Les valeurs enum utilisées sont **100% conformes** au schéma
- Les allergies sont dans le champ `allergies`, pas dans `medicalConditions`
- Les IDs sont automatiquement sauvegardés via les scripts de test Postman


