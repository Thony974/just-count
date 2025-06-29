import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from "@ag-media/react-pdf-table";

import { Expense } from "@prisma/client";
import useStore from "@/services/statemanager/store";

import { styles } from "./reportTemplateStyle";

const TableExpenses = ({
  title,
  expenses,
}: {
  title: string;
  expenses: Expense[];
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

export default function () {
  const users = useStore((state) => state.users);
  const userSalary = useStore((state) => state.userSalary);
  const userQuota = useStore((state) => state.userQuota);
  const userExpensesPicked = useStore((state) => state.userExpensesPicked);
  const commonExpenses = useStore((state) => state.commonExpenses);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Compte ??/2025</Text>
        </View>
        {users.map(({ id, name }) => (
          <View key={`accounting-${id}`} style={styles.section}>
            <View style={styles.section}>
              <Text>{`Salaire ${name}: ${userSalary.get(id) ?? 0}€`}</Text>
            </View>
            <TableExpenses
              title={`Dépenses ${name}`}
              expenses={userExpensesPicked.get(id) ?? []}
            />
          </View>
        ))}
        {users.length ? (
          <View style={styles.section}>
            <TableExpenses
              title="Dépenses communes"
              expenses={commonExpenses}
            />
          </View>
        ) : null}
        <View style={styles.quota}>
          {users.map(({ id, name }) => (
            <Text key={`quota-${id}`}>{`Quota ${name}: ${
              userQuota.get(id) ? userQuota.get(id)?.toFixed(0) : 0
            }€`}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
