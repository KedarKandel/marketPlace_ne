import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";

import layoutImg from "../assets/images/layoutImage.jpg";
export default function Index() {
  const router = useRouter();
  return (
     <ImageBackground source={layoutImg} imageStyle={{opacity:0.9}}  className="flex-1" resizeMode="cover">
    <View className="flex-1 justify-center items-center px-8">
      {/* Header Section */}
      <Text className="text-3xl font-bold text-gray-50 mb-4">Fresh Market</Text>
      <Text className="text-xl font-bold text-gray-50 text-center mb-8">
        Fresh from farmers to your table {"\n"}Eat healthy & support local!
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/auth?mode=register")}
        className="bg-green-500 px-6 py-3 rounded-xl shadow-md"
      >
        <Text className="text-white font-semibold text-2xl">Get Started</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}
