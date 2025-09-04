import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "transparent" },
        headerStyle: { backgroundColor: "#0A580C" },
        headerTintColor: "gray",
        animationDuration: 100,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "FreshEats" }}
      />

      {/* Auth Screen */}
      <Stack.Screen
        name="(auth)/auth"
        options={{
          headerShown: true,
          title: "Get started",
        }}
      />
    </Stack>
  );
}
