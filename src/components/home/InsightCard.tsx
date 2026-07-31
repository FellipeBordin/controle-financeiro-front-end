import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/src/theme";
import { Card } from "../common/Card";

type InsightCardProps = {
  insight: string;
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <Card style={styles.aiCard}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="lightbulb-on-outline"
          size={24}
          color={colors.primary}
        />

        <Text style={styles.aiTitle}>Insight do mês</Text>
      </View>

      <Text style={styles.aiText}>{insight}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  aiCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  aiTitle: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: "900",
  },

  aiText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
});