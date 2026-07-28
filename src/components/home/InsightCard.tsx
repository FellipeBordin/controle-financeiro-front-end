import { StyleSheet, Text, View } from "react-native";

type InsightCardProps = {
  insight: string;
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <View style={styles.aiCard}>
      <Text style={styles.aiTitle}>💡 Insight do mês</Text>
      <Text style={styles.aiText}>{insight}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aiCard: {
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#1e40af",
  },
  aiTitle: {
    color: "#38bdf8",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 8,
  },
  aiText: {
    color: "#e2e8f0",
    fontSize: 14,
    lineHeight: 21,
  },
});
