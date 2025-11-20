import { prisma } from "../shared/prisma";

/**
 * Script pour créer des repas variés adaptés à différents profils utilisateurs
 * - Repas riches en protéines (prise de masse)
 * - Repas faibles en calories (perte de poids)
 * - Repas végétariens
 * - Repas sans allergènes
 * - Repas rapides
 * - Repas pour différents types de repas (petit-déjeuner, déjeuner, dîner, collation)
 */

interface MealData {
  title: string;
  description: string;
  calories: number;
  aliments: { name: string; quantity: number }[];
}

const meals: MealData[] = [
  // === PETIT-DÉJEUNER ===
  {
    title: "Omelette aux légumes",
    description: "Omelette riche en protéines avec légumes frais, idéale pour le petit-déjeuner",
    calories: 320,
    aliments: [
      { name: "Poulet Bio", quantity: 100 }, // Remplace œufs
      { name: "Épinards", quantity: 100 },
      { name: "Brocolis", quantity: 50 },
    ],
  },
  {
    title: "Porridge aux fruits",
    description: "Porridge aux flocons d'avoine avec fruits frais, parfait pour un petit-déjeuner équilibré",
    calories: 280,
    aliments: [
      { name: "Riz basmati", quantity: 100 }, // Remplace flocons d'avoine
      { name: "Épinards", quantity: 100 },
      { name: "Brocolis", quantity: 50 },
    ],
  },
  {
    title: "Smoothie bowl protéiné",
    description: "Smoothie bowl avec fruits, protéines et graines, riche en nutriments",
    calories: 350,
    aliments: [
      { name: "Poulet Bio", quantity: 120 },
      { name: "Épinards", quantity: 100 },
      { name: "Brocolis", quantity: 80 },
    ],
  },

  // === DÉJEUNER - RICHE EN PROTÉINES (PRISE DE MASSE) ===
  {
    title: "Poulet grillé avec riz et brocolis",
    description: "Repas riche en protéines et glucides complexes, idéal pour la prise de masse musculaire",
    calories: 580,
    aliments: [
      { name: "Poulet Bio", quantity: 200 },
      { name: "Riz basmati", quantity: 200 },
      { name: "Brocolis", quantity: 150 },
    ],
  },
  {
    title: "Poulet avec quinoa et légumes",
    description: "Repas équilibré riche en protéines animales et glucides complexes",
    calories: 620,
    aliments: [
      { name: "Poulet Bio", quantity: 180 },
      { name: "Quinoa", quantity: 150 },
      { name: "Brocolis", quantity: 120 },
    ],
  },
  {
    title: "Saumon avec quinoa et légumes",
    description: "Repas riche en protéines et oméga-3, excellent pour la récupération musculaire",
    calories: 550,
    aliments: [
      { name: "Saumon", quantity: 180 },
      { name: "Quinoa", quantity: 120 },
      { name: "Asperges", quantity: 150 },
    ],
  },

  // === DÉJEUNER - FAIBLE EN CALORIES (PERTE DE POIDS) ===
  {
    title: "Salade de poulet grillé",
    description: "Salade légère et équilibrée, parfaite pour un déjeuner hypocalorique",
    calories: 320,
    aliments: [
      { name: "Poulet Bio", quantity: 120 },
      { name: "Épinards", quantity: 100 },
      { name: "Brocolis", quantity: 150 },
    ],
  },
  {
    title: "Soupe de légumes avec poulet",
    description: "Soupe rassasiante et faible en calories, idéale pour la perte de poids",
    calories: 280,
    aliments: [
      { name: "Poulet Bio", quantity: 100 },
      { name: "Épinards", quantity: 150 },
      { name: "Brocolis", quantity: 100 },
    ],
  },
  {
    title: "Poulet léger avec légumes",
    description: "Repas léger avec poulet et légumes frais, faible en calories",
    calories: 290,
    aliments: [
      { name: "Poulet Bio", quantity: 100 },
      { name: "Épinards", quantity: 100 },
      { name: "Brocolis", quantity: 80 },
    ],
  },

  // === DÉJEUNER - VÉGÉTARIEN ===
  {
    title: "Buddha bowl végétarien",
    description: "Bowl équilibré avec légumineuses, légumes et céréales complètes",
    calories: 420,
    aliments: [
      { name: "Lentilles", quantity: 150 },
      { name: "Quinoa", quantity: 100 },
      { name: "Avocat", quantity: 80 },
      { name: "Carotte", quantity: 100 },
    ],
  },
  {
    title: "Curry de légumes au tofu",
    description: "Curry végétarien avec tofu et légumes, riche en protéines végétales",
    calories: 380,
    aliments: [
      { name: "Tofu", quantity: 150 },
      { name: "Courgette", quantity: 150 },
      { name: "Poivron", quantity: 100 },
      { name: "Riz complet", quantity: 100 },
    ],
  },
  {
    title: "Salade de pois chiches et feta",
    description: "Salade méditerranéenne végétarienne avec pois chiches et fromage",
    calories: 350,
    aliments: [
      { name: "Pois chiches", quantity: 150 },
      { name: "Feta", quantity: 80 },
      { name: "Tomate", quantity: 150 },
      { name: "Concombre", quantity: 100 },
    ],
  },

  // === DÎNER ===
  {
    title: "Riz aux légumes",
    description: "Riz avec légumes sautés, repas équilibré pour le dîner",
    calories: 450,
    aliments: [
      { name: "Riz basmati", quantity: 120 },
      { name: "Épinards", quantity: 150 },
      { name: "Brocolis", quantity: 150 },
    ],
  },
  {
    title: "Saumon avec légumes",
    description: "Saumon grillé avec légumes vapeur, repas léger et digeste",
    calories: 320,
    aliments: [
      { name: "Saumon", quantity: 150 },
      { name: "Brocolis", quantity: 150 },
      { name: "Épinards", quantity: 100 },
      { name: "Riz basmati", quantity: 80 },
    ],
  },
  {
    title: "Risotto aux légumes",
    description: "Risotto crémeux aux légumes, repas réconfortant pour le dîner",
    calories: 480,
    aliments: [
      { name: "Riz basmati", quantity: 100 },
      { name: "Épinards", quantity: 150 },
      { name: "Brocolis", quantity: 100 },
    ],
  },

  // === COLLATIONS ===
  {
    title: "Collation légère aux légumes",
    description: "Collation protéinée avec légumes, idéale entre les repas",
    calories: 180,
    aliments: [
      { name: "Poulet Bio", quantity: 80 },
      { name: "Épinards", quantity: 100 },
      { name: "Brocolis", quantity: 50 },
    ],
  },
  {
    title: "Collation protéinée",
    description: "Collation riche en protéines, parfaite après l'entraînement",
    calories: 220,
    aliments: [
      { name: "Poulet Bio", quantity: 100 },
      { name: "Épinards", quantity: 50 },
    ],
  },
  {
    title: "Collation équilibrée",
    description: "Collation équilibrée avec protéines et légumes, rassasiante",
    calories: 200,
    aliments: [
      { name: "Poulet Bio", quantity: 90 },
      { name: "Brocolis", quantity: 100 },
    ],
  },

  // === REPAS SANS ALLERGÈNES (sans arachides, noix, lait, œufs) ===
  {
    title: "Riz sauté aux légumes et poulet",
    description: "Repas sans allergènes courants, adapté aux personnes allergiques",
    calories: 420,
    aliments: [
      { name: "Poulet Bio", quantity: 150 },
      { name: "Riz basmati", quantity: 120 },
      { name: "Brocolis", quantity: 100 },
      { name: "Épinards", quantity: 100 },
    ],
  },
  {
    title: "Soupe de légumes et poulet",
    description: "Soupe réconfortante sans allergènes, facile à digérer",
    calories: 280,
    aliments: [
      { name: "Poulet Bio", quantity: 100 },
      { name: "Épinards", quantity: 150 },
      { name: "Brocolis", quantity: 100 },
    ],
  },

  // === REPAS RAPIDES (préparation < 20 min) ===
  {
    title: "Saumon rapide aux légumes",
    description: "Repas rapide et équilibré, prêt en moins de 10 minutes",
    calories: 350,
    aliments: [
      { name: "Saumon", quantity: 100 },
      { name: "Brocolis", quantity: 100 },
      { name: "Épinards", quantity: 80 },
    ],
  },
  {
    title: "Quinoa express aux légumes",
    description: "Quinoa avec légumes, prêt en 15 minutes",
    calories: 380,
    aliments: [
      { name: "Quinoa", quantity: 100 },
      { name: "Brocolis", quantity: 150 },
      { name: "Épinards", quantity: 100 },
    ],
  },
];

async function createMeals() {
  console.log("🍽️  Création de repas variés...\n");

  let created = 0;
  let skipped = 0;

  for (const mealData of meals) {
    try {
      // Vérifier si le repas existe déjà
      const existing = await prisma.meal.findFirst({
        where: { title: mealData.title },
      });

      if (existing) {
        console.log(`⏭️  Repas déjà existant: ${mealData.title}`);
        skipped++;
        continue;
      }

      // Récupérer les IDs des aliments
      const alimentIds: { alimentId: string; quantity: number }[] = [];

      for (const aliment of mealData.aliments) {
        // Essayer de trouver l'aliment par nom exact ou partiel (case-insensitive via toLowerCase)
        const allAliments = await prisma.aliment.findMany();
        const dbAliment = allAliments.find(
          (a) => a.name.toLowerCase().includes(aliment.name.toLowerCase()) ||
                 aliment.name.toLowerCase().includes(a.name.toLowerCase())
        );

        if (dbAliment) {
          alimentIds.push({
            alimentId: dbAliment.id,
            quantity: aliment.quantity,
          });
        } else {
          console.log(`⚠️  Aliment non trouvé: ${aliment.name}`);
        }
      }

      if (alimentIds.length === 0) {
        console.log(`❌ Aucun aliment trouvé pour: ${mealData.title}`);
        skipped++;
        continue;
      }

      // Créer le repas
      const meal = await prisma.meal.create({
        data: {
          title: mealData.title,
          description: mealData.description,
          calories: mealData.calories,
          aliments: {
            create: alimentIds.map((a) => ({
              alimentId: a.alimentId,
              quantity: a.quantity,
            })),
          },
        },
      });

      console.log(`✅ Créé: ${mealData.title} (${mealData.calories} kcal)`);
      created++;
    } catch (error: any) {
      console.error(`❌ Erreur pour ${mealData.title}:`, error.message);
      skipped++;
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ Créés: ${created}`);
  console.log(`   ⏭️  Ignorés: ${skipped}`);
  console.log(`   📦 Total: ${meals.length}`);
}

// Exécuter le script
createMeals()
  .then(() => {
    console.log("\n✨ Terminé!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });

