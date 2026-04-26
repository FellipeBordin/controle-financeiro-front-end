import { api } from "./api";
import type { GoalResponse } from "@/src/types/goal";

type SaveGoalPayload = {
  month: string;
  targetAmount: number;
};

export async function getGoal(month: string) {
  const response = await api.get<GoalResponse>(`/api/goals?month=${month}`);
  return response.data;
}

export async function saveGoal(payload: SaveGoalPayload) {
  const response = await api.post("/api/goals", payload);
  return response.data;
}
