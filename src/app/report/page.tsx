"use client";

import { useEffect, useState } from "react";

import { pdf } from "@react-pdf/renderer";

import LoadingComponent from "@/components/LoadingComponent";
import ReportTemplate from "@/components/ReportTemplate";

import styles from "./page.module.css";

export default function () {
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
        <iframe src={doc} width={"100%"} height={"700px"} />
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
}
