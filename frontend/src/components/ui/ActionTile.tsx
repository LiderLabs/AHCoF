import { Pressable, View, Text, PressableProps } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/src/constants/colors";

interface ActionTileProps extends PressableProps {
  icon: ReactNode;
  label: string;
  iconBackgroundColor?: string;
  onPress?: () => void;
}

export function ActionTile({
  icon,
  label,
  iconBackgroundColor = "#F3F4F6",
  onPress,
  ...rest
}: ActionTileProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center justify-center rounded-2xl py-4"
      style={{ borderWidth: 1.5, borderColor: "#E5E7EB" }}
      {...rest}
    >
      <View
        className="items-center justify-center rounded-xl mb-2"
        style={{ width: 44, height: 44, backgroundColor: iconBackgroundColor }}
      >
        {icon}
      </View>
      <Text
        className="text-sm font-semibold text-center"
        style={{ color: colors.textPrimary }}
      >
        {label}
      </Text>
    </Pressable>
  );
}