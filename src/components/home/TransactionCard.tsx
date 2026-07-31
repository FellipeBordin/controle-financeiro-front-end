import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/src/theme";
import type { Transaction } from "@/src/types/transaction";
import { formatCurrency } from "@/src/utils/currency";
import { Card } from "../common/Card";

type TransactionCardProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export function TransactionCard({
  transaction,
  onDelete,
  onEdit,
}: TransactionCardProps) {
  const isIncome = transaction.type === "income";

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {transaction.title}
          </Text>

          <Text style={styles.category} numberOfLines={1}>
            {transaction.category}
          </Text>
        </View>

        <Text
          style={[styles.amount, isIncome ? styles.income : styles.expense]}
        >
          {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onEdit(transaction.id)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onDelete(transaction.id)}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },

  info: {
    flex: 1,
  },

  title: {
    color: colors.text, 
    fontSize: typography.body,
    fontWeight: "900",
  },

  category: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs,
  },

  amount: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
  },

  income: {
    color: colors.success,
  },

  expense: {
    color: colors.danger,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },

  editButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  editButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  deleteButton: {
    backgroundColor: colors.dangerDark,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  deleteButtonText: {
    color: colors.dangerLight,
    fontSize: 13,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.7,
  },
});
