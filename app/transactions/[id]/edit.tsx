import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { TransactionForm } from "@/src/components/Transactions/TransactionForm";
import { useEditTransaction } from "@/src/hooks/useEditTransaction";

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
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.back()}
              disabled={saving}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>

            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Editar lançamento</Text>

              <Text style={styles.subtitle}>
                Atualize os dados da receita ou despesa.
              </Text>
            </View>
          </View>

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

  buttonPressed: {
    opacity: 0.75,
  },
});
