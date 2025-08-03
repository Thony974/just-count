import { create } from "zustand";

import { Expense, Prisma, Salary, User } from "@prisma/client";

import { getUsers } from "@/services/database/crudUser";
import {
  getUserSalary,
  updateUserSalary,
} from "@/services/database/crudSalary";
import {
  createExpense,
  deleteExpenses,
  getExpenses,
  updateExpense,
} from "@/services/database/crudExpense";

interface StoreState {
  loading: boolean;
  users: User[];
  userSalary: Map<number, number>;
  userQuota: Map<number, number>;
  userExpenses: Map<number, Expense[]>;
  userExpensesPicked: Map<number, Expense[]>;
  commonExpenses: Expense[];
  fetchUsers: () => Promise<void>;
  updateSalary: (salary: Pick<Salary, "userId" | "amount">) => Promise<void>;
  fetchSalary: (userId: number) => Promise<void>;
  fetchExpenses: (userId: number | null) => Promise<void>;
  addExpense: (
    expense: Pick<Expense, "title" | "amount" | "userId">
  ) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<Expense | null>;
  deleteExpenses: (id: string[]) => Promise<Prisma.BatchPayload | null>;
  pickUserExpenses: (userId: number, expenses: Expense[]) => void;
  resetUserExpensesPicked: () => void;
  setQuota: (userId: number, quota: number) => void;
}

const useStore = create<StoreState>((set, get) => ({
  loading: false,
  users: [],
  userSalary: new Map(),
  userQuota: new Map(),
  userExpenses: new Map(),
  userExpensesPicked: new Map(),
  commonExpenses: [],
  fetchUsers: async () => {
    // Store users already fetched
    const state = get();
    if (state.users.length) return;

    set({ loading: true });
    const users = await getUsers();
    set(() => ({
      users: users,
      loading: false,
    }));
  },
  updateSalary: async ({ userId, amount }) => {
    set({ loading: true });
    await updateUserSalary({ userId, amount });
    set((state) => ({
      userSalary: new Map(state.userSalary).set(userId, amount),
      loading: false,
    }));
  },
  fetchSalary: async (userId) => {
    // Store salary already fetched
    const state = get();
    if (state.userSalary.has(userId)) return;

    set({ loading: true });
    const salary = await getUserSalary({ userId });
    set((state) => ({
      userSalary: new Map(state.userSalary).set(userId, salary),
      loading: false,
    }));
  },
  fetchExpenses: async (userId) => {
    const state = get();

    // Store expenses already fetched
    if (userId && state.userExpenses.has(userId)) return;
    if (!userId && state.commonExpenses.length) return;

    set({ loading: true });
    const expenses = await getExpenses({ userId });
    if (userId) {
      set((state) => ({
        userExpenses: new Map(state.userExpenses).set(userId, expenses),
        loading: false,
      }));
    } else {
      set(() => ({
        commonExpenses: expenses,
        loading: false,
      }));
    }
  },
  addExpense: async ({ title, amount, userId }) => {
    set({ loading: true });
    const expense = await createExpense({ title, amount, userId });
    if (!expense) {
      set({ loading: false });
      return;
    }

    if (userId) {
      set((state) => ({
        userExpenses: new Map(state.userExpenses).set(userId, [
          ...(state.userExpenses.get(userId) ?? []),
          expense,
        ]),
        loading: false,
      }));
    } else {
      set((state) => ({
        commonExpenses: [...state.commonExpenses, expense],
        loading: false,
      }));
    }
  },
  updateExpense: async (expense) => {
    set({ loading: true });
    const updatedExpense = await updateExpense(expense);
    if (!updatedExpense) {
      set({ loading: false });
      return null;
    }

    set((state) => {
      if (expense.userId) {
        const userExpenses = new Map(state.userExpenses);
        const expenses = userExpenses.get(expense.userId) ?? [];
        const index = expenses.findIndex((e) => e.id === expense.id);
        if (index !== -1) {
          expenses[index] = updatedExpense;
          userExpenses.set(expense.userId, expenses);
        }
        return { userExpenses, loading: false };
      } else {
        const commonExpenses = state.commonExpenses.map((commonExpense) =>
          commonExpense.id === expense.id ? updatedExpense : commonExpense
        );
        console.log("Updated common expenses:", commonExpenses);
        return { commonExpenses, loading: false };
      }
    });

    return updatedExpense;
  },
  deleteExpenses: async (ids) => {
    set({ loading: true });
    const deletedExpenses = await deleteExpenses(ids);
    if (!deletedExpenses) {
      set({ loading: false });
      return null;
    }

    set((state) => {
      const userExpenses = new Map(state.userExpenses);
      state.userExpenses.forEach((expenses, userId) => {
        userExpenses.set(
          userId,
          expenses.filter((expense) => !ids.includes(expense.id))
        );
      });
      const commonExpenses = state.commonExpenses.filter(
        (expense) => !ids.includes(expense.id)
      );
      return { userExpenses, commonExpenses, loading: false };
    });

    return deletedExpenses;
  },
  pickUserExpenses: (userId, expenses) => {
    set((state) => ({
      userExpensesPicked: new Map(state.userExpensesPicked).set(
        userId,
        expenses
      ),
    }));
  },
  resetUserExpensesPicked: () => {
    set({ userExpensesPicked: new Map<number, Expense[]>() });
  },
  setQuota: (userId, quota) => {
    set((state) => ({
      userQuota: new Map(state.userQuota).set(userId, quota),
    }));
  },
}));

export default useStore;
