import { View, Text, ImageBackground } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";

interface PromoBannerProps {
  tag: string;
  title: string;
  buttonLabel: string;
  image: any;
  onPress?: () => void;
}

export function PromoBanner({ tag, title, buttonLabel, image, onPress }: PromoBannerProps) {
  return (
    <Card className="flex-row border p-0 overflow-hidden" style={{ borderColor: "#E5E7EB" }}>
      <View className="flex-1 p-4">
        <Text className="text-sm mb-2" style={{ color: "#6B7280" }}>
          {tag}
        </Text>
        <Text className="font-bold text-base text-md mb-4">{title}</Text>
        <Button label={buttonLabel} onPress={onPress} className="text-md w-[70%]" fullWidth={false}/>
      </View>
      <ImageBackground source={image} style={{ width: 160,  }} imageStyle={{ resizeMode: "cover", borderRadius: 10, }} />
    </Card>
  );
}