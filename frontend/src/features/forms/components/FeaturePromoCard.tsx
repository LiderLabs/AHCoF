import { View, Text, Pressable, ImageBackground, ImageSourcePropType } from "react-native";
import { ArrowRight } from "lucide-react-native";

interface FeaturePromoCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  image: ImageSourcePropType;
  onPress?: () => void;
}

export function FeaturePromoCard({
  title,
  description,
  buttonLabel,
  image,
  onPress,
}: FeaturePromoCardProps) {
  return (
    <ImageBackground
      source={image}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        padding: 20,
        minHeight: 190,
        justifyContent: "flex-end",
      }}
      imageStyle={{ borderRadius: 16 }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(6, 78, 59, 0.55)",
        }}
      />
      <Text className="text-white text-lg font-bold mb-1">{title}</Text>
      <Text className="text-white mb-4" style={{ opacity: 0.9 }}>
        {description}
      </Text>
      <Pressable
        className="flex-row items-center self-start rounded-full px-4 py-2"
        style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        onPress={onPress}
      >
        <Text className="text-white font-semibold mr-2">{buttonLabel}</Text>
        <ArrowRight size={16} color="#fff" />
      </Pressable>
    </ImageBackground>
  );
}