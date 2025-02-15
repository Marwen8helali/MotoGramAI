import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { theme } from "../src/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Cette fonction gère la redirection basée sur l'état d'authentification
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      console.log("Auth pas encore chargé");
      return;
    }

    console.log("État auth:", { isSignedIn, segments });

    const inTabsGroup = segments[0] === "(tabs)";

    if (isSignedIn && !inTabsGroup) {
      console.log("Redirection vers tabs");
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 0);
    } else if (!isSignedIn && inTabsGroup) {
      console.log("Redirection vers auth");
      setTimeout(() => {
        router.replace("/auth");
      }, 0);
    }
  }, [isSignedIn, isLoaded, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey ?? ""}
      tokenCache={tokenCache}
    >
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <InitialLayout />
        </PaperProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  );
} 