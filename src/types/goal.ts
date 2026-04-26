export type Goal = {
  id: string;
  month: string;
  targetAmount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type GoalResponse = {
  goal: Goal | null;
  summary: {
    month: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    targetAmount: number;
    remainingToGoal: number;
    goalReached: boolean;
  };
};
