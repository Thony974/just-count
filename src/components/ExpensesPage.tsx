"use client";

import { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

import { Expense } from "@prisma/client";

import useStore from "@/services/statemanager/store";
import { formatCurrency, formatDate } from "@utils/utils";
import LoadingComponent from "@/components/LoadingComponent";

import ExpenseInput from "./ExpenseInput";

import styles from "./expensesPage.module.css";

export default function ExpensesPage({ userId }: { userId?: number }) {
  const [selection, setSelection] = useState<Expense[]>([]);

  const expenses = userId
    ? useStore((state) => state.userExpenses.get(userId))
    : useStore((state) => state.commonExpenses);

  const loading = useStore((state) => state.loading);

  const fetchExpenses = useStore((state) => state.fetchExpenses);
  const addExpense = useStore((state) => state.addExpense);
  const updateExpense = useStore((state) => state.updateExpense);
  const deleteExpenses = useStore((state) => state.deleteExpenses);

  useEffect(() => {
    fetchExpenses(userId ?? null);
  }, []);

  const textEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) =>
          options.editorCallback
            ? options.editorCallback(e.target.value)
            : undefined
        }
      />
    );
  };

  const priceEditor = (options: ColumnEditorOptions) => {
    return (
      <InputNumber
        mode="currency"
        currency="EUR"
        locale="fr-FR"
        value={options.value}
        onChange={(e) =>
          options.editorCallback ? options.editorCallback(e.value) : undefined
        }
      />
    );
  };

  return (
    <div className={styles.page}>
      <ExpenseInput
        userId={userId}
        toDeleteSelection={selection}
        onSelectionDeleted={() => setSelection([])}
      />
      {loading ? (
        <LoadingComponent />
      ) : (
        <DataTable
          value={expenses}
          className={styles.dataTable}
          selectionMode={"checkbox"}
          selection={selection}
          onSelectionChange={(e) => setSelection(e.value)}
          editMode="row"
          onRowEditComplete={(e) => {
            const updatedExpense = e.newData as Expense;
            updateExpense(updatedExpense);
          }}
        >
          <Column selectionMode="multiple" />
          <Column field="title" header="Nom" editor={textEditor} />
          <Column
            field="amount"
            header="Montant"
            editor={priceEditor}
            body={({ amount }: Expense) => formatCurrency(amount)}
          />
          <Column
            field="date"
            header="Date"
            body={({ creationDate }: Expense) => formatDate(creationDate)}
          />
          <Column rowEditor />
          <Column
            body={({ title, amount, userId }: Expense) => (
              <span
                className="pi pi-clone"
                onClick={() => addExpense({ title, amount, userId })}
              ></span>
            )}
          />
          <Column
            body={({ id }: Expense) => (
              <span
                className="pi pi-trash"
                onClick={() => deleteExpenses([id])}
              ></span>
            )}
          />
        </DataTable>
      )}
    </div>
  );
}
