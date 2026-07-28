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
import { colors, spacing, typography } from "@/src/theme";

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
    backgroundColor: colors.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "900",
    marginTop: spacing.md,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    lineHeight: 20,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
});