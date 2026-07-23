import { Pressable, StyleSheet, Text } from "react-native";

type AuthLinkProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthLink({ text, onPress, disabled = false }: AuthLinkProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
