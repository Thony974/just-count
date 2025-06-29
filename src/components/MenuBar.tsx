"use client";

import { useRouter } from "next/navigation";

import { Menubar } from "primereact/menubar";

export default function () {
  const router = useRouter();

  return (
    <Menubar
      model={[
        { label: "Mes dépenses", command: () => router.push("/") },
        {
          label: "Dépenses conjoint",
          command: () => router.push("/partnerExpenses"),
        },
        {
          label: "Dépenses communes",
          command: () => router.push("/monthlyFees"),
        },
        { label: "Comptabilité", command: () => router.push("/accounting") },
      ]}
    />
  );
}
