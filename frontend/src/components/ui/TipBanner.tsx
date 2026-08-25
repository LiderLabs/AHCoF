import { View, Text } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/src/constants/colors";

interface TipBannerProps {
  icon: ReactNode;
  message: string;
  backgroundColor?: string;
  iconBackgroundColor?: string;
}

export function TipBanner({
  icon,
  message,
  backgroundColor = "#FED7AA",
  iconBackgroundColor = "#7C2D12",
}: TipBannerProps) {
  return (
    <View className="flex-row items-start rounded-2xl p-4" style={{ backgroundColor, gap: 12 }}>
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 32, height: 32, backgroundColor: iconBackgroundColor }}
      >
        {icon}
      </View>
      <Text className="flex-1 text-sm leading-5" style={{ color: colors.textPrimary }}>
        {message}
      </Text>
    </View>
  );
}