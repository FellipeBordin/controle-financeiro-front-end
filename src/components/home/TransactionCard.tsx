import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Transaction } from "@/src/types/transaction";
import { formatCurrency } from "@/src/utils/currency";

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
    <View style={styles.card}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 14,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "900",
  },

  category: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },

  amount: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
  },

  income: {
    color: "#22c55e",
  },

  expense: {
    color: "#ef4444",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  editButton: {
    backgroundColor: "#1d4ed8",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },

  editButtonText: {
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: "800",
  },

  deleteButton: {
    backgroundColor: "#7f1d1d",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },

  deleteButtonText: {
    color: "#fecaca",
    fontSize: 13,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.7,
  },
});
