import { View, Text } from "react-native";
import { ReactNode } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/constants/colors";

interface NotificationCardProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  title: string;
  timestamp: string;
  description: string;
  unread?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function NotificationCard({
  icon,
  iconBackgroundColor,
  title,
  timestamp,
  description,
  unread = false,
  actionLabel,
  onActionPress,
}: NotificationCardProps) {
  return (
    <Card className="mb-3">
      <View className="flex-row" style={{ gap: 12 }}>
        <View
          className="items-center justify-center rounded-full"
          style={{ width: 40, height: 40, backgroundColor: iconBackgroundColor }}
        >
          {icon}
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between">
            <Text
              className="text-base font-bold flex-1 mr-2"
              style={{ color: colors.textPrimary }}
            >
              {title}
            </Text>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text className="text-xs" style={{ color: "#9CA3AF" }}>
                {timestamp}
              </Text>
              {unread && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
          </View>

          <Text className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {description}
          </Text>

          {actionLabel && (
            <View className="mt-3">
              <Button
                label={actionLabel}
                variant="primary"
                fullWidth={false}
                onPress={onActionPress}
              />
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}