import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { TransactionTypeSelector } from "@/src/components/Transactions/TransactionTypeSelector";
import { createTransaction } from "@/src/services/transactions";
import type { TransactionType } from "@/src/types/transaction";
import { parseCurrency } from "@/src/utils/currency";
import {
  validateTransaction,
  validateTransactionAmount,
} from "@/src/utils/transactionValidators";
import { SafeAreaView } from "react-native-safe-area-context";


const transactionCategories: Record<TransactionType, string[]> = {
  expense: [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Lazer",
    "Educação",
    "Outros",
  ],
  income: ["Salário", "Freelance", "Venda", "Investimentos", "Outros"],
};

export default function NewTransactionScreen() {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(transactionCategories.expense[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const availableCategories = transactionCategories[type];

  function handleChangeType(newType: TransactionType) {
    setType(newType);
    setCategory(transactionCategories[newType][0]);
  }

  async function handleCreate() {
    const validationError = validateTransaction({
      title,
      amount,
      category,
    });

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    const parsedAmount = parseCurrency(amount);

    const amountError = validateTransactionAmount(parsedAmount);

    if (amountError) {
      Alert.alert("Atenção", amountError);
      return;
    }

    try {
      setLoading(true);

      await createTransaction({
        title: title.trim(),
        amount: parsedAmount,
        type,
        category,
        date: new Date().toISOString(),
        notes: notes.trim(),
      });

      Alert.alert("Sucesso", "Lançamento cadastrado.");
      router.replace("/home");
    } catch (error) {
      console.error("Erro ao cadastrar lançamento:", error);

      Alert.alert("Erro", "Não foi possível cadastrar o lançamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Novo lançamento</Text>

       <TransactionTypeSelector
          value={type}
          onChange={handleChangeType}
        />
          

        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Valor"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Categoria</Text>

        <View style={styles.categoriesContainer}>
          {availableCategories.map((item) => (
            <Pressable
              key={item}
              style={[
                styles.categoryButton,
                category === item && styles.categoryActive,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Observação opcional"
          placeholderTextColor="#94a3b8"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Salvando..." : "Salvar lançamento"}
          </Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
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
  buttonDisabled: {
    opacity: 0.6,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 24,
  },
   input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: "#1e293b",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryActive: {
    backgroundColor: "#38bdf8",
    borderColor: "#38bdf8",
  },
  categoryText: {
    color: "#cbd5e1",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#082f49",
  },
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#052e16",
    fontSize: 16,
    fontWeight: "800",
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
  },
  cancelText: {
    color: "#94a3b8",
    fontWeight: "700",
  },
});
