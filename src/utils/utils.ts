export function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR");
}
