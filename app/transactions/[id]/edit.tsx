import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  getTransactionById,
  updateTransaction,
} from "@/src/services/transactions";
import type { TransactionType } from "@/src/types/transaction";
import { formatCurrency, parseCurrency } from "@/src/utils/currency";
import { getApiErrorMessage } from "@/src/utils/getApiErrorMessage";

type FormErrors = {
  title?: string;
  amount?: string;
  category?: string;
};

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showMessage = useCallback((title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  }, []);

  const loadTransaction = useCallback(async () => {
    if (!id) {
      showMessage("Erro", "O lançamento não foi encontrado.");
      router.back();
      return;
    }

    try {
      setLoading(true);

      const transaction = await getTransactionById(id);

      setTitle(transaction.title);
      setCategory(transaction.category);
      setType(transaction.type);
      setAmount(formatCurrency(transaction.amount));
    } catch (error) {
      console.error("Erro ao carregar lançamento:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível carregar o lançamento.",
      );

      showMessage("Erro", message);
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, showMessage]);

  useEffect(() => {
    void loadTransaction();
  }, [loadTransaction]);

  function validateForm() {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Informe o título.";
    }
    const numericAmount = parseCurrency(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      newErrors.amount = "Informe um valor válido.";
    }

    if (!category.trim()) {
      newErrors.category = "Informe a categoria.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleChangeAmount(value: string) {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setAmount("");

      if (errors.amount) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          amount: undefined,
        }));
      }

      return;
    }

    const numericAmount = Number(digits) / 100;

    setAmount(formatCurrency(numericAmount));

    if (errors.amount) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        amount: undefined,
      }));
    }
  }

  async function handleSubmit() {
    if (!id || saving) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setSaving(true);

      await updateTransaction(id, {
        title: title.trim(),
        amount: parseCurrency(amount),
        category: category.trim(),
        type,
      });

      showMessage("Sucesso", "Lançamento atualizado com sucesso.");

      router.back();
    } catch (error) {
      console.error("Erro ao atualizar lançamento:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível atualizar o lançamento.",
      );

      showMessage("Erro", message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>Carregando lançamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>

            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Editar lançamento</Text>

              <Text style={styles.subtitle}>
                Atualize os dados da receita ou despesa.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Tipo</Text>

              <View style={styles.typeContainer}>
                <Pressable
                  style={[
                    styles.typeButton,
                    type === "income" && styles.incomeButtonSelected,
                  ]}
                  onPress={() => setType("income")}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === "income" && styles.typeButtonTextSelected,
                    ]}
                  >
                    Receita
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.typeButton,
                    type === "expense" && styles.expenseButtonSelected,
                  ]}
                  onPress={() => setType("expense")}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === "expense" && styles.typeButtonTextSelected,
                    ]}
                  >
                    Despesa
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Título</Text>

              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Ex.: Salário, mercado, combustível"
                placeholderTextColor="#64748b"
                value={title}
                onChangeText={(value) => {
                  setTitle(value);

                  if (errors.title) {
                    setErrors((currentErrors) => ({
                      ...currentErrors,
                      title: undefined,
                    }));
                  }
                }}
              />

              {errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Valor</Text>

              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                placeholder="R$ 0,00"
                placeholderTextColor="#64748b"
                value={amount}
                onChangeText={handleChangeAmount}
                keyboardType="numeric"
              />

              {errors.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Categoria</Text>

              <TextInput
                style={[styles.input, errors.category && styles.inputError]}
                placeholder="Ex.: Alimentação, moradia, salário"
                placeholderTextColor="#64748b"
                value={category}
                onChangeText={(value) => {
                  setCategory(value);

                  if (errors.category) {
                    setErrors((currentErrors) => ({
                      ...currentErrors,
                      category: undefined,
                    }));
                  }
                }}
              />

              {errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                saving && styles.saveButtonDisabled,
                pressed && !saving && styles.buttonPressed,
              ]}
              disabled={saving}
              onPress={() => {
                void handleSubmit();
              }}
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar alterações</Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              disabled={saving}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  header: {
    marginBottom: 28,
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 20,
  },

  backButtonText: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "700",
  },

  headerTextContainer: {
    gap: 6,
  },

  title: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
  },

  form: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 22,
    padding: 18,
    gap: 20,
  },

  field: {
    gap: 8,
  },

  label: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "800",
  },

  input: {
    minHeight: 52,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#f8fafc",
    fontSize: 16,
  },

  inputError: {
    borderColor: "#ef4444",
  },

  errorText: {
    color: "#f87171",
    fontSize: 12,
  },

  typeContainer: {
    flexDirection: "row",
    gap: 10,
  },

  typeButton: {
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
  },

  incomeButtonSelected: {
    backgroundColor: "#166534",
    borderColor: "#22c55e",
  },

  expenseButtonSelected: {
    backgroundColor: "#7f1d1d",
    borderColor: "#ef4444",
  },

  typeButtonText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "800",
  },

  typeButtonTextSelected: {
    color: "#ffffff",
  },

  saveButton: {
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 12,
    marginTop: 4,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },

  cancelButton: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
  },

  cancelButtonText: {
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
