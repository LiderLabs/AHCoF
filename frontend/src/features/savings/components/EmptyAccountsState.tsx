import { View, Text } from "react-native";
import { PiggyBank } from "lucide-react-native";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { colors } from "@/src/constants/colors";

interface EmptyAccountsStateProps {
  onCreatePress: () => void;
  backgroundColor?: string;
}

export function EmptyAccountsState({ onCreatePress, backgroundColor }: EmptyAccountsStateProps) {
  return (
    <Card className="items-center py-8" backgroundColor={backgroundColor || "bg-gray-100"}>
      <View
        style={{
          padding: 10,
          backgroundColor: colors.iconRegularSavings,
          borderRadius: 50,

        }}
      >
        <PiggyBank size={35} color={colors.primary} strokeWidth={1.75} />
      </View>
      <Text
        className="text-xl font-bold text-center mt-3"
        style={{ color: colors.primary }}
      >
        No savings accounts yet
      </Text>
      <Text
        className="text-lg text-center mt-1 mb-5 px-4"
        style={{ color: "#6B7280" }}
      >
        Create your first account to start tracking your wealth growth journey.
      </Text>
      <Button
        label="Create savings account"
        onPress={onCreatePress}
        fullWidth={false}
        className="px-6 py-4"
      />
    </Card>
  );
}
