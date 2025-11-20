# Travail effectué aujourd'hui - Point de vue métier

## ✅ Fonctionnalités réalisées

1. **Système de suggestions de repas personnalisées**
   - Endpoint `/meals/suggestions` créé
   - Suggestions basées sur le profil utilisateur :
     * Objectifs (prise de masse, perte de poids, maintien, performance)
     * Calories cibles calculées automatiquement :
       - BMR (Métabolisme de base) : calculé avec la formule de Mifflin-St Jeor ou Katch-McArdle selon les données disponibles
       - TDEE (Dépense énergétique totale) : BMR × facteur d'activité (sédentaire, modéré, actif, très actif)
       - Calories cibles : TDEE ajusté selon l'objectif (+500 kcal pour prise de masse, -500 kcal pour perte de poids)
       - Répartition par repas : calcul automatique selon le nombre de repas par jour (petit-déjeuner, déjeuner, dîner, collations)
     * Allergies et intolérances (exclusion automatique des aliments)
     * Aliments exclus (régime végétarien, végan, etc.)
     * Temps de préparation maximum
     * Compétences culinaires et préférence de complexité
     * Macros préférés selon l'objectif (protéines pour prise de masse, etc.)
     * Repas aimés/détestés
   - Filtrage par type de repas (petit-déjeuner, déjeuner, dîner, collation)

2. **Collection Postman pour tester les suggestions**
   - 7 scénarios de test différents
   - Tests pour tous les types de profils (athlète, perte de poids, végétarien, etc.)

3. **Script de test automatisé**
   - Crée automatiquement 6 utilisateurs avec profils complets
   - Teste tous les endpoints

## ⚠️ Problème technique restant

- L'endpoint retourne un tableau vide au lieu de suggestions (erreur technique à corriger)

