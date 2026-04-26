import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "app_token";
const USER_KEY = "app_user";

export async function saveAuthData(token: string, user: unknown) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser() {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export async function clearAuthData() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
