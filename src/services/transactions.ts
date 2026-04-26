import { api } from "./api";
import type {
  TransactionType,
  TransactionsResponse,
} from "@/src/types/transaction";

type CreateTransactionPayload = {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
};

export async function getTransactions() {
  const response = await api.get<TransactionsResponse>("/api/transactions");
  return response.data;
}

export async function createTransaction(payload: CreateTransactionPayload) {
  const response = await api.post("/api/transactions", payload);
  return response.data;
}

export async function deleteTransaction(id: string) {
  const response = await api.delete(`/api/transactions/${id}`);
  return response.data;
}
