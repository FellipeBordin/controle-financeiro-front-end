import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";

import { useAuth } from "@/src/hooks/useAuth";
import { getInsights } from "@/src/services/ai";
import {
  deleteTransaction,
  getTransactions,
} from "@/src/services/transactions";
import type {
  Transaction,
  TransactionSummary,
} from "@/src/types/transaction";
import { getCurrentMonth } from "@/src/utils/date";
import { getApiErrorMessage } from "@/src/utils/getApiErrorMessage";

const initialSummary: TransactionSummary = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
};

type LoadDataOptions = {
  isRefresh?: boolean;
};

export function useHome() {
  const { signOut } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] =
    useState<TransactionSummary>(initialSummary);
  const [insight, setInsight] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const loadData = useCallback(
    async ({ isRefresh = false }: LoadDataOptions = {}) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const transactionsData = await getTransactions();

        setTransactions(transactionsData.transactions);
        setSummary(transactionsData.summary);

        const month = getCurrentMonth();
        const insightData = await getInsights(month);

        setInsight(insightData.insight);
      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);

        const message = getApiErrorMessage(
          error,
          "Não foi possível carregar os dados.",
        );

        showMessage("Erro", message);
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [showMessage],
  );

  const refreshData = useCallback(async () => {
    await loadData({
      isRefresh: true,
    });
  }, [loadData]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();

      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair da conta:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível sair da conta.",
      );

      showMessage("Erro", message);
    }
  }, [showMessage, signOut]);

  const confirmDeleteTransaction = useCallback(
    async (id: string) => {
      try {
        await deleteTransaction(id);

        showMessage(
          "Sucesso",
          "Lançamento excluído com sucesso.",
        );

        await loadData();
      } catch (error) {
        console.error("Erro ao excluir lançamento:", error);

        const message = getApiErrorMessage(
          error,
          "Não foi possível excluir o lançamento.",
        );

        showMessage("Erro", message);
      }
    },
    [loadData, showMessage],
  );

  const handleDeleteTransaction = useCallback(
    (id: string) => {
      if (Platform.OS === "web") {
        const confirmed = window.confirm(
          "Deseja realmente excluir este lançamento?",
        );

        if (confirmed) {
          void confirmDeleteTransaction(id);
        }

        return;
      }

      Alert.alert(
        "Excluir lançamento",
        "Deseja realmente excluir este lançamento?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => {
              void confirmDeleteTransaction(id);
            },
          },
        ],
      );
    },
    [confirmDeleteTransaction],
  );

  const handleEditTransaction = useCallback(
    (id: string) => {
      router.push(`/transactions/${id}/edit`);
    },
    [],
  );

  const latestTransactions = transactions.slice(0, 6);

  return {
    summary,
    insight,

    loading,
    refreshing,

    latestTransactions,

    loadData,
    refreshData,

    handleLogout,
    handleDeleteTransaction,
    handleEditTransaction,
  };
}