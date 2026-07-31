import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/src/theme";
import type { TransactionSummary } from "@/src/types/transaction";
import { formatCurrency } from "@/src/utils/currency";
import { Card } from "../common/Card";

type BalanceCardProps = {
  summary: TransactionSummary;
};

export function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <Card style={styles.balanceCard}>
      <Text style={styles.cardLabel}>Saldo atual</Text>

      <Text
        style={[
          styles.balanceText,
          summary.balance < 0 && styles.negativeBalance,
        ]}
      >
        {formatCurrency(summary.balance)}
      </Text>

      <View style={styles.balanceDetails}>
        <View>
          <Text style={styles.detailLabel}>Receitas</Text>

          <Text style={styles.incomeText}>
            {formatCurrency(summary.totalIncome)}
          </Text>
        </View>

        <View>
          <Text style={styles.detailLabel}>Despesas</Text>

          <Text style={styles.expenseText}>
            {formatCurrency(summary.totalExpense)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
 balanceCard: {
  backgroundColor: colors.successStrong,
  borderRadius: radius.card,
  padding: spacing.lg,
  marginBottom: spacing.md,
},

  cardLabel: {
    color: colors.successLight,
    fontSize: typography.caption,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },

  balanceText: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
  },

  negativeBalance: {
    color: colors.dangerLight,
  },

  balanceDetails: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.whiteTransparent,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailLabel: {
    color: colors.successLight,
    fontSize: 13,
    marginBottom: spacing.xs,
  },

  incomeText: {
    color: colors.success,
    fontWeight: "900",
  },

  expenseText: {
    color: colors.danger,
    fontWeight: "900",
  },
});