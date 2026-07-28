import { api } from "@/src/services/api";
import type {
  Transaction,
  TransactionSummary,
  TransactionType,
} from "@/src/types/transaction";

type TransactionsResponse = {
  transactions: Transaction[];
  summary: TransactionSummary;
};

type CreateTransactionData = {
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
};

type UpdateTransactionData = {
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
};

export async function getTransactions(): Promise<TransactionsResponse> {
  const response = await api.get<TransactionsResponse>("/api/transactions");

  return response.data;
}

export async function getTransactionById(id: string): Promise<Transaction> {
  const data = await getTransactions();

  const transaction = data.transactions.find((item) => item.id === id);

  if (!transaction) {
    throw new Error("Lançamento não encontrado.");
  }

  return transaction;
}

export async function createTransaction(
  data: CreateTransactionData,
): Promise<Transaction> {
  const response = await api.post<Transaction>("/api/transactions", data);

  return response.data;
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionData,
): Promise<Transaction> {
  const response = await api.put<Transaction>(`/api/transactions/${id}`, data);

  return response.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/api/transactions/${id}`);
}
