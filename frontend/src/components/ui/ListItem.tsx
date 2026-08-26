import { View, Text, Pressable } from "react-native";
import { ReactNode } from "react";
import { ChevronRight, Lock } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface ListItemProps {
  label: string;
  subtitle?: string;
  icon?: ReactNode;
  iconBackgroundColor?: string;
  iconShape?: "circle" | "square";
  iconSize?: number;
  rightLabel?: string;
  rightLabelColor?: string;
  rightValue?: string;
  showChevron?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
  rightIcon?: ReactNode;
}

export function ListItem({
  label,
  subtitle,
  icon,
  iconBackgroundColor = "#E5E7EB",
  iconShape = "circle",
  iconSize = 36,
  rightLabel,
  rightLabelColor = "#C2410C",
  rightValue,
  showChevron = true,
  disabled = false,
  onPress,
  className = "",
  rightIcon,
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
            className="items-center justify-center"
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: iconShape === "circle" ? iconSize / 2 : 12,
              backgroundColor: iconBackgroundColor,
            }}
          >
            {icon}
          </View>
        )}
        <View className="flex-1">
          <Text className="text-base font-semibold" style={{ color: colors.textPrimary }} numberOfLines={1}>
            {label}
          </Text>
          {subtitle && (
            <Text className="text-sm mt-0.5" style={{ color: "#6B7280" }} numberOfLines={2}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center" style={{ gap: 8 }}>
        {rightValue && (
          <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
            {rightValue}
          </Text>
        )}
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