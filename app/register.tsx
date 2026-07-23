import { useState } from "react";
import { Alert, Keyboard, StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import { AuthLink } from "@/src/components/auth/AuthLink";
import { AuthScreenLayout } from "@/src/components/auth/AuthScreenLayout";
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

      const data = await registerUser({
        name: name.trim(),
        email: normalizeEmail(email),
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
    <AuthScreenLayout
      title="Criar conta"
      footer={
        <AuthLink
          text="Já tenho uma conta"
          onPress={() => router.push("/login")}
          disabled={loading}
        />
      }
    >
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
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  passwordHint: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
    marginTop: -2,
    marginBottom: 8,
  },
});
