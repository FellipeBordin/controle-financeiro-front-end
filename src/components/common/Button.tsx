import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
  title: string;
  loadingTitle?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void | Promise<void>;
};

export function Button({
  title,
  loadingTitle = "Carregando...",
  loading = false,
  disabled = false,
  onPress,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading && <ActivityIndicator size="small" color="#052e16" />}

      <Text style={styles.text}>{loading ? loadingTitle : title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: "#052e16",
    fontSize: 16,
    fontWeight: "700",
  },
});
