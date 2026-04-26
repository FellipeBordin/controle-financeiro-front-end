import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getToken } from "@/src/storage/auth-storage";

export default function IndexScreen() {
  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();

      if (token) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    }

    checkAuth();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color="#22c55e" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
});
