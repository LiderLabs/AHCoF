import { View, Text, Pressable } from "react-native";
import { ReactNode } from "react";
import { ChevronRight, Lock } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface ListItemProps {
  label: string;
  icon?: ReactNode;
  iconBackgroundColor?: string;
  rightLabel?: string;
  rightLabelColor?: string;
  showChevron?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
}

export function ListItem({
  label,
  icon,
  iconBackgroundColor = "#E5E7EB",
  rightLabel,
  rightLabelColor = "#C2410C",
  showChevron = true,
  disabled = false,
  onPress,
  className = "",
}: ListItemProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`flex-row items-center justify-between py-4 ${className}`}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <View className="flex-row items-center flex-1" style={{ gap: 12 }}>
        {icon && (
          <View
            className="items-center justify-center rounded-full"
            style={{ width: 36, height: 36, backgroundColor: iconBackgroundColor }}
          >
            {icon}
          </View>
        )}
        <Text
          className="text-base font-medium flex-1"
          style={{ color: colors.textPrimary}}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>

      <View className="flex-row items-center" style={{ gap: 8 }}>
        {rightLabel && (
          <View className="rounded-full px-2 py-1" style={{ backgroundColor: "#FEF3C7" }}>
            <Text className="text-xs font-medium" style={{ color: rightLabelColor }}>
              {rightLabel}
            </Text>
          </View>
        )}
        {disabled ? (
          <Lock size={16} color="#9CA3AF" />
        ) : (
          showChevron && <ChevronRight size={18} color="#9CA3AF" />
        )}
      </View>
    </Pressable>
  );
}