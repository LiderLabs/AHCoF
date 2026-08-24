import { Text, View } from "react-native";
import { ReactNode } from "react";
import { Card } from "@/src/components/ui/Card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  backgroundColor: string;
}

export function FeatureCard({ icon, title, subtitle, backgroundColor }: FeatureCardProps) {
  return (
    <Card
      backgroundColor={backgroundColor}
      className="flex-1 justify-between"
      style={{ minHeight: 140 }}
    >
      <View className="items-end">{icon}</View>
      <View>
        <Text className="text-white font-bold text-base mb-1">{title}</Text>
        <Text className="text-white text-xs" style={{ opacity: 0.85 }}>
          {subtitle}
        </Text>
      </View>
    </Card>
  );
}