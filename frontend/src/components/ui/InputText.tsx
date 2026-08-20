// src/components/ui/Input.tsx
import { TextInput, TextInputProps, Text, View } from "react-native";
import { colors } from "@/src/constants/colors";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function InputText({ label, error, ...rest }: InputProps) {
  return (
    <View className="w-full mb-4">
      {label && <Text className="mb-1 font-semibold">{label}</Text>}
      <TextInput
        className="border rounded-xl px-4 py-3"
        style={{ borderColor: error ? 'red' : colors.primary }}
        placeholderTextColor={colors.textSecondary}
        {...rest}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}