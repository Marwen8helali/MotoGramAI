import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { UserWithFollowStats } from "../types/follow.types";
import { FollowButton } from "./FollowButton";
import { useAuth } from "@clerk/clerk-expo";

interface UserListProps {
  users: UserWithFollowStats[];
  onFollowChange?: (userId: string, isFollowing: boolean) => void;
  ListEmptyComponent?: React.ReactElement;
}

export function UserList({ users, onFollowChange, ListEmptyComponent }: UserListProps) {
  const router = useRouter();
  const { userId } = useAuth();

  const renderUser = ({ item: user }: { item: UserWithFollowStats }) => {
    return (
      <View style={styles.userItem}>
        <Pressable
          style={styles.userInfo}
          onPress={() => router.push(`/profile/${user.id}`)}
        >
          <Avatar.Image
            size={50}
            source={{ uri: user.avatar_url || undefined }}
          />
          <View style={styles.userText}>
            <Text style={styles.username}>{user.username}</Text>
            {user.full_name && (
              <Text style={styles.fullName}>{user.full_name}</Text>
            )}
          </View>
        </Pressable>

        {user.id !== userId && (
          <FollowButton
            userId={user.id}
            isFollowing={user.is_following}
            onFollowChange={(isFollowing) => onFollowChange?.(user.id, isFollowing)}
          />
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={users}
      renderItem={renderUser}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fullName: {
    fontSize: 14,
    color: "#666",
  },
}); 