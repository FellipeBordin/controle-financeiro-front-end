import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getGoal, saveGoal } from "@/src/services/goals";
import { getCurrentMonth } from "@/src/utils/date";

type GoalSummary = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  targetAmount: number;
  remainingToGoal: number;
  goalReached: boolean;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function GoalsScreen() {
  const [targetAmount, setTargetAmount] = useState("");
  const [summary, setSummary] = useState<GoalSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const month = getCurrentMonth();

  async function loadGoal() {
    try {
      setLoading(true);

      const data = await getGoal(month);

      setSummary(data.summary);

      if (data.goal) {
        setTargetAmount(String(data.goal.targetAmount));
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar sua meta.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadGoal();
    }, []),
  );

  async function handleSaveGoal() {
    try {
      const amount = Number(targetAmount.replace(",", "."));

      if (!targetAmount || Number.isNaN(amount) || amount <= 0) {
        Alert.alert("Atenção", "Informe uma meta válida.");
        return;
      }

      await saveGoal({
        month,
        targetAmount: amount,
      });

      Alert.alert("Sucesso", "Meta salva com sucesso.");
      await loadGoal();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a meta.");
    }
  }

  const progress =
    summary && summary.targetAmount > 0
      ? Math.min((summary.balance / summary.targetAmount) * 100, 100)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadGoal} />
        }
      >
        <Pressable onPress={() => router.replace("/home")}>
          <Text style={styles.back}>← Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Meta mensal</Text>
        <Text style={styles.subtitle}>Mês atual: {month}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Quanto você quer guardar este mês?</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 500"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
          />

          <Pressable style={styles.button} onPress={handleSaveGoal}>
            <Text style={styles.buttonText}>Salvar meta</Text>
          </Pressable>
        </View>

        {summary && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo da meta</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receitas</Text>
              <Text style={styles.incomeText}>
                {formatCurrency(summary.totalIncome)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Despesas</Text>
              <Text style={styles.expenseText}>
                {formatCurrency(summary.totalExpense)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Saldo</Text>
              <Text style={styles.balanceText}>
                {formatCurrency(summary.balance)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Meta</Text>
              <Text style={styles.balanceText}>
                {formatCurrency(summary.targetAmount)}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            <Text style={styles.progressText}>
              {progress.toFixed(0)}% da meta atingida
            </Text>

            {summary.goalReached ? (
              <Text style={styles.successText}>Parabéns! Meta atingida.</Text>
            ) : (
              <Text style={styles.warningText}>
                Faltam {formatCurrency(summary.remainingToGoal)} para atingir a
                meta.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  back: {
    color: "#38bdf8",
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 6,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  label: {
    color: "#e2e8f0",
    fontSize: 15,
    marginBottom: 12,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#052e16",
    fontWeight: "800",
    fontSize: 16,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    color: "#94a3b8",
  },
  incomeText: {
    color: "#22c55e",
    fontWeight: "800",
  },
  expenseText: {
    color: "#ef4444",
    fontWeight: "800",
  },
  balanceText: {
    color: "#fff",
    fontWeight: "800",
  },
  progressContainer: {
    height: 12,
    backgroundColor: "#0f172a",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 14,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
  progressText: {
    color: "#cbd5e1",
    marginTop: 8,
    fontSize: 13,
  },
  successText: {
    color: "#22c55e",
    marginTop: 14,
    fontWeight: "800",
  },
  warningText: {
    color: "#facc15",
    marginTop: 14,
    fontWeight: "700",
  },
});
