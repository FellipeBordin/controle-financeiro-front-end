import type { ReactNode } from "react";
import {
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import { colors, spacing, typography } from "@/src/theme";

type FormFieldProps = {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function FormField({
  label,
  error,
  helperText,
  required = false,
  children,
  style,
}: FormFieldProps) {
  const supportingText = error ?? helperText;

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      {children}

      {supportingText ? (
        <Text style={[styles.supportingText, error && styles.errorText]}>
          {supportingText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },

  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
  },

  required: {
    color: colors.danger,
  },

  supportingText: {
    color: colors.textSecondary,
    fontSize: typography.small,
  },

  errorText: {
    color: colors.danger,
  },
});