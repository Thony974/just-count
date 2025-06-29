"use client";

import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { Button } from "primereact/button";

import { Expense } from "@prisma/client";
import useStore from "@/services/statemanager/store";
import { computeQuota } from "@/utils/utils";
import UserBalanceInput from "@/components/UserBalanceInput";
import ExpensesPickList from "@components/ExpensesPickList";
import LoadingComponent from "@/components/LoadingComponent";

import styles from "./page.module.css";

export default function () {
  const router = useRouter();

  const users = useStore((state) => state.users);
  const userSalary = useStore((state) => state.userSalary);
  const userQuota = useStore((state) => state.userQuota);
  const userExpenses = useStore((state) => state.userExpenses);
  const commonExpenses = useStore((state) => state.commonExpenses);
  const userExpensesPicked = useStore((state) => state.userExpensesPicked);

  const fetchUsers = useStore((state) => state.fetchUsers);
  const fetchSalary = useStore((state) => state.fetchSalary);
  const fetchExpenses = useStore((state) => state.fetchExpenses);
  const updateSalary = useStore((state) => state.updateSalary);
  const pickUserExpenses = useStore((state) => state.pickUserExpenses);
  const resetUserExpensesPicked = useStore(
    (state) => state.resetUserExpensesPicked
  );
  const setQuota = useStore((state) => state.setQuota);

  const fetchingData = useRef(false);

  const fetchData = async () => {
    fetchingData.current = true;

    // TODO: Fix userId hardcoding
    await fetchUsers();
    await fetchSalary(1);
    await fetchSalary(2);
    await fetchExpenses(1);
    await fetchExpenses(2);
    await fetchExpenses(null);

    resetUserExpensesPicked();

    fetchingData.current = false;
  };

  const onSalaryChanged = (userId: number, amount: number) => {
    updateSalary({ userId, amount }); // Assuming userId 1 for this example
  };

  const onExpensesPicked = (userId: number, expenses: Expense[]) => {
    pickUserExpenses(userId, expenses); // Assuming userId 1 for this example
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (fetchingData.current) return;

    const userAccounting = users.map(({ id }) => ({
      userId: id,
      salary: userSalary.get(id) ?? 0,
      expenses: userExpensesPicked.get(id) ?? [],
    }));

    const result = computeQuota({
      userAccounting,
      commonExpenses: commonExpenses,
    });

    result.forEach(({ userId, quota }) => {
      setQuota(userId, quota);
    });
  }, [userSalary, userExpensesPicked, commonExpenses]);

  return fetchingData.current ? (
    <LoadingComponent />
  ) : (
    <>
      {users.map(({ id, name }) => (
        <div key={`userPickList-${id}`}>
          <UserBalanceInput
            salary={userSalary.get(id) ?? 0}
            salaryLabel={`Salaire ${name}`}
            quota={userQuota.get(id) ?? 0}
            quotaLabel={`Quote part ${name}`}
            onSalaryChanged={(salary) => onSalaryChanged(id, salary)}
          />
          <ExpensesPickList
            expensesInput={userExpenses.get(id) ?? []}
            onSelectionChanged={(_, target) => onExpensesPicked(id, target)}
          />
        </div>
      ))}
      <div className={styles.submitButtonContainer}>
        <Button
          label={"Terminé"}
          icon="pi pi-check"
          onClick={() => router.push("/report")}
        />
      </div>
    </>
  );
}
