import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="followers"
        options={{
          title: "Abonnés",
        }}
      />
      <Stack.Screen
        name="following"
        options={{
          title: "Abonnements",
        }}
      />
    </Stack>
  );
} 