import type {
  Transaction,
  TransactionType,
  TransactionsResponse,
} from "@/src/types/transaction";

import { api } from "./api";

export type CreateTransactionPayload = {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
};

type DeleteTransactionResponse = {
  message: string;
};

export async function getTransactions(): Promise<TransactionsResponse> {
  const response = await api.get<TransactionsResponse>(
    "/api/transactions",
  );

  return response.data;
}

export async function createTransaction(
  payload: CreateTransactionPayload,
): Promise<Transaction> {
  const response = await api.post<Transaction>(
    "/api/transactions",
    payload,
  );

  return response.data;
}

export async function deleteTransaction(
  id: string,
): Promise<DeleteTransactionResponse> {
  const response = await api.delete<DeleteTransactionResponse>(
    `/api/transactions/${id}`,
  );

  return response.data;
}
