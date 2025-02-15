import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";

export default function AddMotorcycleScreen() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [specs, setSpecs] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { getToken } = useAuth();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      const token = await getToken();
      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/motorcycles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand,
            model,
            year: parseInt(year),
            specs: specs ? JSON.parse(specs) : undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la moto");
      }

      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Ajouter une moto
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        label="Marque"
        value={brand}
        onChangeText={setBrand}
        style={styles.input}
      />

      <TextInput
        label="Modèle"
        value={model}
        onChangeText={setModel}
        style={styles.input}
      />

      <TextInput
        label="Année"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Spécifications (JSON)"
        value={specs}
        onChangeText={setSpecs}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading || !brand || !model}
        style={styles.button}
      >
        Ajouter
      </Button>
    </ScrollView>
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
    marginTop: 8,
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
}); 