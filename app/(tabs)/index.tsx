import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LoadingState } from "@/src/components/common/LoadingState";
import { ScreenContainer } from "@/src/components/common/ScreenContainer";
import { BalanceCard } from "@/src/components/home/BalanceCard";
import { InsightCard } from "@/src/components/home/InsightCard";
import { LatestTransactions } from "@/src/components/home/LatestTransactions";
import { QuickActions } from "@/src/components/home/QuickActions";
import { useHome } from "@/src/hooks/useHome";
import {
  colors,
  iconSizes,
  radius,
  spacing,
  typography,
} from "@/src/theme";

export default function HomeScreen() {
  const {
    summary,
    insight,
    loading,
    refreshing,
    latestTransactions,
    loadData,
    refreshData,
    handleLogout,
    handleDeleteTransaction,
    handleEditTransaction,
  } = useHome();

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  return (
    <ScreenContainer
      refreshing={refreshing}
      onRefresh={refreshData}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Olá</Text>

          <Text style={styles.title}>
            Controle financeiro
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => {
            void handleLogout();
          }}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <MaterialCommunityIcons
            name="logout"
            size={iconSizes.sm}
            color={colors.danger}
          />

          <Text style={styles.logoutButtonText}>
            Sair
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <LoadingState message="Carregando informações..." />
      ) : (
        <>
          <BalanceCard summary={summary} />

          {insight ? (
            <InsightCard insight={insight} />
          ) : null}

          <QuickActions />

          <LatestTransactions
            transactions={latestTransactions}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: spacing.lg,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },

  headerText: {
    flex: 1,
  },

  welcomeText: {
    color: colors.textSecondary,
    fontSize: typography.caption,
  },

  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: spacing.xs,
  },

  logoutButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  logoutButtonText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
