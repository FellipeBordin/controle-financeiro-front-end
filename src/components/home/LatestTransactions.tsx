import { StyleSheet, Text, View } from "react-native";

import { TransactionCard } from "@/src/components/home/TransactionCard";
import { colors, radius, spacing, typography } from "@/src/theme";
import type { Transaction } from "@/src/types/transaction";

type LatestTransactionsProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export function LatestTransactions({
  transactions,
  onDelete,
  onEdit,
}: LatestTransactionsProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Últimos lançamentos</Text>

        <Text style={styles.count}>
          {transactions.length} {transactions.length === 1 ? "item" : "itens"}
        </Text>
      </View>

      <View style={styles.container}>
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum lançamento</Text>

            <Text style={styles.emptyText}>
              Cadastre uma receita ou despesa para começar.
            </Text>
          </View>
        ) : (
          transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
  },

  count: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },

  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: spacing.sm,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
