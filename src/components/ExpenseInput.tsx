"use client";

import { useRef, useState } from "react";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

import { Expense } from "@prisma/client";

import useStore from "@/services/statemanager/store";

import styles from "./expenseInput.module.css";

export interface ExpenseInputProps {
  userId?: number;
  toDeleteSelection?: Expense[];
  onSelectionDeleted?: (ids: string[]) => void;
}

export default function ExpenseInput({
  userId,
  toDeleteSelection,
  onSelectionDeleted,
}: ExpenseInputProps) {
  const addExpense = useStore((state) => state.addExpense);
  const deleteExpenses = useStore((state) => state.deleteExpenses);

  const formRef = useRef<HTMLFormElement>(null);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: 0.0,
  });

  const addNewExpense = async () => {
    const { title, amount } = newExpense;
    if (!newExpense.title.length) {
      console.error("New expense has no title name");
      return;
    }

    await addExpense({ title, amount, userId: userId ?? null });
    cleanup();
  };

  const deleteSelectedExpenses = async () => {
    if (!toDeleteSelection?.length) return;
    const ids = toDeleteSelection.map((e) => e.id);
    const result = await deleteExpenses(ids);
    if (result && onSelectionDeleted) onSelectionDeleted(ids);
  };

  const cleanup = () => {
    formRef.current?.reset();
    setNewExpense({ title: "", amount: 0.0 });
  };

  return (
    <form
      ref={formRef}
      className={styles.addExpenseContainer}
      action={addNewExpense}
    >
      <InputText
        className={styles.expenseInputItem}
        name="title"
        placeholder="Nom"
        onChange={(e) =>
          setNewExpense({ ...newExpense, title: e.target.value })
        }
        required
      />
      <InputNumber
        className={styles.expenseInputItem}
        name="amount"
        placeholder="0,00 €"
        mode="currency"
        currency="EUR"
        locale="fr-FR"
        onChange={(e) =>
          setNewExpense({ ...newExpense, amount: e.value ?? 0.0 })
        }
        required
      />
      <Button label={"Ajouter"} icon="pi pi-plus" />
      <Button
        style={{ visibility: toDeleteSelection?.length ? "initial" : "hidden" }}
        label={"Supprimer selection"}
        icon="pi pi-trash"
        severity="danger"
        onClick={deleteSelectedExpenses}
      />
    </form>
  );
}
