"use client";

import { use, useEffect, useState } from "react";

import { PickList } from "primereact/picklist";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

import { getExpenses } from "@database/crudExpense";
import { formatCurrency, formatDate } from "@/utils/utils";
import { ExpenseItem } from "@/utils/types";

import styles from "./page.module.css";

export default function () {
  const [myExpensesSource, setMyExpensesSource] = useState<ExpenseItem[]>([]);
  const [myExpensesTarget, setMyExpensesTarget] = useState<ExpenseItem[]>([]);
  const [myExpensesCount, setMyExpensesCount] = useState({
    sourceAmount: 0,
    targetAmount: 0,
  });

  const [partnerExpensesSource, setPartnerExpensesSource] = useState<
    ExpenseItem[]
  >([]);
  const [partnerExpensesTarget, setPartnerExpensesTarget] = useState<
    ExpenseItem[]
  >([]);
  const [partnerExpensesCount, setPartnerExpensesCount] = useState({
    sourceAmount: 0,
    targetAmount: 0,
  });

  const fetchExpenses = async () => {
    let result = await getExpenses({ userId: 1 }); // Assuming userId 1 for this example
    if (result.length) {
      setMyExpensesSource(
        result.map(({ id, title, amount, creationDate }) => ({
          id,
          title,
          amount,
          creationDate,
        }))
      );
    }

    result = await getExpenses({ userId: 2 }); // Assuming userId 2 for this example
    if (result.length) {
      setPartnerExpensesSource(
        result.map(({ id, title, amount, creationDate }) => ({
          id,
          title,
          amount,
          creationDate,
        }))
      );
    }
  };

  const itemTemplate = (item: ExpenseItem) => {
    return (
      <div className={styles.pickListItem}>
        <div>{item.title}</div>
        <div>{formatCurrency(item.amount)}</div>
        <div>{formatDate(item.creationDate)}</div>
      </div>
    );
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    setMyExpensesCount({
      sourceAmount: myExpensesSource.reduce(
        (acc, item) => acc + item.amount,
        0
      ),
      targetAmount: myExpensesTarget.reduce(
        (acc, item) => acc + item.amount,
        0
      ),
    });
  }, [myExpensesSource, myExpensesTarget]);

  useEffect(() => {
    setPartnerExpensesCount({
      sourceAmount: partnerExpensesSource.reduce(
        (acc, item) => acc + item.amount,
        0
      ),
      targetAmount: partnerExpensesTarget.reduce(
        (acc, item) => acc + item.amount,
        0
      ),
    });
  }, [partnerExpensesSource, partnerExpensesTarget]);

  return (
    <div>
      <div className={styles.salaryInputsContainer}>
        <div className={styles.salaryInputs}>
          <label htmlFor="mySalary">Mon salaire</label>
          <InputNumber
            //value={mySalary}
            //onValueChange={(e) => setMySalary(e.value ?? null)}
            inputId="mySalary"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
          />
        </div>
      </div>
      <PickList
        dataKey="id"
        sourceHeader={`Dépenses Conjoint ${myExpensesCount.sourceAmount}€`}
        targetHeader={`Dépenses Conjoint sélection ${myExpensesCount.targetAmount}€`}
        showTargetControls={false}
        showSourceControls={false}
        sourceStyle={{ height: "20vh" }}
        targetStyle={{ height: "20vh" }}
        source={myExpensesSource}
        target={myExpensesTarget}
        itemTemplate={itemTemplate}
        onChange={(e) => {
          setMyExpensesSource(e.source);
          setMyExpensesTarget(e.target);
        }}
      />
      <div className={styles.salaryInputsContainer}>
        <div className={styles.salaryInputs}>
          <label htmlFor="partnerSalary">Salaire conjoint</label>
          <InputNumber
            inputId="partnerSalary"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
          />
        </div>
      </div>
      <PickList
        dataKey="id"
        sourceHeader={`Dépenses Conjoint ${partnerExpensesCount.sourceAmount}€`}
        targetHeader={`Dépenses Conjoint sélection ${partnerExpensesCount.targetAmount}€`}
        showTargetControls={false}
        showSourceControls={false}
        sourceStyle={{ height: "20vh" }}
        targetStyle={{ height: "20vh" }}
        source={partnerExpensesSource}
        target={partnerExpensesTarget}
        itemTemplate={itemTemplate}
        onChange={(e) => {
          setPartnerExpensesSource(e.source);
          setPartnerExpensesTarget(e.target);
        }}
      />
      <div className={styles.submitButtonContainer}>
        <Button label={"Terminé"} icon="pi pi-check" />
      </div>
    </div>
  );
}
