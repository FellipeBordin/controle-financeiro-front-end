import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, iconSizes, spacing, typography } from "@/src/theme";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function PageHeader({
  title,
  subtitle,
  onBack,
}: PageHeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={onBack}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={iconSizes.md}
            color={colors.primary}
          />

          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },

  backButtonPressed: {
    opacity: 0.7,
  },

  backText: {
    color: colors.primary,
    fontWeight: "700",
  },

  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "900",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },
});