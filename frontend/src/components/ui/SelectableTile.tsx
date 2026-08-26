import { View, Text, Pressable, Image, ImageSourcePropType } from "react-native";
import { colors } from "@/src/constants/colors";

interface SelectableTileProps {
  logo: ImageSourcePropType;
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function SelectableTile({ logo, label, selected = false, onPress }: SelectableTileProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center rounded-2xl p-3"
      style={{
        borderWidth: 2,
        borderColor: selected ? colors.primary : "#E5E7EB",
        backgroundColor: "#fff",
      }}
    >
      <Image source={logo} style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 8 }} />
      <Text className="text-sm font-semibold text-center" style={{ color: colors.textPrimary }}>
        {label}
      </Text>
    </Pressable>
  );
}