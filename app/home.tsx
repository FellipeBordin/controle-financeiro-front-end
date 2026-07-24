import { getInsights } from "@/src/services/ai";
import {
  deleteTransaction,
  getTransactions,
} from "@/src/services/transactions";
import { clearAuthData } from "@/src/storage/auth-storage";
import type { Transaction } from "@/src/types/transaction";
import { getCurrentMonth } from "@/src/utils/date";
import { getApiErrorMessage } from "@/src/utils/getApiErrorMessage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);

      const transactionsData = await getTransactions();
      setTransactions(transactionsData.transactions);
      setSummary(transactionsData.summary);

      const month = getCurrentMonth();
      const insightData = await getInsights(month);
      setInsight(insightData.insight);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function handleLogout() {
    await clearAuthData();
    router.replace("/login");
  }

  const latestTransactions = transactions.slice(0, 6);

  async function handleDeleteTransaction(id: string) {
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
        onPress: async () => {
          try {
            await deleteTransaction(id);

            Alert.alert("Sucesso", "Lançamento excluído.");
            await loadData();
          } catch (error) {
            console.error("Erro ao excluir lançamento:", error);

            const message = getApiErrorMessage(
              error,
              "Não foi possível excluir o lançamento.",
            );

            Alert.alert("Erro", message);
          }
        },
      },
    ],
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Bem-vindo </Text>
            <Text style={styles.subtitle}>Seu controle financeiro $</Text>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.cardLabel}>Saldo atual</Text>
          <Text
            style={[
              styles.balanceText,
              summary.balance < 0 && styles.negativeBalance,
            ]}
          >
            {formatCurrency(summary.balance)}
          </Text>

          <View style={styles.balanceDetails}>
            <View>
              <Text style={styles.detailLabel}>Receitas</Text>
              <Text style={styles.incomeText}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </View>

            <View>
              <Text style={styles.detailLabel}>Despesas</Text>
              <Text style={styles.expenseText}>
                {formatCurrency(summary.totalExpense)}
              </Text>
            </View>
          </View>
        </View>

        {insight && (
          <View style={styles.aiCard}>
            <Text style={styles.aiTitle}>💡 Insight do mês</Text>
            <Text style={styles.aiText}>{insight}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Ações rápidas</Text>

        <View style={styles.actionsGrid}>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/new-transaction")}
          >
            <Text style={styles.actionIcon}>＋</Text>
            <Text style={styles.actionText}>Novo lançamento</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/goals")}
          >
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>Metas</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/monthly-plan")}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Planejamento</Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/notifications")}
          >
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionText}>Alertas</Text>
          </Pressable>
        </View>

        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Últimos lançamentos</Text>
          <Text style={styles.transactionsCount}>
            {latestTransactions.length} itens
          </Text>
        </View>

        <View style={styles.transactionsContainer}>
          {latestTransactions.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum lançamento cadastrado.</Text>
          ) : (
            latestTransactions.map((item) => (
              <View key={item.id} style={styles.transactionCard}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionCategory}>
                    {item.category}
                  </Text>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      item.type === "income"
                        ? styles.incomeText
                        : styles.expenseText,
                    ]}
                  >
                    {item.type === "income" ? "+" : "-"}{" "}
                    {formatCurrency(item.amount)}
                  </Text>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTransaction(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#334155",
  },
  transactionRight: {
    alignItems: "flex-end",
    gap: 8,
  },

  deleteButton: {
    backgroundColor: "#7f1d1d",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  deleteButtonText: {
    color: "#fecaca",
    fontSize: 12,
    fontWeight: "800",
  },
  logoutText: {
    color: "#f87171",
    fontWeight: "800",
  },
  balanceCard: {
    backgroundColor: "#16a34a",
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
  },
  cardLabel: {
    color: "#dcfce7",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  balanceText: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
  },
  negativeBalance: {
    color: "#fee2e2",
  },
  balanceDetails: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.25)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    color: "#dcfce7",
    fontSize: 13,
    marginBottom: 4,
  },
  incomeText: {
    color: "#22c55e",
    fontWeight: "900",
  },
  expenseText: {
    color: "#ef4444",
    fontWeight: "900",
  },
  aiCard: {
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#1e40af",
  },
  aiTitle: {
    color: "#38bdf8",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 8,
  },
  aiText: {
    color: "#e2e8f0",
    fontSize: 14,
    lineHeight: 21,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 16,
    minHeight: 104,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#334155",
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  actionText: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "800",
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionsCount: {
    color: "#64748b",
    fontWeight: "700",
    marginBottom: 12,
  },
  transactionsContainer: {
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    paddingVertical: 28,
  },
  transactionCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  transactionCategory: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 14,
    textAlign: "right",
  },
});
