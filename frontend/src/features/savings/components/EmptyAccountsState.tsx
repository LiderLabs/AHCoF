import { View, Text } from "react-native";
import { PiggyBank } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/constants/colors";

interface EmptyAccountsStateProps {
  onCreatePress: () => void;
}

export function EmptyAccountsState({ onCreatePress }: EmptyAccountsStateProps) {
  return (
    <Card className="items-center py-8">
      <View
        className="w-14 h-14 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: colors.buttonTransparent }}
      >
        <PiggyBank size={26} color={colors.primary} strokeWidth={1.75} />
      </View>
      <Text className="text-lg font-bold text-center" style={{ color: colors.primary }}>
        No savings accounts yet
      </Text>
      <Text className="text-sm text-center mt-1 mb-5 px-4" style={{ color: "#6B7280" }}>
        Create your first account to start tracking your wealth growth journey.
      </Text>
      <Button label="Create savings account" onPress={onCreatePress} fullWidth={false} className="px-6" />
    </Card>
  );
}