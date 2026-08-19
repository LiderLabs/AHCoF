import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { ShieldCheck, Users, Leaf } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/bg-splash-screen.png")}
      style={{ flex: 1 }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,69,13,0.3)",
        }}
        pointerEvents="none"
      />

      <LinearGradient
        colors={[
          "transparent",
          "rgba(255,255,255,0.05)",
          "rgba(255,255,255,0.15)",
          "rgba(255,255,255,0.35)",
          "rgba(255,255,255,0.7)",
        ]}
        locations={[0, 0.25, 0.45, 0.6, 0.75, 0.9, 1]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
        }}
        pointerEvents="none"
      />

      {/* Main Content */}
      <BlurView 
      
      className="flex flex-col items-center gap-4 flex-1 justify-center items-center px-6">
        <View className="flex flex-col items-center gap-4">
          <Image
            source={require("@/assets/logo_white.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <Text
            className="text-3xl font-bold mb-2"
            style={{ color: "#1B5E20" }}
          >
            AHCoF
          </Text>
          <Text className="text-gray-500 text-lg font-bold -mt-4">
            ADVENTIST HERITAGE
          </Text>
        </View>

        <View className="flex flex-col gap-3 py-3 mt-9 w-full">
          <Text className="text-2xl text-center font-bold">
            Supporting Adventist Financial Independence
          </Text>
          <Text className="text-xl text-center text-gray-600">
            Join a community dedicated to growth, stewardship, and collective
            prosperity through modern financial tools.
          </Text>
        </View>

        <View className="w-full flex gap-2 mt-6">
          <TouchableOpacity
            className="w-full rounded-xl py-3 items-center mb-4 "
            style={{ backgroundColor: "#1B5E20" }}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white font-semibold py-2 text-2xl">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full rounded-xl py-3 items-center border-2"
            style={{ borderColor: "#1B5E20" }}
            onPress={() => router.push("/(auth)/onboarding")}
          >
            <Text
              style={{ color: "#1B5E20" }}
              className="font-semibold py-2 text-2xl"
            >
              Learn More
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-3 mt-3 text-gray-400">
          <View className="flex-row gap-1 items-center">
            <ShieldCheck size={20} />
            <Text className="text-md">Secure</Text>
          </View>
          <View className="flex-row gap-1 items-center">
            <Users size={20} />
            <Text className="text-md">Community-Driven</Text>
          </View>
          <View className="flex-row gap-1 items-center">
            <Leaf size={20} />
            <Text className="text-md">Ethical</Text>
          </View>
        </View>
      </BlurView>
    </ImageBackground>
  );
}
