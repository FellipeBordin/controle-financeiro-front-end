export function parseCurrency(value: string): number {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return 0;
  }

  return Number(digits) / 100;
}

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    return "";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
