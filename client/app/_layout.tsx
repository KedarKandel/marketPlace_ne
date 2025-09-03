import { Stack } from "expo-router";
import "../global.css";
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "gray" },
        headerStyle: { backgroundColor: "#08CB00" },
        headerTintColor: "white",
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
          title:"Get started"
        }}
      />
    </Stack>
  );
}
