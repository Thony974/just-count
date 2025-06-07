// Use data types from prisma schema
export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  creationDate: Date;
}
