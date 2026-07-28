import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TransactionForm } from "@/src/components/Transactions/TransactionForm";
import { useEditTransaction } from "@/src/hooks/useEditTransaction";
import { colors, spacing, typography } from "@/src/theme";

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    title,
    amount,
    category,
    type,
    errors,
    loading,
    saving,
    setType,
    handleChangeTitle,
    handleChangeAmount,
    handleChangeCategory,
    handleSubmit,
  } = useEditTransaction({ id });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Carregando lançamento...
          </Text>
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Editar lançamento</Text>

          <Text style={styles.subtitle}>
            Atualize os dados da receita ou despesa.
          </Text>

          <TransactionForm
            title={title}
            amount={amount}
            category={category}
            type={type}
            errors={errors}
            loading={saving}
            submitLabel="Salvar alterações"
            loadingLabel="Salvando..."
            onChangeTitle={handleChangeTitle}
            onChangeAmount={handleChangeAmount}
            onChangeCategory={handleChangeCategory}
            onChangeType={setType}
            onSubmit={() => {
              void handleSubmit();
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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.body,
  },
});