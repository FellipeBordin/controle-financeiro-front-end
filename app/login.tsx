import { router } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard } from "react-native";

import { AuthLink } from "@/src/components/auth/AuthLink";
import { AuthScreenLayout } from "@/src/components/auth/AuthScreenLayout";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/input";
import { useAuth } from "@/src/hooks/useAuth";
import { loginUser } from "@/src/services/auth";
import { normalizeEmail, validateLogin } from "@/src/utils/authValidators";
import { getApiErrorMessage } from "@/src/utils/getApiErrorMessage";

export default function LoginScreen() {
  const { signIn } = useAuth();

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

      await signIn(data.token, data.user);

      router.replace("/home");
    }  catch (error) {
  console.error("Erro ao fazer login:", error);

  const message = getApiErrorMessage(
    error,
    "Não foi possível fazer login.",
  );

  Alert.alert("Erro", message);
} 
     finally {
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
