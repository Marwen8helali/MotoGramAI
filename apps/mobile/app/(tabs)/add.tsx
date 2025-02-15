import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function AddScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => router.push("/add-motorcycle")}
        style={styles.button}
      >
        Ajouter une moto
      </Button>
      <Button
        mode="contained"
        onPress={() => router.push("/add-post")}
        style={styles.button}
      >
        Créer une publication
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  button: {
    marginVertical: 8,
  },
}); 