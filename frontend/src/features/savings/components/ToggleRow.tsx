import {Text, View, Switch} from "react-native";
import { colors } from "@/src/constants/colors";

export function ToggleRow({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1 pr-4">
        <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
          {label}
        </Text>
        <Text className="text-sm mt-0.5 opacity-60" style={{ color: colors.textPrimary }}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}