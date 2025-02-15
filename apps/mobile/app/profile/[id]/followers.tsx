import { View, StyleSheet } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useFollowers } from "../../../src/hooks/useFollowers";
import { UserList } from "../../../src/components/UserList";

export default function FollowersScreen() {
  const { id } = useLocalSearchParams();
  const { followers, isLoading, error, refresh, updateFollower } = useFollowers(id as string);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Une erreur est survenue</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserList
        users={followers}
        onFollowChange={updateFollower}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>Aucun abonné</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    padding: 16,
    alignItems: "center",
  },
}); 