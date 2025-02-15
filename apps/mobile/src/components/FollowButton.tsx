import { Button, ActivityIndicator } from "react-native-paper";
import { useFollow } from "../hooks/useFollow";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, isFollowing: initialIsFollowing, onFollowChange }: FollowButtonProps) {
  const { toggleFollow, isLoading } = useFollow(userId);
  
  const handlePress = async () => {
    const newFollowStatus = await toggleFollow(initialIsFollowing);
    onFollowChange?.(newFollowStatus);
  };

  if (isLoading) {
    return <ActivityIndicator testID="loading-indicator" />;
  }

  return (
    <Button
      mode={initialIsFollowing ? "outlined" : "contained"}
      onPress={handlePress}
      disabled={isLoading}
    >
      {initialIsFollowing ? "Abonné" : "S'abonner"}
    </Button>
  );
} 