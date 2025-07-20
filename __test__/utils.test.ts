import { Expense } from "@prisma/client";

import {
  computeExpensesAmount,
  computeQuota,
  formatCurrency,
  formatDate,
} from "@/utils/utils";

describe("computeQuota", () => {
  it("should throw an error if userAccounting is empty", () => {
    expect(() =>
      computeQuota({ userAccounting: [], commonExpenses: [] })
    ).toThrow("Cannot compute quota with no users");
  });

  it("should return quotas of 0 if total expenses are 0", () => {
    const userAccounting = [
      { userId: 1, salary: 3000, expenses: [] },
      { userId: 2, salary: 2000, expenses: [] },
    ];
    const commonExpenses: Expense[] = [];

    const result = computeQuota({ userAccounting, commonExpenses });

    expect(result).toEqual([
      { userId: 1, quota: 0 },
      { userId: 2, quota: 0 },
    ]);
  });

  it("should return equal negative quotas if total salaries are 0", () => {
    const userAccounting = [
      {
        userId: 1,
        salary: 0,
        expenses: [
          {
            id: "1",
            creationDate: new Date(),
            title: "Expense 1",
            amount: 100,
            description: null,
            categoryId: null,
            userId: null,
          },
        ],
      },
      {
        userId: 2,
        salary: 0,
        expenses: [
          {
            id: "2",
            creationDate: new Date(),
            title: "Expense 2",
            amount: 200,
            description: null,
            categoryId: null,
            userId: null,
          },
        ],
      },
    ];
    const commonExpenses: Expense[] = [
      {
        id: "common1",
        creationDate: new Date(),
        title: "Common Expense",
        amount: 300,
        description: null,
        categoryId: null,
        userId: null,
      },
    ];

    const result = computeQuota({ userAccounting, commonExpenses });

    expect(result).toEqual([
      { userId: 1, quota: -300 },
      { userId: 2, quota: -300 },
    ]);
  });

  it("should compute quotas correctly for valid inputs", () => {
    const expenseCommonProps = {
      description: null,
      categoryId: null,
    };

    const userAccounting = [
      {
        userId: 1,
        salary: 3625,
        expenses: [
          {
            id: "1",
            userId: 1,
            creationDate: new Date(),
            title: "Billet Paris Nice",
            amount: 1414.14,
            ...expenseCommonProps,
          },
        ],
      },
      {
        userId: 2,
        salary: 2777,
        expenses: [
          {
            id: "7",
            userId: 2,
            creationDate: new Date(),
            title: "Hello Fresh",
            amount: 778.24,
            ...expenseCommonProps,
          },
          {
            id: "8",
            userId: 2,
            creationDate: new Date(),
            title: "Gateau photo mariage",
            amount: 580,
            ...expenseCommonProps,
          },
          {
            id: "9",
            userId: 2,
            creationDate: new Date(),
            title: "Assurance",
            amount: 56.91,
            ...expenseCommonProps,
          },
        ],
      },
    ];
    const commonExpenses: Expense[] = [
      {
        id: "common1",
        userId: null,
        creationDate: new Date(),
        title: "Courses",
        amount: 400,
        ...expenseCommonProps,
      },
      {
        id: "common2",
        userId: null,
        creationDate: new Date(),
        title: "Electricité",
        amount: 50,
        ...expenseCommonProps,
      },
      {
        id: "common3",
        userId: null,
        creationDate: new Date(),
        title: "Box Internet",
        amount: 30,
        ...expenseCommonProps,
      },
      {
        id: "common4",
        userId: null,
        creationDate: new Date(),
        title: "Rodin",
        amount: 150,
        ...expenseCommonProps,
      },
      {
        id: "common5",
        userId: null,
        creationDate: new Date(),
        title: "Cantine",
        amount: 120,
        ...expenseCommonProps,
      },
      {
        id: "common6",
        userId: null,
        creationDate: new Date(),
        title: "Charges Copro",
        amount: 200,
        ...expenseCommonProps,
      },
      {
        id: "common7",
        userId: null,
        creationDate: new Date(),
        title: "Occasionnel",
        amount: 250,
        ...expenseCommonProps,
      },
      {
        id: "common8",
        userId: null,
        creationDate: new Date(),
        title: "Ajustement",
        amount: 600,
        ...expenseCommonProps,
      },
    ];

    const result = computeQuota({ userAccounting, commonExpenses });

    expect(result.length).toBe(2);
    expect(result[0].userId).toBe(1);
    expect(result[1].userId).toBe(2);

    expect(result[0].quota).toBeCloseTo(1207.1);
    expect(result[1].quota).toBeCloseTo(592.9);
  });
});
describe("computeExpensesAmount", () => {
  it("should return 0 if the expenses array is empty", () => {
    const expenses: Expense[] = [];
    const result = computeExpensesAmount(expenses);
    expect(result).toBe(0);
  });

  it("should correctly compute the total amount of expenses", () => {
    const expenses: Expense[] = [
      {
        id: "1",
        creationDate: new Date(),
        title: "Expense 1",
        amount: 100,
        description: null,
        categoryId: null,
        userId: null,
      },
      {
        id: "2",
        creationDate: new Date(),
        title: "Expense 2",
        amount: 200,
        description: null,
        categoryId: null,
        userId: null,
      },
      {
        id: "3",
        creationDate: new Date(),
        title: "Expense 3",
        amount: 300,
        description: null,
        categoryId: null,
        userId: null,
      },
    ];
    const result = computeExpensesAmount(expenses);
    expect(result).toBe(600);
  });
});

describe("formatCurrency", () => {
  it("should format a number into EUR currency format", () => {
    const value = 1234.56;
    const result = formatCurrency(value);
    expect(result).toBe("1 234,56 €");
  });

  it("should handle negative numbers correctly", () => {
    const value = -987.65;
    const result = formatCurrency(value);
    expect(result).toBe("-987,65 €");
  });
});

describe("formatDate", () => {
  it("should format a date into 'fr-FR' locale format", () => {
    const date = new Date("2023-01-01");
    const result = formatDate(date);
    expect(result).toBe("01/01/2023");
  });

  it("should handle invalid dates gracefully", () => {
    const date = new Date("invalid-date");
    const result = formatDate(date);
    expect(result).toBe("Invalid Date");
  });
});
