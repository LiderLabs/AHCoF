import { useState } from "react";
import { ScrollView, View, Text, Switch } from "react-native";
import { useRouter } from "expo-router";

import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { colors } from "@/src/constants/colors";
import { createRegularAccount } from "@/src/features/savings/api/savingsApi";
import type { CreateRegularAccountPayload } from "@/src/features/savings/types";
import { ToggleRow } from "@/src/features/savings/components/ToggleRow";
import { AmountInput } from "@/src/components/ui/AmountInput";

export function CreateRegularAccountScreen() {
  const router = useRouter();
  const [isPrimary, setIsPrimary] = useState(false);
  const [autoTransfer, setAutoTransfer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialDeposit, setInitialDeposit] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const depositValue = initialDeposit ? Math.round(parseFloat(initialDeposit) * 100) : 5000;
      const payload: CreateRegularAccountPayload = {
        initialDeposit: depositValue,
        isPrimary,
        autoTransfer,
      };
      const res = await createRegularAccount(payload);

      if (res.status === "success") {
        router.replace("/savings/savingspage");
      } else {
        console.error("Account creation failed:", res);
      }
    } catch (err) {
      // add the real error state (inline message) once the API is wired up
      console.error("Failed to create account:", err);
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
          className="text-2xl m-auto font-bold"
          style={{ color: colors.primary }}
        >
          Regular Savings Account
        </Text>
      </View>

      <View className="ml-5">
        <Text
          className="text-xl font-semibold pt-4"
          style={{ color: colors.textPrimary }}
        >
          Open a regular savings account
        </Text>
        <Text className="text-md mt-1" style={{ color: "#6B7280" }}>
          Your everyday account for flexible saving , no goal or deadline
          attached.
        </Text>
      </View>

      <Card backgroundColor="#f9f8f8ff">
        <AmountInput
          label="Initial deposit"
          value={initialDeposit}
          onChangeValue={setInitialDeposit}
        />
        <ToggleRow
          label="Set as primary account"
          description="Your primary account is shown first and used by default."
          value={isPrimary}
          onValueChange={setIsPrimary}
          styleLabel={{ color: colors.primary }}
        />
        <View style={{ height: 1, backgroundColor: "#F0EDE4" }} />
        <ToggleRow
          label="Enable auto-transfer"
          description="Automatically move a set amount into this account each month."
          value={autoTransfer}
          onValueChange={setAutoTransfer}
          styleLabel={{ color: colors.primary }}
        />
      </Card>

      <Button
        label={submitting ? "Creating account…" : "Create savings account"}
        onPress={handleSubmit}
        disabled={submitting}
      />
    </ScrollView>
  );
}
