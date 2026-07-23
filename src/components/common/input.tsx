import type { ComponentProps } from "react";
import { StyleSheet, TextInput } from "react-native";

type InputProps = ComponentProps<typeof TextInput>;

export function Input({ style, ...rest }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#94a3b8"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
    fontSize: 16,
  },
});
