import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/common/Card";
import { colors, spacing, typography } from "@/src/theme";
import type { MonthlyPlanResponse } from "@/src/types/monthly-plan";
import { formatCurrency } from "@/src/utils/currency";

type PlanSummaryCardProps = {
  summary: MonthlyPlanResponse["summary"];
};

export function PlanSummaryCard({
  summary,
}: PlanSummaryCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Planejado x Realizado</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Receita prevista</Text>

        <Text style={styles.value}>
          {formatCurrency(summary.expectedIncome)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Receita real</Text>

        <Text style={styles.income}>
          {formatCurrency(summary.realIncome)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Despesa planejada</Text>

        <Text style={styles.value}>
          {formatCurrency(summary.plannedExpense)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Despesa real</Text>

        <Text style={styles.expense}>
          {formatCurrency(summary.realExpense)}
        </Text>
      </View>

      <View style={[styles.infoRow, styles.lastRow]}>
        <Text style={styles.label}>Saldo real</Text>

        <Text
          style={
            summary.realBalance >= 0
              ? styles.income
              : styles.expense
          }
        >
          {formatCurrency(summary.realBalance)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },

  title: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: spacing.md,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  lastRow: {
    marginBottom: 0,
  },

  label: {
    color: colors.textSecondary,
  },

  value: {
    color: colors.text,
    fontWeight: "800",
  },

  income: {
    color: colors.success,
    fontWeight: "800",
  },

  expense: {
    color: colors.danger,
    fontWeight: "800",
  },
});