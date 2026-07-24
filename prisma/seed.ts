import { prisma } from "@database/prisma";

async function main() {
  // Create default users
  const { id: idAnthony } = await prisma.user.create({
    data: { name: "Anthony" },
  });
  const { id: idRomy } = await prisma.user.create({
    data: { name: "Romy" },
  });

  // Update default salary
  await prisma.salary.create({
    data: {
      amount: 0,
      userId: 1,
    },
  });

  await prisma.salary.create({
    data: {
      amount: 0,
      userId: 2,
    },
  });

  // Create common expenses
  await prisma.expense.createMany({
    data: [
      // Anthony
      {
        userId: idAnthony,
        title: "Courses la vie claire",
        amount: 18.22,
      },
      // Romy
      {
        userId: idRomy,
        title: "Cadeaux maitresse EME",
        amount: 87.74,
      },
      {
        userId: idRomy,
        title: "Cours parentalité",
        amount: 39.99,
      },
      {
        userId: idRomy,
        title: "Assurance",
        amount: 56.91,
      },
      // Common
      {
        title: "Courses",
        amount: 400,
      },
      {
        title: "Electricité",
        amount: 50,
      },
      {
        title: "Box Internet",
        amount: 30,
      },
      {
        title: "Rodin",
        amount: 150,
      },
      {
        title: "Cantine",
        amount: 120,
      },
      {
        title: "Charges Copro",
        amount: 200,
      },
      {
        title: "Occasionnel",
        amount: 250,
      },
      {
        title: "Ajustement",
        amount: 600,
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
