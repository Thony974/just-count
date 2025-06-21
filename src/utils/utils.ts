import { AccountingParameters, AccountingResults, ExpenseItem } from "./types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR");
}

export function computeExpensesAmount(expenseItems: ExpenseItem[]) {
  return expenseItems.reduce((acc, item) => acc + item.amount, 0);
}

export function computeQuota({
  mySalary,
  partnerSalary,
  myExpenses,
  partnerExpenses,
  commonExpenses,
}: AccountingParameters): AccountingResults {
  const myExpensesAmount = computeExpensesAmount(myExpenses);
  const partnerExpensesAmount = computeExpensesAmount(partnerExpenses);
  const commonExpensesAmount = computeExpensesAmount(commonExpenses);
  const totalExpenses =
    myExpensesAmount + partnerExpensesAmount + commonExpensesAmount;

  // Trivial cases
  if (totalExpenses === 0) return { myQuota: 0, partnerQuota: 0 };
  if (mySalary === 0 && partnerSalary === 0) {
    return { myQuota: -totalExpenses / 2, partnerQuota: -totalExpenses / 2 }; // So sad case...
  } else if (mySalary === 0) {
    return { myQuota: 0, partnerQuota: totalExpenses };
  } else if (partnerSalary === 0) {
    return { myQuota: totalExpenses, partnerQuota: 0 };
  }

  return {
    myQuota: totalExpenses / (1 + partnerSalary / mySalary) - myExpensesAmount,
    partnerQuota:
      totalExpenses / (1 + mySalary / partnerSalary) - partnerExpensesAmount,
  };
}
