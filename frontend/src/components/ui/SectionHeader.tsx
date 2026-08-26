import { View, Text, Pressable } from "react-native";
import { colors } from "@/src/constants/colors";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
        {title}
      </Text>
      {actionLabel && (
        <Pressable onPress={onActionPress}>
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}