import { Pressable, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, ChevronRight } from "lucide-react-native";

interface ReferralBannerProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function ReferralBanner({ title, subtitle, onPress }: ReferralBannerProps) {
  return (
    <Pressable className="mb-4" onPress={onPress}>
      <LinearGradient
        colors={["#F97066", "#C026D3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 16, padding: 16 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1" style={{ gap: 12 }}>
            <View
              className="items-center justify-center rounded-full"
              style={{ width: 36, height: 36, backgroundColor: "rgba(255,255,255,0.25)" }}
            >
              <Heart size={18} color="#fff" fill="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="font-semibold text-white">{title}</Text>
              <Text className="text-white" style={{ opacity: 0.9 }}>
                {subtitle}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#fff" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}