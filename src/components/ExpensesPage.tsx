"use client";

import { useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Expense } from "@prisma/client";

import useStore from "@/services/statemanager/store";
import { formatCurrency, formatDate } from "@utils/utils";
import LoadingComponent from "@/components/LoadingComponent";

import ExpenseInput from "./ExpenseInput";

import styles from "./expensesPage.module.css";

export default function ExpensesPage({ userId }: { userId?: number }) {
  const expenses = userId
    ? useStore((state) => state.userExpenses.get(userId))
    : useStore((state) => state.commonExpenses);

  const loading = useStore((state) => state.loading);

  const fetchExpenses = useStore((state) => state.fetchExpenses);

  useEffect(() => {
    fetchExpenses(userId ?? null);
  }, []);

  return (
    <div className={styles.page}>
      <ExpenseInput userId={userId} />
      {loading ? (
        <LoadingComponent />
      ) : (
        <DataTable value={expenses} className={styles.dataTable}>
          <Column field="title" header="Nom" />
          <Column
            field="amount"
            header="Montant"
            body={({ amount }: Expense) => formatCurrency(amount)}
          />
          <Column
            field="date"
            header="Date"
            body={({ creationDate }: Expense) => formatDate(creationDate)}
          />
        </DataTable>
      )}
    </div>
  );
}
