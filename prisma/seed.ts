import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create default users
  await prisma.user.create({
    data: { name: "Anthony" },
  });
  await prisma.user.create({
    data: { name: "Romy" },
  });

  // Create common expenses
  await prisma.expense.createMany({
    data: [
      {
        title: "Courses",
        amount: 400,
        creationDate: new Date(),
      },
      {
        title: "Electricité",
        amount: 50,
        creationDate: new Date(),
      },
      {
        title: "Box Internet",
        amount: 24,
        creationDate: new Date(),
      },
      {
        title: "Rodin",
        amount: 150,
        creationDate: new Date(),
      },
      {
        title: "Cantine Eléonore",
        amount: 120,
        creationDate: new Date(),
      },
      {
        title: "Charges Copro",
        amount: 200,
        creationDate: new Date(),
      },
      {
        title: "Occasionnel",
        amount: 250,
        creationDate: new Date(),
      },
      {
        title: "Ajustement",
        amount: 400,
        creationDate: new Date(),
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((e) => {
    console.error("Error during seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
