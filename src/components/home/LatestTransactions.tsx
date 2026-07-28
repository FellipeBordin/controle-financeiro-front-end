import { StyleSheet, Text, View } from "react-native";

import { TransactionCard } from "@/src/components/home/TransactionCard";
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
    gap: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#f8fafc",
    fontSize: 19,
    fontWeight: "900",
  },

  count: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
  },

  container: {
    backgroundColor: "#0f172a",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 12,
    gap: 10,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
  },

  emptyTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },
});
