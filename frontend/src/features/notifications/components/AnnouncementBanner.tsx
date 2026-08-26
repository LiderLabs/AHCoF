import { View, Text } from "react-native";
import { ReactNode } from "react";

interface AnnouncementBannerProps {
  title: string;
  description: string;
  decorativeIcon?: ReactNode;
  backgroundColor?: string;
}

export function AnnouncementBanner({
  title,
  description,
  decorativeIcon,
  backgroundColor = "#064E3B",
}: AnnouncementBannerProps) {
  return (
    <View
      className="rounded-2xl p-5 overflow-hidden"
      style={{ backgroundColor }}
    >
      {decorativeIcon && (
        <View
          style={{
            position: "absolute",
            right: -10,
            bottom: -10,
            opacity: 0.15,
          }}
        >
          {decorativeIcon}
        </View>
      )}
      <Text className="text-white text-lg font-bold mb-1">{title}</Text>
      <Text className="text-white" style={{ opacity: 0.85 }}>
        {description}
      </Text>
    </View>
  );
}