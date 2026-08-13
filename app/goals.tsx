import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import { Card } from "@/src/components/common/Card";
import { ErrorState } from "@/src/components/common/ErrorState";
import { FormField } from "@/src/components/common/FormField";
import { PageHeader } from "@/src/components/common/PageHeader";
import { ScreenContainer } from "@/src/components/common/ScreenContainer";
import { GoalSummaryCard } from "@/src/components/goals/GoalSummaryCard";
import { useGoals } from "@/src/hooks/useGoals";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function GoalsScreen() {
  const {
    month,
    targetAmount,
    summary,
    loading,
    saving,
    error,
    progress,
    setTargetAmount,
    loadGoal,
    handleSaveGoal,
  } = useGoals();

  useFocusEffect(
    useCallback(() => {
      void loadGoal();
    }, [loadGoal]),
  );

  if (error && !summary) {
    return (
      <ScreenContainer>
        <PageHeader
          title="Meta mensal"
          subtitle={`Mês atual: ${month}`}
          onBack={() => router.replace("/home")}
        />

        <ErrorState
          title="Erro ao carregar"
          message={error}
          onRetry={() => {
            void loadGoal();
          }}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      refreshing={loading}
      onRefresh={loadGoal}
    >
      <PageHeader
        title="Meta mensal"
        subtitle={`Mês atual: ${month}`}
        onBack={() => router.replace("/home")}
      />

      <Card style={styles.card}>
        <FormField
          label="Quanto você quer guardar este mês?"
          required
        >
          <TextInput
            style={styles.input}
            placeholder="Ex: 500"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
            editable={!saving}
          />
        </FormField>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            saving && styles.buttonDisabled,
            pressed && !saving && styles.buttonPressed,
          ]}
          disabled={saving}
          onPress={() => {
            void handleSaveGoal();
          }}
        >
          <Text style={styles.buttonText}>
            {saving ? "Salvando..." : "Salvar meta"}
          </Text>
        </Pressable>
      </Card>

      {summary ? (
        <GoalSummaryCard
          summary={summary}
          progress={progress}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    gap: spacing.md,
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  button: {
    backgroundColor: colors.success,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
  },

  buttonText: {
    color: colors.successDark,
    fontWeight: "800",
    fontSize: typography.body,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});