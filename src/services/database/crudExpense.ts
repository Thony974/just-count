"use server";

import { prisma } from "@database/prisma";

export async function createExpense({
  title,
  amount,
  userId,
}: {
  title: string;
  amount: number;
  userId?: number;
}) {
  try {
    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        userId,
        creationDate: new Date(),
      },
    });

    return expense.id;
  } catch (error) {
    console.error("Error creating expense:", error);
    return null;
  }
}

export async function getExpenses({ userId }: { userId?: number }) {
  try {
    const expenses = await prisma.expense.findMany({
      where: userId === undefined ? { userId: null } : { userId },
      orderBy: {
        creationDate: "desc",
      },
    });

    return expenses;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
}
