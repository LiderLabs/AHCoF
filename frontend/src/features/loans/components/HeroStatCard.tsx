import { Text, View } from "react-native";
import { ReactNode } from "react";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";

interface StatBlock {
  label: string;
  value: string;
}

interface HeroStatCardProps {
  label: string;
  amount: string;
  icon: ReactNode;
  stats: StatBlock[];
  dueLabel: string;
  dueValue: string;
  actionLabel: string;
  onActionPress?: () => void;
  backgroundColor: string;
}

export function HeroStatCard({
  label,
  amount,
  icon,
  stats,
  dueLabel,
  dueValue,
  actionLabel,
  onActionPress,
  backgroundColor,
}: HeroStatCardProps) {
  return (
    <Card backgroundColor={backgroundColor} className="p-5">
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-lg" style={{ color: "#D1FAE5" }}>{label}</Text>
          <Text className="text-2xl font-bold text-white mt-1">{amount}</Text>
        </View>
        <View
          className="items-center justify-center rounded-xl"
          style={{ width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          {icon}
        </View>
      </View>

      <View className="flex-row gap-3 mb-4">
        {stats.map((stat) => (
          <View
            key={stat.label}
            className="flex-1 rounded-xl p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <Text className="text-md" style={{ color: "#D1FAE5" }}>{stat.label}</Text>
            <Text className="text-white font-semibold mt-1">{stat.value}</Text>
          </View>
        ))}
      </View>

      <View
        className="flex-row items-center justify-between rounded-xl p-3"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <View>
          <Text className="text-md" style={{ color: "#D1FAE5" }}>{dueLabel}</Text>
          <Text className="text-white font-semibold mt-1">{dueValue}</Text>
        </View>
        <Button label={actionLabel} onPress={onActionPress} fullWidth={false} className="py-2 px-6" variant="primary" />
      </View>
    </Card>
  );
}