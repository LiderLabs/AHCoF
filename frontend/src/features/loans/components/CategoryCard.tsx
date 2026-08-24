import { Text, View, ImageBackground, Pressable } from "react-native";
import { ReactNode } from "react";

interface CategoryCardProps {
  label: string;
  icon: ReactNode;
  image: any;
  onPress?: () => void;
}

export function CategoryCard({ label, icon, image, onPress }: CategoryCardProps) {
  return (
    <Pressable onPress={onPress} className="flex-1" style={{ height: 140 }}>
      <ImageBackground
        source={image}
        style={{ flex: 1, borderRadius: 16, overflow: "hidden", padding: 12, justifyContent: "flex-end" }}
        imageStyle={{ resizeMode: "cover" }}
      >
        <View className="mb-2">{icon}</View>
        <Text className="text-white font-bold text-xs" style={{ letterSpacing: 0.5 }}>
          {label.toUpperCase()}
        </Text>
      </ImageBackground>
    </Pressable>
  );
}