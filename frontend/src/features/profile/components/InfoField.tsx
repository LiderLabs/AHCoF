import { View, Text } from "react-native";
import { colors } from "@/src/constants/colors";

interface InfoFieldProps {
  label: string;
  value: string;
}

export function InfoField({ label, value }: InfoFieldProps) {
  return (
    <View className="py-3" style={{ gap: 4 }}>
      <Text className="text-xs font-medium" style={{ color: "#9CA3AF", letterSpacing: 0.5 }}>
        {label.toUpperCase()}
      </Text>
      <Text className="text-base font-medium" style={{ color: colors.primary }}>
        {value}
      </Text>
    </View>
  );
}