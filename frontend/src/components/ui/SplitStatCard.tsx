import { View, Text } from "react-native";
import { ReactNode } from "react";
import { Card } from "./Card";
import { colors } from "@/src/constants/colors";

interface StatItem {
  icon: ReactNode;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  badgeBackgroundColor?: string;
}

interface SplitStatCardProps {
  left: StatItem;
  right: StatItem;
  dividerColor?: string;
}

function StatColumn({ icon, label, value, badge, badgeColor, badgeBackgroundColor }: StatItem) {
  return (
    <View className="flex-1" style={{ justifyContent: "space-between", minHeight: 110 }}>
      <View className="flex-row items-center justify-between">
        {icon}
        {badge && (
          <View
            className="rounded-full px-2 py-1"
            style={{ backgroundColor: badgeBackgroundColor ?? "#DCFCE7" }}
          >
            <Text className="text-xs font-semibold" style={{ color: badgeColor ?? "#166534" }}>
              {badge}
            </Text>
          </View>
        )}
      </View>
      <View>
        <Text className="text-sm mb-1" style={{ color: "#6B7280" }}>
          {label}
        </Text>
        <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export function SplitStatCard({ left, right, dividerColor = "#B45309" }: SplitStatCardProps) {
  return (
    <Card>
      <View className="flex-row">
        <View className="flex-1 pr-4">
          <StatColumn {...left} />
        </View>
        <View style={{ width: 2, backgroundColor: dividerColor, borderRadius: 1 }} />
        <View className="flex-1 pl-4">
          <StatColumn {...right} />
        </View>
      </View>
    </Card>
  );
}