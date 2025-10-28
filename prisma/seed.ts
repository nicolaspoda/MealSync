import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  const aliments = await Promise.all([
    prisma.aliment.upsert({
      where: { nom: 'Poulet' },
      update: {},
      create: {
        nom: 'Poulet',
        cal_100g: 165,
      },
    }),
    prisma.aliment.upsert({
      where: { nom: 'Riz basmati' },
      update: {},
      create: {
        nom: 'Riz basmati',
        cal_100g: 350,
      },
    }),
    prisma.aliment.upsert({
      where: { nom: 'Brocolis' },
      update: {},
      create: {
        nom: 'Brocolis',
        cal_100g: 34,
      },
    }),
    prisma.aliment.upsert({
      where: { nom: 'Saumon' },
      update: {},
      create: {
        nom: 'Saumon',
        cal_100g: 208,
      },
    }),
    prisma.aliment.upsert({
      where: { nom: 'Quinoa' },
      update: {},
      create: {
        nom: 'Quinoa',
        cal_100g: 368,
      },
    }),
    prisma.aliment.upsert({
      where: { nom: 'Épinards' },
      update: {},
      create: {
        nom: 'Épinards',
        cal_100g: 23,
      },
    }),
  ]);

  const equipements = await Promise.all([
    prisma.equipment.upsert({
      where: { nom: 'Poêle' },
      update: {},
      create: {
        nom: 'Poêle',
      },
    }),
    prisma.equipment.upsert({
      where: { nom: 'Casserole' },
      update: {},
      create: {
        nom: 'Casserole',
      },
    }),
    prisma.equipment.upsert({
      where: { nom: 'Four' },
      update: {},
      create: {
        nom: 'Four',
      },
    }),
    prisma.equipment.upsert({
      where: { nom: 'Cuiseur vapeur' },
      update: {},
      create: {
        nom: 'Cuiseur vapeur',
      },
    }),
  ]);

  const preparations = await Promise.all([
    prisma.preparation.create({
      data: {
        etape: 1,
        description: 'Faire cuire le riz dans l\'eau bouillante salée',
        temps_estime: 15,
      },
    }),
    prisma.preparation.create({
      data: {
        etape: 2,
        description: 'Faire revenir le poulet dans la poêle avec un peu d\'huile',
        temps_estime: 10,
      },
    }),
    prisma.preparation.create({
      data: {
        etape: 3,
        description: 'Cuire les brocolis à la vapeur',
        temps_estime: 8,
      },
    }),
    prisma.preparation.create({
      data: {
        etape: 1,
        description: 'Préchauffer le four à 180°C',
        temps_estime: 5,
      },
    }),
    prisma.preparation.create({
      data: {
        etape: 2,
        description: 'Faire cuire le saumon au four',
        temps_estime: 20,
      },
    }),
    prisma.preparation.create({
      data: {
        etape: 3,
        description: 'Faire cuire le quinoa',
        temps_estime: 12,
      },
    }),
  ]);

  const macros = await Promise.all([
    prisma.macro.upsert({
      where: { nom: 'Protéines' },
      update: {},
      create: {
        nom: 'Protéines',
      },
    }),
    prisma.macro.upsert({
      where: { nom: 'Glucides' },
      update: {},
      create: {
        nom: 'Glucides',
      },
    }),
    prisma.macro.upsert({
      where: { nom: 'Lipides' },
      update: {},
      create: {
        nom: 'Lipides',
      },
    }),
    prisma.macro.upsert({
      where: { nom: 'Fibres' },
      update: {},
      create: {
        nom: 'Fibres',
      },
    }),
  ]);

  const meal1 = await prisma.meal.create({
    data: {
      title: 'Poulet au riz et brocolis',
      description: 'Un repas équilibré riche en protéines et légumes',
      calories: 450,
      aliments: {
        create: [
          {
            alimentId: aliments[0].id,
            quantite: 150,
          },
          {
            alimentId: aliments[1].id,
            quantite: 80,
          },
          {
            alimentId: aliments[2].id,
            quantite: 200,
          },
        ],
      },
      preparations: {
        create: [
          {
            preparationId: preparations[0].id,
            ordre: 1,
          },
          {
            preparationId: preparations[1].id,
            ordre: 2,
          },
          {
            preparationId: preparations[2].id,
            ordre: 3,
          },
        ],
      },
      equipements: {
        create: [
          {
            equipmentId: equipements[0].id,
          },
          {
            equipmentId: equipements[1].id,
          },
          {
            equipmentId: equipements[3].id,
          },
        ],
      },
    },
  });

  const meal2 = await prisma.meal.create({
    data: {
      title: 'Saumon grillé au quinoa',
      description: 'Saumon riche en oméga-3 accompagné de quinoa et épinards',
      calories: 520,
      aliments: {
        create: [
          {
            alimentId: aliments[3].id,
            quantite: 120,
          },
          {
            alimentId: aliments[4].id,
            quantite: 70,
          },
          {
            alimentId: aliments[5].id,
            quantite: 150,
          },
        ],
      },
      preparations: {
        create: [
          {
            preparationId: preparations[3].id,
            ordre: 1,
          },
          {
            preparationId: preparations[4].id,
            ordre: 2,
          },
          {
            preparationId: preparations[5].id,
            ordre: 3,
          },
        ],
      },
      equipements: {
        create: [
          {
            equipmentId: equipements[2].id,
          },
          {
            equipmentId: equipements[1].id,
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
        quantite: 31,
      },
    }),
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[1].id,
        macroId: macros[1].id,
        quantite: 78,
      },
    }),
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[2].id,
        macroId: macros[3].id,
        quantite: 2.6,
      },
    }),
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[3].id,
        macroId: macros[0].id,
        quantite: 25,
      },
    }),
    prisma.alimentMacro.create({
      data: {
        alimentId: aliments[3].id,
        macroId: macros[2].id,
        quantite: 12,
      },
    }),
  ]);

  console.log('Seeding completed successfully!');
  console.log(`Created:`);
  console.log(`   - ${aliments.length} aliments`);
  console.log(`   - ${equipements.length} équipements`);
  console.log(`   - ${preparations.length} préparations`);
  console.log(`   - ${macros.length} macros`);
  console.log(`   - 2 repas d'exemple`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });