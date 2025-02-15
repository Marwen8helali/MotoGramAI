import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Avatar, Text, Button } from "react-native-paper";
import { useAuth } from "@clerk/clerk-expo";
import { MotorcycleList } from "../../src/components/MotorcycleList";
import { useUser } from "../../src/hooks/useUser";
import { LoadingScreen } from "../../src/components/LoadingScreen";
import { ProfileStats } from "../../src/components/ProfileStats";
import { useState } from "react";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user, isLoading, refresh } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (isLoading || !user) return <LoadingScreen />;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Avatar.Image
          size={80}
          source={{ uri: user.avatar_url || undefined }}
        />
        <Text variant="headlineMedium" style={styles.username}>
          {user.username}
        </Text>
        {user.full_name && (
          <Text variant="bodyLarge" style={styles.fullName}>
            {user.full_name}
          </Text>
        )}
        {user.bio && (
          <Text variant="bodyMedium" style={styles.bio}>
            {user.bio}
          </Text>
        )}
      </View>

      <ProfileStats user={user} />

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => signOut()}
          style={styles.button}
        >
          Se déconnecter
        </Button>
      </View>

      <MotorcycleList userId={user.id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  username: {
    marginTop: 8,
  },
  fullName: {
    marginTop: 4,
  },
  bio: {
    marginTop: 8,
    textAlign: "center",
    color: "#666",
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    marginBottom: 8,
  },
}); 