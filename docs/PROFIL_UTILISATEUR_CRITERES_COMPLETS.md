# Critères Complets pour le Profil Utilisateur - MealSync

## Table des matières
1. [Données Physiques et Biométriques](#1-données-physiques-et-biométriques)
2. [Niveau d'Activité et Mode de Vie](#2-niveau-dactivité-et-mode-de-vie)
3. [Objectifs et Cibles](#3-objectifs-et-cibles)
4. [Préférences Alimentaires et Régimes](#4-préférences-alimentaires-et-régimes)
5. [Allergies et Intolérances](#5-allergies-et-intolérances)
6. [Contraintes Pratiques](#6-contraintes-pratiques)
7. [Préférences Culinaires](#7-préférences-culinaires)
8. [Répartition des Repas](#8-répartition-des-repas)
9. [Préférences Nutritionnelles](#9-préférences-nutritionnelles)
10. [Contraintes Médicales et Santé](#10-contraintes-médicales-et-santé)
11. [Préférences de Goût](#11-préférences-de-goût)
12. [Contraintes Temporelles](#12-contraintes-temporelles)
13. [Contraintes Budgétaires](#13-contraintes-budgétaires)
14. [Préférences de Préparation](#14-préférences-de-préparation)
15. [Historique et Suivi](#15-historique-et-suivi)
16. [Préférences Sociales et Culturelles](#16-préférences-sociales-et-culturelles)

---

## 1. Données Physiques et Biométriques

### 1.1. Données de Base
- **Genre** : MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
- **Date de naissance** : pour calculer l'âge
- **Taille** : en cm (précision au 0.5 cm)
- **Poids actuel** : en kg (précision au 0.1 kg)
- **Poids cible** : en kg (optionnel)

### 1.2. Composition Corporelle (optionnel mais très utile)
- **Pourcentage de masse grasse** : % (mesure par DEXA, impédance, etc.)
- **Masse maigre** : en kg (calculée ou mesurée)
- **Masse grasse** : en kg
- **Tour de taille** : en cm
- **Tour de hanches** : en cm
- **Tour de cou** : en cm
- **IMC actuel** : calculé automatiquement
- **IMC cible** : calculé automatiquement

### 1.3. Métabolisme
- **BMR (Basal Metabolic Rate)** : kcal/jour (calculé automatiquement)
- **TDEE (Total Daily Energy Expenditure)** : kcal/jour (calculé automatiquement)
- **Métabolisme de base mesuré** : kcal/jour (si test métabolique effectué)
- **Facteur métabolique personnalisé** : multiplicateur (si connu)

### 1.4. Données de Santé Générale
- **État de santé général** : EXCELLENT, GOOD, FAIR, POOR
- **Conditions médicales** : liste (diabète, hypertension, etc.)
- **Médications** : liste (peut affecter l'appétit/métabolisme)
- **Grossesse** : boolean + trimestre (1, 2, 3)
- **Allaitement** : boolean + nombre de mois

---

## 2. Niveau d'Activité et Mode de Vie

### 2.1. Niveau d'Activité Global
- **Niveau d'activité** : 
  - SEDENTARY (1.2) : pas d'exercice, travail de bureau
  - LIGHTLY_ACTIVE (1.375) : exercice léger 1-3 jours/semaine
  - MODERATELY_ACTIVE (1.55) : exercice modéré 3-5 jours/semaine
  - VERY_ACTIVE (1.725) : exercice intense 6-7 jours/semaine
  - EXTRA_ACTIVE (1.9) : exercice très intense, travail physique

### 2.2. Activités Physiques Détaillées
- **Type d'exercice principal** : 
  - CARDIO (course, vélo, natation)
  - STRENGTH (musculation, haltérophilie)
  - FLEXIBILITY (yoga, stretching)
  - SPORTS (football, basketball, tennis)
  - MIXED (crossfit, HIIT)
  - NONE

- **Fréquence d'exercice** : 
  - jours par semaine (0-7)
  - minutes par session
  - intensité : LOW, MODERATE, HIGH, VERY_HIGH

- **Objectifs d'entraînement** :
  - ENDURANCE
  - STRENGTH_GAIN
  - MUSCLE_GAIN
  - FAT_LOSS
  - FLEXIBILITY
  - GENERAL_FITNESS

### 2.3. Mode de Vie
- **Type de travail** : 
  - SEDENTARY (bureau)
  - LIGHT (debout, marche occasionnelle)
  - MODERATE (marche régulière)
  - ACTIVE (travail physique)
  - VERY_ACTIVE (travail très physique)

- **Heures de travail par jour** : nombre
- **Heures de sommeil par nuit** : nombre (idéalement 7-9h)
- **Qualité du sommeil** : EXCELLENT, GOOD, FAIR, POOR
- **Niveau de stress** : LOW, MODERATE, HIGH, VERY_HIGH
- **Fumeur** : boolean + nombre de cigarettes/jour
- **Consommation d'alcool** : 
  - NONE, OCCASIONAL, MODERATE, HEAVY
  - verres par semaine

---

## 3. Objectifs et Cibles

### 3.1. Objectif Principal
- **Objectif** :
  - LOSE_WEIGHT (perte de poids)
  - MAINTAIN_WEIGHT (maintien)
  - GAIN_WEIGHT (prise de poids)
  - BUILD_MUSCLE (prise de masse musculaire)
  - RECOMPOSITION (recomposition corporelle - perdre gras, gagner muscle)
  - IMPROVE_HEALTH (améliorer la santé)
  - PERFORMANCE (performance sportive)
  - PREGNANCY (grossesse)
  - LACTATION (allaitement)

### 3.2. Cibles Caloriques
- **Calories cibles par jour** : kcal (calculé ou défini manuellement)
- **Déficit/surplus calorique** : kcal/jour
- **Vitesse de changement souhaitée** :
  - CONSERVATIVE (0.25-0.5 kg/semaine)
  - MODERATE (0.5-1 kg/semaine)
  - AGGRESSIVE (1-1.5 kg/semaine)

### 3.3. Cibles de Poids
- **Poids cible** : kg
- **Date cible** : date (pour calculer le déficit/surplus nécessaire)
- **Perte/gain de poids par semaine** : kg

### 3.4. Cibles de Composition Corporelle
- **Pourcentage de masse grasse cible** : %
- **Masse musculaire cible** : kg
- **Tour de taille cible** : cm

### 3.5. Cibles de Performance
- **Objectifs sportifs** : texte libre
- **Compétitions à venir** : dates + types
- **Performance cible** : (ex: courir 10km en X minutes)

---

## 4. Préférences Alimentaires et Régimes

### 4.1. Régimes Alimentaires
- **Régime principal** :
  - OMNIVORE (tout)
  - VEGETARIAN (végétarien)
  - VEGAN (végan)
  - PESCATARIAN (pesco-végétarien)
  - POLLOTARIAN (pollo-végétarien)
  - FLEXITARIAN (flexitarien)
  - PALEO (paléolithique)
  - KETO (cétogène)
  - LOW_CARB (faible en glucides)
  - LOW_FAT (faible en lipides)
  - MEDITERRANEAN (méditerranéen)
  - DASH (Dietary Approaches to Stop Hypertension)
  - MIND (Mediterranean-DASH Intervention for Neurodegenerative Delay)
  - WHOLE30
  - RAW_FOOD (alimentation crue)
  - MACROBIOTIC (macrobiotique)
  - AYURVEDIC (ayurvédique)
  - CUSTOM (personnalisé)

### 4.2. Restrictions Alimentaires
- **Aliments à exclure** : liste de noms d'aliments
- **Catégories à exclure** :
  - RED_MEAT (viande rouge)
  - POULTRY (volaille)
  - FISH (poisson)
  - SEAFOOD (fruits de mer)
  - DAIRY (produits laitiers)
  - EGGS (œufs)
  - GRAINS (céréales)
  - LEGUMES (légumineuses)
  - NUTS (noix)
  - SEEDS (graines)
  - SOY (soja)
  - NIGHTSHADES (solanacées : tomates, aubergines, etc.)

### 4.3. Préférences Religieuses/Culturelles
- **Régime religieux** :
  - HALAL (halal)
  - KOSHER (cacher)
  - JAIN (jaïnisme)
  - BUDDHIST (bouddhiste)
  - HINDU (hindouiste)
  - SEVENTH_DAY_ADVENTIST (adventiste du 7ème jour)

### 4.4. Philosophie Alimentaire
- **Éthique alimentaire** :
  - ORGANIC_ONLY (bio uniquement)
  - LOCAL_ONLY (local uniquement)
  - SUSTAINABLE (durable)
  - FAIR_TRADE (commerce équitable)
  - CRUELTY_FREE (sans cruauté)
  - ENVIRONMENTALLY_CONSCIOUS (conscient de l'environnement)

---

## 5. Allergies et Intolérances

### 5.1. Allergies Alimentaires
- **Allergènes majeurs** :
  - PEANUTS (arachides)
  - TREE_NUTS (noix d'arbres)
  - MILK (lait)
  - EGGS (œufs)
  - FISH (poisson)
  - SHELLFISH (crustacés)
  - SOY (soja)
  - WHEAT (blé)
  - SESAME (sésame)
  - MUSTARD (moutarde)
  - CELERY (céleri)
  - LUPIN (lupin)
  - MOLLUSCS (mollusques)
  - SULPHITES (sulfites)

- **Autres allergies** : liste personnalisée
- **Sévérité** : MILD, MODERATE, SEVERE, LIFE_THREATENING

### 5.2. Intolérances
- **Intolérances** :
  - LACTOSE (lactose)
  - GLUTEN (gluten - non cœliaque)
  - FRUCTOSE (fructose)
  - HISTAMINE (histamine)
  - FODMAP (FODMAP)
  - SULPHITES (sulfites)

- **Sensibilité** : LOW, MODERATE, HIGH
- **Aliments spécifiques à éviter** : liste

### 5.3. Maladie Cœliaque
- **Cœliaque** : boolean
- **Niveau de sensibilité** : VERY_SENSITIVE, MODERATE, LOW

---

## 6. Contraintes Pratiques

### 6.1. Équipements Disponibles
- **Équipements de cuisine disponibles** : liste d'IDs d'équipements
- **Équipements manquants à éviter** : liste d'IDs
- **Préférence pour repas sans équipement** : boolean

### 6.2. Espace de Cuisine
- **Taille de la cuisine** : SMALL, MEDIUM, LARGE
- **Espace de stockage** : LIMITED, MODERATE, AMPLE
- **Réfrigérateur** : boolean + taille
- **Congélateur** : boolean + taille

### 6.3. Compétences Culinaires
- **Niveau de compétence** :
  - BEGINNER (débutant)
  - INTERMEDIATE (intermédiaire)
  - ADVANCED (avancé)
  - PROFESSIONAL (professionnel)

- **Techniques maîtrisées** :
  - SAUTEING (sauter)
  - ROASTING (rôtir)
  - GRILLING (griller)
  - BAKING (cuire au four)
  - STEAMING (cuire à la vapeur)
  - BOILING (bouillir)
  - BRAISING (braiser)
  - SOUS_VIDE (sous-vide)
  - FERMENTATION (fermentation)
  - PRESSURE_COOKING (cuisson sous pression)

### 6.4. Accessibilité
- **Mobilité réduite** : boolean
- **Limitations physiques** : texte
- **Besoin d'aide pour cuisiner** : boolean

---

## 7. Préférences Culinaires

### 7.1. Types de Cuisines
- **Cuisines préférées** :
  - FRENCH (française)
  - ITALIAN (italienne)
  - SPANISH (espagnole)
  - GREEK (grecque)
  - MEDITERRANEAN (méditerranéenne)
  - ASIAN (asiatique)
  - CHINESE (chinoise)
  - JAPANESE (japonaise)
  - THAI (thaïlandaise)
  - INDIAN (indienne)
  - MEXICAN (mexicaine)
  - MIDDLE_EASTERN (moyen-orientale)
  - AMERICAN (américaine)
  - BRITISH (britannique)
  - GERMAN (allemande)
  - SCANDINAVIAN (scandinave)
  - AFRICAN (africaine)
  - LATIN_AMERICAN (latino-américaine)
  - FUSION (fusion)

- **Cuisines à éviter** : liste

### 7.2. Styles de Repas
- **Styles préférés** :
  - HOME_COOKED (fait maison)
  - QUICK_MEALS (repas rapides)
  - MEAL_PREP (préparation à l'avance)
  - ONE_POT (tout-en-un)
  - BOWL (bowl)
  - SALAD (salade)
  - SOUP (soupe)
  - SANDWICH (sandwich)
  - WRAP (wrap)
  - SMOOTHIE (smoothie)
  - JUICE (jus)

### 7.3. Types de Repas
- **Repas préférés** :
  - BREAKFAST (petit-déjeuner)
  - BRUNCH (brunch)
  - LUNCH (déjeuner)
  - DINNER (dîner)
  - SNACK (collation)
  - DESSERT (dessert)
  - APPETIZER (entrée)

---

## 8. Répartition des Repas

### 8.1. Structure des Repas
- **Nombre de repas par jour** : 1-8
- **Nombre de collations par jour** : 0-5
- **Jeûne intermittent** : boolean
- **Type de jeûne** :
  - NONE
  - 16_8 (16h jeûne, 8h fenêtre)
  - 18_6 (18h jeûne, 6h fenêtre)
  - 20_4 (20h jeûne, 4h fenêtre)
  - OMAD (One Meal A Day)
  - 5_2 (5 jours normal, 2 jours restriction)
  - ALTERNATE_DAY (jeûne un jour sur deux)

### 8.2. Répartition Calorique
- **Répartition par type de repas** :
  - Petit-déjeuner : % (généralement 20-30%)
  - Collation matinale : % (0-10%)
  - Déjeuner : % (généralement 30-40%)
  - Collation après-midi : % (0-10%)
  - Dîner : % (généralement 25-35%)
  - Collation soirée : % (0-10%)

### 8.3. Timing des Repas
- **Heures préférées** :
  - Petit-déjeuner : heure (ex: 7h00)
  - Déjeuner : heure (ex: 12h30)
  - Dîner : heure (ex: 19h00)
  - Collations : heures

- **Fenêtre d'alimentation** : début - fin (pour jeûne intermittent)
- **Dernier repas avant coucher** : heures avant (ex: 3h)

### 8.4. Répartition des Macros par Repas
- **Petit-déjeuner** :
  - Protéines : % ou g
  - Glucides : % ou g
  - Lipides : % ou g

- **Déjeuner** : idem
- **Dîner** : idem
- **Collations** : idem

---

## 9. Préférences Nutritionnelles

### 9.1. Macros Cibles
- **Ratio de macros** :
  - HIGH_PROTEIN (haute protéine : 30-40% calories)
  - BALANCED (équilibré : 30% protéines, 40% glucides, 30% lipides)
  - LOW_CARB (faible glucides : <50g/jour)
  - MODERATE_CARB (glucides modérés : 100-150g/jour)
  - HIGH_CARB (haute glucides : >200g/jour)
  - LOW_FAT (faible lipides : <20% calories)
  - MODERATE_FAT (lipides modérés : 20-30% calories)
  - HIGH_FAT (haute lipides : >35% calories)
  - KETO_RATIO (cétogène : 70% lipides, 20% protéines, 10% glucides)

- **Macros spécifiques** :
  - Protéines : g/jour ou % calories
  - Glucides : g/jour ou % calories
  - Lipides : g/jour ou % calories
  - Fibres : g/jour (minimum recommandé : 25-30g)

### 9.2. Micronutriments
- **Focus sur micronutriments** :
  - IRON (fer) - important pour anémie
  - CALCIUM (calcium) - important pour os
  - VITAMIN_D (vitamine D)
  - VITAMIN_B12 (vitamine B12) - important pour végans
  - OMEGA_3 (oméga-3)
  - MAGNESIUM (magnésium)
  - ZINC (zinc)
  - FOLATE (folate) - important pour grossesse

### 9.3. Densité Nutritionnelle
- **Préférence pour aliments denses** : boolean
- **Minimum de nutriments par calorie** : score
- **Focus sur superaliments** : boolean

### 9.4. Qualité des Aliments
- **Préférence pour** :
  - WHOLE_FOODS (aliments entiers)
  - MINIMALLY_PROCESSED (minimalement transformés)
  - ORGANIC (bio)
  - GRASS_FED (nourri à l'herbe)
  - WILD_CAUGHT (pêché sauvage)
  - FREE_RANGE (élevage en plein air)

### 9.5. Suppléments
- **Suppléments pris** : liste
- **Besoin de suppléments dans les repas** : boolean

---

## 10. Contraintes Médicales et Santé

### 10.1. Conditions Médicales
- **Conditions** :
  - DIABETES_TYPE_1 (diabète type 1)
  - DIABETES_TYPE_2 (diabète type 2)
  - PREDIABETES (prédiabète)
  - HYPERTENSION (hypertension)
  - HYPOTENSION (hypotension)
  - HEART_DISEASE (maladie cardiaque)
  - KIDNEY_DISEASE (maladie rénale)
  - LIVER_DISEASE (maladie hépatique)
  - PCOS (syndrome des ovaires polykystiques)
  - THYROID_ISSUES (problèmes thyroïdiens)
  - IBS (syndrome du côlon irritable)
  - IBD (maladie inflammatoire de l'intestin)
  - CROHNS (maladie de Crohn)
  - ULCERATIVE_COLITIS (colite ulcéreuse)
  - GERD (reflux gastro-œsophagien)
  - GALLSTONES (calculs biliaires)
  - OSTEOPOROSIS (ostéoporose)
  - ARTHRITIS (arthrite)
  - GOUT (goutte)
  - MIGRAINES (migraines)
  - EPILEPSY (épilepsie)

### 10.2. Restrictions Médicales
- **Sodium** : limite en mg/jour (ex: <2000mg pour hypertension)
- **Potassium** : limite en mg/jour (ex: pour maladie rénale)
- **Phosphore** : limite en mg/jour (ex: pour maladie rénale)
- **Protéines** : limite en g/jour (ex: pour maladie rénale)
- **Liquides** : limite en ml/jour (ex: pour maladie rénale)
- **Fibres** : limite en g/jour (ex: pour certains troubles digestifs)

### 10.3. Médications
- **Médications affectant l'appétit** : liste
- **Médications nécessitant restrictions** : liste
- **Interactions alimentaires** : texte

### 10.4. Chirurgies et Procédures
- **Chirurgies récentes** : liste + dates
- **Restrictions post-chirurgie** : texte
- **Bypass gastrique** : boolean + type
- **Autres procédures** : texte

---

## 11. Préférences de Goût

### 11.1. Saveurs Préférées
- **Préférences de saveur** :
  - SWEET (sucré) : LIKE, NEUTRAL, DISLIKE
  - SOUR (acide) : LIKE, NEUTRAL, DISLIKE
  - SALTY (salé) : LIKE, NEUTRAL, DISLIKE
  - BITTER (amer) : LIKE, NEUTRAL, DISLIKE
  - UMAMI (umami) : LIKE, NEUTRAL, DISLIKE
  - SPICY (épicé) : LIKE, NEUTRAL, DISLIKE

- **Niveau d'épices préféré** :
  - NONE (aucun)
  - MILD (doux)
  - MODERATE (modéré)
  - HOT (fort)
  - VERY_HOT (très fort)
  - EXTREME (extrême)

### 11.2. Textures Préférées
- **Textures préférées** :
  - CRISPY (croustillant) : LIKE, NEUTRAL, DISLIKE
  - CREAMY (crémeux) : LIKE, NEUTRAL, DISLIKE
  - CHEWY (moelleux) : LIKE, NEUTRAL, DISLIKE
  - SOFT (doux) : LIKE, NEUTRAL, DISLIKE
  - CRUNCHY (croquant) : LIKE, NEUTRAL, DISLIKE
  - SMOOTH (lisse) : LIKE, NEUTRAL, DISLIKE

### 11.3. Températures
- **Températures préférées** :
  - HOT (chaud)
  - WARM (tiède)
  - ROOM_TEMPERATURE (température ambiante)
  - COLD (froid)
  - FROZEN (congelé)

### 11.4. Aliments Spécifiques
- **Aliments aimés** : liste
- **Aliments détestés** : liste
- **Aliments neutres** : liste

---

## 12. Contraintes Temporelles

### 12.1. Temps de Préparation
- **Temps maximum par repas** : minutes
- **Temps maximum par jour** : minutes
- **Temps disponible par type de repas** :
  - Petit-déjeuner : minutes
  - Déjeuner : minutes
  - Dîner : minutes
  - Collations : minutes

### 12.2. Planning
- **Jours de la semaine disponibles** : liste (LUN, MAR, MER, JEU, VEN, SAM, DIM)
- **Heures de disponibilité** : plages horaires
- **Préférence pour meal prep** : boolean
- **Jours de meal prep** : liste

### 12.3. Urgence
- **Besoin de repas rapides** : boolean
- **Temps de préparation préféré** :
  - INSTANT (<5 min)
  - QUICK (5-15 min)
  - MODERATE (15-30 min)
  - LONG (30-60 min)
  - VERY_LONG (>60 min)

---

## 13. Contraintes Budgétaires

### 13.1. Budget
- **Budget par repas** : montant + devise
- **Budget par jour** : montant + devise
- **Budget par semaine** : montant + devise
- **Budget par mois** : montant + devise

### 13.2. Préférences de Coût
- **Niveau de prix préféré** :
  - BUDGET (économique)
  - MODERATE (modéré)
  - PREMIUM (premium)
  - LUXURY (luxe)

- **Préférence pour ingrédients** :
  - AFFORDABLE (abordables)
  - MID_RANGE (milieu de gamme)
  - PREMIUM (premium)

### 13.3. Optimisation
- **Optimiser pour coût** : boolean
- **Accepter alternatives moins chères** : boolean

---

## 14. Préférences de Préparation

### 14.1. Méthodes de Cuisson
- **Méthodes préférées** :
  - BAKING (cuisson au four)
  - GRILLING (grillage)
  - STEAMING (cuisson à la vapeur)
  - BOILING (ébullition)
  - SAUTEING (sauter)
  - ROASTING (rôtir)
  - RAW (cru)
  - SLOW_COOKING (cuisson lente)
  - PRESSURE_COOKING (cuisson sous pression)
  - SOUS_VIDE (sous-vide)

- **Méthodes à éviter** : liste

### 14.2. Complexité
- **Complexité préférée** :
  - SIMPLE (simple - 1-3 ingrédients)
  - MODERATE (modérée - 4-7 ingrédients)
  - COMPLEX (complexe - 8+ ingrédients)

- **Nombre d'étapes maximum** : nombre
- **Temps de préparation vs cuisson** : préférence

### 14.3. Batch Cooking
- **Préférence pour batch cooking** : boolean
- **Portions à préparer** : nombre
- **Durée de conservation** : jours

### 14.4. Stockage
- **Préférence pour repas préparables à l'avance** : boolean
- **Durée de conservation préférée** : jours
- **Congélation** : boolean (accepte/refuse)

---

## 15. Historique et Suivi

### 15.1. Historique Alimentaire
- **Repas précédents** : historique
- **Aliments fréquemment consommés** : liste
- **Aliments évités récemment** : liste
- **Variété souhaitée** : HIGH, MODERATE, LOW

### 15.2. Suivi de Progrès
- **Poids historique** : dates + poids
- **Mensurations historiques** : dates + valeurs
- **Performance historique** : dates + métriques
- **Objectifs atteints** : liste

### 15.3. Feedback
- **Repas aimés** : liste d'IDs
- **Repas détestés** : liste d'IDs
- **Notes sur repas** : texte libre
- **Ratings** : 1-5 étoiles par repas

### 15.4. Ajustements
- **Fréquence de réévaluation** : WEEKLY, MONTHLY, QUARTERLY
- **Historique de modifications du profil** : dates + changements

---

## 16. Préférences Sociales et Culturelles

### 16.1. Contexte Social
- **Nombre de personnes à nourrir** : nombre
- **Repas partagés** : boolean
- **Préférence pour repas familiaux** : boolean
- **Occasions spéciales** : dates + types

### 16.2. Culture et Traditions
- **Traditions culinaires** : texte
- **Fêtes religieuses** : dates + restrictions
- **Célébrations** : dates + types

### 16.3. Éthique et Valeurs
- **Valeurs importantes** :
  - ANIMAL_WELFARE (bien-être animal)
  - ENVIRONMENTAL (environnemental)
  - SUSTAINABILITY (durabilité)
  - FAIR_TRADE (commerce équitable)
  - LOCAL (local)
  - SEASONAL (saisonnier)

### 16.4. Éducation et Apprentissage
- **Souhaite apprendre** : boolean
- **Niveau de connaissances nutritionnelles** : BEGINNER, INTERMEDIATE, ADVANCED
- **Intérêt pour éducation nutritionnelle** : boolean

---

## Formules de Calcul Recommandées

### BMR (Basal Metabolic Rate)

#### Mifflin-St Jeor (recommandée)
- **Homme** : BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge + 5
- **Femme** : BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge - 161

#### Harris-Benedict (alternative)
- **Homme** : BMR = 88.362 + (13.397 × poids) + (4.799 × taille) - (5.677 × âge)
- **Femme** : BMR = 447.593 + (9.247 × poids) + (3.098 × taille) - (4.330 × âge)

#### Katch-McArdle (si % masse grasse connu)
- BMR = 370 + (21.6 × masse maigre en kg)

### TDEE (Total Daily Energy Expenditure)
- TDEE = BMR × facteur d'activité

### Ajustements selon Objectif
- **Perte de poids** : TDEE - 500 à -750 kcal/jour
- **Maintien** : TDEE ± 0 kcal/jour
- **Prise de poids** : TDEE + 300 à +500 kcal/jour
- **Prise de masse** : TDEE + 300 à +500 kcal/jour

### Macros selon Objectif
- **Perte de poids** : 30-40% protéines, 30-40% glucides, 20-30% lipides
- **Maintien** : 25-35% protéines, 40-50% glucides, 25-35% lipides
- **Prise de masse** : 30-40% protéines, 40-50% glucides, 20-30% lipides
- **Cétogène** : 20% protéines, 10% glucides, 70% lipides

---

## Priorisation des Critères

### Niveau 1 - Critiques (doivent être respectés)
- Allergies et intolérances sévères
- Restrictions médicales
- Régimes stricts (cœliaque, allergies)

### Niveau 2 - Importants (fortement recommandés)
- Objectifs caloriques
- Préférences alimentaires (végétarien, etc.)
- Contraintes pratiques (équipements)

### Niveau 3 - Préférences (souhaitables)
- Goûts et textures
- Styles culinaires
- Complexité de préparation

### Niveau 4 - Optimisations (améliorations)
- Budget
- Variété
- Densité nutritionnelle

---

## Notes d'Implémentation

1. **Validation** : Tous les critères doivent être validés (ranges, types, cohérence)
2. **Calculs automatiques** : BMR, TDEE, calories cibles calculés automatiquement
3. **Mise à jour** : Recalculer si poids/activité/objectif change
4. **Flexibilité** : Permettre override manuel des valeurs calculées
5. **Historique** : Garder un historique des profils pour suivi
6. **Confidentialité** : Données sensibles, nécessitent sécurité renforcée
7. **Performance** : Indexer les champs utilisés pour filtrage
8. **Évolutivité** : Structure extensible pour ajouter de nouveaux critères

---

**Total : Plus de 200 critères possibles pour un système ultra-personnalisé !**

