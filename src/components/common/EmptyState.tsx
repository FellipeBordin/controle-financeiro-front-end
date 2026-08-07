import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    colors,
    iconSizes,
    radius,
    spacing,
    typography,
} from "@/src/theme";

type EmptyStateProps = {
  title: string;
  message?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  message,
  icon = "inbox-outline",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={iconSizes.lg}
          color={colors.textSecondary}
        />
      </View>

      <Text style={styles.title}>{title}</Text>

      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}

      {actionLabel && onAction ? (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={onAction}
        >
          <Text style={styles.actionText}>
            {actionLabel}
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
    backgroundColor: colors.card,
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
    marginTop: spacing.sm,
    lineHeight: 20,
  },

  actionButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  actionButtonPressed: {
    opacity: 0.75,
  },

  actionText: {
    color: colors.text,
    fontWeight: "800",
  },
});