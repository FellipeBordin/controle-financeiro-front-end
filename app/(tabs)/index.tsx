import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { BalanceCard } from "@/src/components/home/BalanceCard";
import { InsightCard } from "@/src/components/home/InsightCard";
import { LatestTransactions } from "@/src/components/home/LatestTransactions";
import { QuickActions } from "@/src/components/home/QuickActions";
import { useHome } from "@/src/hooks/useHome";

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
      void loadData();
    }, [loadData]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Olá</Text>

            <Text style={styles.title}>Controle financeiro</Text>
          </View>

          <Pressable
            style={styles.logoutButton}
            onPress={() => {
              void handleLogout();
            }}
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Carregando informações...</Text>
          </View>
        ) : (
          <>
            <BalanceCard summary={summary} />

            {insight && <InsightCard insight={insight} />}

            <QuickActions />

            <LatestTransactions
              transactions={latestTransactions}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcomeText: {
    color: "#94a3b8",
    fontSize: 14,
  },

  title: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 2,
  },

  logoutButton: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  logoutButtonText: {
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: "800",
  },

  loadingContainer: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    color: "#94a3b8",
    fontSize: 14,
  },
});
