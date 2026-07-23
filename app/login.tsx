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
import { loginUser } from "@/src/services/auth";
import { saveAuthData } from "@/src/storage/auth-storage";
import { normalizeEmail, validateLogin } from "@/src/utils/authValidators";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (loading) {
      return;
    }

    const validationError = validateLogin({
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

      const normalizedEmail = normalizeEmail(email);

      const data = await loginUser({
        email: normalizedEmail,
        password,
      });

      await saveAuthData(data.token, data.user);

      router.replace("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      Alert.alert(
        "Erro",
        "Não foi possível fazer login. Verifique seus dados e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Entrar</Text>

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
          textContentType="password"
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <Button
          title="Entrar"
          loadingTitle="Entrando..."
          loading={loading}
          onPress={handleLogin}
        />

        <Pressable
          style={styles.linkButton}
          onPress={() => router.push("/register")}
          disabled={loading}
        >
          <Text style={styles.link}>Criar uma conta</Text>
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
