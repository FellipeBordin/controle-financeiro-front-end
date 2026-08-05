import type { ReactNode } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    type ScrollViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "@/src/theme";

type ScreenContainerProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
} & Omit<ScrollViewProps, "refreshControl">;

export function ScreenContainer({
  children,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  ...rest
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          contentContainerStyle,
        ]}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          ) : undefined
        }
        {...rest}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});