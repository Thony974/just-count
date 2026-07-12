"use client";

import { TabView, TabPanel } from "primereact/tabview";

import ExpensesPage from "@/components/ExpensesPage";

import styles from "./page.module.css";

export default function MonthlyFees() {
  return (
    <div className={styles.page}>
      <TabView>
        <TabPanel header="Tous">
          <ExpensesPage />
        </TabPanel>
        <TabPanel header="Courses">
          <ExpensesPage />
        </TabPanel>
        <TabPanel header="Abonnements">
          <ExpensesPage />
        </TabPanel>
        <TabPanel header="Loisirs">
          <ExpensesPage />
        </TabPanel>
      </TabView>
    </div>
  );
}
