import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { TransactionFormErrors } from "@/src/types/transactionForm";
import { TransactionCategorySelector } from "@/src/components/Transactions/TransactionCategorySelector";
import { TransactionTypeSelector } from "@/src/components/Transactions/TransactionTypeSelector";
import type { TransactionType } from "@/src/types/transaction";

type TransactionFormProps = {
  title: string;
  amount: string;
  category: string;
  type: TransactionType;
  errors: TransactionFormErrors;

  loading: boolean;
  submitLabel: string;
  loadingLabel?: string;

  categories?: string[];
  notes?: string;
  showNotes?: boolean;
  useCategorySelector?: boolean;
  useTypeSelector?: boolean;

  onChangeTitle: (value: string) => void;
  onChangeAmount: (value: string) => void;
  onChangeCategory: (value: string) => void;
  onChangeType: (type: TransactionType) => void;
  onChangeNotes?: (value: string) => void;

  onSubmit: () => void;
  onCancel: () => void;
};

export function TransactionForm({
  title,
  amount,
  category,
  type,
  errors,
  loading,
  submitLabel,
  loadingLabel = "Salvando...",
  categories = [],
  notes = "",
  showNotes = false,
  useCategorySelector = false,
  useTypeSelector = false,
  onChangeTitle,
  onChangeAmount,
  onChangeCategory,
  onChangeType,
  onChangeNotes,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  return (
    <View style={styles.form}>
      {useTypeSelector ? (
        <TransactionTypeSelector value={type} onChange={onChangeType} />
      ) : (
        <View style={styles.field}>
          <Text style={styles.label}>Tipo</Text>

          <View style={styles.typeContainer}>
            <Pressable
              style={[
                styles.typeButton,
                type === "income" && styles.incomeButtonSelected,
              ]}
              onPress={() => onChangeType("income")}
              disabled={loading}
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
              onPress={() => onChangeType("expense")}
              disabled={loading}
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
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Título</Text>

        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="Ex.: Salário, mercado, combustível"
          placeholderTextColor="#64748b"
          value={title}
          onChangeText={onChangeTitle}
          editable={!loading}
          autoCapitalize="sentences"
        />

        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Valor</Text>

        <TextInput
          style={[styles.input, errors.amount && styles.inputError]}
          placeholder="R$ 0,00"
          placeholderTextColor="#64748b"
          value={amount}
          onChangeText={onChangeAmount}
          keyboardType="numeric"
          editable={!loading}
        />

        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
      </View>

      {useCategorySelector ? (
        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>

          <TransactionCategorySelector
            categories={categories}
            value={category}
            onChange={onChangeCategory}
          />

          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>
      ) : (
        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>

          <TextInput
            style={[styles.input, errors.category && styles.inputError]}
            placeholder="Ex.: Alimentação, moradia, salário"
            placeholderTextColor="#64748b"
            value={category}
            onChangeText={onChangeCategory}
            editable={!loading}
            autoCapitalize="sentences"
          />

          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>
      )}

      {showNotes && onChangeNotes && (
        <View style={styles.field}>
          <Text style={styles.label}>Observação</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observação opcional"
            placeholderTextColor="#64748b"
            value={notes}
            onChangeText={onChangeNotes}
            editable={!loading}
            multiline
            textAlignVertical="top"
          />
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          loading && styles.buttonDisabled,
          pressed && !loading && styles.buttonPressed,
        ]}
        disabled={loading}
        onPress={onSubmit}
      >
        {loading ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color="#ffffff" />

            <Text style={styles.saveButtonText}>{loadingLabel}</Text>
          </View>
        ) : (
          <Text style={styles.saveButtonText}>{submitLabel}</Text>
        )}
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.cancelButton,
          loading && styles.buttonDisabled,
          pressed && !loading && styles.buttonPressed,
        ]}
        disabled={loading}
        onPress={onCancel}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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

  textArea: {
    minHeight: 96,
    paddingTop: 14,
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

  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
