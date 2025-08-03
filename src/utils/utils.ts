import { Expense } from "@prisma/client";

import { AccountingParameters, AccountingResults } from "./types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR");
}

export function computeExpensesAmount(expenses: Expense[]) {
  return expenses.reduce((acc, item) => acc + item.amount, 0);
}

export function computeQuota({
  userAccounting,
  commonExpenses,
}: AccountingParameters): AccountingResults[] {
  if (userAccounting.length < 1)
    throw new Error("Cannot compute quota with no users");

  const totalSalaries = userAccounting.reduce(
    (acc, { salary }) => acc + salary,
    0
  );
  const totalExpenses =
    userAccounting
      .map(({ expenses }) => computeExpensesAmount(expenses))
      .reduce((acc, amount) => acc + amount, 0) +
    computeExpensesAmount(commonExpenses);

  /** Trivial cases */
  // Wonderfull world
  if (totalExpenses === 0) {
    return userAccounting.map(({ userId }) => ({ userId, quota: 0 }));
  }
  // So sad one...
  if (totalSalaries === 0) {
    const quota = -totalExpenses / userAccounting.length;
    return userAccounting.map(({ userId }) => ({ userId, quota }));
  }

  const quotas = userAccounting.map(({ userId, salary, expenses }) => {
    const userExpensesAmount = computeExpensesAmount(expenses);
    const userQuota = (salary / totalSalaries) * totalExpenses;
    return { userId, quota: userQuota - userExpensesAmount };
  });

  console.log("User accounting:", userAccounting);
  console.log("Computed quotas:", quotas);

  return quotas;
}
