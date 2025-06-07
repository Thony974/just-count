"use client";

import { useEffect, useRef, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { getExpenses } from "@database/crudExpense";
import { formatCurrency, formatDate } from "@utils/utils";
import { ExpenseItem } from "@/utils/types";

import ExpenseInput from "./ExpenseInput";

import styles from "./expensesPage.module.css";

export default function ExpensesPage({ userId }: { userId?: number }) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  const fetchExpenses = async () => {
    const result = await getExpenses({ userId });
    if (result.length) {
      setExpenses(
        result.map(({ id, title, amount, creationDate }) => ({
          id,
          title,
          amount,
          creationDate,
        }))
      );
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className={styles.page}>
      <ExpenseInput userId={userId} onNewExpenseAdded={fetchExpenses} />
      <DataTable value={expenses} className={styles.dataTable}>
        <Column field="title" header="Nom" />
        <Column
          field="amount"
          header="Montant"
          body={({ amount }: ExpenseItem) => formatCurrency(amount)}
        />
        <Column
          field="date"
          header="Date"
          body={({ creationDate }: ExpenseItem) => formatDate(creationDate)}
        />
      </DataTable>
    </div>
  );
}
