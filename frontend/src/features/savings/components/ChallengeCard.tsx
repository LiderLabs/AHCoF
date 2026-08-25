import { Text, ImageBackground, Pressable } from "react-native";

interface ChallengeCardProps {
  image: any;
  badge: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function ChallengeCard({ image, badge, title, subtitle, onPress }: ChallengeCardProps) {
  return (
    <Pressable onPress={onPress} style={{ width: 160 }}>
      <ImageBackground
        source={image}
        style={{ height: 90, borderRadius: 12, overflow: "hidden", padding: 8, justifyContent: "flex-start" }}
        imageStyle={{ resizeMode: "cover" }}
      >
        <Text className="text-white font-bold text-xs">{badge}</Text>
      </ImageBackground>
      <Text className="font-semibold text-sm mt-2">{title}</Text>
      <Text className="text-xs" style={{ color: "#6B7280" }}>{subtitle}</Text>
    </Pressable>
  );
}