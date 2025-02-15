import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMotorcycle } from "../../src/hooks/useMotorcycle";
import { LoadingScreen } from "../../src/components/LoadingScreen";

export default function MotorcycleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { motorcycle, isLoading } = useMotorcycle(id as string);
  const router = useRouter();

  if (isLoading || !motorcycle) return <LoadingScreen />;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: motorcycle.photos?.[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {motorcycle.brand} {motorcycle.model}
        </Text>
        {motorcycle.year && (
          <Text variant="titleMedium" style={styles.year}>
            {motorcycle.year}
          </Text>
        )}

        {motorcycle.specs && (
          <Card style={styles.specsCard}>
            <Card.Title title="Spécifications" />
            <Card.Content>
              {Object.entries(motorcycle.specs).map(([key, value]) => (
                <Text key={key} style={styles.spec}>
                  {key}: {value}
                </Text>
              ))}
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={() => router.push(`/profile/${motorcycle.user_id}`)}
          style={styles.button}
        >
          Voir le profil du propriétaire
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  year: {
    marginBottom: 16,
    opacity: 0.7,
  },
  specsCard: {
    marginBottom: 16,
  },
  spec: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
}); 