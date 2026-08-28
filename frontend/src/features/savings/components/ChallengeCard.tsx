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
    <Pressable onPress={onPress} style={{ width: 185 }}>
      <ImageBackground
        source={image}
        style={{ height: 97, borderRadius: 12, overflow: "hidden", padding: 8, justifyContent: "flex-start" }}
        imageStyle={{ resizeMode: "cover" }}
      >
        <Text className="text-white font-bold text-sm">{badge}</Text>
      </ImageBackground>
      <Text className="font-semibold text-md mt-2">{title}</Text>
      <Text className="text-sm" style={{ color: "#6B7280" }}>{subtitle}</Text>
    </Pressable>
  );
}