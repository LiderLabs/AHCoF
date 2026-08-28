import { Text, View, Pressable } from "react-native";
import { Card } from "@/src/components/ui/Card";

interface BoostAccountCardProps {
  title: string;
  nextTransferLabel: string;
  balance: string;
  fundLabel: string;
  fundTier: string;
  onBoostPress?: () => void;
}

export function BoostAccountCard({
  title,
  nextTransferLabel,
  balance,
  fundLabel,
  fundTier,
  onBoostPress,
}: BoostAccountCardProps) {
  return (
    <Card backgroundColor="#A7F3D0" className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-3">
          <View className="rounded-full bg-white" style={{ width: 40, height: 40 }} />
          <View>
            <Text className="font-bold text-lg">{title}</Text>
            <Text className="text-md" style={{ color: "#065F46" }}>{nextTransferLabel}</Text>
          </View>
        </View>
        <Pressable onPress={onBoostPress} className="rounded-full px-4 py-1 self-start" style={{ backgroundColor: "#065F46" }}>
          <Text className="text-white text-xs">Boost</Text>
        </Pressable>
      </View>

      <View className="rounded-xl p-3 py-5 flex-row justify-between" style={{ backgroundColor: "rgba(255,255,255,0.5)" }}>
        <View>
          <Text className="text-md" style={{ color: "#065F46" }}>Current Balance</Text>
          <Text className="font-bold mt-1 text-lg" style={{ color: "#065F46" }}>{balance}</Text>
        </View>
        <View className="items-end">
          <Text className="text-md" style={{ color: "#065F46" }}>{fundLabel}</Text>
          <Text className="font-bold mt-1 text-lg" style={{ color: "#065F46" }}>{fundTier}</Text>
        </View>
      </View>
    </Card>
  );
}