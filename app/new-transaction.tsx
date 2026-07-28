import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TransactionForm } from "@/src/components/Transactions/TransactionForm";
import { useNewTransaction } from "@/src/hooks/useNewTransaction";

export default function NewTransactionScreen() {
  const {
    type,
    title,
    amount,
    category,
    notes,
    errors,
    loading,
    availableCategories,
    setNotes,
    handleChangeTitle,
    handleChangeAmount,
    handleChangeCategory,
    handleChangeType,
    handleCreate,
  } = useNewTransaction();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Novo lançamento</Text>

          <Text style={styles.subtitle}>
            Cadastre uma nova receita ou despesa.
          </Text>

          <TransactionForm
            title={title}
            amount={amount}
            category={category}
            type={type}
            errors={errors}
            loading={loading}
            submitLabel="Salvar lançamento"
            loadingLabel="Salvando..."
            categories={availableCategories}
            notes={notes}
            showNotes
            useCategorySelector
            useTypeSelector
            onChangeTitle={handleChangeTitle}
            onChangeAmount={handleChangeAmount}
            onChangeCategory={handleChangeCategory}
            onChangeType={handleChangeType}
            onChangeNotes={setNotes}
            onSubmit={() => {
              void handleCreate();
            }}
            onCancel={() => router.back()}
          />
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

  title: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 16,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 28,
  },
});
