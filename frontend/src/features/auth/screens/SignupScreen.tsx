import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Logo } from "@/src/components/ui/Logo";
import { SignupForm } from "./components/SignupForm";
import { colors } from "@/src/constants/colors";

export default function SignupScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          paddingHorizontal: 24,
          backgroundColor: "white",
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo section */}
        <ImageBackground
          source={require("@/assets/img-security-message.png")}
          style={{ width: "100%", paddingTop: 10, paddingBottom: 10 }}
          imageStyle={{ resizeMode: "cover", borderRadius: 24 }}
        >
          <Logo type="green" />
        </ImageBackground>

        {/* Signup Form */}
        <SignupForm />

        {/* Already have an account */}
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          className="flex-row justify-center mt-2"
        >
          <Text style={{ color: colors.textSecondary }}>
            Already have an account?{" "}
          </Text>
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            Login
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}