import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { UserWithFollowStats } from "../types/follow.types";

interface ProfileStatsProps {
  user: UserWithFollowStats;
}

export function ProfileStats({ user }: ProfileStatsProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.stat}
        onPress={() => router.push(`/profile/${user.id}/followers`)}
      >
        <Text style={styles.number}>{user.followers_count}</Text>
        <Text style={styles.label}>Abonnés</Text>
      </Pressable>

      <View style={styles.separator} />

      <Pressable
        style={styles.stat}
        onPress={() => router.push(`/profile/${user.id}/following`)}
      >
        <Text style={styles.number}>{user.following_count}</Text>
        <Text style={styles.label}>Abonnements</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: "#ddd",
  },
}); 