import { useCallback, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";

import {
    deleteMonthlyPlan,
    getMonthlyPlan,
    saveMonthlyPlan,
} from "@/src/services/monthly-plan";
import type { MonthlyPlanResponse } from "@/src/types/monthly-plan";
import { getCurrentMonth } from "@/src/utils/date";
import { getApiErrorMessage } from "@/src/utils/getApiErrorMessage";

export type CategoryInput = {
  name: string;
  plannedAmount: string;
};

const defaultCategories = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação",
  "Dívidas",
  "Cartão de crédito",
  "Reserva",
  "Investimentos",
];

function createDefaultCategories(): CategoryInput[] {
  return defaultCategories.map((name) => ({
    name,
    plannedAmount: "",
  }));
}

export function useMonthlyPlan() {
  const month = getCurrentMonth();

  const [expectedIncome, setExpectedIncome] = useState("");
  const [categories, setCategories] = useState<CategoryInput[]>(
    createDefaultCategories(),
  );

  const [data, setData] = useState<MonthlyPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  const loadPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMonthlyPlan(month);

      setData(response);

      if (response.plan) {
        setExpectedIncome(String(response.plan.expectedIncome));

        setCategories(
          response.plan.budgetCategories.map((category) => ({
            name: category.name,
            plannedAmount: String(category.plannedAmount),
          })),
        );

        return;
      }

      setExpectedIncome("");
      setCategories(createDefaultCategories());
    } catch (error) {
      console.error("Erro ao carregar planejamento:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível carregar o planejamento.",
      );

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  function updateCategoryAmount(index: number, value: string) {
    setCategories((current) =>
      current.map((category, categoryIndex) =>
        categoryIndex === index
          ? {
              ...category,
              plannedAmount: value,
            }
          : category,
      ),
    );
  }

  const plannedTotal = useMemo(() => {
    return categories.reduce((sum, category) => {
      const value =
        Number(category.plannedAmount.replace(",", ".")) || 0;

      return sum + value;
    }, 0);
  }, [categories]);

  const expectedIncomeNumber = useMemo(() => {
    return Number(expectedIncome.replace(",", ".")) || 0;
  }, [expectedIncome]);

  const plannedBalance = expectedIncomeNumber - plannedTotal;

  async function handleSave() {
    if (saving) {
      return;
    }

    const income = Number(expectedIncome.replace(",", "."));

    if (Number.isNaN(income) || income < 0) {
      showMessage(
        "Atenção",
        "Informe uma renda prevista válida.",
      );
      return;
    }

    const parsedCategories = categories
      .map((category) => ({
        name: category.name,
        plannedAmount:
          Number(category.plannedAmount.replace(",", ".")) || 0,
      }))
      .filter((category) => category.plannedAmount > 0);

    if (parsedCategories.length === 0) {
      showMessage(
        "Atenção",
        "Informe pelo menos uma categoria planejada.",
      );
      return;
    }

    try {
      setSaving(true);

      await saveMonthlyPlan({
        month,
        expectedIncome: income,
        categories: parsedCategories,
      });

      showMessage(
        "Sucesso",
        "Planejamento salvo com sucesso.",
      );

      await loadPlan();
    } catch (error) {
      console.error("Erro ao salvar planejamento:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível salvar o planejamento.",
      );

      showMessage("Erro", message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeletePlan() {
    try {
      setDeleting(true);

      await deleteMonthlyPlan(month);

      setData(null);
      setExpectedIncome("");
      setCategories(createDefaultCategories());

      showMessage(
        "Sucesso",
        "Planejamento excluído com sucesso.",
      );

      await loadPlan();
    } catch (error) {
      console.error("Erro ao excluir planejamento:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível excluir o planejamento.",
      );

      showMessage("Erro", message);
    } finally {
      setDeleting(false);
    }
  }

  function handleDeletePlan() {
    if (deleting) {
      return;
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Deseja realmente excluir este planejamento?",
      );

      if (confirmed) {
        void confirmDeletePlan();
      }

      return;
    }

    Alert.alert(
      "Excluir planejamento",
      "Deseja realmente excluir este planejamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            void confirmDeletePlan();
          },
        },
      ],
    );
  }

  return {
    month,
    expectedIncome,
    categories,
    data,

    loading,
    saving,
    deleting,
    error,

    plannedTotal,
    plannedBalance,

    setExpectedIncome,
    updateCategoryAmount,

    loadPlan,
    handleSave,
    handleDeletePlan,
  };
}