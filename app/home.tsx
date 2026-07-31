import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BalanceCard } from "@/src/components/home/BalanceCard";
import { InsightCard } from "@/src/components/home/InsightCard";
import { LatestTransactions } from "@/src/components/home/LatestTransactions";
import { QuickActions } from "@/src/components/home/QuickActions";
import { useHome } from "@/src/hooks/useHome";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function HomeScreen() {
  const {
    summary,
    insight,
    loading,
    latestTransactions,
    loadData,
    handleLogout,
    handleDeleteTransaction,
    handleEditTransaction,
  } = useHome();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Bem-vindo</Text>

            <Text style={styles.subtitle}>
              Seu controle financeiro
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={colors.danger}
            />

            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>

        <BalanceCard summary={summary} />

        {insight ? <InsightCard insight={insight} /> : null}

        <QuickActions />

        <LatestTransactions
          transactions={latestTransactions}
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
        />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },

  header: {
    marginBottom: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: spacing.xs,
  },

  logoutButton: {
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },

  logoutButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  logoutText: {
    color: colors.danger,
    fontWeight: "800",
  },
});