import {
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { colors } from "@/src/constants/colors";
import { Logo } from "@/src/components/ui/Logo";
import { Button } from "@/src/components/ui/Button";
import { LoginForm } from "./components/LoginForm";

export default function LoginScreen() {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
