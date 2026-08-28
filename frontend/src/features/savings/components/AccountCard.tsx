import { Text, View } from "react-native";
import { ReactNode } from "react";
import { Card } from "@/src/components/ui/Card";

interface AccountCardProps {
  icon: ReactNode;
  title: string;
  tag: string;
  balance: string;
  monthlyContribution: string;
  interestEarned: string;
  refreshedLabel: string;
}

export function AccountCard({
  icon,
  title,
  tag,
  balance,
  monthlyContribution,
  interestEarned,
  refreshedLabel,
}: AccountCardProps) {
  return (
    <Card className="border" style={{ borderColor: "#E5E7EB" }}>
      <View className="flex-row items-center gap-3 mb-4">
        <View
          className="items-center justify-center rounded-xl"
          style={{ width: 50, height: 50, backgroundColor: "#1B5E20", }}
        >
          {icon}
        </View>
        <Text className="font-bold text-base text-lg">{title}</Text>
        <View className="rounded-full px-2 py-1" style={{ backgroundColor: "#F3F4F6" }}>
          <Text className="text-xs" style={{ color: "#6B7280" }}>{tag}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-4">
        <View>
          <Text className="text-md" style={{ color: "#6B7280" }}>CURRENT BALANCE</Text>
          <Text className="text-xl font-bold mt-1" style={{ color: "#1B5E20" }}>{balance}</Text>
        </View>
        <View className="items-end">
          <Text className="text-md" style={{ color: "#6B7280" }}>MONTHLY CONTRIBUTION</Text>
          <Text className="text-base text-xl font-semibold mt-1">{monthlyContribution}</Text>
        </View>
      </View>

      <View
        className="flex-row justify-between pt-3"
        style={{ borderTopWidth: 1, borderColor: "#E5E7EB" }}
      >
        <Text className="text-sm" style={{ color: "#16A34A" }}>Interest Earned: {interestEarned}</Text>
        <Text className="text-sm" style={{ color: "#9CA3AF" }}>{refreshedLabel}</Text>
      </View>
    </Card>
  );
}