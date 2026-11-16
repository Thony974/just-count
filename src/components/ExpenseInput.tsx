"use client";

import { useRef, useState } from "react";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { Expense } from "@database/prisma/generated/client";

import useStore from "@/services/statemanager/store";

import { StyledCurrencyInput } from "./StyledCurrencyInput";
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
  const titleInputRef = useRef<HTMLInputElement>(null);
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
    titleInputRef.current?.focus();
  };

  return (
    <form
      ref={formRef}
      className={styles.addExpenseContainer}
      action={addNewExpense}
    >
      <InputText
        ref={titleInputRef}
        className={styles.expenseInputItem}
        name="title"
        placeholder="Nom"
        onChange={(e) =>
          setNewExpense({ ...newExpense, title: e.target.value })
        }
        required
      />
      {/** InputNumber does not handle decimal input intuitively on some mobile browsers */}
      <StyledCurrencyInput
        className={styles.expenseInputItem}
        name="amount"
        onValueChange={(_, __, values) =>
          setNewExpense({ ...newExpense, amount: values?.float ?? 0.0 })
        }
        required
      />
      <Button
        className={styles.addExpenseAction}
        label={"Ajouter"}
        icon="pi pi-plus"
      />
      <Button
        className={styles.deleteSelectionAction}
        style={{ visibility: toDeleteSelection?.length ? "initial" : "hidden" }}
        label={"Supprimer selection"}
        icon="pi pi-trash"
        severity="danger"
        onClick={deleteSelectedExpenses}
      />
    </form>
  );
}
