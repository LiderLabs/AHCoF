import { View, Text } from "react-native";
import { ReactNode } from "react";

interface NotificationBadgeIconProps {
  icon: ReactNode;
  count?: number;
}

export function NotificationBadgeIcon({ icon, count }: NotificationBadgeIconProps) {
  return (
    <View>
      {icon}
      {count ? (
        <View
          className="absolute rounded-full items-center justify-center"
          style={{ backgroundColor: "#DC2626", width: 16, height: 16, top: -4, right: -4 }}
        >
          <Text className="text-white" style={{ fontSize: 10 }}>
            {count}
          </Text>
        </View>
      ) : null}
    </View>
  );
}