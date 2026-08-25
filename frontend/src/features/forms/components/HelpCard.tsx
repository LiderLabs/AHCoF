import { View, Text, Pressable } from "react-native";
import { ReactNode } from "react";
import { ExternalLink } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";
import { colors } from "@/src/constants/colors";

interface HelpCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkLabel: string;
  onPress?: () => void;
}

export function HelpCard({ icon, title, description, linkLabel, onPress }: HelpCardProps) {
  return (
    <Card backgroundColor="#F3F4F6">
      <View className="flex-row items-start" style={{ gap: 10 }}>
        {icon}
        <View style={{ flex: 1 }}>
          <Text className="text-base font-bold mb-1" style={{ color: colors.textPrimary }}>
            {title}
          </Text>
          <Text className="text-sm mb-3" style={{ color: "#6B7280" }}>
            {description}
          </Text>
          <Pressable className="flex-row items-center" onPress={onPress} style={{ gap: 6 }}>
            <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
              {linkLabel}
            </Text>
            <ExternalLink size={14} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}