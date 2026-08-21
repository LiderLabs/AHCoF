import { TextInput, TextInputProps, Text, View, Pressable } from "react-native";
import { useState } from "react";
import { colors } from "@/src/constants/colors";
import { EyeOff, Eye } from "lucide-react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  type?: "text" | "email" | "password" | "number";
}

export function Input({ label, error, type = "text", ...rest }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password"; //to check if value of type is password

  // to check and find the type of input 
  const keyboardType =
    type === "email"
      ? "email-address"
      : type === "number"
        ? "numeric"
        : "default";

  return (
    <View className="w-full mb-4">
      {label && <Text className="mb-1 font-semibold">{label}</Text>}

      <View className="relative justify-center"> 
        <TextInput
          className="border rounded-xl px-4 py-3"
          style={{ borderColor: error ? "red" : colors.primary }}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          autoCapitalize={type === 'email' || isPassword ? 'none' : 'sentences'}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />

        {isPassword && (
          <Pressable
          onPress={() => setShowPassword((prev) => !prev)}
          className="absolute right-4"
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary}/>
            ) : (
              <Eye size={20} color={colors.textSecondary}/>
            )}
          </Pressable>
        )}
      </View>

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
