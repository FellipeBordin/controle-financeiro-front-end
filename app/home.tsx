import { BalanceCard } from "@/src/components/home/BalanceCard";
import { InsightCard } from "@/src/components/home/InsightCard";
import { LatestTransactions } from "@/src/components/home/LatestTransactions";
import { QuickActions } from "@/src/components/home/QuickActions";
import { useHome } from "@/src/hooks/useHome";
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
          <RefreshControl refreshing={loading} onRefresh={loadData} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>Seu controle financeiro $</Text>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>

        <BalanceCard summary={summary} />

        {insight && <InsightCard insight={insight} />}

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
    backgroundColor: "#020617",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginTop: 12,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    marginTop: 4,
  },

  logoutButton: {
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#334155",
  },

  logoutText: {
    color: "#f87171",
    fontWeight: "800",
  },
});
