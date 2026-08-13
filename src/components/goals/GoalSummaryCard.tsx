import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/common/Card";
import type { GoalSummary } from "@/src/hooks/useGoals";
import { colors, radius, spacing, typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils/currency";

type GoalSummaryCardProps = {
  summary: GoalSummary;
  progress: number;
};

export function GoalSummaryCard({
  summary,
  progress,
}: GoalSummaryCardProps) {
  return (
    <Card>
      <Text style={styles.cardTitle}>Resumo da meta</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Receitas</Text>

        <Text style={styles.incomeText}>
          {formatCurrency(summary.totalIncome)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Despesas</Text>

        <Text style={styles.expenseText}>
          {formatCurrency(summary.totalExpense)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Saldo</Text>

        <Text style={styles.balanceText}>
          {formatCurrency(summary.balance)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Meta</Text>

        <Text style={styles.balanceText}>
          {formatCurrency(summary.targetAmount)}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress}%` },
          ]}
        />
      </View>

      <Text style={styles.progressText}>
        {progress.toFixed(0)}% da meta atingida
      </Text>

      {summary.goalReached ? (
        <Text style={styles.successText}>
          Parabéns! Meta atingida.
        </Text>
      ) : (
        <Text style={styles.warningText}>
          Faltam {formatCurrency(summary.remainingToGoal)} para atingir a meta.
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: spacing.md,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },

  infoLabel: {
    color: colors.textSecondary,
  },

  incomeText: {
    color: colors.success,
    fontWeight: "800",
  },

  expenseText: {
    color: colors.danger,
    fontWeight: "800",
  },

  balanceText: {
    color: colors.text,
    fontWeight: "800",
  },

  progressContainer: {
    height: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    overflow: "hidden",
    marginTop: spacing.md,
  },

  progressBar: {
    height: "100%",
    backgroundColor: colors.success,
  },

  progressText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontSize: 13,
  },

  successText: {
    color: colors.success,
    marginTop: spacing.md,
    fontWeight: "800",
  },

  warningText: {
    color: colors.warning,
    marginTop: spacing.md,
    fontWeight: "700",
  },
});