import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError("");

      const result = await signUp.create({
        emailAddress: email,
        password,
        username,
        phoneNumber
      });

      console.log("Résultat inscription:", result);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)");
      } else {
        throw new Error("Une erreur est survenue lors de l'inscription");
      }
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Inscription
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
        label="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Numéro de téléphone"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
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
        onPress={handleSignUp}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        S'inscrire
      </Button>

      <Button
        mode="text"
        onPress={() => router.push("/auth/sign-in")}
        style={styles.button}
      >
        Déjà un compte ? Se connecter
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