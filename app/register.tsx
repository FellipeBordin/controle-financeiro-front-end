import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerUser } from "@/src/services/auth";
import { saveAuthData } from "@/src/storage/auth-storage";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      if (!name || !email || !password) {
        Alert.alert("Atenção", "Preencha todos os campos.");
        return;
      }

      const data = await registerUser({ name, email, password });

      await saveAuthData(data.token, data.user);

      router.replace("/home");
    } catch {
      Alert.alert("Erro", "Não foi possível criar a conta.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#94a3b8"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/login")}>
        <Text style={styles.link}>Já tenho uma conta</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#052e16",
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
  },
});
