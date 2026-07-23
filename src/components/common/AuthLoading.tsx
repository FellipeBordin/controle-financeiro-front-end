import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function AuthLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#38bdf8" />

      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  text: {
    color: "#94a3b8",
    fontSize: 16,
  },
});
