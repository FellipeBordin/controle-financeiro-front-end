export type BudgetCategory = {
  id: string;
  name: string;
  plannedAmount: number;
  realAmount: number;
  difference: number;
  exceeded: boolean;
};

export type MonthlyPlan = {
  id: string;
  month: string;
  expectedIncome: number;
  budgetCategories: BudgetCategory[];
};

export type MonthlyPlanResponse = {
  plan: MonthlyPlan | null;
  summary: {
    month: string;
    expectedIncome: number;
    plannedExpense: number;
    plannedBalance: number;
    realIncome: number;
    realExpense: number;
    realBalance: number;
    incomeDifference: number;
    expenseDifference: number;
    balanceDifference: number;
  };
};
