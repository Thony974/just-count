"use client";

import { useEffect, useState } from "react";

import { pdf } from "@react-pdf/renderer";

import { ReportProps } from "@/components/ReportTemplate";
import ReportTemplate from "@/components/ReportTemplate";

import styles from "./page.module.css";

// TO REMOVE: Sample data for demonstration purposes
import { accountingParametersSample } from "./tmpData";

export default function (props: ReportProps) {
  const [doc, setDoc] = useState("");

  const renderDocument = async () => {
    const doc = pdf(
      /* TODO: Replace with actual props */
      <ReportTemplate {...accountingParametersSample} />
    );
    const blob = await doc.toBlob();
    setDoc(URL.createObjectURL(blob));
  };

  useEffect(() => {
    renderDocument();
  }, []);

  return (
    <div className={styles.page}>
      {doc ? <iframe src={doc} width={"100%"} height={"700px"} /> : <></>}
    </div>
  );
}
