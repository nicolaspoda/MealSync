# MealSync API

Plateforme de gestion des repas et de l'alimentation orientée nutrition et sport.
MealSync permet aux utilisateurs de créer et gérer des plats et recettes, consulter les informations nutritionnelles (calories, macro-nutriments), filtrer par ingrédients et trouver des idées de repas en fonction du temps disponible pour cuisiner.

---

## 📋 Description

MealSync est un service SmartCity permettant aux citoyens de mieux organiser leur alimentation.
Ce service fournit une API REST pour gérer des plats, leurs ingrédients, leurs valeurs nutritionnelles et leurs recettes associées.

### Fonctionnalités principales

* ✅ Gestion complète des plats et recettes (CRUD)
* ✅ Informations nutritionnelles détaillées (calories, macronutriments)
* ✅ Filtres avancés par ingrédients, calories et macro-nutriments
* ✅ Recherche par temps de préparation
* ✅ Suggestions de plats personnalisées basées sur le profil utilisateur
* ✅ Système de profils utilisateurs complet (objectifs, allergies, préférences)
* ✅ Calcul automatique des besoins métaboliques (BMR, TDEE, calories cibles)
* ✅ Analyse nutritionnelle de repas
* ✅ Génération de programmes nutritionnels quotidiens
* ✅ Gestion des aliments, équipements et macronutriments

---

## 🛠️ Stack Technique

* **Langage** : Node.js 18+
* **Framework** : Express 5.x
* **Langage de programmation** : TypeScript
* **Documentation API** : TSOA (génération automatique OpenAPI/Swagger)
* **Base de données** : SQLite (via Prisma ORM)
* **ORM** : Prisma 6.x
* **Documentation interactive** : Swagger UI

---

## 🚀 Installation

### Prérequis

* Node.js 18 ou supérieur
* npm ou yarn
* Git

### Installation des dépendances

```bash
# Cloner le repository
git clone https://github.com/nicolaspoda/MealSync.git
cd MealSync

# Installer les dépendances
npm install
```

### Configuration des variables d'environnement

1. Copier le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

2. Éditer le fichier `.env` et configurer les variables :
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
API_KEY=your-api-key-here
BASE_URL=http://localhost:3000
```

### Initialisation de la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# (Optionnel) Peupler la base de données avec des données de test
npm run prisma:seed
```

---

## 🏃 Lancement

### Mode développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000` (ou le port configuré dans `.env`).

### Mode production

```bash
# Build du projet
npm run build

# Lancer le serveur
npm start
```

### Accès à la documentation Swagger

Une fois le serveur démarré, accédez à la documentation interactive Swagger UI :

**URL** : `http://localhost:3000/api-docs`

La documentation Swagger permet de :
* Visualiser tous les endpoints disponibles
* Tester les endpoints directement depuis le navigateur
* Voir les modèles de données (schemas)
* Comprendre les paramètres requis pour chaque endpoint

---

## 🔐 Authentification et API Keys

### Comment obtenir une API Key

L'API Key est configurée dans le fichier `.env` via la variable `API_KEY`.

**Pour le développement** : Utilisez la valeur par défaut ou générez une clé sécurisée.

**Pour la production** : 
1. Générez une clé sécurisée (ex: `openssl rand -hex 32`)
2. Configurez-la dans le fichier `.env`
3. Partagez cette clé avec le frontend de manière sécurisée

### Utilisation de l'API Key

Toutes les requêtes vers l'API doivent inclure l'API Key dans le header `x-api-key` :

```bash
curl -H "x-api-key: your-api-key-here" http://localhost:3000/aliments
```

**Exemple avec Postman** :
1. Créer une nouvelle requête
2. Aller dans l'onglet "Headers"
3. Ajouter : `x-api-key` = `your-api-key-here`

**Exemple avec fetch (JavaScript)** :
```javascript
fetch('http://localhost:3000/aliments', {
  headers: {
    'x-api-key': 'your-api-key-here'
  }
})
```

### Endpoints protégés

La plupart des endpoints nécessitent une API Key valide. En cas d'API Key manquante ou invalide, vous recevrez une erreur `401 Unauthorized`.

---

## 📚 Structure du projet

```
MealSync/
├── src/
│   ├── aliments/          # Gestion des aliments
│   │   ├── aliment.ts
│   │   ├── alimentsController.ts
│   │   └── alimentsService.ts
│   ├── equipments/        # Gestion des équipements de cuisine
│   ├── macros/           # Gestion des macronutriments
│   ├── meals/            # Gestion des plats (endpoints principaux)
│   ├── meal-plans/       # Génération de plans de repas
│   ├── preparations/     # Gestion des étapes de préparation
│   ├── shared/           # Utilitaires partagés
│   ├── scripts/          # Scripts utilitaires
│   ├── app.ts            # Configuration Express
│   ├── authentication.ts # Gestion de l'authentification API Key
│   └── server.ts         # Point d'entrée du serveur
├── prisma/
│   ├── schema.prisma     # Schéma de base de données
│   ├── migrations/       # Migrations de base de données
│   └── seed.ts           # Script de seed
├── build/                # Fichiers compilés (générés)
├── .env.example          # Template des variables d'environnement
├── tsoa.json             # Configuration TSOA
└── package.json
```

---

## 📡 Endpoints de l'API

### Base URL

Par défaut : `http://localhost:3000`

### Aliments (`/aliments`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/aliments` | Liste de tous les aliments |
| GET | `/aliments/{id}` | Détails d'un aliment |
| POST | `/aliments` | Créer un nouvel aliment |
| PUT | `/aliments/{id}` | Mettre à jour un aliment |
| DELETE | `/aliments/{id}` | Supprimer un aliment |

### Équipements (`/equipments`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/equipments` | Liste de tous les équipements |
| GET | `/equipments/{id}` | Détails d'un équipement |
| POST | `/equipments` | Créer un nouvel équipement |
| PUT | `/equipments/{id}` | Mettre à jour un équipement |
| DELETE | `/equipments/{id}` | Supprimer un équipement |

### Macronutriments (`/macros`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/macros` | Liste de tous les macronutriments |
| GET | `/macros/{id}` | Détails d'un macronutriment |
| POST | `/macros` | Créer un nouveau macronutriment |
| PUT | `/macros/{id}` | Mettre à jour un macronutriment |
| DELETE | `/macros/{id}` | Supprimer un macronutriment |

### Plats (`/meals`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/meals` | Liste de tous les plats avec paramètres optionnels :<br>- Sans paramètres : retourne tous les plats<br>- `page`/`limit` : pagination avec filtres (title, minCalories, maxCalories, aliment, equipment)<br>- `maxTime` : plats rapides (temps de préparation ≤ maxTime)<br>- `targetCalories`, `excludedAliments`, `availableEquipments`, `preferredMacros` : suggestions personnalisées |
| GET | `/meals/{id}` | Détails d'un plat |
| GET | `/meals/{id}/nutrition-analysis` | Analyse nutritionnelle d'un plat |
| POST | `/meals` | Créer un nouveau plat |
| POST | `/meals/analyze?fromDb=true\|false` | Analyser un repas sans le persister :<br>- `fromDb=false` (défaut) : payload avec valeurs nutritionnelles<br>- `fromDb=true` : références d'aliments depuis la DB |
| PUT | `/meals/{id}` | Mettre à jour un plat |
| DELETE | `/meals/{id}` | Supprimer un plat |

### Préparations (`/preparations`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/preparations` | Liste de toutes les préparations |
| GET | `/preparations/{id}` | Détails d'une préparation |
| POST | `/preparations` | Créer une nouvelle préparation |
| PUT | `/preparations/{id}` | Mettre à jour une préparation |
| DELETE | `/preparations/{id}` | Supprimer une préparation |

### Plans de repas (`/meal-plans`)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/meal-plans/generate` | Générer un plan de repas personnalisé |
> 💡 Vous pouvez désormais fournir simplement un `userId` : l’API récupère automatiquement les objectifs (calories, macros) et contraintes (allergies, équipements, temps de préparation) du profil utilisateur, puis applique vos éventuels overrides (`objectives`, `constraints`).

### Utilisateurs et Profils (`/users`)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/users` | Créer un nouvel utilisateur |
| GET | `/users/{userId}` | Récupérer un utilisateur |
| PUT | `/users/{userId}` | Mettre à jour un utilisateur |
| DELETE | `/users/{userId}` | Supprimer un utilisateur |
| POST | `/users/{userId}/profile` | Créer ou mettre à jour le profil utilisateur |
| GET | `/users/{userId}/profile` | Récupérer le profil utilisateur |
| PUT | `/users/{userId}/profile` | Mettre à jour le profil utilisateur |
| GET | `/users/{userId}/profile/calculated-needs` | Obtenir les besoins métaboliques calculés (BMR, TDEE, calories cibles) |
| POST | `/users/{userId}/profile/recalculate` | Recalculer les besoins métaboliques |
| GET | `/users/{userId}/history/weight` | Historique des poids |
| POST | `/users/{userId}/history/weight` | Ajouter une entrée de poids |
| GET | `/users/{userId}/history/meals` | Historique de consommation de repas |
| POST | `/users/{userId}/history/meals` | Enregistrer la consommation d'un repas |

### Suggestions personnalisées (`/meals/suggestions`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/meals/suggestions?userId={userId}&mealType={type}&limit={n}` | Obtenir des suggestions de repas personnalisées basées sur le profil utilisateur (objectifs, allergies, préférences, etc.) |

---

## 💡 Exemples d'utilisation

### Exemple 1 : Récupérer tous les aliments

```bash
curl -H "x-api-key: your-api-key-here" \
  http://localhost:3000/aliments
```

### Exemple 2 : Créer un nouvel aliment

```bash
curl -X POST \
  -H "x-api-key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Poulet",
    "cal_100g": 165
  }' \
  http://localhost:3000/aliments
```

### Exemple 3 : Rechercher des plats avec filtres

```bash
curl -H "x-api-key: your-api-key-here" \
  "http://localhost:3000/meals/paginated?page=1&limit=10&minCalories=200&maxCalories=500"
```

### Exemple 4 : Obtenir des suggestions de plats personnalisées

```bash
# Suggestions basées sur le profil utilisateur
curl -H "x-api-key: your-api-key-here" \
  "http://localhost:3000/meals/suggestions?userId=user-id-here&limit=5"

# Suggestions pour un type de repas spécifique
curl -H "x-api-key: your-api-key-here" \
  "http://localhost:3000/meals/suggestions?userId=user-id-here&mealType=BREAKFAST&limit=3"
```

### Exemple 5 : Générer un plan de repas

```bash
curl -X POST \
  -H "x-api-key: your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "objectives": {
      "targetCalories": 2000
    },
    "constraints": {
      "mealsPerDay": 3,
      "excludedAliments": ["Poisson"],
      "availableEquipments": ["oven", "stove"]
    }
  }' \
  http://localhost:3000/meal-plans/generate
```

---

## 🧪 Tests

### Lancer les tests d'intégration

```bash
# Avec la variable d'environnement BASE_URL configurée
BASE_URL=http://localhost:3000 npx ts-node src/scripts/testRoutes.ts
```

---

## 📦 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur en mode développement avec hot-reload |
| `npm run build` | Compile le projet TypeScript |
| `npm start` | Lance le serveur en mode production |
| `npm run tsoa:routes` | Génère les routes TSOA |
| `npm run tsoa:spec` | Génère le fichier Swagger JSON |
| `npm run prisma:generate` | Génère le client Prisma |
| `npm run prisma:migrate` | Exécute les migrations de base de données |
| `npm run prisma:studio` | Ouvre Prisma Studio (interface graphique pour la DB) |
| `npm run prisma:seed` | Peuple la base de données avec des données de test |
| `npm run prisma:reset` | Réinitialise la base de données |

---

## 📖 Documentation complète

Pour une documentation complète et interactive de l'API, consultez :

**Swagger UI** : `http://localhost:3000/api-docs`

La documentation Swagger inclut :
* Tous les endpoints avec leurs descriptions
* Les modèles de données (schemas)
* Les paramètres requis et optionnels
* Les codes de réponse HTTP
* La possibilité de tester les endpoints directement

---

## 🐳 Docker

### Build et lancement avec Docker

#### Option 1 : Docker Compose (recommandé)

```bash
# Lancer avec docker-compose
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

#### Option 2 : Docker uniquement

```bash
# Build l'image
docker build -t mealsync-api .

# Lancer le conteneur
docker run -d \
  -p 3000:3000 \
  -e API_KEY=your-api-key-here \
  -v $(pwd)/prisma/dev.db:/app/prisma/dev.db \
  --name mealsync-api \
  mealsync-api
```

### Variables d'environnement Docker

Toutes les variables d'environnement peuvent être configurées dans `docker-compose.yml` ou passées via `-e` avec Docker.

---

## 🔧 Configuration avancée

### Base de données

Par défaut, l'API utilise SQLite. Pour changer de base de données, modifiez le `DATABASE_URL` dans `.env` :

```env
# SQLite (défaut)
DATABASE_URL="file:./prisma/dev.db"

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mealsync"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/mealsync"
```

Puis mettez à jour le `provider` dans `prisma/schema.prisma` et exécutez les migrations.

---

## 🐛 Dépannage

### Le serveur ne démarre pas

1. Vérifiez que le port n'est pas déjà utilisé
2. Vérifiez que toutes les variables d'environnement sont configurées
3. Vérifiez que la base de données est initialisée (`npm run prisma:migrate`)

### Erreur 401 Unauthorized

Vérifiez que vous incluez bien l'header `x-api-key` avec une valeur valide.

### Erreur de base de données

Exécutez les migrations : `npm run prisma:migrate`

---

## 📝 License

ISC

---

## 👥 Auteurs

Équipe MealSync

---

## 🔗 Liens utiles

* [Documentation TSOA](https://tsoa-community.github.io/docs/)
* [Documentation Prisma](https://www.prisma.io/docs)
* [Documentation Express](https://expressjs.com/)
* [OpenAPI Specification](https://swagger.io/specification/)

---

## 📊 Statut du projet

✅ API REST fonctionnelle avec 33+ endpoints  
✅ Base de données Prisma configurée  
✅ Documentation Swagger automatique  
✅ Authentification par API Key  
✅ Gestion complète CRUD pour toutes les ressources  
✅ Filtres et recherches avancées  
✅ Génération de plans de repas personnalisés  

---

**Pour toute question ou problème, consultez la documentation Swagger à `/api-docs` ou ouvrez une issue sur GitHub.**
