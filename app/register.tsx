import { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/input";
import { registerUser } from "@/src/services/auth";
import { saveAuthData } from "@/src/storage/auth-storage";
import { normalizeEmail, validateRegister } from "@/src/utils/authValidators";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (loading) {
      return;
    }

    const validationError = validateRegister({
      name,
      email,
      password,
    });

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();

      const normalizedName = name.trim();
      const normalizedEmail = normalizeEmail(email);

      const data = await registerUser({
        name: normalizedName,
        email: normalizedEmail,
        password,
      });

      await saveAuthData(data.token, data.user);

      router.replace("/home");
    } catch (error) {
      console.error("Erro ao criar conta:", error);

      Alert.alert(
        "Erro",
        "Não foi possível criar a conta. Verifique os dados e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Criar conta</Text>

        <Input
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          textContentType="name"
          editable={!loading}
          returnKeyType="next"
        />

        <Input
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          editable={!loading}
          returnKeyType="next"
        />

        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />

        <Text style={styles.passwordHint}>
          Use no mínimo 8 caracteres, incluindo letra maiúscula, minúscula e
          número.
        </Text>

        <Button
          title="Cadastrar"
          loadingTitle="Cadastrando..."
          loading={loading}
          onPress={handleRegister}
        />

        <Pressable
          style={styles.linkButton}
          onPress={() => router.push("/login")}
          disabled={loading}
        >
          <Text style={styles.link}>Já tenho uma conta</Text>
        </Pressable>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  },
  passwordHint: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
    marginTop: -2,
    marginBottom: 8,
  },
  linkButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  link: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
});
