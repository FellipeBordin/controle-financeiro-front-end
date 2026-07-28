import { StyleSheet, Text, View } from "react-native";

import type { TransactionSummary } from "@/src/types/transaction";
import { formatCurrency } from "@/src/utils/currency";

type BalanceCardProps = {
  summary: TransactionSummary;
};

export function BalanceCard({ summary }: BalanceCardProps) {
  return (
    <View style={styles.balanceCard}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: "#16a34a",
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
  },
  cardLabel: {
    color: "#dcfce7",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  balanceText: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
  },
  negativeBalance: {
    color: "#fee2e2",
  },
  balanceDetails: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.25)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    color: "#dcfce7",
    fontSize: 13,
    marginBottom: 4,
  },
  incomeText: {
    color: "#22c55e",
    fontWeight: "900",
  },
  expenseText: {
    color: "#ef4444",
    fontWeight: "900",
  },
});
