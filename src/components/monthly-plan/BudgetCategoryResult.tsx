import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/common/Card";
import { colors, spacing } from "@/src/theme";
import type { BudgetCategory } from "@/src/types/monthly-plan";
import { formatCurrency } from "@/src/utils/currency";

type BudgetCategoryResultProps = {
  category: BudgetCategory;
};

export function BudgetCategoryResult({
  category,
}: BudgetCategoryResultProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name}>
            {category.name}
          </Text>

          <Text style={styles.sub}>
            Planejado: {formatCurrency(category.plannedAmount)}
          </Text>

          <Text style={styles.sub}>
            Realizado: {formatCurrency(category.realAmount)}
          </Text>
        </View>

        <Text
          style={
            category.exceeded
              ? styles.exceeded
              : styles.ok
          }
        >
          {category.exceeded ? "Estourou" : "Ok"}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },

  info: {
    flex: 1,
  },

  name: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 15,
  },

  sub: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 13,
  },

  ok: {
    color: colors.success,
    fontWeight: "800",
  },

  exceeded: {
    color: colors.danger,
    fontWeight: "800",
  },
});