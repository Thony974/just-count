"use client";

import ExpensesPage from "@components/ExpensesPage";

export default function Home() {
  return (
    <ExpensesPage userId={2} /> // TODO: Assuming a static user ID for now
  );
}
