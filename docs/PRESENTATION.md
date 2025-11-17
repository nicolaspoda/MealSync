# MealSync API - Support de Présentation

Guide de présentation pour la soutenance du projet MealSync API.

**Durée recommandée** : 20-30 minutes

---

## 📋 Structure de la Présentation

### 1. Présentation du thème et contexte (2-3 min) - /2 pts

#### Slide 1 : Introduction
- **Titre** : MealSync API - Service de Diététique et Nutrition
- **Problématique** :
  - Les citoyens ont besoin d'outils pour mieux organiser leur alimentation
  - Difficulté à trouver des repas adaptés à leurs objectifs nutritionnels
  - Manque d'informations nutritionnelles détaillées
- **Valeur ajoutée** :
  - API complète pour gérer plats, recettes et informations nutritionnelles
  - Suggestions personnalisées basées sur les objectifs
  - Génération automatique de plans de repas quotidiens
- **Public cible** :
  - Applications mobiles de nutrition
  - Plateformes de coaching sportif
  - Services de livraison de repas
  - Applications SmartCity

#### Points clés à mentionner :
- ✅ Service SmartCity pour améliorer la qualité de vie des citoyens
- ✅ API REST complète avec 33+ endpoints
- ✅ Gestion complète du cycle de vie des repas (création, recherche, analyse)

---

### 2. Architecture et choix techniques (5-7 min) - /3 pts

#### Slide 2 : Stack Technique

**Technologies choisies** :
- **Node.js 18+** : Performance et écosystème riche
- **TypeScript** : Type safety et maintenabilité
- **Express 5.x** : Framework web minimaliste et performant
- **Prisma ORM** : Type safety, migrations automatiques
- **SQLite** : Simplicité pour le développement (migration PostgreSQL facile)
- **TSOA** : Documentation OpenAPI automatique depuis le code

**Justifications** :
- Stack moderne et performante
- Productivité élevée (développement rapide)
- Type safety end-to-end (TypeScript + Prisma)
- Documentation automatique (TSOA)

#### Slide 3 : Architecture de l'Application

**Diagramme d'architecture en couches** :

```
Client (Frontend)
    ↓ HTTP/REST + x-api-key
Express Server
    ├─ Rate Limiting
    ├─ CORS
    ├─ Body Parser
    ├─ TSOA Routes (auto-generated)
    │   └─ Authentication (API Key)
    ├─ Controllers
    ├─ Services
    └─ Prisma Client
        ↓
SQLite Database
```

**Points clés** :
- Architecture en couches (Controllers → Services → Data Access)
- Séparation claire des responsabilités
- Middleware pour sécurité (CORS, Rate Limiting, Auth)

#### Slide 4 : Modèle de Données

**Diagramme ER** (montrer les relations) :
- Meal (plats)
- Aliment (ingrédients)
- Equipment (équipements)
- Macro (macronutriments)
- Preparation (étapes de recette)
- Relations many-to-many via tables de jointure

**Points clés** :
- Normalisation 3NF
- Relations bien définies
- UUID comme clés primaires
- Cascade delete pour l'intégrité

#### Slide 5 : Stratégie de Sécurité

**API Keys (B2B)** :
- Authentification du frontend via header `x-api-key`
- Clé stockée dans variables d'environnement
- Validation côté serveur
- Format standard professionnel

**Sécurité supplémentaire** :
- CORS configuré pour autoriser le frontend
- Rate limiting (100 req/15min par IP)
- Validation des entrées (TSOA)
- Gestion d'erreurs centralisée

#### Slide 6 : Patterns Utilisés

- **Service Layer** : Logique métier séparée
- **Repository Pattern** : Via Prisma
- **Singleton** : Instance Prisma unique
- **Middleware Pattern** : Express
- **Dependency Injection** : Implicite (services instanciés dans controllers)

---

### 3. Démonstration live (8-10 min) - /3 pts

#### Démo 1 : Documentation Swagger (1 min)
1. Ouvrir `http://localhost:3000/docs`
2. Montrer l'interface Swagger UI
3. Expliquer que tous les endpoints sont documentés
4. Montrer les modèles de données (schemas)

#### Démo 2 : Endpoints CRUD (2-3 min)
**Avec Postman** :

1. **GET /aliments** (avec API Key)
   - Montrer la liste des aliments
   - Expliquer l'authentification

2. **POST /aliments**
   - Créer un nouvel aliment
   - Montrer la validation (essayer avec données invalides → 422)

3. **GET /aliments/{id}**
   - Récupérer un aliment spécifique
   - Montrer le format de réponse

4. **PUT /aliments/{id}**
   - Modifier un aliment
   - Montrer la mise à jour partielle

5. **DELETE /aliments/{id}**
   - Supprimer un aliment
   - Vérifier la suppression

#### Démo 3 : Endpoints Avancés (2-3 min)

1. **GET /meals/paginated?page=1&limit=10&minCalories=200**
   - Montrer la pagination
   - Expliquer les filtres

2. **GET /meals/quick?maxTime=30**
   - Recherche de plats rapides
   - Montrer les résultats

3. **GET /meals/suggestions?targetCalories=2000&limit=5**
   - Suggestions personnalisées
   - Expliquer l'algorithme

4. **POST /meals/analyze**
   - Analyse nutritionnelle d'un payload
   - Montrer le calcul des totaux

#### Démo 4 : Génération de Plan de Repas (2 min)

**POST /meal-plans/generate** :
```json
{
  "objectives": {
    "targetCalories": 2000,
    "macros": {
      "protein": 150,
      "carbohydrates": 200,
      "lipids": 65
    }
  },
  "constraints": {
    "mealsPerDay": 3,
    "excludedAliments": ["Poisson"],
    "availableEquipments": ["oven", "stove"]
  }
}
```

- Montrer la génération
- Expliquer le résultat (plan quotidien avec résumé nutritionnel)

#### Démo 5 : Gestion des Erreurs (1 min)

1. **Sans API Key** → 401 Unauthorized
2. **Données invalides** → 422 Validation Failed
3. **Ressource inexistante** → 404 Not Found
4. **Rate limiting** → 429 Too Many Requests (si applicable)

---

### 4. Difficultés rencontrées et solutions (3-5 min) - /1 pt

#### Difficulté 1 : Génération automatique de la documentation
- **Problème** : Maintenir la documentation à jour avec le code
- **Solution** : TSOA pour génération automatique depuis le code TypeScript
- **Résultat** : Documentation toujours synchronisée

#### Difficulté 2 : Relations complexes dans Prisma
- **Problème** : Gérer les relations many-to-many (Meal ↔ Aliment, etc.)
- **Solution** : Tables de jointure avec Prisma
- **Résultat** : Modèle de données clair et maintenable

#### Difficulté 3 : Validation des types
- **Problème** : S'assurer que les données entrantes sont valides
- **Solution** : TSOA avec décorateurs TypeScript pour validation automatique
- **Résultat** : Validation robuste sans code boilerplate

#### Apprentissages :
- Importance de la documentation automatique
- Avantages du type safety (TypeScript + Prisma)
- Architecture en couches facilite la maintenance

---

### 5. Améliorations futures (2-3 min) - /1 pt

#### Court terme :
- ✅ Versioning de l'API (`/api/v1`)
- ✅ Migration vers PostgreSQL pour la production
- ✅ Amélioration de la sécurité des API Keys (stockage en DB, hash)

#### Moyen terme :
- 🔄 Cache Redis pour les requêtes fréquentes
- 🔄 Rate limiting par API Key (au lieu de par IP)
- 🔄 Système de monitoring (Prometheus, Grafana)
- 🔄 Tests automatisés complets (coverage > 80%)

#### Long terme :
- 🔄 Support multi-tenant
- 🔄 API GraphQL en parallèle de REST
- 🔄 Microservices (séparation par domaine)
- 🔄 Machine Learning pour suggestions améliorées

#### Scalabilité :
- Architecture actuelle supporte des milliers de requêtes/jour
- Migration PostgreSQL pour haute disponibilité
- Cache pour réduire la charge sur la DB
- Load balancing si nécessaire

---

## 🎯 Points Clés à Mettre en Avant

### Points Forts du Projet

1. **Documentation complète** :
   - README détaillé
   - Documentation architecturale
   - Swagger UI interactif
   - Collection Postman

2. **Code de qualité** :
   - TypeScript pour la sécurité de types
   - Architecture claire et modulaire
   - Commentaires Swagger sur tous les endpoints
   - Gestion d'erreurs robuste

3. **Fonctionnalités avancées** :
   - 33+ endpoints
   - Pagination et filtres
   - Suggestions personnalisées
   - Génération de plans de repas
   - Analyse nutritionnelle

4. **Sécurité** :
   - API Keys implémentées
   - CORS configuré
   - Rate limiting
   - Validation des entrées

5. **DevOps** :
   - Docker et Docker Compose
   - Logging structuré
   - Tests automatisés
   - Configuration via variables d'environnement

---

## 📊 Métriques du Projet

- **Endpoints** : 33+
- **Ressources** : 6 (Aliments, Equipments, Macros, Meals, Preparations, Meal Plans)
- **Lignes de code** : ~3000+
- **Tests** : Unitaires + Intégration
- **Documentation** : README + Architecture + Swagger
- **Temps de développement** : 9 jours

---

## 🎤 Conseils pour la Présentation

### Avant la présentation :
1. ✅ Tester tous les endpoints avec Postman
2. ✅ Préparer des données de test
3. ✅ Vérifier que le serveur démarre correctement
4. ✅ Avoir un plan B (vidéo screencast si problème technique)

### Pendant la présentation :
1. **Parler clairement** : Expliquer chaque choix technique
2. **Justifier les décisions** : Pourquoi cette stack ? Pourquoi cette architecture ?
3. **Montrer le code** : Si possible, montrer quelques lignes clés
4. **Démos fluides** : Avoir les requêtes Postman pré-remplies
5. **Gérer le timing** : Respecter les 20-30 minutes

### Questions possibles du jury :

**Q : Pourquoi SQLite et pas PostgreSQL directement ?**
R : SQLite pour la simplicité en développement. Prisma permet une migration facile vers PostgreSQL pour la production.

**Q : Comment gérez-vous la sécurité des API Keys ?**
R : Actuellement en variables d'environnement. Pour la production, nous recommandons le stockage en DB avec hash.

**Q : Pourquoi pas de versioning dans les URLs ?**
R : Choix de simplicité pour le MVP. Facile à ajouter avec un middleware Express.

**Q : Comment testez-vous l'API ?**
R : Tests unitaires avec Jest (services) et tests d'intégration avec Supertest (endpoints).

**Q : Quelle est la performance de l'API ?**
R : SQLite est très performant pour des volumes moyens. Pour la production, migration PostgreSQL + cache Redis recommandés.

---

## 📝 Checklist Avant la Soutenance

- [ ] Serveur démarre sans erreur
- [ ] Tous les endpoints testés avec Postman
- [ ] Swagger UI accessible sur `/docs`
- [ ] Collection Postman fonctionnelle
- [ ] Données de test dans la base
- [ ] Support de présentation prêt
- [ ] Démo testée plusieurs fois
- [ ] Plan B (vidéo) préparé si nécessaire
- [ ] Variables d'environnement configurées
- [ ] README à jour
- [ ] Documentation architecturale complète

---

## 🎬 Script de Démo (Exemple)

### Introduction
"Bonjour, nous allons vous présenter MealSync API, un service SmartCity de gestion de repas et nutrition."

### Architecture
"Notre API utilise une architecture en couches avec Express, Prisma et TypeScript. Voici le schéma..."

### Démo
"Maintenant, je vais vous montrer quelques endpoints. D'abord, la documentation Swagger..."

### Conclusion
"En résumé, nous avons développé une API REST complète avec 33+ endpoints, une documentation exhaustive, et une architecture solide et évolutive."

---

**Bonne chance pour la soutenance ! 🚀**

