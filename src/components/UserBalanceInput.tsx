import { InputNumber } from "primereact/inputnumber";

import styles from "./userBalanceInput.module.css";

export interface UserBalanceProps {
  salary: number;
  salaryLabel: string;
  quota: number;
  quotaLabel: string;
  onSalaryChanged: (salary: number) => void;
}

export default function UserBalanceInput({
  salary,
  salaryLabel,
  quota,
  quotaLabel,
  onSalaryChanged,
}: UserBalanceProps) {
  return (
    <div className={styles.salaryInputsContainer}>
      <div className={styles.salaryInputs}>
        <div className={styles.inputContent}>
          <label htmlFor="salary">{salaryLabel}</label>
          <InputNumber
            placeholder="0,00 €"
            inputId="salary"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
            value={salary}
            onValueChange={(e) => onSalaryChanged(e.value ?? 0)}
          />
        </div>
        <div className={styles.inputContent}>
          <label htmlFor="quota" className={styles.textAlignRight}>
            {quotaLabel}
          </label>
          <InputNumber
            disabled
            placeholder="0,00 €"
            inputId="quota"
            mode="currency"
            currency="EUR"
            locale="fr-FR"
            value={quota}
          />
        </div>
      </div>
    </div>
  );
}
