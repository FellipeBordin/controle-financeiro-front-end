import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/src/theme";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Carregando...",
}: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colors.primary}
      />

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },

  message: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: "center",
  },
});