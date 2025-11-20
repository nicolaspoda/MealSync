#!/bin/bash

# Script complet de test de tous les endpoints avec tous les critères
# Usage: ./test_all_endpoints.sh

BASE_URL="http://localhost:3000"
API_KEY="abc123456"

echo "=========================================="
echo "TEST COMPLET DE TOUS LES ENDPOINTS"
echo "=========================================="
echo ""

# Variables pour stocker les IDs
USER1_ID=""
USER2_ID=""
USER3_ID=""
USER4_ID=""
USER5_ID=""
USER6_ID=""

# Fonction pour afficher les résultats
print_result() {
    local method=$1
    local endpoint=$2
    local status=$3
    
    if [ "$status" -eq 200 ] || [ "$status" -eq 201 ] || [ "$status" -eq 204 ]; then
        echo "✅ $method $endpoint - Status: $status"
        return 0
    else
        echo "❌ $method $endpoint - Status: $status"
        return 1
    fi
}

ERRORS=0

# ============================================
# 1. CRÉATION DES UTILISATEURS
# ============================================
echo "=== 1. CRÉATION DES UTILISATEURS ==="
echo ""

echo "1.1. Création User 1 - Athlete (Muscle Gain)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"athlete@test.com","username":"athlete_user"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if print_result "POST" "/users" "$HTTP_CODE"; then
    USER1_ID=$(echo "$BODY" | jq -r '.id')
    echo "   User1 ID: $USER1_ID"
else
    ((ERRORS++))
fi
echo ""

echo "1.2. Création User 2 - Weight Loss"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"weightloss@test.com","username":"weightloss_user"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if print_result "POST" "/users" "$HTTP_CODE"; then
    USER2_ID=$(echo "$BODY" | jq -r '.id')
    echo "   User2 ID: $USER2_ID"
else
    ((ERRORS++))
fi
echo ""

echo "1.3. Création User 3 - Vegetarian"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"vegetarian@test.com","username":"vegetarian_user"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if print_result "POST" "/users" "$HTTP_CODE"; then
    USER3_ID=$(echo "$BODY" | jq -r '.id')
    echo "   User3 ID: $USER3_ID"
else
    ((ERRORS++))
fi
echo ""

echo "1.4. Création User 4 - Keto Diet"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"keto@test.com","username":"keto_user"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if print_result "POST" "/users" "$HTTP_CODE"; then
    USER4_ID=$(echo "$BODY" | jq -r '.id')
    echo "   User4 ID: $USER4_ID"
else
    ((ERRORS++))
fi
echo ""

echo "1.5. Création User 5 - Allergies & Intolerances"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"allergies@test.com","username":"allergies_user"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if print_result "POST" "/users" "$HTTP_CODE"; then
    USER5_ID=$(echo "$BODY" | jq -r '.id')
    echo "   User5 ID: $USER5_ID"
else
    ((ERRORS++))
fi
echo ""

echo "1.6. Création User 6 - Medical Conditions"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"medical@test.com","username":"medical_user"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if print_result "POST" "/users" "$HTTP_CODE"; then
    USER6_ID=$(echo "$BODY" | jq -r '.id')
    echo "   User6 ID: $USER6_ID"
else
    ((ERRORS++))
fi
echo ""

# ============================================
# 2. CRÉATION DES PROFILS COMPLETS
# ============================================
echo "=== 2. CRÉATION DES PROFILS COMPLETS ==="
echo ""

echo "2.1. Profil User 1 - Athlete (Muscle Gain) - TOUS CRITÈRES"
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
if ! print_result "POST" "/users/$USER1_ID/profile" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "2.2. Profil User 2 - Weight Loss (Conservative)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER2_ID/profile" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "FEMALE",
    "birthDate": "1990-07-20T00:00:00.000Z",
    "height": 165,
    "weight": 70,
    "targetWeight": 65,
    "activityLevel": "MODERATELY_ACTIVE",
    "exerciseType": "CARDIO",
    "exerciseFrequency": 4,
    "exerciseMinutes": 45,
    "exerciseIntensity": "MODERATE",
    "trainingGoal": "FAT_LOSS",
    "goal": "LOSE_WEIGHT",
    "weightChangeRate": "CONSERVATIVE",
    "mealsPerDay": 3,
    "snacksPerDay": 1,
    "macroRatio": "BALANCED",
    "fiberTarget": 30,
    "maxPrepTimePerMeal": 30,
    "complexityPreference": "SIMPLE",
    "preferredCookingMethods": ["STEAMING", "BAKING"],
    "mealDistribution": {
      "breakfastPercent": 25,
      "lunchPercent": 40,
      "dinnerPercent": 30,
      "snackPercent": 5
    }
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "POST" "/users/$USER2_ID/profile" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "2.3. Profil User 3 - Vegetarian (Complete)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER3_ID/profile" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "FEMALE",
    "birthDate": "1988-11-10T00:00:00.000Z",
    "height": 170,
    "weight": 65,
    "activityLevel": "LIGHTLY_ACTIVE",
    "exerciseType": "FLEXIBILITY",
    "exerciseFrequency": 3,
    "goal": "MAINTAIN_WEIGHT",
    "mealsPerDay": 4,
    "macroRatio": "BALANCED",
    "excludedAliments": ["Poulet", "Bœuf", "Porc", "Poisson"],
    "preferredCuisines": ["MEDITERRANEAN", "INDIAN"],
    "prefersOrganic": true,
    "prefersWholeFoods": true,
    "micronutrientFocus": ["IRON", "VITAMIN_B12", "CALCIUM"],
    "takesSupplements": true,
    "supplementsList": "B12, Iron",
    "maxPrepTimePerMeal": 45,
    "complexityPreference": "MODERATE",
    "mealDistribution": {
      "breakfastPercent": 25,
      "lunchPercent": 35,
      "dinnerPercent": 30,
      "snackPercent": 10
    }
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "POST" "/users/$USER3_ID/profile" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "2.4. Profil User 4 - Keto Diet (Low Carb)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER4_ID/profile" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "MALE",
    "birthDate": "1992-05-25T00:00:00.000Z",
    "height": 175,
    "weight": 85,
    "targetWeight": 78,
    "activityLevel": "MODERATELY_ACTIVE",
    "exerciseType": "MIXED",
    "exerciseFrequency": 5,
    "goal": "LOSE_WEIGHT",
    "weightChangeRate": "MODERATE",
    "mealsPerDay": 3,
    "intermittentFasting": "16_8",
    "fastingWindowStart": "20:00",
    "fastingWindowEnd": "12:00",
    "macroRatio": "KETO_RATIO",
    "proteinTarget": 120,
    "carbTarget": 20,
    "fatTarget": 150,
    "excludedAliments": ["Riz", "Pâtes", "Pain", "Pomme de terre"],
    "maxPrepTimePerMeal": 40,
    "preferredCookingMethods": ["GRILLING", "ROASTING"],
    "mealDistribution": {
      "breakfastPercent": 0,
      "lunchPercent": 50,
      "dinnerPercent": 50,
      "snackPercent": 0
    }
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "POST" "/users/$USER4_ID/profile" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "2.5. Profil User 5 - Allergies & Intolerances (COMPLET)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER5_ID/profile" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "FEMALE",
    "birthDate": "1995-09-12T00:00:00.000Z",
    "height": 160,
    "weight": 60,
    "activityLevel": "LIGHTLY_ACTIVE",
    "goal": "MAINTAIN_WEIGHT",
    "mealsPerDay": 3,
    "excludedAliments": ["Arachides", "Noix", "Lait", "Œufs"],
    "allergies": ["PEANUTS", "TREE_NUTS", "MILK", "EGGS"],
    "allergySeverity": "SEVERE",
    "intolerances": ["LACTOSE"],
    "celiac": true,
    "sodiumLimit": 2000,
    "maxPrepTimePerMeal": 25,
    "cookingSkill": "BEGINNER",
    "complexityPreference": "SIMPLE"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "POST" "/users/$USER5_ID/profile" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "2.6. Profil User 6 - Medical Conditions"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER6_ID/profile" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "MALE",
    "birthDate": "1975-02-18T00:00:00.000Z",
    "height": 175,
    "weight": 90,
    "healthStatus": "FAIR",
    "activityLevel": "SEDENTARY",
    "goal": "IMPROVE_HEALTH",
    "mealsPerDay": 3,
    "medicalConditions": ["HYPERTENSION", "DIABETES_TYPE_2"],
    "sodiumLimit": 1500,
    "potassiumLimit": 2000,
    "proteinLimit": 80,
    "fiberTarget": 25,
    "medications": "Metformin, Lisinopril",
    "macroRatio": "LOW_FAT",
    "maxPrepTimePerMeal": 30
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "POST" "/users/$USER6_ID/profile" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

sleep 2

# ============================================
# 3. TEST DES ENDPOINTS USER CRUD
# ============================================
echo "=== 3. TEST DES ENDPOINTS USER CRUD ==="
echo ""

echo "3.1. GET /users/$USER1_ID"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/users/$USER1_ID" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "3.2. PUT /users/$USER1_ID"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/users/$USER1_ID" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"username": "updated_athlete"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "PUT" "/users/$USER1_ID" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

# ============================================
# 4. TEST DES ENDPOINTS PROFILE
# ============================================
echo "=== 4. TEST DES ENDPOINTS PROFILE ==="
echo ""

echo "4.1. GET /users/$USER1_ID/profile"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID/profile" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/users/$USER1_ID/profile" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "4.2. GET /users/$USER1_ID/profile/calculated-needs"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID/profile/calculated-needs" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/users/$USER1_ID/profile/calculated-needs" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "4.3. POST /users/$USER1_ID/profile/recalculate"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER1_ID/profile/recalculate" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "POST" "/users/$USER1_ID/profile/recalculate" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "4.4. PUT /users/$USER1_ID/profile"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/users/$USER1_ID/profile" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"weight": 76, "goal": "MAINTAIN_WEIGHT"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "PUT" "/users/$USER1_ID/profile" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

# ============================================
# 5. TEST DES SUGGESTIONS DE REPAS
# ============================================
echo "=== 5. TEST DES SUGGESTIONS DE REPAS ==="
echo ""

echo "5.1. GET /meals/suggestions?userId=$USER1_ID&limit=5"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/meals/suggestions?userId=$USER1_ID&limit=5" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if print_result "GET" "/meals/suggestions (User 1)" "$HTTP_CODE"; then
    MEAL_COUNT=$(echo "$BODY" | jq 'length' 2>/dev/null || echo "0")
    echo "   Meals returned: $MEAL_COUNT"
else
    echo "   Error response: $BODY"
    ((ERRORS++))
fi
echo ""

echo "5.2. GET /meals/suggestions?userId=$USER1_ID&mealType=BREAKFAST&limit=3"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/meals/suggestions?userId=$USER1_ID&mealType=BREAKFAST&limit=3" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/meals/suggestions (Breakfast)" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "5.3. GET /meals/suggestions?userId=$USER2_ID&limit=5"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/meals/suggestions?userId=$USER2_ID&limit=5" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/meals/suggestions (User 2 - Weight Loss)" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "5.4. GET /meals/suggestions?userId=$USER3_ID&limit=5"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/meals/suggestions?userId=$USER3_ID&limit=5" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/meals/suggestions (User 3 - Vegetarian)" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "5.5. GET /meals/suggestions?userId=$USER5_ID&limit=5"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/meals/suggestions?userId=$USER5_ID&limit=5" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/meals/suggestions (User 5 - Allergies)" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

# ============================================
# 6. TEST DE L'HISTORIQUE
# ============================================
echo "=== 6. TEST DE L'HISTORIQUE ==="
echo ""

echo "6.1. POST /users/$USER1_ID/history/weight"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER1_ID/history/weight" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"weight": 76.5, "notes": "Après entraînement"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "POST" "/users/$USER1_ID/history/weight" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "6.2. GET /users/$USER1_ID/history/weight"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID/history/weight" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/users/$USER1_ID/history/weight" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "6.3. POST /users/$USER1_ID/history/meals"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/users/$USER1_ID/history/meals" \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"mealId": "test-meal-123", "mealType": "LUNCH", "rating": 5, "notes": "Excellent repas"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "POST" "/users/$USER1_ID/history/meals" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

echo "6.4. GET /users/$USER1_ID/history/meals"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID/history/meals" \
  -H "x-api-key: $API_KEY")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if ! print_result "GET" "/users/$USER1_ID/history/meals" "$HTTP_CODE"; then
    ((ERRORS++))
fi
echo ""

# ============================================
# RÉSUMÉ
# ============================================
echo "=========================================="
echo "RÉSUMÉ DES TESTS"
echo "=========================================="
echo "Total d'erreurs: $ERRORS"
if [ $ERRORS -eq 0 ]; then
    echo "✅ TOUS LES TESTS ONT RÉUSSI !"
else
    echo "❌ $ERRORS test(s) ont échoué"
fi
echo ""
echo "IDs des utilisateurs créés:"
echo "  USER1_ID=$USER1_ID (Athlete)"
echo "  USER2_ID=$USER2_ID (Weight Loss)"
echo "  USER3_ID=$USER3_ID (Vegetarian)"
echo "  USER4_ID=$USER4_ID (Keto)"
echo "  USER5_ID=$USER5_ID (Allergies)"
echo "  USER6_ID=$USER6_ID (Medical)"
echo "=========================================="

exit $ERRORS



