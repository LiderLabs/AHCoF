import { Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { colors } from "@/src/constants/colors";

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      className="items-center justify-center rounded-full"
      style={{ width: 36, height: 36, backgroundColor: colors.primary }}
    >
      <ChevronLeft size={20} color={colors.textInverted} />
    </Pressable>
  );
}