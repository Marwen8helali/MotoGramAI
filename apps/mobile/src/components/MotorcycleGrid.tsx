import { View, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMotorcycles } from "../hooks/useMotorcycles";
import { LoadingScreen } from "./LoadingScreen";

interface MotorcycleGridProps {
  searchQuery?: string;
}

export function MotorcycleGrid({ searchQuery }: MotorcycleGridProps) {
  const { motorcycles, isLoading } = useMotorcycles(searchQuery);
  const router = useRouter();

  if (isLoading) return <LoadingScreen />;

  return (
    <FlatList
      data={motorcycles}
      numColumns={3}
      renderItem={({ item }) => (
        <Pressable
          style={styles.item}
          onPress={() => router.push(`/motorcycle/${item.id}`)}
        >
          <Image
            source={{ uri: item.photos?.[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1/3,
    aspectRatio: 1,
    padding: 1,
  },
  image: {
    flex: 1,
  },
}); 