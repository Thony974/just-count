import { useEffect, useState } from "react";

import { PickList, PickListChangeEvent } from "primereact/picklist";

import { ExpenseItem } from "@/utils/types";
import {
  computeExpensesAmount,
  formatCurrency,
  formatDate,
} from "@/utils/utils";

import styles from "./expensesPickList.module.css";

export interface ExpensesPickListProps {
  expensesInput: ExpenseItem[];
  onSelectionChanged: (source: ExpenseItem[], target: ExpenseItem[]) => void;
}

export default function ExpensesPickList({
  expensesInput,
  onSelectionChanged,
}: ExpensesPickListProps) {
  const [expensesSource, setExpensesSource] = useState<ExpenseItem[]>([]);
  const [expensesTarget, setExpensesTarget] = useState<ExpenseItem[]>([]);
  const [totalExpensesAmount, setTotalExpensesAmount] = useState({
    source: 0,
    target: 0,
  });

  const onDistributionChanged = (e: PickListChangeEvent) => {
    const sourceList = e.source as ExpenseItem[];
    const targetList = e.target as ExpenseItem[];

    setExpensesSource(sourceList);
    setExpensesTarget(targetList);
    setTotalExpensesAmount({
      source: computeExpensesAmount(sourceList),
      target: computeExpensesAmount(targetList),
    });

    onSelectionChanged(sourceList, targetList);
  };

  useEffect(() => {
    setTotalExpensesAmount({
      source: computeExpensesAmount(expensesInput),
      target: 0,
    });
    setExpensesSource(expensesInput);
  }, [expensesInput]);

  const itemTemplate = (item: ExpenseItem) => {
    return (
      <div className={styles.pickListItem}>
        <div>{item.title}</div>
        <div>{formatCurrency(item.amount)}</div>
        <div>{formatDate(item.creationDate)}</div>
      </div>
    );
  };

  return (
    <PickList
      dataKey="id"
      sourceHeader={`Dépenses ${totalExpensesAmount.source}€`}
      targetHeader={`Dépenses sélectionnées ${totalExpensesAmount.target}€`}
      showTargetControls={false}
      showSourceControls={false}
      sourceStyle={{ height: "20vh" }}
      targetStyle={{ height: "20vh" }}
      source={expensesSource}
      target={expensesTarget}
      itemTemplate={itemTemplate}
      onChange={onDistributionChanged}
    />
  );
}
