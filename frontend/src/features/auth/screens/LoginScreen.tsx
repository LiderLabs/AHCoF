import {
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable, 
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/src/constants/colors";
import { Logo } from "@/src/components/ui/Logo";
import { LoginForm } from "../components/LoginForm";

export default function LoginScreen() {
 const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          paddingHorizontal: 24,
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

        {/* Login Form */}
        <LoginForm />

        {/* Don't have an account */}
        <Pressable
          onPress={() => router.push("/(auth)/signup")}
          className="flex-row justify-center mt-2"
        >
          <Text style={{ color: colors.textSecondary }}>
            Don't have an account?{" "}
          </Text>
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            Sign up
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
