import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
    colors,
    iconSizes,
    radius,
    spacing,
    typography,
} from "@/src/theme";

type ErrorStateProps = {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Algo deu errado",
  message,
  retryLabel = "Tentar novamente",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={iconSizes.lg}
          color={colors.danger}
        />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.message}>{message}</Text>

      {onRetry ? (
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={iconSizes.sm}
            color={colors.text}
          />

          <Text style={styles.retryText}>
            {retryLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.dangerDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
    textAlign: "center",
  },

  message: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    textAlign: "center",
    lineHeight: 20,
    marginTop: spacing.sm,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 44,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },

  retryText: {
    color: colors.text,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});