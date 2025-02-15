import { View, StyleSheet } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useFollowing } from "../../../src/hooks/useFollowing";
import { UserList } from "../../../src/components/UserList";

export default function FollowingScreen() {
  const { id } = useLocalSearchParams();
  const { following, isLoading, error, refresh, updateFollowing } = useFollowing(id as string);

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
        users={following}
        onFollowChange={updateFollowing}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>Aucun abonnement</Text>
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