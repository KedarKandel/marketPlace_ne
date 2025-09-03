import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function AuthScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login"; // default is signup if not signin

  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      {/* Title */}
      <Text className="text-3xl font-bold text-green-600 mb-6">
        {isLogin ? "Welcome back" : "Create an acount"}
      </Text>

      {/* Input Fields */}
      {!isLogin && (
        <TextInput
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
      />

      {/* Submit Button */}
      <TouchableOpacity className="bg-green-500 w-full py-3 rounded-xl mb-4">
        <Text className="text-white font-semibold text-center text-lg">
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
        <Text className="text-gray-600">
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
