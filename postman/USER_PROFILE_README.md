# MealSync - User Profile System - Collection Postman

Cette collection Postman permet de tester complètement le système de profil utilisateur avec différents scénarios et critères.

## 📥 Installation

1. Ouvrez Postman
2. Cliquez sur **Import**
3. Sélectionnez le fichier `MealSync_User_Profile.postman_collection.json`
4. La collection apparaîtra dans votre workspace

## ⚙️ Configuration

### Variables de la collection

- `base_url` : URL de base de l'API (défaut: `http://localhost:3000`)
- `api_key` : Clé API (défaut: `abc123456`)
- `user1_id`, `user2_id`, `user3_id`, `user4_id` : IDs des utilisateurs (remplis automatiquement)

Les IDs des utilisateurs sont automatiquement sauvegardés lors de la création via les scripts de test.

## 📋 Structure de la Collection

### 1. Setup - Create Users
Crée 4 utilisateurs de base pour les différents scénarios de test.

### 2. Profile Scenarios
8 scénarios de profils différents couvrant tous les critères :

#### Scenario 1: Athlete - Muscle Gain
- **Objectif** : Prise de masse musculaire
- **Caractéristiques** :
  - Homme, 28 ans, 180 cm, 75 kg
  - Très actif (6 jours/semaine, musculation)
  - 5 repas + 2 collations par jour
  - Ratio haute protéine (180g/jour)
  - Temps de préparation max : 60 min
  - Compétences culinaires : Intermédiaire

#### Scenario 2: Weight Loss (Conservative)
- **Objectif** : Perte de poids (conservative)
- **Caractéristiques** :
  - Femme, 33 ans, 165 cm, 70 kg
  - Modérément active (cardio 4x/semaine)
  - 3 repas + 1 collation
  - Ratio équilibré
  - Repas simples, préparation rapide (30 min max)

#### Scenario 3: Vegetarian (Complete)
- **Objectif** : Maintien du poids
- **Caractéristiques** :
  - Femme, 35 ans, 170 cm, 65 kg
  - Légèrement active (yoga 3x/semaine)
  - 4 repas par jour
  - Exclut : viande, poisson
  - Focus sur micronutriments (fer, B12, calcium)
  - Préférence pour bio et aliments entiers

#### Scenario 4: Keto Diet (Low Carb)
- **Objectif** : Perte de poids avec régime cétogène
- **Caractéristiques** :
  - Homme, 31 ans, 175 cm, 85 kg
  - Jeûne intermittent 16:8
  - Ratio cétogène (20% protéines, 10% glucides, 70% lipides)
  - Exclut : riz, pâtes, pain, pommes de terre
  - 2 repas par jour (déjeuner + dîner)

#### Scenario 5: Allergies & Intolerances
- **Objectif** : Maintien avec allergies multiples
- **Caractéristiques** :
  - Femme, 28 ans
  - Allergies : arachides, noix, lait, œufs
  - Limite sodium : 2000 mg/jour
  - Repas simples, débutant en cuisine

#### Scenario 6: Medical Conditions
- **Objectif** : Améliorer la santé
- **Caractéristiques** :
  - Homme, 48 ans
  - Conditions : hypertension, diabète type 2
  - Limites strictes : sodium 1500 mg, potassium 2000 mg, protéines 80g
  - Médications : Metformin, Lisinopril
  - Ratio faible en lipides

#### Scenario 7: Taste Preferences
- **Objectif** : Maintien avec préférences de goût
- **Caractéristiques** :
  - Femme, 30 ans
  - Aime : sucré, croustillant, crémeux
  - N'aime pas : épicé
  - Préférences culinaires : française, italienne
  - Température : tiède

#### Scenario 8: Budget Constraints
- **Objectif** : Maintien avec budget serré
- **Caractéristiques** :
  - Homme, 26 ans
  - Budget : 5€ par repas, 15€ par jour
  - Optimisation pour coût
  - Repas simples, débutant
  - Préparation rapide (20 min max)

### 3. Get Profiles & Calculated Needs
- Récupérer les profils complets
- Obtenir les besoins calculés (BMR, TDEE, calories cibles)
- Recalculer les besoins

### 4. Personalized Meal Suggestions
- Suggestions personnalisées pour chaque type de repas
- Test avec différents profils utilisateur
- Vérification du filtrage et du scoring

### 5. Weight History
- Ajouter des entrées de poids
- Consulter l'historique
- Vérifier le recalcul automatique des besoins

### 6. Meal Consumption History
- Enregistrer des repas consommés
- Ajouter des notes et ratings
- Consulter l'historique

### 7. Profile Updates
- Mettre à jour le profil (changement d'objectif, activité, préférences)
- Vérifier le recalcul automatique

### 8. Advanced Scenarios
- Profil grossesse
- Athlète de performance
- Senior avec conditions de santé

## 🚀 Guide d'Utilisation

### Étape 1 : Créer les utilisateurs
1. Exécutez les 4 requêtes dans "1. Setup - Create Users"
2. Les IDs sont automatiquement sauvegardés dans les variables

### Étape 2 : Créer les profils
1. Choisissez un scénario dans "2. Profile Scenarios"
2. Exécutez la requête POST
3. Vérifiez la réponse (le profil est créé avec calculs automatiques)

### Étape 3 : Vérifier les calculs
1. Exécutez "Get Calculated Needs" pour voir :
   - BMR (Basal Metabolic Rate)
   - TDEE (Total Daily Energy Expenditure)
   - Calories cibles par jour
   - Calories par type de repas
   - Macros cibles (protéines, glucides, lipides)

### Étape 4 : Tester les suggestions
1. Exécutez les requêtes dans "4. Personalized Meal Suggestions"
2. Vérifiez que les suggestions correspondent au profil :
   - Calories adaptées au type de repas
   - Filtrage selon les préférences
   - Scoring de pertinence

### Étape 5 : Tester l'historique
1. Ajoutez des entrées de poids
2. Enregistrez des repas consommés
3. Consultez l'historique

### Étape 6 : Tester les mises à jour
1. Modifiez le profil (objectif, activité, etc.)
2. Vérifiez que les calculs sont automatiquement mis à jour

## 📊 Critères Testés

Cette collection teste plus de 200 critères différents :

### Données Physiques
- ✅ Genre, âge, taille, poids
- ✅ Composition corporelle (masse grasse, masse maigre)
- ✅ Mensurations (tour de taille, hanches, cou)

### Activité & Mode de Vie
- ✅ Niveau d'activité (5 niveaux)
- ✅ Type d'exercice (cardio, musculation, etc.)
- ✅ Fréquence et intensité
- ✅ Type de travail
- ✅ Sommeil, stress, tabac, alcool

### Objectifs
- ✅ 9 types d'objectifs différents
- ✅ Vitesse de changement (conservative, modérée, agressive)
- ✅ Cibles de composition corporelle

### Préférences Alimentaires
- ✅ Régimes (végétarien, végan, cétogène, etc.)
- ✅ Aliments exclus
- ✅ Cuisines préférées

### Allergies & Intolérances
- ✅ Allergènes majeurs
- ✅ Intolérances
- ✅ Restrictions médicales

### Contraintes Pratiques
- ✅ Équipements disponibles
- ✅ Compétences culinaires
- ✅ Accessibilité

### Contraintes Temporelles
- ✅ Temps de préparation par repas
- ✅ Jours disponibles
- ✅ Meal prep

### Contraintes Budgétaires
- ✅ Budget par repas/jour/semaine
- ✅ Optimisation pour coût

### Préférences Nutritionnelles
- ✅ Ratios de macros (9 types)
- ✅ Cibles de macros
- ✅ Focus micronutriments
- ✅ Qualité des aliments (bio, entier, etc.)

### Contraintes Médicales
- ✅ Conditions médicales
- ✅ Limites (sodium, potassium, protéines, etc.)
- ✅ Médications

### Préférences de Goût
- ✅ Saveurs (sucré, salé, épicé, etc.)
- ✅ Textures (croustillant, crémeux, etc.)
- ✅ Température
- ✅ Aliments aimés/détestés

### Répartition des Repas
- ✅ Nombre de repas par jour
- ✅ Jeûne intermittent
- ✅ Répartition calorique
- ✅ Timing des repas

## 🔍 Vérifications à Faire

### Calculs Métaboliques
- [ ] BMR calculé correctement selon la formule Mifflin-St Jeor
- [ ] TDEE = BMR × facteur d'activité
- [ ] Calories cibles ajustées selon l'objectif
- [ ] Répartition par repas respecte les pourcentages

### Filtrage des Repas
- [ ] Les repas exclus sont bien filtrés
- [ ] Les calories correspondent aux cibles (±10%)
- [ ] Le temps de préparation respecte les limites
- [ ] Les équipements requis sont disponibles
- [ ] La complexité correspond aux préférences

### Scoring
- [ ] Les repas aimés ont un meilleur score
- [ ] Les repas détestés sont pénalisés
- [ ] Les calories proches de la cible sont favorisées
- [ ] Le temps de préparation optimal est favorisé

### Historique
- [ ] Les entrées de poids sont enregistrées
- [ ] Le recalcul est automatique après changement de poids
- [ ] Les repas consommés sont trackés
- [ ] Les ratings et notes sont sauvegardés

### Mises à Jour
- [ ] Changement d'objectif → recalcul automatique
- [ ] Changement d'activité → recalcul TDEE
- [ ] Changement de poids → recalcul BMR/TDEE
- [ ] Ajout de préférences → impact sur suggestions

## 📝 Notes

- **Remplacez `meal-id-here`** dans les requêtes de consommation par un vrai ID de meal
- Les variables `user1_id`, `user2_id`, etc. sont automatiquement remplies
- Pour tester avec vos propres données, modifiez les bodies JSON des requêtes
- Tous les calculs sont automatiques, pas besoin de les faire manuellement

## 🐛 Dépannage

### Erreur 404 - User not found
- Vérifiez que vous avez bien créé les utilisateurs dans l'étape 1
- Vérifiez que les variables `userX_id` sont bien remplies

### Erreur 422 - Validation Failed
- Vérifiez le format des dates (ISO 8601)
- Vérifiez que les valeurs numériques sont valides
- Vérifiez que les enums sont corrects (ex: "MALE" pas "male")

### Suggestions vides
- Vérifiez qu'il y a des meals dans la base de données
- Vérifiez que les filtres ne sont pas trop restrictifs
- Essayez d'augmenter la limite ou de réduire les contraintes

## 🎯 Scénarios Recommandés pour Tests Complets

1. **Test complet d'un profil** : Créer user → Créer profil → Vérifier calculs → Obtenir suggestions → Enregistrer consommation
2. **Test de recalcul** : Créer profil → Changer poids → Vérifier recalcul → Changer activité → Vérifier recalcul
3. **Test de filtrage** : Créer profil avec restrictions → Obtenir suggestions → Vérifier que les restrictions sont respectées
4. **Test de scoring** : Créer profil → Marquer des meals comme aimés → Obtenir suggestions → Vérifier que les meals aimés sont en haut

---

**Total : 50+ requêtes de test couvrant tous les critères du système de profil utilisateur !**





