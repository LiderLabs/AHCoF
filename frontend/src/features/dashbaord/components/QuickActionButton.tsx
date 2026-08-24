import { View, Text, Pressable } from "react-native";
import { ReactNode } from "react";

interface QuickActionButtonProps {
  icon: ReactNode;
  label: string;
  backgroundColor: string;
  onPress?: () => void;
}

export function QuickActionButton({
  icon,
  label,
  backgroundColor,
  onPress,
}: QuickActionButtonProps) {
  return (
    <Pressable onPress={onPress} className="items-center" style={{ gap: 6 }}>
      <View
        className="items-center justify-center rounded-2xl"
        style={{ width: 56, height: 56, backgroundColor }}
      >
        {icon}
      </View>
      <Text className="text-xs text-center">{label}</Text>
    </Pressable>
  );
}