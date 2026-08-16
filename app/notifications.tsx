import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/src/components/common/Card";
import { ErrorState } from "@/src/components/common/ErrorState";
import { LoadingState } from "@/src/components/common/LoadingState";
import { PageHeader } from "@/src/components/common/PageHeader";
import { ScreenContainer } from "@/src/components/common/ScreenContainer";
import { useNotifications } from "@/src/hooks/useNotifications";
import { colors, iconSizes, radius, spacing, typography } from "@/src/theme";

export default function NotificationsScreen() {
  const {
    enabled,
    scheduledCount,
    loading,
    saving,
    error,
    loadStatus,
    handleToggleNotifications,
  } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      void loadStatus();
    }, [loadStatus]),
  );

  if (error) {
    return (
      <ScreenContainer>
        <PageHeader
          title="Alertas automáticos"
          subtitle="Receba lembretes para manter seu controle financeiro atualizado."
          onBack={() => router.replace("/home")}
        />

        <ErrorState
          title="Erro ao carregar"
          message={error}
          onRetry={() => {
            void loadStatus();
          }}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader
        title="Alertas automáticos"
        subtitle="Receba lembretes para manter seu controle financeiro atualizado."
        onBack={() => router.replace("/home")}
      />

      {loading ? (
        <LoadingState message="Carregando alertas..." />
      ) : (
        <>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name={enabled ? "bell-check-outline" : "bell-off-outline"}
                size={iconSizes.md}
                color={enabled ? colors.success : colors.danger}
              />

              <Text style={styles.cardTitle}>Status</Text>
            </View>

            <Text style={enabled ? styles.enabledText : styles.disabledText}>
              {enabled ? "Ativados" : "Desativados"}
            </Text>

            <Text style={styles.description}>
              Notificações agendadas: {scheduledCount}
            </Text>
          </Card>

          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="clock-alert-outline"
                size={iconSizes.md}
                color={colors.primary}
              />

              <Text style={styles.cardTitle}>Alertas incluídos</Text>
            </View>

            <View style={styles.alertRow}>
              <MaterialCommunityIcons
                name="calendar-clock-outline"
                size={iconSizes.sm}
                color={colors.textSecondary}
              />

              <Text style={styles.description}>
                Lembrete diário às 20h para registrar gastos.
              </Text>
            </View>

            <View style={styles.alertRow}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={iconSizes.sm}
                color={colors.textSecondary}
              />

              <Text style={styles.description}>
                Revisão mensal no dia 28 às 19h.
              </Text>
            </View>
          </Card>

          <Pressable
            style={({ pressed }) => [
              enabled ? styles.dangerButton : styles.button,
              saving && styles.buttonDisabled,
              pressed && !saving && styles.buttonPressed,
            ]}
            disabled={saving}
            onPress={() => {
              void handleToggleNotifications();
            }}
          >
            <MaterialCommunityIcons
              name={enabled ? "bell-off-outline" : "bell-ring-outline"}
              size={iconSizes.sm}
              color={enabled ? colors.text : colors.successDark}
            />

            <Text style={enabled ? styles.dangerButtonText : styles.buttonText}>
              {saving
                ? "Processando..."
                : enabled
                  ? "Desativar alertas"
                  : "Ativar alertas"}
            </Text>
          </Pressable>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  cardTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: "800",
  },

  enabledText: {
    color: colors.success,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },

  disabledText: {
    color: colors.danger,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },

  description: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  button: {
    minHeight: 52,
    backgroundColor: colors.success,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  buttonText: {
    color: colors.successDark,
    fontWeight: "800",
    fontSize: typography.body,
  },

  dangerButton: {
    minHeight: 52,
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  dangerButtonText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: typography.body,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
