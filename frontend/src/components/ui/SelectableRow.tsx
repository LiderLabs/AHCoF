import { View, Text, Pressable, Image, ImageSourcePropType } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { colors } from "@/src/constants/colors";

interface SelectableRowProps {
  logo: ImageSourcePropType;
  title: string;
  subtitle: string;
  selected?: boolean;
  onPress?: () => void;
}

export function SelectableRow({ logo, title, subtitle, selected = false, onPress }: SelectableRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-2xl p-4 mb-3"
      style={{
        borderWidth: 2,
        borderColor: selected ? colors.primary : "#E5E7EB",
        backgroundColor: "#fff",
      }}
    >
      <View className="flex-row items-center flex-1" style={{ gap: 12 }}>
        <Image source={logo} style={{ width: 40, height: 40, borderRadius: 10 }} />
        <View>
          <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
            {title}
          </Text>
          <Text className="text-sm" style={{ color: "#9CA3AF" }}>
            {subtitle}
          </Text>
        </View>
      </View>
      {selected && <CheckCircle2 size={22} color={colors.primary} />}
    </Pressable>
  );
}