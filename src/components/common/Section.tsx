import type { ReactNode } from "react";
import {
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import { colors, spacing, typography } from "@/src/theme";

type SectionProps = {
  title: string;
  children: ReactNode;
  rightContent?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Section({
  title,
  children,
  rightContent,
  style,
  contentStyle,
}: SectionProps) {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        {rightContent ? rightContent : null}
      </View>

      <View style={contentStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "900",
  },
});