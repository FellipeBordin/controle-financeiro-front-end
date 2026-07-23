import { router, Stack, usePathname } from "expo-router";
import { useEffect } from "react";

import { AuthLoading } from "@/src/components/common/AuthLoading";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { useAuth } from "@/src/hooks/useAuth";

const PUBLIC_ROUTES = ["/login", "/register"];

function RootNavigator() {
  const pathname = usePathname();

  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isPublicRoute) {
      router.replace("/home");
    }
  }, [loading, isAuthenticated, pathname]);

  if (loading) {
    return <AuthLoading />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
