import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { Text, Avatar, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { useNotifications } from "../../src/hooks/useNotifications";
import { NotificationType } from "../../src/types/notification.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function NotificationsScreen() {
  const { notifications, isLoading, markAsRead } = useNotifications();
  const router = useRouter();

  const handlePress = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    switch (notification.type) {
      case NotificationType.LIKE:
      case NotificationType.COMMENT:
        router.push(`/post/${notification.post_id}`);
        break;
      case NotificationType.FOLLOW:
        router.push(`/profile/${notification.user_id}`);
        break;
    }
  };

  const renderNotification = ({ item: notification }: any) => {
    const getNotificationContent = () => {
      switch (notification.type) {
        case NotificationType.LIKE:
          return "a aimé votre publication";
        case NotificationType.COMMENT:
          return "a commenté votre publication";
        case NotificationType.FOLLOW:
          return "a commencé à vous suivre";
        default:
          return "";
      }
    };

    const getNotificationIcon = () => {
      switch (notification.type) {
        case NotificationType.LIKE:
          return "heart";
        case NotificationType.COMMENT:
          return "comment";
        case NotificationType.FOLLOW:
          return "account-plus";
        default:
          return "bell";
      }
    };

    return (
      <Pressable
        style={[styles.notification, !notification.read && styles.unread]}
        onPress={() => handlePress(notification)}
      >
        <Avatar.Image
          size={40}
          source={{ uri: notification.user.avatar_url || undefined }}
        />
        <View style={styles.content}>
          <Text style={styles.text}>
            <Text style={styles.username}>{notification.user.username}</Text>{" "}
            {getNotificationContent()}
          </Text>
          <Text style={styles.time}>
            {new Date(notification.created_at).toLocaleDateString()}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={getNotificationIcon()}
          size={24}
          color="#666"
        />
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  unread: {
    backgroundColor: "#f0f9ff",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  username: {
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
}); 