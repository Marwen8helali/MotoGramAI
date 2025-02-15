import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, Button, TextInput, Avatar, Divider } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { usePost } from "../../src/hooks/usePost";
import { LoadingScreen } from "../../src/components/LoadingScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useComments } from "../../src/hooks/useComments";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { post, isLoading: isLoadingPost } = usePost(id as string);
  const { comments, isLoading: isLoadingComments, addComment } = useComments(id as string);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (isLoadingPost || !post) return <LoadingScreen />;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await addComment(newComment);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={40}
          source={{ uri: post.user.avatar_url || undefined }}
        />
        <Text variant="titleMedium" style={styles.username}>
          {post.user.username}
        </Text>
      </View>

      <Image
        source={{ uri: post.photos[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.actions}>
        <Button
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="heart-outline" size={size} color={color} />
          )}
        >
          J'aime
        </Button>
        <Button
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="comment-outline" size={size} color={color} />
          )}
        >
          Commenter
        </Button>
      </View>

      <View style={styles.content}>
        <Text variant="bodyMedium">
          <Text style={styles.username}>{post.user.username}</Text>{" "}
          {post.caption}
        </Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.commentsSection}>
        <Text variant="titleMedium" style={styles.commentsTitle}>
          Commentaires
        </Text>

        {isLoadingComments ? (
          <LoadingScreen />
        ) : (
          comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Avatar.Image
                size={32}
                source={{ uri: comment.user.avatar_url || undefined }}
              />
              <View style={styles.commentContent}>
                <Text variant="bodyMedium">
                  <Text style={styles.username}>{comment.user.username}</Text>{" "}
                  {comment.content}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={styles.addComment}>
          <TextInput
            mode="outlined"
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChangeText={setNewComment}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleAddComment}
                disabled={isSubmitting || !newComment.trim()}
              />
            }
            style={styles.commentInput}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  divider: {
    marginVertical: 16,
  },
  commentsSection: {
    padding: 16,
  },
  commentsTitle: {
    marginBottom: 16,
  },
  comment: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 8,
  },
  addComment: {
    marginTop: 16,
  },
  commentInput: {
    backgroundColor: "#fff",
  },
}); 