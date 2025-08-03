"use server";

import { Salary } from "@prisma/client";

import { prisma } from "@database/prisma";

export async function updateUserSalary({
  amount,
  userId,
}: Pick<Salary, "userId" | "amount">) {
  try {
    const salary = await prisma.salary.update({
      where: { userId },
      data: {
        amount,
        userId,
      },
    });

    return salary.id;
  } catch (error) {
    console.error("Error updating user salary:", error);
    return null;
  }
}

export async function getUserSalary({ userId }: { userId: number }) {
  try {
    const salary = await prisma.salary.findUnique({
      where: { userId },
    });

    return salary?.amount ?? 0;
  } catch (error) {
    console.error("Error fetching user salary:", error);
    return 0;
  }
}
