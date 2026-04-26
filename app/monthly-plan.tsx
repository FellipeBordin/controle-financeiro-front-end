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
import { getCurrentMonth } from "@/src/utils/date";
import {
  deleteMonthlyPlan,
  getMonthlyPlan,
  saveMonthlyPlan,
} from "@/src/services/monthly-plan";
import type {
  BudgetCategory,
  MonthlyPlanResponse,
} from "@/src/types/monthly-plan";

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

type CategoryInput = {
  name: string;
  plannedAmount: string;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function MonthlyPlanScreen() {
  const month = getCurrentMonth();

  const [expectedIncome, setExpectedIncome] = useState("");
  const [categories, setCategories] = useState<CategoryInput[]>(
    defaultCategories.map((name) => ({
      name,
      plannedAmount: "",
    })),
  );
  const [data, setData] = useState<MonthlyPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadPlan() {
    try {
      setLoading(true);

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
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o planejamento.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadPlan();
    }, []),
  );

  function updateCategoryAmount(index: number, value: string) {
    setCategories((current) =>
      current.map((category, categoryIndex) =>
        categoryIndex === index
          ? { ...category, plannedAmount: value }
          : category,
      ),
    );
  }

  async function handleSave() {
    try {
      const income = Number(expectedIncome.replace(",", "."));

      if (Number.isNaN(income) || income < 0) {
        Alert.alert("Atenção", "Informe uma renda prevista válida.");
        return;
      }

      const parsedCategories = categories
        .map((category) => ({
          name: category.name,
          plannedAmount: Number(category.plannedAmount.replace(",", ".")) || 0,
        }))
        .filter((category) => category.plannedAmount > 0);

      if (parsedCategories.length === 0) {
        Alert.alert("Atenção", "Informe pelo menos uma categoria planejada.");
        return;
      }

      await saveMonthlyPlan({
        month,
        expectedIncome: income,
        categories: parsedCategories,
      });

      Alert.alert("Sucesso", "Planejamento salvo com sucesso.");
      await loadPlan();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o planejamento.");
    }
  }

  async function handleDeletePlan() {
    console.log("CLICOU NO BOTÃO EXCLUIR PLANEJAMENTO");

    try {
      console.log("MÊS ENVIADO:", month);

      const response = await deleteMonthlyPlan(month);

      console.log("RESPOSTA DELETE:", response);

      Alert.alert("Sucesso", "Planejamento excluído.");

      setData(null);
      setExpectedIncome("");
      setCategories(
        defaultCategories.map((name) => ({
          name,
          plannedAmount: "",
        })),
      );

      await loadPlan();
    } catch (error) {
      console.log("DELETE_PLAN_ERROR:", error);
      Alert.alert("Erro", "Não foi possível excluir o planejamento.");
    }
  }

  const plannedTotal = categories.reduce((sum, category) => {
    const value = Number(category.plannedAmount.replace(",", ".")) || 0;
    return sum + value;
  }, 0);

  const expectedIncomeNumber = Number(expectedIncome.replace(",", ".")) || 0;
  const plannedBalance = expectedIncomeNumber - plannedTotal;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPlan} />
        }
      >
        <Pressable onPress={() => router.replace("/home")}>
          <Text style={styles.back}>← Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Planejamento mensal</Text>
        <Text style={styles.subtitle}>Mês atual: {month}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Renda prevista no mês</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 3000"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={expectedIncome}
            onChangeText={setExpectedIncome}
          />

          <View style={styles.previewBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total planejado</Text>
              <Text style={styles.expenseText}>
                {formatCurrency(plannedTotal)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Saldo planejado</Text>
              <Text
                style={
                  plannedBalance >= 0 ? styles.incomeText : styles.expenseText
                }
              >
                {formatCurrency(plannedBalance)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Categorias planejadas</Text>

        {categories.map((category, index) => (
          <View key={category.name} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{category.name}</Text>

            <TextInput
              style={styles.categoryInput}
              placeholder="0"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={category.plannedAmount}
              onChangeText={(value) => updateCategoryAmount(index, value)}
            />
          </View>
        ))}

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar planejamento</Text>
        </Pressable>

        {data?.plan && (
          <Pressable
            style={({ pressed }) => [
              styles.deletePlanButton,
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => {
              console.log("PRESSIONOU PRESSABLE");
              handleDeletePlan();
            }}
          >
            <Text style={styles.deletePlanText}>Excluir planejamento</Text>
          </Pressable>
        )}

        {data?.plan && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Planejado x Realizado</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receita prevista</Text>
              <Text style={styles.balanceText}>
                {formatCurrency(data.summary.expectedIncome)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receita real</Text>
              <Text style={styles.incomeText}>
                {formatCurrency(data.summary.realIncome)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Despesa planejada</Text>
              <Text style={styles.balanceText}>
                {formatCurrency(data.summary.plannedExpense)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Despesa real</Text>
              <Text style={styles.expenseText}>
                {formatCurrency(data.summary.realExpense)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Saldo real</Text>
              <Text
                style={
                  data.summary.realBalance >= 0
                    ? styles.incomeText
                    : styles.expenseText
                }
              >
                {formatCurrency(data.summary.realBalance)}
              </Text>
            </View>
          </View>
        )}

        {data?.plan?.budgetCategories?.map((category: BudgetCategory) => (
          <View key={category.id} style={styles.resultCategoryCard}>
            <View>
              <Text style={styles.resultCategoryName}>{category.name}</Text>
              <Text style={styles.resultCategorySub}>
                Planejado: {formatCurrency(category.plannedAmount)}
              </Text>
              <Text style={styles.resultCategorySub}>
                Realizado: {formatCurrency(category.realAmount)}
              </Text>
            </View>

            <Text
              style={category.exceeded ? styles.expenseText : styles.incomeText}
            >
              {category.exceeded ? "Estourou" : "Ok"}
            </Text>
          </View>
        ))}
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
  deletePlanButton: {
    backgroundColor: "#7f1d1d",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  deletePlanText: {
    color: "#fecaca",
    fontWeight: "800",
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
  previewBox: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  categoryRow: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  categoryInput: {
    backgroundColor: "#0f172a",
    color: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
    width: 110,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginVertical: 18,
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
    gap: 12,
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
  resultCategoryCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultCategoryName: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  resultCategorySub: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 13,
  },
});
