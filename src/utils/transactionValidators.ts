type ValidateTransactionInput = {
  title: string;
  amount: string;
  category: string;
};

export function validateTransaction({
  title,
  amount,
  category,
}: ValidateTransactionInput): string | null {
  if (!title.trim() || !amount.trim() || !category.trim()) {
    return "Preencha título, valor e categoria.";
  }

  return null;
}

export function validateTransactionAmount(amount: number): string | null {
  if (Number.isNaN(amount) || amount <= 0) {
    return "Informe um valor válido.";
  }

  return null;
}
