import { prisma } from '../shared/prisma';

(async function main() {
  try {
    const a = await prisma.aliment.findMany({ take: 12 });
    console.log(JSON.stringify(a, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
