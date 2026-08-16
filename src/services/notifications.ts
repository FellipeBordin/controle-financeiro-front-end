import { Platform } from "react-native";

async function getNotifications() {
  if (Platform.OS === "web") {
    return null;
  }

  return await import("expo-notifications");
}

export async function requestNotificationPermission() {
  const Notifications = await getNotifications();

  if (!Notifications) {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Alertas financeiros",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#22c55e",
    });
  }

  const currentPermission = await Notifications.getPermissionsAsync();

  if (currentPermission.granted) {
    return true;
  }

  const requestedPermission = await Notifications.requestPermissionsAsync();

  return requestedPermission.granted;
}

export async function cancelAllFinancialNotifications() {
  const Notifications = await getNotifications();

  if (!Notifications) {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailyExpenseReminder() {
  const Notifications = await getNotifications();

  if (!Notifications) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Lembrete financeiro",
      body: "Você já registrou suas receitas e despesas de hoje?",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: "default",
      hour: 20,
      minute: 0,
    },
  });
}

export async function scheduleMonthReviewReminder() {
  const Notifications = await getNotifications();

  if (!Notifications) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Fechamento do mês",
      body: "Revise seu planejamento mensal e veja se alguma categoria estourou.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
      channelId: "default",
      day: 28,
      hour: 19,
      minute: 0,
    },
  });
}

export async function enableFinancialNotifications() {
  const Notifications = await getNotifications();

  if (!Notifications) {
    return false;
  }

  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    return false;
  }

  await cancelAllFinancialNotifications();
  await scheduleDailyExpenseReminder();
  await scheduleMonthReviewReminder();

  return true;
}

export async function getScheduledFinancialNotifications() {
  const Notifications = await getNotifications();

  if (!Notifications) {
    return [];
  }

  return await Notifications.getAllScheduledNotificationsAsync();
}
