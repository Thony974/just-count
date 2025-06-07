"use client";

import { useRef, useState } from "react";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

import { createExpense } from "@database/crudExpense";

import styles from "./expenseInput.module.css";

export interface ExpenseInputProps {
  userId?: number;
  onNewExpenseAdded: () => void;
}

export default function ExpenseInput({
  userId,
  onNewExpenseAdded,
}: ExpenseInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: 0.0,
  });

  const addExpense = async () => {
    if (!newExpense.title.length) {
      console.error("New expense has no title name");
      return;
    }

    const result = await createExpense({
      title: newExpense.title,
      amount: newExpense.amount,
      userId,
    });

    if (result) onNewExpenseAdded();

    cleanup();
  };

  const cleanup = () => {
    formRef.current?.reset();
    setNewExpense({ title: "", amount: 0.0 });
  };

  return (
    <form
      ref={formRef}
      className={styles.addExpenseContainer}
      action={addExpense}
    >
      <InputText
        name="title"
        placeholder="Nom"
        onChange={(e) =>
          setNewExpense({ ...newExpense, title: e.target.value })
        }
        required
      />
      <InputNumber
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
    </form>
  );
}
