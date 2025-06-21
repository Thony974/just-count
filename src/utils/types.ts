// TODO: Use data types from prisma schema
export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  creationDate: Date;
}

export interface AccountingParameters {
  mySalary: number;
  partnerSalary: number;
  myExpenses: ExpenseItem[];
  partnerExpenses: ExpenseItem[];
  commonExpenses: ExpenseItem[];
}

export interface AccountingResults {
  myQuota: number;
  partnerQuota: number;
}
