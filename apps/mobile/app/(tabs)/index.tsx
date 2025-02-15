import { View, FlatList, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { Post } from "../../src/components/Post";
import { useFeed } from "../../src/hooks/useFeed";
import { LoadingScreen } from "../../src/components/LoadingScreen";

export default function FeedScreen() {
  const { posts, isLoading, refresh } = useFeed();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
} 