#!/bin/bash

# Script de test complet pour toutes les routes du système de profil utilisateur
# Usage: ./test_user_profile_routes.sh

BASE_URL="http://localhost:3000"
API_KEY="abc123456"

echo "=========================================="
echo "TEST COMPLET DES ROUTES USER PROFILE"
echo "=========================================="
echo ""

# Variables pour stocker les IDs
USER1_ID=""
USER2_ID=""
PROFILE1_ID=""

# Fonction pour afficher les résultats
print_result() {
    local method=$1
    local endpoint=$2
    local status=$3
    local response=$4
    
    if [ "$status" -eq 200 ] || [ "$status" -eq 201 ] || [ "$status" -eq 204 ]; then
        echo "✅ $method $endpoint - Status: $status"
    else
        echo "❌ $method $endpoint - Status: $status"
        echo "   Response: $response"
    fi
    echo ""
}

# 1. POST /users - Créer utilisateur 1
echo "1. POST /users - Créer utilisateur 1"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "username": "testuser1"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "POST" "/users" "$HTTP_CODE" "$BODY"
if [ "$HTTP_CODE" -eq 201 ]; then
    USER1_ID=$(echo "$BODY" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "   User1 ID: $USER1_ID"
fi
echo ""

# 2. POST /users - Créer utilisateur 2
echo "2. POST /users - Créer utilisateur 2"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "username": "testuser2"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "POST" "/users" "$HTTP_CODE" "$BODY"
if [ "$HTTP_CODE" -eq 201 ]; then
    USER2_ID=$(echo "$BODY" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "   User2 ID: $USER2_ID"
fi
echo ""

# 3. GET /users/{userId} - Récupérer utilisateur 1
echo "3. GET /users/$USER1_ID"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "GET" "/users/$USER1_ID" "$HTTP_CODE" "$BODY"
echo ""

# 4. PUT /users/{userId} - Mettre à jour utilisateur 1
echo "4. PUT /users/$USER1_ID"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/users/$USER1_ID" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updateduser1"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "PUT" "/users/$USER1_ID" "$HTTP_CODE" "$BODY"
echo ""

# 5. POST /users/{userId}/profile - Créer profil complet
echo "5. POST /users/$USER1_ID/profile - Créer profil complet"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER1_ID/profile" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "MALE",
    "birthDate": "1990-01-15T00:00:00.000Z",
    "height": 180,
    "weight": 75,
    "targetWeight": 80,
    "bodyFatPercentage": 15,
    "activityLevel": "MODERATELY_ACTIVE",
    "exerciseType": "STRENGTH",
    "exerciseFrequency": 4,
    "exerciseMinutes": 60,
    "exerciseIntensity": "HIGH",
    "trainingGoal": "MUSCLE_GAIN",
    "goal": "BUILD_MUSCLE",
    "weightChangeRate": "MODERATE",
    "mealsPerDay": 4,
    "snacksPerDay": 1,
    "macroRatio": "HIGH_PROTEIN",
    "proteinTarget": 150,
    "carbTarget": 200,
    "fatTarget": 70,
    "allergies": ["PEANUTS"],
    "allergySeverity": "SEVERE",
    "intolerances": ["LACTOSE"],
    "medicalConditions": ["HYPERTENSION"],
    "sodiumLimit": 2000,
    "maxPrepTimePerMeal": 45,
    "cookingSkill": "INTERMEDIATE",
    "complexityPreference": "MODERATE",
    "preferredCookingMethods": ["BAKING", "GRILLING"],
    "mealDistribution": {
      "breakfastPercent": 25,
      "lunchPercent": 35,
      "dinnerPercent": 30,
      "snackPercent": 10
    }
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "POST" "/users/$USER1_ID/profile" "$HTTP_CODE" "$BODY"
echo ""

# 6. GET /users/{userId}/profile - Récupérer profil
echo "6. GET /users/$USER1_ID/profile"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID/profile" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "GET" "/users/$USER1_ID/profile" "$HTTP_CODE" "$BODY"
echo ""

# 7. GET /users/{userId}/profile/calculated-needs - Récupérer besoins calculés
echo "7. GET /users/$USER1_ID/profile/calculated-needs"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID/profile/calculated-needs" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "GET" "/users/$USER1_ID/profile/calculated-needs" "$HTTP_CODE" "$BODY"
echo ""

# 8. POST /users/{userId}/profile/recalculate - Recalculer besoins
echo "8. POST /users/$USER1_ID/profile/recalculate"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER1_ID/profile/recalculate" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "POST" "/users/$USER1_ID/profile/recalculate" "$HTTP_CODE" "$BODY"
echo ""

# 9. PUT /users/{userId}/profile - Mettre à jour profil
echo "9. PUT /users/$USER1_ID/profile"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/users/$USER1_ID/profile" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 76,
    "goal": "MAINTAIN_WEIGHT"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "PUT" "/users/$USER1_ID/profile" "$HTTP_CODE" "$BODY"
echo ""

# 10. POST /users/{userId}/history/weight - Ajouter entrée poids
echo "10. POST /users/$USER1_ID/history/weight"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER1_ID/history/weight" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 76.5,
    "notes": "Après entraînement"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "POST" "/users/$USER1_ID/history/weight" "$HTTP_CODE" "$BODY"
echo ""

# 11. GET /users/{userId}/history/weight - Récupérer historique poids
echo "11. GET /users/$USER1_ID/history/weight"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID/history/weight" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "GET" "/users/$USER1_ID/history/weight" "$HTTP_CODE" "$BODY"
echo ""

# 12. POST /users/{userId}/history/meals - Ajouter consommation repas
echo "12. POST /users/$USER1_ID/history/meals"
# On a besoin d'un mealId valide, utilisons un UUID fictif pour le test
MEAL_ID="test-meal-123"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER1_ID/history/meals" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"mealId\": \"$MEAL_ID\",
    \"mealType\": \"LUNCH\",
    \"rating\": 5,
    \"notes\": \"Excellent repas\"
  }")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "POST" "/users/$USER1_ID/history/meals" "$HTTP_CODE" "$BODY"
echo ""

# 13. GET /users/{userId}/history/meals - Récupérer historique repas
echo "13. GET /users/$USER1_ID/history/meals"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID/history/meals" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
print_result "GET" "/users/$USER1_ID/history/meals" "$HTTP_CODE" "$BODY"
echo ""

# 14. DELETE /users/{userId}/profile - Supprimer profil
echo "14. DELETE /users/$USER1_ID/profile"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/users/$USER1_ID/profile" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
print_result "DELETE" "/users/$USER1_ID/profile" "$HTTP_CODE" ""
echo ""

# 15. DELETE /users/{userId} - Supprimer utilisateur
echo "15. DELETE /users/$USER1_ID"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/users/$USER1_ID" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
print_result "DELETE" "/users/$USER1_ID" "$HTTP_CODE" ""
echo ""

echo "=========================================="
echo "TESTS TERMINÉS"
echo "=========================================="




