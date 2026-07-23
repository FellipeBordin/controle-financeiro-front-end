import { router } from "expo-router";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TransactionCategorySelector } from "@/src/components/Transactions/TransactionCategorySelector";
import { TransactionTypeSelector } from "@/src/components/Transactions/TransactionTypeSelector";
import { useNewTransaction } from "@/src/hooks/useNewTransaction";

export default function NewTransactionScreen() {
  const {
    type,
    title,
    amount,
    category,
    notes,
    loading,
    availableCategories,
    setTitle,
    setAmount,
    setCategory,
    setNotes,
    handleChangeType,
    handleCreate,
  } = useNewTransaction();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Novo lançamento</Text>

        <TransactionTypeSelector value={type} onChange={handleChangeType} />

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

        <TransactionCategorySelector
          categories={availableCategories}
          value={category}
          onChange={setCategory}
        />
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
