import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { FormField } from "@/src/components/common/FormField";
import type { CategoryInput } from "@/src/hooks/useMonthlyPlan";
import { colors, radius, spacing, typography } from "@/src/theme";
import { formatCurrency } from "@/src/utils/currency";

type MonthlyPlanFormProps = {
  expectedIncome: string;
  categories: CategoryInput[];
  plannedTotal: number;
  plannedBalance: number;

  saving: boolean;
  deleting: boolean;

  onChangeExpectedIncome: (value: string) => void;
  onChangeCategoryAmount: (index: number, value: string) => void;
  onSubmit: () => void;
};

export function MonthlyPlanForm({
  expectedIncome,
  categories,
  plannedTotal,
  plannedBalance,
  saving,
  deleting,
  onChangeExpectedIncome,
  onChangeCategoryAmount,
  onSubmit,
}: MonthlyPlanFormProps) {
  const disabled = saving || deleting;

  return (
    <>
      <View style={styles.card}>
        <FormField label="Renda prevista no mês">
          <TextInput
            style={styles.input}
            placeholder="Ex: 3000"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={expectedIncome}
            onChangeText={onChangeExpectedIncome}
            editable={!disabled}
          />
        </FormField>

        <View style={styles.previewBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total planejado</Text>

            <Text style={styles.expenseText}>
              {formatCurrency(plannedTotal)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Saldo planejado</Text>

            <Text
              style={
                plannedBalance >= 0
                  ? styles.incomeText
                  : styles.expenseText
              }
            >
              {formatCurrency(plannedBalance)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Categorias planejadas
      </Text>

      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <View
            key={category.name}
            style={styles.categoryRow}
          >
            <Text style={styles.categoryName}>
              {category.name}
            </Text>

            <TextInput
              style={styles.categoryInput}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={category.plannedAmount}
              editable={!disabled}
              onChangeText={(value) =>
                onChangeCategoryAmount(index, value)
              }
            />
          </View>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.buttonPressed,
        ]}
        disabled={disabled}
        onPress={onSubmit}
      >
        <Text style={styles.buttonText}>
          {saving ? "Salvando..." : "Salvar planejamento"}
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },

  categoriesContainer: {
    gap: spacing.sm,
  },

  categoryRow: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },

  categoryName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },

  categoryInput: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    width: 110,
    textAlign: "right",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
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

  button: {
    backgroundColor: colors.success,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    marginVertical: spacing.lg,
  },

  buttonText: {
    color: colors.successDark,
    fontWeight: "800",
    fontSize: typography.body,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});