"use client";

import { use, useEffect, useState } from "react";

import { pdf } from "@react-pdf/renderer";

import { useRouter } from "next/navigation";

import LoadingComponent from "@/components/LoadingComponent";
import ReportTemplate from "@/components/ReportTemplate";
import useStore from "@/services/statemanager/store";

import { Button } from "primereact/button";

import styles from "./page.module.css";

export default function Report() {
  const router = useRouter();

  const cleanup = useStore((state) => state.cleanupUnplannedExpenses);

  const [doc, setDoc] = useState("");

  const renderDocument = async () => {
    try {
      const doc = pdf(<ReportTemplate />);
      const blob = await doc.toBlob();
      setDoc(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error rendering pdf:", error);
    }
  };

  useEffect(() => {
    renderDocument();
  }, []);

  return (
    <div className={styles.page}>
      {doc ? (
        <div className={styles.pdfContainer}>
          <iframe src={doc} width={"100%"} height={"690px"} />
          <Button
            label={"Terminer"}
            icon="pi pi-check"
            onClick={() => {
              cleanup();
              router.push("/");
            }}
          />
        </div>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
}
