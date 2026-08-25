import { View, Text } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/src/constants/colors";

interface ProfileHeaderProps {
  name: string;
  memberId: string;
  avatar?: ReactNode;
  actions?: ReactNode;
}

export function ProfileHeader({ name, memberId, avatar, actions }: ProfileHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <View
          className="items-center justify-center rounded-full"
          style={{ width: 44, height: 44, backgroundColor: "#E5E7EB" }}
        >
          {avatar}
        </View>
        <View>
          <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            {name}
          </Text>
          <Text className="text-xs" style={{ color: "#9CA3AF" }}>
            ID: {memberId}
          </Text>
        </View>
      </View>
      {actions && <View className="flex-row items-center" style={{ gap: 12 }}>{actions}</View>}
    </View>
  );
}