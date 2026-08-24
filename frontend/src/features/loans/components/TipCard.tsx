import { Text, View, Pressable } from "react-native";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";

interface TipCardProps {
  icon: ReactNode;
  iconBackground: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function TipCard({ icon, iconBackground, title, subtitle, onPress }: TipCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="flex-row items-center border" style={{ borderColor: "#E5E7EB", gap: 12 }}>
        <View
          className="items-center justify-center rounded-xl"
          style={{ width: 44, height: 44, backgroundColor: iconBackground }}
        >
          {icon}
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-sm">{title}</Text>
          <Text className="text-xs" style={{ color: "#6B7280" }}>{subtitle}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </Card>
    </Pressable>
  );
}