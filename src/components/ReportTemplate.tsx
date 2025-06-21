import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from "@ag-media/react-pdf-table";

import {
  AccountingParameters,
  AccountingResults,
  ExpenseItem,
} from "@/utils/types";

import { styles } from "./reportTemplateStyle";

const TableExpenses = ({
  title,
  expenses,
}: {
  title: string;
  expenses: ExpenseItem[];
}) => (
  <View style={styles.section}>
    <Text>{title}</Text>
    <Table style={styles.table}>
      <TableHeader>
        <TableCell>Nom</TableCell>
        <TableCell>Montant</TableCell>
      </TableHeader>
      {expenses.map(({ title, amount }, index) => (
        <TableRow key={index}>
          <TableCell>{title}</TableCell>
          <TableCell>{amount}€</TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell>Total</TableCell>
        <TableCell style={styles.totalCell}>
          {expenses.reduce((acc, curr) => acc + curr.amount, 0)}€
        </TableCell>
      </TableRow>
    </Table>
  </View>
);

export interface ReportProps extends AccountingParameters, AccountingResults {}

export default function ({
  mySalary,
  partnerSalary,
  myExpenses,
  partnerExpenses,
  commonExpenses,
  myQuota,
  partnerQuota,
}: ReportProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Compte 06/2025</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.section}>
            <Text>{`Mon salaire: ${mySalary}€`}</Text>
          </View>
          <TableExpenses title="Mes Dépenses" expenses={myExpenses} />
        </View>
        <View style={styles.section}>
          <View style={styles.section}>
            <Text>{`Salaire conjoint: ${partnerSalary}€`}</Text>
          </View>
          <TableExpenses title="Dépenses conjoint" expenses={partnerExpenses} />
        </View>
        <View style={styles.section}>
          <TableExpenses title="Dépenses communes" expenses={commonExpenses} />
        </View>
        <View style={styles.quota}>
          <Text>{`Mon quota: ${myQuota}€`}</Text>
          <Text>{`Quota conjoint: ${partnerQuota}€`}</Text>
        </View>
      </Page>
    </Document>
  );
}
