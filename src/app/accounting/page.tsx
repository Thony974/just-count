"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "primereact/button";

import { getExpenses } from "@database/crudExpense";
import {
  updateUserSalary,
  getUserSalary,
} from "@/services/database/crudSalary";
import { computeExpensesAmount, computeQuota } from "@/utils/utils";
import { ExpenseItem } from "@/utils/types";
import UserBalanceInput from "@/components/UserBalanceInput";
import ExpensesPickList from "@components/ExpensesPickList";

import styles from "./page.module.css";

export default function () {
  const [mySalary, setMySalary] = useState(0);
  const [partnerSalary, setPartnerSalary] = useState(0);

  const [myQuota, setMyQuota] = useState(0);
  const [partnerQuota, setPartnerQuota] = useState(0);

  const [myExpenses, setMyExpenses] = useState<ExpenseItem[]>([]);
  const [partnerExpenses, setPartnerExpenses] = useState<ExpenseItem[]>([]);

  const [myTotalExpensesSelection, setMyTotalExpensesSelection] = useState(0);
  const [partnerTotalExpensesSelection, setPartnerTotalExpensesSelection] =
    useState(0);

  const [commonExpenses, setCommonExpenses] = useState<ExpenseItem[]>([]);

  const fetchingData = useRef(true);

  const fetchData = async () => {
    let salary = await getUserSalary({ userId: 1 }); // Assuming userId 1 for this example
    if (typeof salary === "number") setMySalary(salary); // FIXME

    salary = await getUserSalary({ userId: 2 }); // Assuming userId 2 for this example
    if (typeof salary === "number") setPartnerSalary(salary); // FIXME

    let expenses = await getExpenses({ userId: 1 }); // Assuming userId 1 for this example
    if (expenses.length) {
      setMyExpenses(
        expenses.map(({ id, title, amount, creationDate }) => ({
          id,
          title,
          amount,
          creationDate,
        }))
      );
    }

    expenses = await getExpenses({ userId: 2 }); // Assuming userId 2 for this example
    if (expenses.length) {
      setPartnerExpenses(
        expenses.map(({ id, title, amount, creationDate }) => ({
          id,
          title,
          amount,
          creationDate,
        }))
      );
    }

    expenses = await getExpenses({ userId: undefined });
    if (expenses.length) {
      setCommonExpenses(
        expenses.map(({ id, title, amount, creationDate }) => ({
          id,
          title,
          amount,
          creationDate,
        }))
      );
    }

    fetchingData.current = false;
  };

  const onMySalaryChanged = (salary: number) => {
    setMySalary(salary);
  };

  const onPartnerSalaryChanged = (salary: number) => {
    setPartnerSalary(salary);
  };

  const onMyExpensesSelectionChanged = (
    _: ExpenseItem[],
    target: ExpenseItem[]
  ) => {
    const expenses = computeExpensesAmount(target);
    setMyTotalExpensesSelection(expenses);
  };

  const onPartnerExpensesSelectionChanged = (
    _: ExpenseItem[],
    target: ExpenseItem[]
  ) => {
    const expenses = computeExpensesAmount(target);
    setPartnerTotalExpensesSelection(expenses);
  };

  const commonExpensesAmount = useMemo(() => {
    return computeExpensesAmount(commonExpenses);
  }, [commonExpenses]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (fetchingData.current) return;
    updateUserSalary({ userId: 1, amount: mySalary }); // Assuming userId 1 for this example
  }, [mySalary]);

  useEffect(() => {
    if (fetchingData.current) return;
    updateUserSalary({ userId: 2, amount: partnerSalary }); // Assuming userId 2 for this example
  }, [partnerSalary]);

  useEffect(() => {
    const result = computeQuota({
      mySalary: mySalary,
      partnerSalary: partnerSalary,
      myExpenses: myTotalExpensesSelection,
      partnerExpenses: partnerTotalExpensesSelection,
      commonExpenses: commonExpensesAmount,
    });

    setMyQuota(result.myQuota);
    setPartnerQuota(result.partnerQuota);
  }, [
    mySalary,
    partnerSalary,
    myTotalExpensesSelection,
    partnerTotalExpensesSelection,
    commonExpenses,
  ]);

  return (
    <>
      <UserBalanceInput
        salary={mySalary}
        salaryLabel={"Mon salaire"}
        quota={myQuota}
        quotaLabel={"Ma quote part"}
        onSalaryChanged={onMySalaryChanged}
      />
      <ExpensesPickList
        expensesInput={myExpenses}
        onSelectionChanged={onMyExpensesSelectionChanged}
      />

      <UserBalanceInput
        salary={partnerSalary}
        salaryLabel={"Salaire conjoint"}
        quota={partnerQuota}
        quotaLabel={"Quote part conjoint"}
        onSalaryChanged={onPartnerSalaryChanged}
      />
      <ExpensesPickList
        expensesInput={partnerExpenses}
        onSelectionChanged={onPartnerExpensesSelectionChanged}
      />

      <div className={styles.submitButtonContainer}>
        <Button label={"Terminé"} icon="pi pi-check" />
      </div>
    </>
  );
}
