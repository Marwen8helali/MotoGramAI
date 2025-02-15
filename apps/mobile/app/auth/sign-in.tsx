import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError("");

      const result = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: result.createdSessionId });
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Connexion
      </Text>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSignIn}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        Se connecter
      </Button>

      <Button
        mode="text"
        onPress={() => router.push("/auth/sign-up")}
        style={styles.button}
      >
        Pas encore de compte ? S'inscrire
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
}); 