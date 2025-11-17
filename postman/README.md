# MealSync API - Postman Collection

Cette collection Postman contient tous les endpoints de l'API MealSync pour faciliter les tests et l'intégration.

## 📥 Installation

### Méthode 1 : Import direct dans Postman

1. Ouvrez Postman
2. Cliquez sur **Import** (en haut à gauche)
3. Sélectionnez le fichier `MealSync_API.postman_collection.json`
4. La collection apparaîtra dans votre workspace

### Méthode 2 : Import depuis l'URL (si hébergé sur GitHub)

1. Ouvrez Postman
2. Cliquez sur **Import**
3. Choisissez l'onglet **Link**
4. Collez l'URL du fichier JSON
5. Cliquez sur **Continue** puis **Import**

## ⚙️ Configuration des variables d'environnement

La collection utilise des variables pour faciliter la configuration :

### Variables de la collection

- `base_url` : URL de base de l'API (défaut: `http://localhost:3000`)
- `api_key` : Clé API pour l'authentification (défaut: `abc123456`)

### Comment modifier les variables

1. Dans Postman, sélectionnez la collection **MealSync API**
2. Cliquez sur l'onglet **Variables**
3. Modifiez les valeurs selon votre environnement :
   - **base_url** : `http://localhost:3000` (développement) ou votre URL de production
   - **api_key** : Votre clé API (configurée dans `.env`)

### Créer un environnement Postman (recommandé)

Pour gérer différents environnements (dev, staging, prod) :

1. Cliquez sur **Environments** dans la barre latérale
2. Cliquez sur **+** pour créer un nouvel environnement
3. Nommez-le (ex: "MealSync - Local")
4. Ajoutez les variables :
   - `base_url` = `http://localhost:3000`
   - `api_key` = `abc123456`
5. Sélectionnez cet environnement dans le menu déroulant en haut à droite

## 📋 Structure de la collection

La collection est organisée par ressources :

- **Aliments** : Gestion des aliments (5 endpoints)
- **Equipments** : Gestion des équipements de cuisine (5 endpoints)
- **Macros** : Gestion des macronutriments (5 endpoints)
- **Meals** : Gestion des plats (7 endpoints)
  - GET /meals : Liste consolidée avec paramètres optionnels (pagination, filtres, quick meals, suggestions)
  - GET /meals/{id} : Détails d'un plat
  - GET /meals/{id}/nutrition-analysis : Analyse nutritionnelle
  - POST /meals : Créer un plat
  - POST /meals/analyze : Analyser un repas (avec paramètre fromDb)
  - PUT /meals/{id} : Mettre à jour
  - DELETE /meals/{id} : Supprimer
- **Preparations** : Gestion des étapes de préparation (5 endpoints)
- **Meal Plans** : Génération de plans de repas (1 endpoint)

**Total : 27 endpoints** (consolidation de 11 → 7 pour Meals)

## 🚀 Utilisation

### Tester un endpoint

1. Sélectionnez un endpoint dans la collection
2. Vérifiez que les variables sont correctement configurées
3. Pour les requêtes POST/PUT, modifiez le body si nécessaire
4. Cliquez sur **Send**
5. Consultez la réponse dans l'onglet **Body**

### Exemples de requêtes

#### GET - Récupérer tous les aliments
```
GET {{base_url}}/aliments
Header: x-api-key: {{api_key}}
```

#### POST - Créer un aliment
```
POST {{base_url}}/aliments
Header: x-api-key: {{api_key}}
Body: {
  "name": "Poulet",
  "cal_100g": 165
}
```

#### GET - Plats paginés avec filtres
```
GET {{base_url}}/meals?page=1&limit=10&minCalories=200&maxCalories=500
Header: x-api-key: {{api_key}}
```

#### GET - Plats rapides
```
GET {{base_url}}/meals?maxTime=30
Header: x-api-key: {{api_key}}
```

#### GET - Suggestions personnalisées
```
GET {{base_url}}/meals?targetCalories=2000&excludedAliments=Poulet&preferredMacros=protein
Header: x-api-key: {{api_key}}
```

#### POST - Analyser un repas depuis la DB
```
POST {{base_url}}/meals/analyze?fromDb=true
Header: x-api-key: {{api_key}}
Body: {
  "aliments": [
    { "alimentId": "...", "quantity": 150 }
  ]
}
```

## 🔐 Authentification

Tous les endpoints nécessitent une API Key valide dans le header `x-api-key`.

Si vous recevez une erreur `401 Unauthorized`, vérifiez que :
1. La variable `api_key` est correctement configurée
2. La valeur correspond à celle dans votre fichier `.env`
3. Le header `x-api-key` est présent dans la requête

## 📝 Notes

- Les IDs dans les exemples sont des placeholders. Remplacez-les par de vrais IDs après avoir créé des ressources.
- Pour les requêtes POST/PUT, les exemples de body sont fournis mais peuvent être modifiés selon vos besoins.
- Certains paramètres de requête sont désactivés par défaut (comme les filtres optionnels). Activez-les selon vos besoins.

## 🐛 Dépannage

### Erreur "Could not get response"

- Vérifiez que le serveur est démarré (`npm run dev`)
- Vérifiez que `base_url` pointe vers le bon port

### Erreur 401 Unauthorized

- Vérifiez que `api_key` est correctement configurée
- Vérifiez que le header `x-api-key` est présent

### Erreur 404 Not Found

- Vérifiez que l'endpoint existe dans la collection
- Vérifiez que l'URL est correcte (pas de `/api/v1` dans les routes)

## 📚 Documentation complète

Pour une documentation complète de l'API, consultez :
- **Swagger UI** : `http://localhost:3000/docs`
- **README.md** du projet : Voir la section "Endpoints de l'API"

---

**Dernière mise à jour** : Collection complète avec tous les 33 endpoints de l'API MealSync

