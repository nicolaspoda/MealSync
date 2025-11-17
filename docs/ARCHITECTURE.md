# Documentation des Choix Architecturaux - MealSync API

Ce document explique les choix techniques et architecturaux effectués lors du développement de l'API MealSync.

---

## 📋 Table des matières

1. [Justification de la Stack Technique](#justification-de-la-stack-technique)
2. [Architecture de l'Application](#architecture-de-lapplication)
3. [Architecture de la Base de Données](#architecture-de-la-base-de-données)
4. [Stratégie de Versioning](#stratégie-de-versioning)
5. [Gestion des API Keys](#gestion-des-api-keys)
6. [Gestion des Erreurs](#gestion-des-erreurs)
7. [Patterns Utilisés](#patterns-utilisés)
8. [Trade-offs et Limitations](#trade-offs-et-limitations)

---

## 🛠️ Justification de la Stack Technique

### Node.js + TypeScript

**Choix** : Node.js 18+ avec TypeScript

**Justifications** :
- **Performance** : Node.js offre d'excellentes performances pour les APIs REST grâce à son modèle asynchrone non-bloquant
- **Écosystème** : Large écosystème de packages npm pour accélérer le développement
- **Type Safety** : TypeScript apporte la sécurité de types, réduisant les erreurs à l'exécution
- **Maintenabilité** : Le typage facilite la maintenance et la compréhension du code
- **Productivité** : Développement rapide avec hot-reload en développement

**Alternatives considérées** :
- Python (Flask/FastAPI) : Rejeté car moins performant pour les APIs REST simples
- Java (Spring Boot) : Rejeté car trop verbeux pour ce projet

### Express 5.x

**Choix** : Express comme framework web

**Justifications** :
- **Simplicité** : Framework minimaliste et flexible
- **Maturité** : Framework le plus utilisé dans l'écosystème Node.js
- **Middleware** : Système de middleware puissant et extensible
- **Performance** : Léger et performant
- **Documentation** : Documentation abondante et communauté active

### Prisma ORM

**Choix** : Prisma comme ORM

**Justifications** :
- **Type Safety** : Génération automatique de types TypeScript depuis le schéma
- **Migrations** : Système de migrations intégré et versionné
- **Productivité** : Réduction significative du code boilerplate
- **Developer Experience** : Excellent outillage (Prisma Studio, introspection)
- **Multi-database** : Support facile pour changer de base de données (SQLite → PostgreSQL/MySQL)

**Alternatives considérées** :
- TypeORM : Rejeté car configuration plus complexe
- Sequelize : Rejeté car moins moderne et moins de support TypeScript

### SQLite

**Choix** : SQLite comme base de données

**Justifications** :
- **Simplicité** : Base de données fichier, pas besoin de serveur séparé
- **Développement** : Parfait pour le développement et les tests
- **Performance** : Excellentes performances pour des volumes moyens
- **Portabilité** : Fichier unique, facile à déplacer/backup
- **Migration facile** : Prisma permet de migrer vers PostgreSQL/MySQL facilement

**Limitations assumées** :
- Pas adapté pour la haute disponibilité (single-writer)
- Pas de support concurrent pour les écritures multiples
- Pour la production à grande échelle, migration vers PostgreSQL recommandée

### TSOA (TypeScript OpenAPI)

**Choix** : TSOA pour la génération automatique de la documentation OpenAPI

**Justifications** :
- **Documentation automatique** : Génération du contrat OpenAPI depuis le code TypeScript
- **Type Safety** : Validation automatique des types à la compilation
- **Single Source of Truth** : Le code est la source unique de vérité
- **Réduction des erreurs** : Impossible d'avoir une incohérence entre code et documentation
- **Productivité** : Pas besoin de maintenir un fichier OpenAPI séparé

**Alternatives considérées** :
- Swagger JSDoc : Rejeté car nécessite de maintenir la documentation séparément
- OpenAPI Generator : Rejeté car nécessite de partir du contrat, pas du code

---

## 🏗️ Architecture de l'Application

### Structure en Couches (Layered Architecture)

L'application suit une architecture en couches claire :

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Frontend)                      │
│              (Postman, Browser, Mobile App)              │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP/REST
                       │ x-api-key header
┌──────────────────────▼───────────────────────────────────┐
│                    Express Server                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Middleware Layer                     │  │
│  │  - Body Parser                                   │  │
│  │  - Error Handler                                 │  │
│  │  - Authentication (API Key)                     │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Routes Layer (TSOA)                    │  │
│  │  - Auto-generated from Controllers                │  │
│  │  - Request validation                            │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│                  Controllers Layer                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Aliments │  │  Meals   │  │ Equipments│  ...         │
│  │Controller│  │Controller│  │Controller│              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │             │             │                     │
│       └─────────────┴─────────────┘                     │
│                    │                                     │
│                    ▼                                     │
│              Services Layer                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Aliments │  │  Meals   │  │ Equipments│  ...         │
│  │ Service  │  │ Service  │  │ Service  │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │             │             │                     │
│       └─────────────┴─────────────┘                     │
│                    │                                     │
│                    ▼                                     │
│              Data Access Layer                           │
│  ┌──────────────────────────────────────┐               │
│  │         Prisma Client                │               │
│  │    (Generated from schema.prisma)    │               │
│  └──────────────────────────────────────┘               │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│                  Database (SQLite)                        │
│              prisma/dev.db                                │
└───────────────────────────────────────────────────────────┘
```

### Séparation des Responsabilités

#### Controllers (`src/*/Controller.ts`)
- **Responsabilité** : Gestion des requêtes HTTP
- **Rôle** : 
  - Validation des paramètres d'entrée (via TSOA)
  - Appel aux services appropriés
  - Gestion des codes de statut HTTP
  - Formatage des réponses

#### Services (`src/*/Service.ts`)
- **Responsabilité** : Logique métier
- **Rôle** :
  - Implémentation de la logique métier
  - Appels à la base de données via Prisma
  - Calculs et transformations de données
  - Validation métier

#### Models (`src/*/*.ts` - interfaces TypeScript)
- **Responsabilité** : Définition des structures de données
- **Rôle** :
  - Types TypeScript pour la validation
  - Documentation des modèles (via TSOA)
  - Contrats d'API

#### Shared (`src/shared/`)
- **Responsabilité** : Utilitaires partagés
- **Rôle** :
  - Instance Prisma singleton
  - Helpers réutilisables
  - Types communs

---

## 🗄️ Architecture de la Base de Données

### Modèle Entité-Relation

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│    Meal     │         │  MealAliment      │         │   Aliment   │
├─────────────┤         ├──────────────────┤         ├─────────────┤
│ id (PK)     │◄───────┤│ mealId (FK)      │         │ id (PK)     │
│ title       │         │ alimentId (FK)    │────────►│ name        │
│ description │         │ quantity          │         │ cal_100g    │
│ calories    │         └──────────────────┘         │ createdAt   │
│ createdAt   │                                      │ updatedAt   │
│ updatedAt   │                                      └──────┬───────┘
└──────┬──────┘                                             │
       │                                                    │
       │         ┌──────────────────┐                      │
       │         │  MealEquipment   │                      │
       │         ├──────────────────┤                      │
       │         │ mealId (FK)      │                      │
       │         │ equipmentId (FK) │                      │
       │         └──────────────────┘                      │
       │                                                    │
       │         ┌─────────────┐                            │
       │         │  Equipment  │                            │
       │         ├─────────────┤                            │
       │         │ id (PK)     │                            │
       │         │ name (UNIQUE)│                           │
       │         └─────────────┘                            │
       │                                                    │
       │         ┌──────────────────┐                      │
       │         │ MealPreparation   │                      │
       │         ├──────────────────┤                      │
       │         │ mealId (FK)      │                      │
       │         │ preparationId(FK)│                      │
       │         │ order            │                      │
       │         └──────────────────┘                      │
       │                                                    │
       │         ┌─────────────┐                            │
       │         │ Preparation │                            │
       │         ├─────────────┤                            │
       │         │ id (PK)     │                            │
       │         │ step        │                            │
       │         │ description │                            │
       │         │ estimated_time│                          │
       │         └─────────────┘                            │
       │                                                    │
       └────────────────────────────────────────────────────┘
                                                             │
                                            ┌──────────────────┐
                                            │  AlimentMacro    │
                                            ├──────────────────┤
                                            │ alimentId (FK)   │
                                            │ macroId (FK)     │
                                            │ quantity         │
                                            └──────────────────┘
                                                             │
                                            ┌─────────────┐
                                            │    Macro    │
                                            ├─────────────┤
                                            │ id (PK)     │
                                            │ name (UNIQUE)│
                                            └─────────────┘
```

### Relations

#### Relations Many-to-Many

1. **Meal ↔ Aliment** (via `MealAliment`)
   - Un plat peut contenir plusieurs aliments
   - Un aliment peut être dans plusieurs plats
   - Attribut supplémentaire : `quantity` (quantité en grammes)

2. **Meal ↔ Equipment** (via `MealEquipment`)
   - Un plat peut nécessiter plusieurs équipements
   - Un équipement peut être utilisé pour plusieurs plats

3. **Meal ↔ Preparation** (via `MealPreparation`)
   - Un plat peut avoir plusieurs étapes de préparation
   - Une préparation peut être utilisée dans plusieurs plats
   - Attribut supplémentaire : `order` (ordre d'exécution)

4. **Aliment ↔ Macro** (via `AlimentMacro`)
   - Un aliment peut avoir plusieurs macronutriments
   - Un macronutriment peut être présent dans plusieurs aliments
   - Attribut supplémentaire : `quantity` (quantité en grammes)

### Contraintes et Index

- **UUID comme clés primaires** : Meilleure distribution et sécurité
- **Cascade Delete** : Suppression en cascade pour maintenir l'intégrité référentielle
- **Unique Constraints** : 
  - `Aliment.name` : Un aliment ne peut pas avoir le même nom
  - `Equipment.name` : Un équipement ne peut pas avoir le même nom
  - `Macro.name` : Un macro ne peut pas avoir le même nom
- **Timestamps** : `createdAt` et `updatedAt` automatiques pour Meal et Aliment

### Normalisation

La base de données est normalisée en 3NF (Troisième Forme Normale) :
- Pas de redondance de données
- Relations claires et bien définies
- Tables de jointure pour les relations many-to-many

---

## 🔢 Stratégie de Versioning

### État Actuel

**Version actuelle** : Pas de versioning explicite dans les URLs

Les routes sont actuellement :
- `/aliments`
- `/meals`
- `/equipments`
- etc.

### Stratégie Recommandée

Pour une évolution future, nous recommandons d'implémenter le versioning par URL :

```
/api/v1/aliments
/api/v1/meals
/api/v1/equipments
```

### Justification

**Versioning par URL** (choisi) :
- ✅ Simple à implémenter
- ✅ Clair pour les clients
- ✅ Permet de maintenir plusieurs versions en parallèle
- ✅ Facile à router avec Express

**Alternatives considérées** :
- **Versioning par Header** : Moins visible, plus complexe
- **Versioning par Query Parameter** : Moins RESTful

### Migration Future

Pour ajouter le versioning :
1. Préfixer toutes les routes avec `/api/v1`
2. Créer un middleware de versioning
3. Maintenir la compatibilité avec l'ancienne version pendant une période de transition

---

## 🔐 Gestion des API Keys

### Architecture Actuelle

```
Client Request
    │
    ├─ Header: x-api-key: "abc123456"
    │
    ▼
Express Server
    │
    ├─ Middleware: expressAuthentication()
    │
    ├─ Vérifie header "x-api-key"
    │
    ├─ Compare avec process.env.API_KEY
    │
    ├─ Si valide → Continue
    │
    └─ Si invalide → 401 Unauthorized
```

### Implémentation

**Fichier** : `src/authentication.ts`

**Fonctionnement** :
1. TSOA appelle `expressAuthentication()` pour chaque endpoint protégé
2. La fonction vérifie le header `x-api-key`
3. Compare avec la variable d'environnement `API_KEY`
4. Retourne une erreur 401 si invalide

### Sécurité

**Points forts** :
- ✅ API Key stockée dans les variables d'environnement (pas dans le code)
- ✅ Validation côté serveur
- ✅ Header HTTP standard (`x-api-key`)

**Améliorations futures recommandées** :
- 🔄 Stockage des clés en base de données (hashées)
- 🔄 Support de multiples clés par client
- 🔄 Régénération de clés
- 🔄 Expiration de clés
- 🔄 Rate limiting par clé
- 🔄 Logs d'utilisation par clé

### Configuration

**Fichier** : `.env`
```env
API_KEY=your-secure-api-key-here
```

**Génération d'une clé sécurisée** :
```bash
openssl rand -hex 32
```

---

## ⚠️ Gestion des Erreurs

### Stratégie de Gestion des Erreurs

L'application utilise une gestion d'erreurs centralisée avec des codes HTTP appropriés.

### Middleware de Gestion d'Erreurs

**Fichier** : `src/app.ts`

```typescript
// Gestion des erreurs de validation TSOA
if (err instanceof ValidateError) {
  return res.status(422).json({
    message: "Validation Failed",
    details: err?.fields,
  });
}

// Gestion des erreurs génériques
if (err instanceof Error) {
  return res.status(500).json({
    message: "Internal Server Error",
  });
}
```

### Codes HTTP Utilisés

| Code | Signification | Utilisation |
|------|---------------|-------------|
| 200 | OK | Requête réussie (GET, PUT) |
| 201 | Created | Ressource créée (POST) |
| 204 | No Content | Ressource supprimée (DELETE) |
| 400 | Bad Request | Requête mal formée |
| 401 | Unauthorized | API Key manquante ou invalide |
| 404 | Not Found | Ressource introuvable |
| 422 | Unprocessable Entity | Erreur de validation (TSOA) |
| 500 | Internal Server Error | Erreur serveur |

### Validation

**TSOA** gère automatiquement la validation :
- Types TypeScript
- Contraintes (min, max, length, etc.)
- Retourne automatiquement 422 avec les détails

### Messages d'Erreur

**Format standardisé** :
```json
{
  "message": "Error description",
  "details": { /* optional */ }
}
```

---

## 🎯 Patterns Utilisés

### 1. Repository Pattern (via Prisma)

Prisma agit comme une couche d'abstraction de la base de données :
- Accès unifié aux données
- Type safety
- Migrations versionnées

### 2. Service Layer Pattern

Chaque ressource a un service dédié :
- `AlimentsService` : Logique métier pour les aliments
- `MealsService` : Logique métier pour les plats
- `MealPlanService` : Logique de génération de plans

**Avantages** :
- Séparation claire des responsabilités
- Réutilisabilité
- Testabilité

### 3. Dependency Injection (Implicite)

Les services sont instanciés dans les controllers :
```typescript
return new AlimentsService().getAll();
```

**Note** : Pour une application plus grande, considérer un conteneur DI (ex: InversifyJS).

### 4. Singleton Pattern (Prisma Client)

**Fichier** : `src/shared/prisma.ts`

```typescript
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

**Avantages** :
- Une seule instance de Prisma Client
- Évite les problèmes de connexion en développement
- Performance optimale

### 5. Factory Pattern (UUID)

**Fichier** : `src/shared/uuid.ts`

Génération centralisée des UUIDs pour garantir la cohérence.

### 6. Middleware Pattern (Express)

- Body parser
- Error handler
- Authentication

---

## ⚖️ Trade-offs et Limitations

### Trade-offs Assumés

#### 1. SQLite vs PostgreSQL

**Choix** : SQLite pour le développement

**Trade-off** :
- ✅ Simplicité et rapidité de setup
- ❌ Limitation pour la haute disponibilité
- ✅ Migration facile vers PostgreSQL si nécessaire

#### 2. Pas de Versioning Explicite

**Choix** : Pas de `/v1` dans les URLs actuellement

**Trade-off** :
- ✅ URLs plus simples
- ❌ Difficile d'évoluer sans casser la compatibilité
- ✅ Facile à ajouter plus tard

#### 3. API Key Simple

**Choix** : API Key en variable d'environnement

**Trade-off** :
- ✅ Simple à implémenter
- ❌ Pas de gestion multi-clients
- ✅ Suffisant pour le contexte actuel

#### 4. Pas de Cache

**Choix** : Pas de système de cache

**Trade-off** :
- ✅ Simplicité
- ❌ Performance pour les requêtes fréquentes
- ✅ SQLite est déjà rapide pour des volumes moyens

### Limitations Connues

1. **Concurrence** : SQLite limite les écritures concurrentes
2. **Scalabilité** : Architecture monolithique (pas de microservices)
3. **Rate Limiting** : Pas implémenté (à ajouter pour la production)
4. **Logging** : Logs basiques (à améliorer avec Winston/Pino)
5. **Monitoring** : Pas de système de monitoring (à ajouter)

### Améliorations Futures

1. **Migration vers PostgreSQL** pour la production
2. **Implémentation du versioning** (`/api/v1`)
3. **Système de cache** (Redis) pour les requêtes fréquentes
4. **Rate limiting** par API Key
5. **Logging structuré** avec Winston ou Pino
6. **Monitoring** avec Prometheus/Grafana
7. **Tests automatisés** (Jest)
8. **CI/CD** (GitHub Actions)

---

## 📊 Diagramme de Flux de Requête

```
Client
  │
  ├─ HTTP Request + x-api-key header
  │
  ▼
Express Server
  │
  ├─ Body Parser Middleware
  │
  ├─ TSOA Routes (auto-generated)
  │  ├─ Validation des paramètres
  │  └─ Authentication Middleware
  │     └─ expressAuthentication()
  │        ├─ Vérifie x-api-key
  │        └─ Continue ou 401
  │
  ├─ Controller
  │  ├─ Validation TSOA
  │  └─ Appel Service
  │
  ├─ Service
  │  ├─ Logique métier
  │  └─ Appel Prisma
  │
  ├─ Prisma Client
  │  └─ Query SQLite
  │
  ├─ SQLite Database
  │  └─ Retour données
  │
  ├─ Service (formatage)
  │
  ├─ Controller (code HTTP)
  │
  ├─ Error Handler (si erreur)
  │
  └─ HTTP Response
```

---

## 🎓 Conclusion

Cette architecture a été conçue pour :
- ✅ **Simplicité** : Facile à comprendre et maintenir
- ✅ **Productivité** : Développement rapide avec des outils modernes
- ✅ **Type Safety** : TypeScript + Prisma pour réduire les erreurs
- ✅ **Documentation** : TSOA pour une documentation automatique
- ✅ **Évolutivité** : Structure permettant d'ajouter des fonctionnalités facilement

L'architecture peut évoluer vers une architecture plus complexe (microservices, cache, etc.) si nécessaire, tout en gardant une base solide et maintenable.

---

**Dernière mise à jour** : Architecture documentée avec tous les choix justifiés

