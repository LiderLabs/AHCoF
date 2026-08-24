import { View, ImageBackground, Text } from "react-native";
import { ReactNode } from "react";
import { Dot } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface HeaderProps {
  name: string;
  status: string;
  avatar: any;
  actions?: ReactNode;
}

export function Header({ name, status, avatar, actions }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5">
      <View className="flex-row gap-2 items-center">
        <ImageBackground
          style={{ borderRadius: 30, borderWidth: 2, width: 60, height: 60, overflow: "hidden" }}
          imageStyle={{ resizeMode: "cover" }}
          source={avatar}
        />
        <View className="flex-col justify-center">
          <Text className="text-2xl" style={{ lineHeight: 26 }}>
            Hi, {name}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg">{status}</Text>
            <Dot size={8} color={colors.primary} />
          </View>
        </View>
      </View>

      <View className="flex-row gap-6 items-center">{actions}</View>
    </View>
  );
}