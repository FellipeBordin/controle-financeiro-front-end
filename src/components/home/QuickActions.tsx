import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, spacing } from "@/src/theme";
import { Section } from "../common/Section";

type ActionItem = {
  label: string;
  route:
    | "/new-transaction"
    | "/goals"
    | "/monthly-plan"
    | "/notifications";
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

const actions: ActionItem[] = [
  {
    label: "Novo lançamento",
    route: "/new-transaction",
    icon: "plus-circle",
    color: colors.primary,
  },
  {
    label: "Metas",
    route: "/goals",
    icon: "target",
    color: colors.success,
  },
  {
    label: "Planejamento",
    route: "/monthly-plan",
    icon: "chart-box-outline",
    color: colors.primary,
  },
  {
    label: "Alertas",
    route: "/notifications",
    icon: "bell-outline",
    color: colors.danger,
  },
];

export function QuickActions() {
  return (
    <>
      <Section title="Ações rápidas"
      contentStyle={styles.actionsGrid}
      > 
       {actions.map((action) => (
          <Pressable
            key={action.route}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push(action.route)}
          >
            <MaterialCommunityIcons
              name={action.icon}
              size={30}
              color={action.color}
              style={styles.actionIcon}
            />

            <Text style={styles.actionText}>{action.label}</Text>
          </Pressable>
        ))}
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    },

  actionButton: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    minHeight: 104,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
  },

  actionIcon: {
    marginBottom: spacing.sm,
  },

  actionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});