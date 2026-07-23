import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthSession, AuthUser } from "@/src/types/auth";

const TOKEN_KEY = "app_token";
const USER_KEY = "app_user";

export async function saveAuthData(
  token: string,
  user: AuthUser,
): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser(): Promise<AuthUser | null> {
  try {
    const storedUser = await AsyncStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as AuthUser;
  } catch (error) {
    console.error("Erro ao recuperar usuário armazenado:", error);

    await AsyncStorage.removeItem(USER_KEY);

    return null;
  }
}

export async function getAuthData(): Promise<AuthSession | null> {
  try {
    const entries = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);

    const token = entries.find(([key]) => key === TOKEN_KEY)?.[1];

    const storedUser = entries.find(([key]) => key === USER_KEY)?.[1];

    if (!token || !storedUser) {
      await clearAuthData();
      return null;
    }

    const user = JSON.parse(storedUser) as AuthUser;

    return {
      token,
      user,
    };
  } catch (error) {
    console.error("Erro ao recuperar sessão:", error);

    await clearAuthData();

    return null;
  }
}

export async function clearAuthData(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
