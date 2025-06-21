import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
  },
  section: {
    margin: 10,
  },
  table: {
    fontSize: 12,
  },
  totalCell: {
    display: "flex",
    justifyContent: "flex-end",
    fontWeight: "bold",
  },
  quota: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 5,
    margin: 20,
  },
});
