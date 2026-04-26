import { api } from "./api";
import type { MonthlyPlanResponse } from "@/src/types/monthly-plan";

type SaveMonthlyPlanPayload = {
  month: string;
  expectedIncome: number;
  categories: {
    name: string;
    plannedAmount: number;
  }[];
};

export async function getMonthlyPlan(month: string) {
  const response = await api.get<MonthlyPlanResponse>(
    `/api/monthly-plan?month=${month}`,
  );

  return response.data;
}

export async function saveMonthlyPlan(payload: SaveMonthlyPlanPayload) {
  const response = await api.post("/api/monthly-plan", payload);
  return response.data;
}

export async function deleteMonthlyPlan(month: string) {
  const response = await api.delete(`/api/monthly-plan?month=${month}`);
  return response.data;
}
