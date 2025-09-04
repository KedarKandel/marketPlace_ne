import { View, Text, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import layoutImg from "../../assets/images/layoutImage.jpg";

export default function AuthScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login"; // default is signup if not signin

  return (
    <ImageBackground source={layoutImg} imageStyle={{opacity:0.9}}  className="flex-1" resizeMode="cover">
    <View className="flex-1 justify-center items-center px-6">
      {/* Title */}
      <Text className="text-4xl font-bold text-white mb-6">
        {isLogin ? "Welcome back" : "Create an acount"}
      </Text>

      {/* Input Fields */}
      {!isLogin && (
        <TextInput
          placeholder="Full Name"
          className="w-full bg-gray-100 text-2xl outline-none rounded-lg px-4 py-4 mb-4"
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="w-full bg-gray-100 text-2xl outline-none rounded-lg px-4 py-4 mb-4"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full bg-gray-100 outline-none text-2xl rounded-lg px-4 py-4 mb-6"
      />

      {/* Submit Button */}
      <TouchableOpacity className="bg-green-500 w-full py-4 rounded-xl mb-4">
        <Text className="text-white font-semibold text-center text-2xl">
          {isLogin ? "Login" : "Register"}
        </Text>
      </TouchableOpacity>

      {/* Switch Auth Mode */}
      <TouchableOpacity
        onPress={() =>
          router.replace(
            isLogin ? "/(auth)/auth?mode=register" : "/(auth)/auth?mode=login"
          )
        }
      >
        <Text className="text-green-50 text-2xl">
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}
