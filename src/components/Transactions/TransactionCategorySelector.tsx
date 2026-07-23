import { Pressable, StyleSheet, Text, View } from "react-native";

type TransactionCategorySelectorProps = {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
};

export function TransactionCategorySelector({
  categories,
  value,
  onChange,
}: TransactionCategorySelectorProps) {
  return (
    <View>
      <Text style={styles.label}>Categoria</Text>

      <View style={styles.container}>
        {categories.map((category) => {
          const isActive = value === category;

          return (
            <Pressable
              key={category}
              style={[styles.button, isActive && styles.buttonActive]}
              onPress={() => onChange(category)}
            >
              <Text style={[styles.text, isActive && styles.textActive]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1e293b",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  buttonActive: {
    backgroundColor: "#38bdf8",
    borderColor: "#38bdf8",
  },
  text: {
    color: "#cbd5e1",
    fontWeight: "600",
  },
  textActive: {
    color: "#082f49",
  },
});