import { useState } from "react";
import { ScrollView, View, Text, TextInput, Switch } from "react-native";
import { useRouter } from "expo-router";

import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { AmountInput } from "@/src/components/ui/AmountInput";
import { DateField } from "@/src/components/ui/DateField";
import { colors } from "@/src/constants/colors";
import { createEducationFundAccount } from "@/src/features/savings/api/savingsApi";
import type { CreateEducationFundPayload } from "@/src/features/savings/types";

export function CreateEducationFundScreen() {
  const router = useRouter();
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [maturityDate, setMaturityDate] = useState<Date | null>(null);
  const [autoTransfer, setAutoTransfer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const targetAmountValue = parseFloat(targetAmount) || 0;
  const isValid =
    goalName.trim().length > 0 && targetAmountValue > 0 ;

  const handleSubmit = async () => {
    if (!isValid ) return;
    setSubmitting(true);
    try {
      const depositValue = initialDeposit ? Math.round(parseFloat(initialDeposit) * 100) : 5000;
      const payload: CreateEducationFundPayload = {
        initialDeposit: depositValue,
        goalName: goalName.trim(),
        targetAmount: Math.round(parseFloat(targetAmount) * 100),
        autoTransfer,
      };
      const res = await createEducationFundAccount(payload);
      if (res.status === "success") {
        router.replace("/savings/savingspage");
      } else {
        console.error("Account creation failed:", res);
      }
    } catch (err) {
      console.error("Failed to create Education Fund account:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, gap: 20, paddingTop: 26 }}
      className="bg-white flex-1"
    >
      <View className="pt-4 pb-1 -mb-5 flex-row items-center">
        <BackButton />
        <Text
          className="text-2xl font-bold m-auto"
          style={{ color: colors.primary }}
        >
          Education Fund Account
        </Text>
      </View>

      <View>
        <Text
          className="text-xl pt-2 font-semibold"
          style={{ color: colors.textPrimary }}
        >
          Open an Education Fund
        </Text>
        <Text className="text-md mt-1" style={{ color: "#6B7280" }}>
          Track progress toward a specific tuition or school goal.
        </Text>
      </View>

      <Card backgroundColor={colors.backgroundForm}>
        <Text
          className="text-sm font-semibold mb-2"
          style={{ color: colors.primary }}
        >
          Goal name
        </Text>
        <TextInput
          value={goalName}
          onChangeText={setGoalName}
          placeholder="e.g. University Tuition"
          placeholderTextColor="#9CA3AF"
          className="rounded-xl px-4 py-3.5 text-base mb-4"
          style={{
            borderWidth: 1,
            borderColor: colors.primary,
            color: colors.textPrimary,
            backgroundColor: colors.background,
          }}
        />

         <AmountInput
          label="Initial deposit"
          value={initialDeposit}
          onChangeValue={setInitialDeposit}
        />

        <Text
          className="text-sm font-semibold mb-2"
          style={{ color: colors.primary }}
        >
          Target amount (GHS)
        </Text>
        <TextInput
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#9CA3AF"
          className="rounded-xl px-4 py-3.5 text-base mb-4"
          style={{
            borderWidth: 1,
            borderColor: colors.primary,
            color: colors.textPrimary,
          }}
        />

        <View className="flex-row items-center justify-between pt-2">
          <View className="flex-1 pr-4">
            <Text
              className="text-base font-semibold"
              style={{ color: colors.primary }}
            >
              Enable auto-transfer
            </Text>
            <Text
              className="text-sm mt-0.5 opacity-60"
              style={{ color: colors.textPrimary }}
            >
              Automatically contribute toward this goal monthly.
            </Text>
          </View>
          <Switch
            value={autoTransfer}
            onValueChange={setAutoTransfer}
            trackColor={{ false: "#D1D5DB", true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      <Button
        label={submitting ? "Creating account…" : "Create Education Fund"}
        onPress={handleSubmit}
        disabled={submitting || !isValid}
      />
    </ScrollView>
  );
}
