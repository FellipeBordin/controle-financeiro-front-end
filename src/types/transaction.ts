export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string | null;
};

export type TransactionsResponse = {
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
};
