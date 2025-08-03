"use server";

import { Expense } from "@prisma/client";

import { prisma } from "@database/prisma";

export async function createExpense({
  title,
  amount,
  userId,
}: Pick<Expense, "title" | "amount" | "userId">) {
  console.debug("Creating expense with data:", { title, amount, userId });
  try {
    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        userId,
      },
    });

    return expense;
  } catch (error) {
    console.error("Error creating expense:", error);
    return null;
  }
}

export async function getExpenses({ userId }: { userId: number | null }) {
  console.debug("Fetching expenses for userId:", userId);
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
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

export async function updateExpense(expense: Expense) {
  console.debug("Updating expense with data:", expense);

  try {
    const updatedExpense = await prisma.expense.update({
      where: { id: expense.id },
      data: expense,
    });

    return updatedExpense;
  } catch (error) {
    console.error("Error updating expense:", error);
    return null;
  }
}

export async function deleteExpenses(ids: string[]) {
  console.debug("Deleting expenses with ids:", ids);

  try {
    const deletedExpenses = await prisma.expense.deleteMany({
      where: { id: { in: ids } },
    });

    return deletedExpenses;
  } catch (error) {
    console.error("Error deleting multiple expenses:", error);
    return null;
  }
}
