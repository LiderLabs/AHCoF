import { View, Text } from "react-native";
import { ReactNode } from "react";

interface ActivityListItemProps {
  icon: ReactNode;
  iconBackground: string;
  title: string;
  subtitle: string;
  amount: string;
  amountColor: string;
  status: string;
  statusColor?: string;
}

export function ActivityListItem({
  icon,
  iconBackground,
  title,
  subtitle,
  amount,
  amountColor,
  status,
  statusColor = "#6B7280",
}: ActivityListItemProps) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center flex-1" style={{ gap: 12 }}>
        <View
          className="items-center justify-center rounded-full"
          style={{ width: 40, height: 40, backgroundColor: iconBackground }}
        >
          {icon}
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-md">{title}</Text>
          <Text className="text-sm" style={{ color: "#6B7280" }}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text className="font-semibold text-md" style={{ color: amountColor }}>
          {amount}
        </Text>
        <Text className="text-sm" style={{ color: statusColor }}>
          {status}
        </Text>
      </View>
    </View>
  );
}