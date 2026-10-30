"use client";

import { useRouter } from "next/navigation";

import { Menubar } from "primereact/menubar";

export default function MenuBar() {
  const router = useRouter();

  return (
    <Menubar
      model={[
        { label: "Dépenses Romy", command: () => router.push("/") },
        {
          label: "Dépenses Anthony",
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
