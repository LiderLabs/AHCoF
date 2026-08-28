import { Text, View } from "react-native";
import { AlertCircle } from "lucide-react-native";

interface AlertBannerProps {
  message?: string | null;
  variant?: "error" | "success";
}

export function AlertBanner({ message, variant = "error" }: AlertBannerProps) {
  if (!message) return null;

  const isError = variant === "error";

  return (
    <View
      className="flex-row items-center gap-2 rounded-xl p-3 mb-4"
      style={{
        backgroundColor: isError ? "#FEE2E2" : "#D1FAE5",
      }}
    >
      <AlertCircle size={18} color={isError ? "#DC2626" : "#059669"} />
      <Text
        className="flex-1 text-sm font-medium"
        style={{ color: isError ? "#DC2626" : "#059669" }}
      >
        {message}
      </Text>
    </View>
  );
}