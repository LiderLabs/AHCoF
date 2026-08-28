import { Text, View } from "react-native";
import { ReactNode } from "react";
import { Card } from "@/src/components/ui/Card";
import { colors } from "@/src/constants/colors";

interface GoalProgressCardProps {
  icon: ReactNode;
  title: string;
  percentLabel: string;
  currentValue: string;
  goalValue: string;
  progress: number; // 0 to 1
  maturityDate: string;
  autoTransferStatus: string;
}

export function GoalProgressCard({
  icon,
  title,
  percentLabel,
  currentValue,
  goalValue,
  progress,
  maturityDate,
  autoTransferStatus,
}: GoalProgressCardProps) {
  return (
    <Card className="border" style={{ borderColor: "#E5E7EB" }}>
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center gap-3">
          <View
            className="rounded-xl items-center justify-center"
            style={{ width: 50, height: 50, backgroundColor: "#FDBA74" }}
          >
            {icon}
          </View>
          <Text className="font-bold text-lg text-base">{title}</Text>
        </View>
        <Text className="text-sm font-semibold" style={{ color: "#B45309" }}>{percentLabel}</Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-md" style={{ color: "#6B7280" }}>Progress to goal</Text>
        <Text className="text-md" style={{ color: "#374151" }}>{currentValue} / {goalValue}</Text>
      </View>

      <View className="rounded-full mb-4" style={{ height: 10, backgroundColor: "#E5E7EB" }}>
        <View
          className="rounded-full"
          style={{ height: 10, width: `${progress * 100}%`, backgroundColor: "#B45309" }}
        />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-xl p-3 py-4" style={{ backgroundColor: colors.backgroundlightGray }}>
          <Text className="text-sm" style={{ color: "#6B7280" }}>Maturity Date</Text>
          <Text className="text-md font-semibold mt-1">{maturityDate}</Text>
        </View>
        <View className="flex-1 rounded-xl p-3 py-4" style={{ backgroundColor: colors.backgroundlightGray }}>
          <Text className="text-sm" style={{ color: "#6B7280" }}>Auto-Transfer</Text>
          <Text className="text-md font-semibold mt-1">{autoTransferStatus}</Text>
        </View>
      </View>
    </Card>
  );
}