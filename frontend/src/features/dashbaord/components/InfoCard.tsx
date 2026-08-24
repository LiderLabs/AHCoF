import { Text, View, Pressable } from "react-native";
import { ReactNode } from "react";
import { Card } from "@/src/components/ui/Card";
import { colors } from "@/src/constants/colors";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function InfoCard({ icon, title, subtitle, onPress }: InfoCardProps) {
  return (
    <Pressable onPress={onPress} className="flex-1 h-[100%]">
      <Card className="border" style={{ borderColor: "#E5E7EB" }}>
        <View
          className="items-center justify-center rounded-xl mb-6 flex-1 bg-rose-100"
          style={{ width: 36, height: 36, backgroundColor: "#F0FDF4" }}
        >
          {icon}
        </View>
        <Text className="font-semibold text-base text-lg mb-1">{title}</Text>
        <Text className="text-md" style={{ color: colors.textSecondary }}>
          {subtitle}
        </Text>
      </Card>
    </Pressable>
  );
}