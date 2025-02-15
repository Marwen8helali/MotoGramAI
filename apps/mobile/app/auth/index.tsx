import { View, StyleSheet } from "react-native";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface ClerkError {
  errors?: Array<{
    code: string;
    message: string;
    longMessage?: string;
  }>;
  status?: number;
  message?: string;
}

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error("Email et mot de passe requis");
      }

      if (isLogin) {
        console.log("Tentative de connexion avec:", { email });
        try {
          const result = await signIn.create({
            identifier: email,
            password,
          });
          
          console.log("Résultat connexion:", JSON.stringify(result, null, 2));

          if (result.status === "complete") {
            await setSignInActive({ session: result.createdSessionId });
          } else if (result.status === "needs_first_factor") {
            throw new Error("Email ou mot de passe incorrect");
          } else {
            console.log("Statut inattendu:", result);
            throw new Error(`Statut inattendu: ${result.status}`);
          }
        } catch (signInError) {
          console.error("Erreur de connexion détaillée:", JSON.stringify(signInError, null, 2));
          throw signInError;
        }
      } else {
        console.log("Tentative d'inscription avec:", { email });
        try {
          const result = await signUp.create({
            emailAddress: email,
            password,
          });

          console.log("Résultat inscription:", JSON.stringify(result, null, 2));

          if (result.status === "complete") {
            await setSignUpActive({ session: result.createdSessionId });
          } else if (result.status === "missing_requirements") {
            throw new Error("Informations manquantes pour l'inscription");
          } else if (result.status === "needs_first_factor") {
            throw new Error("Vérification supplémentaire requise");
          } else {
            console.log("Statut inattendu:", result);
            throw new Error(`Statut inattendu: ${result.status}`);
          }
        } catch (signUpError) {
          console.error("Erreur d'inscription détaillée:", JSON.stringify(signUpError, null, 2));
          throw signUpError;
        }
      }
    } catch (err) {
      console.error("Erreur d'authentification complète:", JSON.stringify(err, null, 2));
      
      const clerkError = err as ClerkError;
      if (clerkError.errors && clerkError.errors.length > 0) {
        // Gestion des erreurs spécifiques de Clerk
        const firstError = clerkError.errors[0];
        switch (firstError.code) {
          case "form_password_pwned":
            setError("Ce mot de passe a été compromis, veuillez en choisir un autre");
            break;
          case "form_password_length":
            setError("Le mot de passe doit contenir au moins 8 caractères");
            break;
          case "form_identifier_not_found":
            setError("Email non trouvé");
            break;
          case "form_password_incorrect":
            setError("Mot de passe incorrect");
            break;
          case "form_email_invalid":
            setError("Format d'email invalide");
            break;
          default:
            setError(firstError.message || "Une erreur est survenue");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text variant="headlineMedium" style={styles.title}>
          {isLogin ? "Connexion" : "Inscription"}
        </Text>

        {error && (
          <Text style={styles.error} variant="bodyMedium">
            {error}
          </Text>
        )}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          error={!!error && error.toLowerCase().includes('email')}
        />

        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          error={!!error && error.toLowerCase().includes('mot de passe')}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        >
          {isLogin ? "Se connecter" : "S'inscrire"}
        </Button>

        <Button
          mode="text"
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
        >
          {isLogin
            ? "Pas encore de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchButton: {
    marginTop: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
}); 