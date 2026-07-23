import type { TransactionType } from "@/src/types/transaction";

export const transactionCategories: Record<TransactionType, string[]> = {
  expense: [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Lazer",
    "Educação",
    "Outros",
  ],
  income: ["Salário", "Freelance", "Venda", "Investimentos", "Outros"],
};