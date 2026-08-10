import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { ErrorState } from "@/src/components/common/ErrorState";
import { PageHeader } from "@/src/components/common/PageHeader";
import { ScreenContainer } from "@/src/components/common/ScreenContainer";
import { BudgetCategoryResult } from "@/src/components/monthly-plan/BudgetCategoryResult";
import { MonthlyPlanForm } from "@/src/components/monthly-plan/MonthlyPlanForm";
import { PlanSummaryCard } from "@/src/components/monthly-plan/PlanSummaryCard";
import { useMonthlyPlan } from "@/src/hooks/useMonthlyPlan";
import { colors, radius, spacing } from "@/src/theme";

export default function MonthlyPlanScreen() {
  const {
    month,
    expectedIncome,
    categories,
    data,
    loading,
    saving,
    deleting,
    error,
    plannedTotal,
    plannedBalance,
    setExpectedIncome,
    updateCategoryAmount,
    loadPlan,
    handleSave,
    handleDeletePlan,
  } = useMonthlyPlan();

  useFocusEffect(
    useCallback(() => {
      void loadPlan();
    }, [loadPlan]),
  );

  if (error && !data) {
    return (
      <ScreenContainer>
        <PageHeader
          title="Planejamento mensal"
          subtitle={`Mês atual: ${month}`}
          onBack={() => router.replace("/home")}
        />

        <ErrorState
          title="Erro ao carregar"
          message={error}
          onRetry={() => {
            void loadPlan();
          }}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      refreshing={loading}
      onRefresh={loadPlan}
    >
      <PageHeader
        title="Planejamento mensal"
        subtitle={`Mês atual: ${month}`}
        onBack={() => router.replace("/home")}
      />

      <MonthlyPlanForm
        expectedIncome={expectedIncome}
        categories={categories}
        plannedTotal={plannedTotal}
        plannedBalance={plannedBalance}
        saving={saving}
        deleting={deleting}
        onChangeExpectedIncome={setExpectedIncome}
        onChangeCategoryAmount={updateCategoryAmount}
        onSubmit={() => {
          void handleSave();
        }}
      />

      {data?.plan ? (
        <Pressable
          style={({ pressed }) => [
            styles.deletePlanButton,
            deleting && styles.buttonDisabled,
            pressed && !deleting && styles.buttonPressed,
          ]}
          disabled={saving || deleting}
          onPress={handleDeletePlan}
        >
          <Text style={styles.deletePlanText}>
            {deleting
              ? "Excluindo..."
              : "Excluir planejamento"}
          </Text>
        </Pressable>
      ) : null}

      {data?.plan ? (
        <PlanSummaryCard summary={data.summary} />
      ) : null}

      {data?.plan?.budgetCategories?.map((category) => (
        <BudgetCategoryResult
          key={category.id}
          category={category}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  deletePlanButton: {
    backgroundColor: colors.dangerDark,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  deletePlanText: {
    color: colors.dangerLight,
    fontWeight: "800",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});