import {
  View,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Button } from "@/src/components/ui/Button";
import { Logo } from "@/src/components/ui/Logo";

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
          "rgba(255,255,255,0.07)",
          "rgba(255,255,255,0.15)",
          "rgba(255,255,255,0.3)",
        ]}
        locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
        }}
        pointerEvents="none"
      />

      {/* Main Content */}
      <BlurView 
      intensity={5}
      tint="light"
      className="flex flex-col items-center gap-4 flex-1 justify-center items-center px-6">
        {/* Logo is here */}
        <Logo type="white"/>


        {/* Splash screen onboarding text */}
        <View className="flex flex-col gap-3 py-3 mt-9 w-full">
          <Text className="text-2xl text-center font-bold">
            Supporting Adventist Financial Independence
          </Text>
          <Text className="text-xl text-center text-gray-600">
            Join a community dedicated to growth, stewardship, and collective
            prosperity through modern financial tools.
          </Text>
        </View>

          {/* Buttons */}
        <View className="w-full mt-6">
         <Button label="Get Started" onPress={() => router.push("/onboardingpage")} />
        </View>
      </BlurView>
    </ImageBackground>
  );
}
