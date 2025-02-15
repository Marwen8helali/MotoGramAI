import { View, StyleSheet, Image, Pressable } from "react-native";
import { Text, Avatar, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PostWithLikes } from "../types/like.types";
import { useLikes } from "../hooks/useLikes";
import { useState } from "react";

interface PostProps {
  post: PostWithLikes;
  onLikeChange?: (postId: string, isLiked: boolean) => void;
}

export function Post({ post, onLikeChange }: PostProps) {
  const router = useRouter();
  const { toggleLike, isLiking } = useLikes(post.id);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = async () => {
    if (isLiking) return;

    const newLikeStatus = await toggleLike(isLiked);
    setIsLiked(newLikeStatus);
    setLikesCount(prev => newLikeStatus ? prev + 1 : prev - 1);
    onLikeChange?.(post.id, newLikeStatus);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.header}
        onPress={() => router.push(`/profile/${post.user_id}`)}
      >
        <Avatar.Image
          size={40}
          source={{ uri: post.user.avatar_url || undefined }}
        />
        <Text variant="titleMedium" style={styles.username}>
          {post.user.username}
        </Text>
      </Pressable>

      <Image
        source={{ uri: post.photos[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.actions}>
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons
              name={isLiked ? "heart" : "heart-outline"}
              size={size}
              color={isLiked ? "#e11d48" : color}
            />
          )}
          onPress={handleLike}
          disabled={isLiking}
        />
        <Text style={styles.likesCount}>{likesCount} likes</Text>
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="comment-outline" size={size} color={color} />
          )}
          onPress={() => router.push(`/post/${post.id}`)}
        />
      </View>

      <View style={styles.content}>
        <Text variant="bodyMedium">
          <Text style={styles.username}>{post.user.username}</Text>{" "}
          {post.caption}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  username: {
    marginLeft: 8,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  actions: {
    flexDirection: "row",
    padding: 8,
  },
  content: {
    padding: 8,
    paddingTop: 0,
  },
  likesCount: {
    marginLeft: 8,
    marginRight: 8,
  },
}); 