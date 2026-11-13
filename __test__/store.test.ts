import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import type {
  Expense,
  Prisma,
  Salary,
  User,
} from "@database/prisma/generated/client";

import { getUsers } from "@/services/database/crudUser";
import {
  createExpense,
  deleteExpenses,
  getExpenses,
  updateExpense,
} from "@/services/database/crudExpense";
import {
  getUserSalary,
  updateUserSalary,
} from "@/services/database/crudSalary";
import useStore from "@/services/statemanager/store";

jest.mock("@/services/database/crudUser", () => ({
  getUsers: jest.fn(),
}));

jest.mock("@/services/database/crudSalary", () => ({
  getUserSalary: jest.fn(),
  updateUserSalary: jest.fn(),
}));

jest.mock("@/services/database/crudExpense", () => ({
  createExpense: jest.fn(),
  deleteExpenses: jest.fn(),
  getExpenses: jest.fn(),
  updateExpense: jest.fn(),
}));

const makeExpense = (overrides: Partial<Expense> = {}): Expense =>
  ({
    id: "expense-1",
    userId: 1,
    title: "Groceries",
    amount: 42.5,
    creationDate: new Date("2024-01-01T00:00:00.000Z"),
    isPlanned: false,
    description: null,
    categoryId: null,
    ...overrides,
  }) as Expense;

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    image: null,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-02T00:00:00.000Z"),
    ...overrides,
  }) as User;

const makeBatchPayload = (count: number): Prisma.BatchPayload => ({
  count,
});

describe("zustand store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStore.setState({
      loading: false,
      users: [],
      userSalary: new Map<number, number>(),
      userQuota: new Map<number, number>(),
      userExpenses: new Map<number, Expense[]>(),
      userExpensesPicked: new Map<number, Expense[]>(),
      commonExpenses: [],
      comment: "",
    });
  });

  it("fetches users only once when already loaded", async () => {
    const users = [makeUser({ id: 1, name: "Alice" })];
    jest.mocked(getUsers).mockResolvedValue(users);

    await useStore.getState().fetchUsers();
    await useStore.getState().fetchUsers();

    expect(getUsers).toHaveBeenCalledTimes(1);
    expect(useStore.getState().users).toEqual(users);
    expect(useStore.getState().loading).toBe(false);
  });

  it("updates a salary and stores it by user id", async () => {
    jest.mocked(updateUserSalary).mockResolvedValue(null);

    await useStore.getState().updateSalary({ userId: 2, amount: 3500 });

    expect(updateUserSalary).toHaveBeenCalledWith({ userId: 2, amount: 3500 });
    expect(useStore.getState().userSalary.get(2)).toBe(3500);
    expect(useStore.getState().loading).toBe(false);
  });

  it("fetches salary once and caches the result", async () => {
    jest.mocked(getUserSalary).mockResolvedValue(2800);

    await useStore.getState().fetchSalary(2);
    await useStore.getState().fetchSalary(2);

    expect(getUserSalary).toHaveBeenCalledTimes(1);
    expect(getUserSalary).toHaveBeenCalledWith({ userId: 2 });
    expect(useStore.getState().userSalary.get(2)).toBe(2800);
  });

  it("fetches expenses for a user and caches them", async () => {
    const userExpenses = [makeExpense({ id: "exp-1", userId: 2 })];
    jest.mocked(getExpenses).mockResolvedValue(userExpenses);

    await useStore.getState().fetchExpenses(2);
    await useStore.getState().fetchExpenses(2);

    expect(getExpenses).toHaveBeenCalledTimes(1);
    expect(getExpenses).toHaveBeenCalledWith({ userId: 2 });
    expect(useStore.getState().userExpenses.get(2)).toEqual(userExpenses);
  });

  it("fetches common expenses once and caches them", async () => {
    const commonExpenses = [makeExpense({ id: "common-1", userId: null })];
    jest.mocked(getExpenses).mockResolvedValue(commonExpenses);

    await useStore.getState().fetchExpenses(null);
    await useStore.getState().fetchExpenses(null);

    expect(getExpenses).toHaveBeenCalledTimes(1);
    expect(getExpenses).toHaveBeenCalledWith({ userId: null });
    expect(useStore.getState().commonExpenses).toEqual(commonExpenses);
  });

  it("adds an expense to the user-specific store", async () => {
    const createdExpense = makeExpense({
      id: "exp-new",
      userId: 4,
      title: "Rent",
    });
    jest.mocked(createExpense).mockResolvedValue(createdExpense);

    await useStore.getState().addExpense({
      title: "Rent",
      amount: 1000,
      userId: 4,
    });

    expect(createExpense).toHaveBeenCalledWith({
      title: "Rent",
      amount: 1000,
      userId: 4,
    });
    expect(useStore.getState().userExpenses.get(4)).toEqual([createdExpense]);
    expect(useStore.getState().loading).toBe(false);
  });

  it("adds a common expense to the shared store", async () => {
    const createdExpense = makeExpense({
      id: "common-new",
      userId: null,
      title: "Internet",
    });
    jest.mocked(createExpense).mockResolvedValue(createdExpense);

    await useStore.getState().addExpense({
      title: "Internet",
      amount: 65,
      userId: null,
    });

    expect(useStore.getState().commonExpenses).toEqual([createdExpense]);
  });

  it("returns early when creating an expense fails", async () => {
    jest.mocked(createExpense).mockResolvedValue(null);

    await useStore.getState().addExpense({
      title: "Failed",
      amount: 10,
      userId: 7,
    });

    expect(useStore.getState().loading).toBe(false);
    expect(useStore.getState().userExpenses.get(7)).toBeUndefined();
  });

  it("updates a user expense in place", async () => {
    const existing = makeExpense({ id: "exp-1", userId: 5, title: "Old" });
    const updated = makeExpense({
      id: "exp-1",
      userId: 5,
      title: "Updated",
      amount: 99,
    });
    useStore.setState({
      userExpenses: new Map<number, Expense[]>([[5, [existing]]]),
    });
    jest.mocked(updateExpense).mockResolvedValue(updated);

    const result = await useStore.getState().updateExpense(updated);

    expect(updateExpense).toHaveBeenCalledWith(updated);
    expect(result).toEqual(updated);
    expect(useStore.getState().userExpenses.get(5)).toEqual([updated]);
    expect(useStore.getState().loading).toBe(false);
  });

  it("updates a common expense in place", async () => {
    const existing = makeExpense({
      id: "common-1",
      userId: null,
      title: "Old",
    });
    const updated = makeExpense({
      id: "common-1",
      userId: null,
      title: "Updated",
      amount: 120,
    });
    useStore.setState({ commonExpenses: [existing] });
    jest.mocked(updateExpense).mockResolvedValue(updated);

    const result = await useStore.getState().updateExpense(updated);

    expect(result).toEqual(updated);
    expect(useStore.getState().commonExpenses).toEqual([updated]);
  });

  it("returns null when an expense update fails", async () => {
    const expense = makeExpense({ id: "exp-1", userId: 1 });
    jest.mocked(updateExpense).mockResolvedValue(null);

    const result = await useStore.getState().updateExpense(expense);

    expect(result).toBeNull();
    expect(useStore.getState().loading).toBe(false);
  });

  it("deletes selected expenses from both user and common collections", async () => {
    const userExpense1 = makeExpense({ id: "exp-1", userId: 1 });
    const userExpense2 = makeExpense({ id: "exp-2", userId: 1 });
    const commonExpense = makeExpense({ id: "common-1", userId: null });
    useStore.setState({
      userExpenses: new Map<number, Expense[]>([
        [1, [userExpense1, userExpense2]],
      ]),
      commonExpenses: [commonExpense],
    });
    const deleted = makeBatchPayload(2);
    jest.mocked(deleteExpenses).mockResolvedValue(deleted);

    const result = await useStore
      .getState()
      .deleteExpenses(["exp-1", "common-1"]);

    expect(deleteExpenses).toHaveBeenCalledWith(["exp-1", "common-1"]);
    expect(result).toEqual(deleted);
    expect(useStore.getState().userExpenses.get(1)).toEqual([userExpense2]);
    expect(useStore.getState().commonExpenses).toEqual([]);
  });

  it("cleans up unplanned picked and common expenses", async () => {
    const picked = [
      makeExpense({ id: "picked-1", userId: 3, isPlanned: false }),
      makeExpense({ id: "picked-2", userId: 3, isPlanned: true }),
    ];
    const common = [
      makeExpense({ id: "common-1", userId: null, isPlanned: false }),
      makeExpense({ id: "common-2", userId: null, isPlanned: true }),
    ];
    useStore.setState({
      userExpensesPicked: new Map<number, Expense[]>([[3, picked]]),
      commonExpenses: common,
    });
    const deleted = makeBatchPayload(2);
    jest.mocked(deleteExpenses).mockResolvedValue(deleted);

    await useStore.getState().cleanupExpenses();

    expect(deleteExpenses).toHaveBeenCalledWith(["picked-1", "common-1"]);
    expect(useStore.getState().userExpensesPicked.get(3)).toEqual([picked[1]]);
    expect(useStore.getState().commonExpenses).toEqual([common[1]]);
    expect(useStore.getState().loading).toBe(false);
  });

  it("stores selected user expenses and resets them", () => {
    const expense = makeExpense({ id: "picked-1", userId: 10 });

    useStore.getState().pickUserExpenses(10, [expense]);
    useStore.getState().setQuota(10, 1500);
    useStore.getState().setComment("monthly review");

    expect(useStore.getState().userExpensesPicked.get(10)).toEqual([expense]);
    expect(useStore.getState().userQuota.get(10)).toBe(1500);
    expect(useStore.getState().comment).toBe("monthly review");

    useStore.getState().resetUserExpensesPicked();
    expect(useStore.getState().userExpensesPicked.size).toBe(0);
  });

  it("stores and updates quota and comment values", () => {
    useStore.getState().setQuota(11, 2200);
    useStore.getState().setComment("final review");

    expect(useStore.getState().userQuota.get(11)).toBe(2200);
    expect(useStore.getState().comment).toBe("final review");
  });

  it("keeps the state in sync when the delete call fails", async () => {
    const userExpense = makeExpense({ id: "exp-1", userId: 4 });
    const commonExpense = makeExpense({ id: "common-1", userId: null });
    useStore.setState({
      userExpenses: new Map<number, Expense[]>([[4, [userExpense]]]),
      commonExpenses: [commonExpense],
    });
    jest.mocked(deleteExpenses).mockResolvedValue(null);

    const result = await useStore
      .getState()
      .deleteExpenses(["exp-1", "common-1"]);

    expect(result).toBeNull();
    expect(useStore.getState().userExpenses.get(4)).toEqual([userExpense]);
    expect(useStore.getState().commonExpenses).toEqual([commonExpense]);
    expect(useStore.getState().loading).toBe(false);
  });

  it("returns null when cleanup deletes nothing", async () => {
    useStore.setState({
      userExpensesPicked: new Map<number, Expense[]>([
        [7, [makeExpense({ id: "exp-7", userId: 7, isPlanned: true })]],
      ]),
      commonExpenses: [
        makeExpense({ id: "common-7", userId: null, isPlanned: true }),
      ],
    });
    jest.mocked(deleteExpenses).mockResolvedValue(null);

    const result = await useStore.getState().cleanupExpenses();

    expect(result).toBeNull();
    expect(useStore.getState().loading).toBe(false);
  });

  it("does not refetch common expenses when they are already in state", async () => {
    const commonExpenses = [makeExpense({ id: "common-1", userId: null })];
    useStore.setState({ commonExpenses });

    await useStore.getState().fetchExpenses(null);

    expect(getExpenses).not.toHaveBeenCalled();
  });

  it("does not refetch user expenses when they are already in state", async () => {
    const expenses = [makeExpense({ id: "exp-1", userId: 9 })];
    useStore.setState({
      userExpenses: new Map<number, Expense[]>([[9, expenses]]),
    });

    await useStore.getState().fetchExpenses(9);

    expect(getExpenses).not.toHaveBeenCalled();
  });

  it("does not refetch salary when it is already in state", async () => {
    useStore.setState({ userSalary: new Map<number, number>([[8, 900]]) });

    await useStore.getState().fetchSalary(8);

    expect(getUserSalary).not.toHaveBeenCalled();
  });

  it("does not refetch users when they are already in state", async () => {
    useStore.setState({ users: [makeUser({ id: 12 })] });

    await useStore.getState().fetchUsers();

    expect(getUsers).not.toHaveBeenCalled();
  });
});
