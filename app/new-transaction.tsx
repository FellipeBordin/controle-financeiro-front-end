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
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createTransaction } from "@/src/services/transactions";
import type { TransactionType } from "@/src/types/transaction";

const categories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Lazer",
  "Educação",
  "Salário",
  "Outros",
];

export default function NewTransactionScreen() {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Alimentação");
  const [notes, setNotes] = useState("");

  async function handleCreate() {
    try {
      const parsedAmount = Number(amount.replace(",", "."));

      if (!title || !amount || !category) {
        Alert.alert("Atenção", "Preencha título, valor e categoria.");
        return;
      }

      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        Alert.alert("Atenção", "Informe um valor válido.");
        return;
      }

      await createTransaction({
        title,
        amount: parsedAmount,
        type,
        category,
        date: new Date().toISOString(),
        notes,
      });

      Alert.alert("Sucesso", "Lançamento cadastrado.");
      router.replace("/home");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o lançamento.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Novo lançamento</Text>

        <View style={styles.typeRow}>
          <Pressable
            style={[styles.typeButton, type === "expense" && styles.typeActive]}
            onPress={() => setType("expense")}
          >
            <Text
              style={[
                styles.typeText,
                type === "expense" && styles.typeTextActive,
              ]}
            >
              Despesa
            </Text>
          </Pressable>

          <Pressable
            style={[styles.typeButton, type === "income" && styles.typeActive]}
            onPress={() => setType("income")}
          >
            <Text
              style={[
                styles.typeText,
                type === "income" && styles.typeTextActive,
              ]}
            >
              Receita
            </Text>
          </Pressable>
        </View>

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
          {categories.map((item) => (
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

        <Pressable style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Salvar lançamento</Text>
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
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 24,
  },
  typeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  typeActive: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  typeText: {
    color: "#cbd5e1",
    fontWeight: "700",
  },
  typeTextActive: {
    color: "#052e16",
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
