import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clearAuthData,
  getAuthData,
  saveAuthData,
} from "@/src/storage/auth-storage";
import type { AuthUser } from "@/src/types/auth";

type AuthContextData = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const authData = await getAuthData();

      if (!authData) {
        setUser(null);
        setToken(null);
        return;
      }

      setUser(authData.user);
      setToken(authData.token);
    } catch (error) {
      console.error("Erro ao restaurar sessão:", error);

      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(async (newToken: string, newUser: AuthUser) => {
    await saveAuthData(newToken, newUser);

    setToken(newToken);
    setUser(newUser);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await clearAuthData();
    } finally {
      setToken(null);
      setUser(null);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [user, token, loading, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
