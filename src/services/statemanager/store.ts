import { create } from "zustand";

import { Expense, Salary, User } from "@prisma/client";

import { getUsers } from "@/services/database/crudUser";
import {
  getUserSalary,
  updateUserSalary,
} from "@/services/database/crudSalary";
import { createExpense, getExpenses } from "@/services/database/crudExpense";

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
  fetchSalary: async (userId: number) => {
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
  fetchExpenses: async (userId: number | null) => {
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
  pickUserExpenses: (userId: number, expenses: Expense[]) => {
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
