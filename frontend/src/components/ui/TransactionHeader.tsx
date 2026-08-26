import { View, Text, Pressable } from "react-native";
import { HelpCircle } from "lucide-react-native";
import { BackButton } from "@/src/components/ui/BackButton";
import { colors } from "@/src/constants/colors";

interface TransactionHeaderProps {
  title: string;
  onBackPress?: () => void;
  onHelpPress?: () => void;
}

export function TransactionHeader({ title, onBackPress, onHelpPress }: TransactionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <BackButton onPress={onBackPress} />
      <Text className="text-lg font-bold" style={{ color: colors.primary }}>
        {title}
      </Text>
      <Pressable onPress={onHelpPress} hitSlop={8}>
        <HelpCircle size={22} color={colors.primary} />
      </Pressable>
    </View>
  );
}