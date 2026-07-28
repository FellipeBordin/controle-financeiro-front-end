import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function QuickActions() {
  return (
    <>
      <Text style={styles.sectionTitle}>Ações rápidas</Text>

      <View style={styles.actionsGrid}>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/new-transaction")}
        >
          <Text style={styles.actionIcon}>＋</Text>
          <Text style={styles.actionText}>Novo lançamento</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/goals")}
        >
          <Text style={styles.actionIcon}>🎯</Text>
          <Text style={styles.actionText}>Metas</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/monthly-plan")}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>Planejamento</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/notifications")}
        >
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionText}>Alertas</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 16,
    minHeight: 104,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#334155",
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  actionText: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "800",
  },
});
