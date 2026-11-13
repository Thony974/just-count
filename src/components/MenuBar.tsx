"use client";

import { usePathname, useRouter } from "next/navigation";

import { Menubar } from "primereact/menubar";

export default function MenuBar() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      label: "Dépenses Romy",
      command: () => router.push("/"),
      path: "/",
    },
    {
      label: "Dépenses Anthony",
      command: () => router.push("/partnerExpenses"),
      path: "/partnerExpenses",
    },
    {
      label: "Dépenses communes",
      command: () => router.push("/monthlyFees"),
      path: "/monthlyFees",
    },
    {
      label: "Comptabilité",
      command: () => router.push("/accounting"),
      path: "/accounting",
    },
  ].map((item) => ({
    ...item,
    className: pathname === item.path ? "p-highlight" : undefined,
  }));

  return <Menubar model={items} />;
}
