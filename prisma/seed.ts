import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  const aliments = await Promise.all([
    prisma.aliment.upsert({
      where: { name: "Poulet" },
      update: {},
      create: {
        name: "Poulet",
        cal_100g: 165,
      },
    }),
    prisma.aliment.upsert({
      where: { name: "Riz basmati" },
      update: {},
      create: {
        name: "Riz basmati",
        cal_100g: 350,
      },
    }),
    prisma.aliment.upsert({
      where: { name: "Brocolis" },
      update: {},
      create: {
        name: "Brocolis",
        cal_100g: 34,
      },
    }),
    prisma.aliment.upsert({
      where: { name: "Saumon" },
      update: {},
      create: {
        name: "Saumon",
        cal_100g: 208,
      },
    }),
    prisma.aliment.upsert({
      where: { name: "Quinoa" },
      update: {},
      create: {
        name: "Quinoa",
        cal_100g: 368,
      },
    }),
    prisma.aliment.upsert({
      where: { name: "Épinards" },
      update: {},
      create: {
        name: "Épinards",
        cal_100g: 23,
      },
    }),
  ]);

  const equipments = await Promise.all([
    prisma.equipment.upsert({
      where: { name: "Poêle" },
      update: {},
      create: {
        name: "Poêle",
      },
    }),
    prisma.equipment.upsert({
      where: { name: "Casserole" },
      update: {},
      create: {
        name: "Casserole",
      },
    }),
    prisma.equipment.upsert({
      where: { name: "Four" },
      update: {},
      create: {
        name: "Four",
      },
    }),
    prisma.equipment.upsert({
      where: { name: "Cuiseur vapeur" },
      update: {},
      create: {
        name: "Cuiseur vapeur",
      },
    }),
  ]);

  const preparations = await Promise.all([
    prisma.preparation.create({
      data: {
        step: 1,
        description: "Faire cuire le riz dans l'eau bouillante salée",
        estimated_time: 15,
      },
    }),
    prisma.preparation.create({
      data: {
        step: 2,
        description:
          "Faire revenir le poulet dans la poêle avec un peu d'huile",
        estimated_time: 10,
      },
    }),
    prisma.preparation.create({
      data: {
        step: 3,
        description: "Cuire les brocolis à la vapeur",
        estimated_time: 8,
      },
    }),
    prisma.preparation.create({
      data: {
        step: 1,
        description: "Préchauffer le four à 180°C",
        estimated_time: 5,
      },
    }),
    prisma.preparation.create({
      data: {
        step: 2,
        description: "Faire cuire le saumon au four",
        estimated_time: 20,
      },
    }),
    prisma.preparation.create({
      data: {
        step: 3,
        description: "Faire cuire le quinoa",
        estimated_time: 12,
      },
    }),
  ]);

  const macros = await Promise.all([
    prisma.macro.upsert({
      where: { name: "Protéines" },
      update: {},
      create: {
        name: "Protéines",
      },
    }),
    prisma.macro.upsert({
      where: { name: "Glucides" },
      update: {},
      create: {
        name: "Glucides",
      },
    }),
    prisma.macro.upsert({
      where: { name: "Lipides" },
      update: {},
      create: {
        name: "Lipides",
      },
    }),
    prisma.macro.upsert({
      where: { name: "Fibres" },
      update: {},
      create: {
        name: "Fibres",
      },
    }),
  ]);

  const meal1 = await prisma.meal.create({
    data: {
      title: "Poulet au riz et brocolis",
      description: "Un repas équilibré riche en protéines et légumes",
      calories: 450,
      aliments: {
        create: [
          {
            alimentId: aliments[0].id,
            quantity: 150,
          },
          {
            alimentId: aliments[1].id,
            quantity: 80,
          },
          {
            alimentId: aliments[2].id,
            quantity: 200,
          },
        ],
      },
      preparations: {
        create: [
          {
            preparationId: preparations[0].id,
            order: 1,
          },
          {
            preparationId: preparations[1].id,
            order: 2,
          },
          {
            preparationId: preparations[2].id,
            order: 3,
          },
        ],
      },
      equipments: {
        create: [
          {
            equipmentId: equipments[0].id,
          },
          {
            equipmentId: equipments[1].id,
          },
          {
            equipmentId: equipments[3].id,
          },
        ],
      },
    },
  });

  const meal2 = await prisma.meal.create({
    data: {
      title: "Saumon grillé au quinoa",
      description: "Saumon riche en oméga-3 accompagné de quinoa et épinards",
      calories: 520,
      aliments: {
        create: [
          {
            alimentId: aliments[3].id,
            quantity: 120,
          },
          {
            alimentId: aliments[4].id,
            quantity: 70,
          },
          {
            alimentId: aliments[5].id,
            quantity: 150,
          },
        ],
      },
      preparations: {
        create: [
          {
            preparationId: preparations[3].id,
            order: 1,
          },
          {
            preparationId: preparations[4].id,
            order: 2,
          },
          {
            preparationId: preparations[5].id,
            order: 3,
          },
        ],
      },
      equipments: {
        create: [
          {
            equipmentId: equipments[2].id,
          },
          {
            equipmentId: equipments[1].id,
          },
        ],
      },
    },
  });

  await Promise.all([
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[0].id,
        macroId: macros[0].id,
        quantity: 31,
      },
    }),
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[1].id,
        macroId: macros[1].id,
        quantity: 78,
      },
    }),
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[2].id,
        macroId: macros[3].id,
        quantity: 2.6,
      },
    }),
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[3].id,
        macroId: macros[0].id,
        quantity: 25,
      },
    }),
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[3].id,
        macroId: macros[2].id,
        quantity: 12,
      },
    }),
  ]);

  console.log("Seeding completed successfully!");
  console.log(`Created:`);
  console.log(`   - ${aliments.length} aliments`);
  console.log(`   - ${equipments.length} équipements`);
  console.log(`   - ${preparations.length} préparations`);
  console.log(`   - ${macros.length} macros`);
  console.log(`   - 2 repas d'exemple`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
