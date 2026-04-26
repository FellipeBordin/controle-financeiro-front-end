import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  cancelAllFinancialNotifications,
  enableFinancialNotifications,
  getScheduledFinancialNotifications,
} from "@/src/services/notifications";
import {
  getNotificationsEnabled,
  saveNotificationsEnabled,
} from "@/src/storage/notification-storage";

export default function NotificationsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

  async function loadStatus() {
    const storedEnabled = await getNotificationsEnabled();
    const scheduled = await getScheduledFinancialNotifications();

    setEnabled(storedEnabled);
    setScheduledCount(scheduled.length);
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleEnable() {
    const success = await enableFinancialNotifications();

    if (!success) {
      Alert.alert(
        "Permissão necessária",
        "Você precisa permitir notificações para ativar os alertas.",
      );
      return;
    }

    await saveNotificationsEnabled(true);
    await loadStatus();

    Alert.alert("Sucesso", "Alertas automáticos ativados.");
  }

  async function handleDisable() {
    await cancelAllFinancialNotifications();
    await saveNotificationsEnabled(false);
    await loadStatus();

    Alert.alert("Pronto", "Alertas automáticos desativados.");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.replace("/home")}>
        <Text style={styles.back}>← Voltar</Text>
      </Pressable>

      <Text style={styles.title}>Alertas automáticos</Text>
      <Text style={styles.subtitle}>
        Receba lembretes para manter seu controle financeiro atualizado.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>

        <Text style={enabled ? styles.enabledText : styles.disabledText}>
          {enabled ? "Ativados" : "Desativados"}
        </Text>

        <Text style={styles.description}>
          Notificações agendadas: {scheduledCount}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Alertas incluídos</Text>

        <Text style={styles.description}>
          • Lembrete diário às 20h para registrar gastos.
        </Text>

        <Text style={styles.description}>
          • Revisão mensal no dia 28 às 19h.
        </Text>
      </View>

      {enabled ? (
        <Pressable style={styles.dangerButton} onPress={handleDisable}>
          <Text style={styles.dangerButtonText}>Desativar alertas</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.button} onPress={handleEnable}>
          <Text style={styles.buttonText}>Ativar alertas</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  back: {
    color: "#38bdf8",
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  enabledText: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  disabledText: {
    color: "#ef4444",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#052e16",
    fontWeight: "800",
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: "#ef4444",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  dangerButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },

  secondaryButtonText: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "800",
  },
});
