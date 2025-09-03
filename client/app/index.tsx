import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      {/* Header Section */}
      <Text className="text-4xl font-bold text-green-600 mb-4">
        Fresh Market
      </Text>
      <Text className="text-lg text-gray-600 text-center mb-8">
        Buy fresh fruits and vegetables directly from farmers.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/auth?mode=register")}
        className="bg-green-500 px-6 py-3 rounded-xl shadow-md"
      >
        <Text className="text-white font-semibold text-xl">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
