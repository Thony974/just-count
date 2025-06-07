import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import ExpensesPage from "@/components/ExpensesPage";

import styles from "./page.module.css";

export default function () {
  // Fake data for monthly fees
  const groceryShopping = [
    {
      name: "Courses",
      amount: "400,00 €",
      category: "",
    },
    {
      name: "Occasionnel",
      amount: "250,00 €",
      category: "",
    },
    {
      name: "Rodin",
      amount: "150,00 €",
      category: "",
    },
    {
      name: "Total",
      amount: "1000, 00 €",
      category: "",
    },
  ];

  const subscriptions = [
    {
      name: "Electricité",
      amount: "50,00 €",
      category: "",
    },
    {
      name: "Abonnement internet",
      amount: "30,00 €",
      category: "",
    },
    {
      name: "Total",
      amount: "80, 00 €",
      category: "",
    },
  ];

  const leasures = [
    {
      name: "Total",
      amount: "1000, 00 €",
      category: "",
    },
  ];

  const all = [...groceryShopping, ...subscriptions, ...leasures];

  return (
    <div className={styles.page}>
      <TabView>
        <TabPanel header="Tous">
          <ExpensesPage userId={undefined} />
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
