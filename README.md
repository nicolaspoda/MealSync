# MealSync API

Plateforme de gestion des repas et de l’alimentation orientée nutrition et sport.
MealSync permet aux utilisateurs de créer et gérer des plats et recettes, consulter les informations nutritionnelles (calories, macro-nutriments), filtrer par ingrédients et trouver des idées de repas en fonction du temps disponible pour cuisiner.

---

## Description

MealSync est un service SmartCity permettant aux citoyens de mieux organiser leur alimentation.
Ce service fournit une API REST pour gérer des plats, leurs ingrédients, leurs valeurs nutritionnelles et leurs recettes associées.

Fonctionnalités visées (vision globale) :

* Gestion des plats et recettes
* Informations nutritionnelles détaillées
* Filtres par ingrédients, calories et macro-nutriments
* Recherche par temps de préparation
* Génération de programmes nutritionnels quotidiens

---

## Stack Technique

* Langage : Node.js
* Framework : Express
* Documentation et génération du contrat API : TSOA (TypeScript)
* Base de données (prévue Sprint 2) : A définir

---

## Endpoints cibles (prévisionnel)

Base URL : `/api/v1`

| Méthode | Route                  | Description                                                   |
| ------- | ---------------------- | ------------------------------------------------------------- |
| GET     | /meals                 | Liste des plats, avec filtres (ingrédients, nutrition, temps) |
| POST    | /meals                 | Création d’un plat                                            |
| GET     | /meals/{id}            | Détails d’un plat                                             |
| PUT     | /meals/{id}            | Modification d’un plat                                        |
| DELETE  | /meals/{id}            | Suppression d’un plat                                         |
| GET     | /ingredients           | Liste des ingrédients disponibles                             |
| GET     | /meals/quick?time=X    | Recherche par temps de préparation                            |
| GET     | /meals/recommendations | Suggestions adaptées aux objectifs                            |

Pour le Sprint 1, seuls les endpoints suivants seront implémentés sous forme de mock :

* GET /meals
* GET /meals/{id}
* POST /meals

---

## Installation

### Prérequis

* Node.js 18+
* npm ou yarn

### Commandes

```
git clone https://github.com/<username>/mealsync-api.git
cd mealsync-api
npm install
```

### Lancement en développement

```
npm run dev
```

### Génération du contrat OpenAPI

```
npm run tsoa:generate
```

---

## Roadmap

### Sprint 1 (J1-J2)

* Contrat OpenAPI minimal
* Initialisation projet (Express + TSOA)
* Mock des endpoints principaux
* Documentation générée automatiquement
* Tests unitaires de base

### Sprint 2 (J3-J4)

* Connexion base de données
* CRUD complet des plats
* Filtres avancés

### Sprint 3 (J5-J6)

* Informations nutritionnelles détaillées
* Recommandations et nouvelles recherches
* Gestion des images de plats (optionnel)
* Sécurité (intégration du service Auth)

### Sprint 4 (J7-J8)

* Observabilité et logs
* Containerisation et CI/CD
* Optimisations de performances

---

## Statut

Phase de lancement et rédaction du contrat API.

---


Souhaites-tu que je t’envoie aussi ces fichiers pour finaliser ton Sprint 1 rapidement ?
