import { View, Text, TextInput, Pressable } from "react-native";
import { Card } from "./Card";
import { colors } from "@/src/constants/colors";

interface AmountInputProps {
  label: string;
  value: string;
  onChangeValue: (value: string) => void;
  presets?: number[];
  currency?: string;
}

export function AmountInput({
  label,
  value,
  onChangeValue,
  presets = [50, 100, 200, 500],
  currency = "GHS",
}: AmountInputProps) {
  return (
    <Card>
      <Text className="text-xs mb-2" style={{ color: "#9CA3AF" }}>
        {label}
      </Text>
      <View className="flex-row items-baseline mb-4">
        <Text className="text-2xl font-bold mr-2" style={{ color: colors.primary }}>
          {currency}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeValue}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#D1D5DB"
          className="text-2xl font-bold flex-1"
          style={{ color: colors.textPrimary }}
        />
      </View>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {presets.map((preset) => (
          <Pressable
            key={preset}
            onPress={() => onChangeValue(preset.toFixed(2))}
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
              {currency} {preset}
            </Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}