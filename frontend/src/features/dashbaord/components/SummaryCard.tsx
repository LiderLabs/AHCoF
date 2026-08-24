import { Text, View } from "react-native";
import { ReactNode } from "react";
import { Card } from "@/src/components/ui/Card";

interface SummaryCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtext?: string;
  subtextColor?: string;
  backgroundColor: string;
  textColor?: string;
}

export function SummaryCard({
  icon,
  label,
  value,
  subtext,
  subtextColor = "#DC2626",
  backgroundColor,
  textColor = "#000000",
}: SummaryCardProps) {
  return (
    <Card backgroundColor={backgroundColor} className="flex-1">
      <View className={`mb-6 self-start p-2 rounded-md`} style={{backgroundColor: "rgba(255,255,255,0.2)"}}>{icon}</View>
      <Text className="text-md mb-1" style={{ color: textColor, opacity: 0.8 }}>
        {label}
      </Text>
      <Text className="text-xl font-bold" style={{ color: textColor }}>
        {value}
      </Text>
      {subtext && (
        <Text className="text-sm font-bold mt-1" style={{ color: subtextColor }}>
          {subtext}
        </Text>
      )}
    </Card>
  );
}