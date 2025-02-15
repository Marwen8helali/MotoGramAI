import { View, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AddPostScreen() {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { getToken } = useAuth();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      const token = await getToken();

      // Créer le FormData avec les images
      const formData = new FormData();
      formData.append("caption", caption);
      
      images.forEach((uri, index) => {
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image";
        
        formData.append("photos", {
          uri,
          name: filename,
          type,
        } as any);
      });

      const response = await fetch(
        `${Constants.expoConfig?.extra?.apiUrl}/api/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création du post");
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
        Créer une publication
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.imageGrid}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePreview} />
        ))}
        {images.length < 4 && (
          <Pressable style={styles.addImageButton} onPress={pickImage}>
            <MaterialCommunityIcons name="plus" size={32} color="#666" />
          </Pressable>
        )}
      </View>

      <TextInput
        label="Légende"
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading || !caption || images.length === 0}
        style={styles.button}
      >
        Publier
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
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  imagePreview: {
    width: "48%",
    aspectRatio: 1,
    margin: "1%",
    borderRadius: 8,
  },
  addImageButton: {
    width: "48%",
    aspectRatio: 1,
    margin: "1%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
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