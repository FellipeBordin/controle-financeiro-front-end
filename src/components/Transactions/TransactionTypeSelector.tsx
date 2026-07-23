import type { TransactionType } from "@/src/types/transaction";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TransactionTypeSelectorProps = {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
};

export function TransactionTypeSelector({
  value,
  onChange,
}: TransactionTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <TypeButton
        label="Despesa"
        active={value === "expense"}
        onPress={() => onChange("expense")}
      />

      <TypeButton
        label="Receita"
        active={value === "income"}
        onPress={() => onChange("income")}
      />
    </View>
  );
}

type TypeButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function TypeButton({ label, active, onPress }: TypeButtonProps) {
  return (
    <Pressable
      style={[styles.button, active && styles.buttonActive]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  buttonActive: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  text: {
    color: "#cbd5e1",
    fontWeight: "700",
  },
  textActive: {
    color: "#052e16",
  },
});