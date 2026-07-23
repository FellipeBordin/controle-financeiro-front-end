import { useState } from "react";
import { Alert, Keyboard } from "react-native";
import { router } from "expo-router";

import { AuthLink } from "@/src/components/auth/AuthLink";
import { AuthScreenLayout } from "@/src/components/auth/AuthScreenLayout";
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

      const data = await loginUser({
        email: normalizeEmail(email),
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
    <AuthScreenLayout
      title="Entrar"
      footer={
        <AuthLink
          text="Criar uma conta"
          onPress={() => router.push("/register")}
          disabled={loading}
        />
      }
    >
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
    </AuthScreenLayout>
  );
}
