import { Expense } from "@prisma/client";

export interface UserAccounting {
  userId: number;
  salary: number;
  expenses: Expense[];
}

export interface AccountingParameters {
  userAccounting: UserAccounting[];
  commonExpenses: Expense[];
}

export interface AccountingResults {
  userId: number;
  quota: number;
}
