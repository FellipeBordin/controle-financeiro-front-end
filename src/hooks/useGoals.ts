import { useCallback, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";

import { getGoal, saveGoal } from "@/src/services/goals";
import { getCurrentMonth } from "@/src/utils/date";
import { getApiErrorMessage } from "@/src/utils/getApiErrorMessage";

export type GoalSummary = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  targetAmount: number;
  remainingToGoal: number;
  goalReached: boolean;
};

export function useGoals() {
  const month = getCurrentMonth();

  const [targetAmount, setTargetAmount] = useState("");
  const [summary, setSummary] = useState<GoalSummary | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showMessage = useCallback(
    (title: string, message: string) => {
      if (Platform.OS === "web") {
        window.alert(`${title}\n\n${message}`);
        return;
      }

      Alert.alert(title, message);
    },
    [],
  );

  const loadGoal = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getGoal(month);

      setSummary(data.summary);

      if (data.goal) {
        setTargetAmount(String(data.goal.targetAmount));
      } else {
        setTargetAmount("");
      }
    } catch (error) {
      console.error("Erro ao carregar meta:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível carregar sua meta.",
      );

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  const progress = useMemo(() => {
    if (!summary || summary.targetAmount <= 0) {
      return 0;
    }

    return Math.min(
      Math.max((summary.balance / summary.targetAmount) * 100, 0),
      100,
    );
  }, [summary]);

  async function handleSaveGoal() {
    if (saving) {
      return;
    }

    const amount = Number(targetAmount.replace(",", "."));

    if (
      !targetAmount.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      showMessage(
        "Atenção",
        "Informe uma meta válida.",
      );

      return;
    }

    try {
      setSaving(true);

      await saveGoal({
        month,
        targetAmount: amount,
      });

      showMessage(
        "Sucesso",
        "Meta salva com sucesso.",
      );

      await loadGoal();
    } catch (error) {
      console.error("Erro ao salvar meta:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível salvar a meta.",
      );

      showMessage("Erro", message);
    } finally {
      setSaving(false);
    }
  }

  return {
    month,
    targetAmount,
    summary,

    loading,
    saving,
    error,

    progress,

    setTargetAmount,

    loadGoal,
    handleSaveGoal,
  };
}