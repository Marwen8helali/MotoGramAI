import { View, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useMotorcycles } from "../hooks/useMotorcycles";
import { LoadingScreen } from "./LoadingScreen";

interface MotorcycleListProps {
  userId: string;
}

export function MotorcycleList({ userId }: MotorcycleListProps) {
  const { motorcycles, isLoading } = useMotorcycles(undefined, userId);
  const router = useRouter();

  if (isLoading) return <LoadingScreen />;

  return (
    <FlatList
      data={motorcycles}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Cover source={{ uri: item.photos?.[0] }} />
          <Card.Title title={`${item.brand} ${item.model}`} subtitle={item.year?.toString()} />
          <Card.Actions>
            <Button onPress={() => router.push(`/motorcycle/${item.id}`)}>
              Voir plus
            </Button>
          </Card.Actions>
        </Card>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
}); 