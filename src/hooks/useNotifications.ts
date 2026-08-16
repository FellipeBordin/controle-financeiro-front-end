import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";

import {
  cancelAllFinancialNotifications,
  enableFinancialNotifications,
  getScheduledFinancialNotifications,
} from "@/src/services/notifications";
import {
  getNotificationsEnabled,
  saveNotificationsEnabled,
} from "@/src/storage/notification-storage";
import { getApiErrorMessage } from "@/src/utils/getApiErrorMessage";

export function useNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showMessage = useCallback((title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    Alert.alert(title, message);
  }, []);

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [storedEnabled, scheduled] = await Promise.all([
        getNotificationsEnabled(),
        getScheduledFinancialNotifications(),
      ]);

      setEnabled(storedEnabled);
      setScheduledCount(scheduled.length);
    } catch (error) {
      console.error("Erro ao carregar status das notificações:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível carregar as configurações de notificações.",
      );

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEnable = useCallback(async () => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const success = await enableFinancialNotifications();

      if (!success) {
        showMessage(
          "Permissão necessária",
          Platform.OS === "web"
            ? "As notificações não estão disponíveis na versão web."
            : "Você precisa permitir notificações para ativar os alertas.",
        );

        return;
      }

      await saveNotificationsEnabled(true);

      await loadStatus();

      showMessage("Sucesso", "Alertas automáticos ativados.");
    } catch (error) {
      console.error("Erro ao ativar notificações:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível ativar os alertas.",
      );

      showMessage("Erro", message);
    } finally {
      setSaving(false);
    }
  }, [loadStatus, saving, showMessage]);

  const handleDisable = useCallback(async () => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      await cancelAllFinancialNotifications();
      await saveNotificationsEnabled(false);

      await loadStatus();

      showMessage("Pronto", "Alertas automáticos desativados.");
    } catch (error) {
      console.error("Erro ao desativar notificações:", error);

      const message = getApiErrorMessage(
        error,
        "Não foi possível desativar os alertas.",
      );

      showMessage("Erro", message);
    } finally {
      setSaving(false);
    }
  }, [loadStatus, saving, showMessage]);

  const handleToggleNotifications = useCallback(async () => {
    if (enabled) {
      await handleDisable();
      return;
    }

    await handleEnable();
  }, [enabled, handleDisable, handleEnable]);

  return {
    enabled,
    scheduledCount,

    loading,
    saving,
    error,

    loadStatus,
    handleEnable,
    handleDisable,
    handleToggleNotifications,
  };
}
