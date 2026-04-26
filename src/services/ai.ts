import { api } from "./api";

type InsightResponse = {
  month: string;
  insight: string;
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    topExpenseCategory: string | null;
    topExpenseCategoryAmount: number;
  } | null;
};

export async function getInsights(month: string) {
  const response = await api.get<InsightResponse>(
    `/api/ai/insights?month=${month}`,
  );

  return response.data;
}
