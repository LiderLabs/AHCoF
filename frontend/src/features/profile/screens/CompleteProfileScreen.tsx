import { Pressable, View, Text } from "react-native";
import { CompleteProfileForm } from "../components/CompleteProfileForm";
import { User } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useRouter } from "expo-router";

export function CompleteProfileScreen() {
  const router = useRouter();
  return (
    <View className="h-full px-6 flex-col justify-center items-center relative">
      <View className="absolute top-0 right-6 flex-row justify-end w-full items-start self-start pt-14">
        <Pressable className="border border-gray-500 rounded-2xl px-3 py-1" onPress={() => router.replace("/portfolio")}>
          <Text className="text-gray-500 font-medium">Skip</Text>
        </Pressable>
      </View>
      <User
        size={20}
        style={{
          backgroundColor: colors.backgroundLime,
          borderRadius: 55,
          padding: 40,
        }}
      />
      <CompleteProfileForm />
    </View>
  );
}
